import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../lib/format';
import { SmartImage } from './SmartImage';

/**
 * Scroll-driven cinematic hero.
 *
 * The hero is pinned for a long scroll section (300vh) and the visitor's scroll
 * position scrubs the clip's timeline: 0% scroll = first frame, 100% = final
 * frame, both directions. The video is never played, only `currentTime` seeks
 * inside a requestAnimationFrame loop — see the notes below.
 *
 * Why it is smooth:
 * - The scroll listener is passive and only flags that work is pending; every
 *   layout read, easing step and DOM write happens once per animation frame.
 * - `targetTime` (from scroll) and `renderedTime` are separated by a light
 *   exponential ease, so a single wheel notch does not slam `currentTime` from
 *   one end of the clip to the other.
 * - A seek is only issued when the frame we want differs by > 1/60s AND the
 *   previous seek has settled, which caps the browser at roughly one decode per
 *   frame instead of hundreds of queued seeks per second.
 * - Progress is read from `window.scrollY` against metrics measured on resize,
 *   so the loop never forces a layout flush.
 * - Nothing here is React state: the copy/badge opacity and the video timeline
 *   are written through refs, so scrolling never re-renders the page.
 *
 * Why the supplied clip was re-encoded (see AGENTS.md):
 * - Browsers can only begin decoding at a keyframe. The original clip carried a
 *   single keyframe for its whole 10s, so every scroll seek decoded from frame
 *   zero and scrubbing stuttered badly. The hero assets are encoded with a
 *   keyframe every 6 frames (0.25s at 24fps) and `+faststart`, so each seek
 *   decodes a handful of frames.
 * - The audio track is stripped so no AAC work competes with decoding.
 * - Resolution is capped (1280x720 desktop, 854x480 mobile) at a moderate CRF:
 *   lower per-frame decode cost is worth more than 1080p pixels here.
 * For a future replacement clip, the same export settings apply: H.264 High,
 * `-g 6 -keyint_min 6 -sc_threshold 0`, `-movflags +faststart`, high visual
 * quality but not a heavy bitrate, and no audio.
 */

const SMOOTHING = 0.18; // fraction of the remaining distance covered per frame at 60fps
const MIN_SEEK = 1 / 60; // ignore sub-frame corrections
const FADE_END = 0.3; // hero copy is fully gone by 30% of the section
const END_GUARD = 0.02; // never seek exactly to duration: some browsers paint black there

interface ScrollScrubHeroProps {
  desktopSrc: string;
  mobileSrc: string;
  /** WebM fallback for the rare browser without an H.264 decoder. */
  alternativeSrc: string;
  poster: string;
  fallbackSrc: string;
  fallbackAlt: string;
  children: ReactNode;
}

export function ScrollScrubHero({
  desktopSrc,
  mobileSrc,
  alternativeSrc,
  poster,
  fallbackSrc,
  fallbackAlt,
  children,
}: ScrollScrubHeroProps) {
  const driverRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);

  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [src] = useState(() => {
    const mobile = window.matchMedia('(max-width: 767px)').matches;
    const h264 = document.createElement('video').canPlayType('video/mp4; codecs="avc1.64001f"');
    return h264 ? (mobile ? mobileSrc : desktopSrc) : alternativeSrc;
  });

  const interactive = !reducedMotion && !failed;

  useEffect(() => {
    if (!interactive) return;
    const video = videoRef.current;
    const driver = driverRef.current;
    const stage = stageRef.current;
    const content = contentRef.current;
    if (!video || !driver || !stage) return;

    const scrim = scrimRef.current;

    // The clip must never play on its own: scroll is the only transport control.
    video.pause();

    let duration = 0;
    let driverTop = 0;
    let distance = 1;
    let target = 0;
    let current = 0;
    let rafId = 0;
    let running = false;
    let lastTs = 0;
    let seekable = false;
    let lastFade = -1;
    let panelHidden = false;
    const panel = content?.querySelector('form') ?? null;

    const paint = (progress: number) => {
      if (!content) return;
      const fade =
        progress <= 0.02 ? 1 : progress >= FADE_END ? 0 : 1 - (progress - 0.02) / (FADE_END - 0.02);
      const rounded = Math.round(fade * 400) / 400;
      if (rounded === lastFade) return;
      lastFade = rounded;

      content.style.opacity = String(rounded);
      content.style.transform = `translate3d(0, ${(-36 * (1 - rounded)).toFixed(1)}px, 0)`;
      content.style.pointerEvents = rounded < 0.4 ? 'none' : '';
      // The scrim thins out as the copy leaves, so the footage stays dominant.
      if (scrim) scrim.style.opacity = (0.28 + 0.72 * rounded).toFixed(3);

      // Once the panel is invisible it also drops its backdrop blur over the
      // scrubbing video and leaves the tab order; the copy stays in the tree.
      const hidden = rounded <= 0.002;
      if (hidden !== panelHidden) {
        panelHidden = hidden;
        if (panel) (panel as HTMLElement).style.visibility = hidden ? 'hidden' : 'visible';
      }
    };

    const seek = (time: number) => {
      if (!seekable || duration <= 0) return;
      if (video.seeking) return; // one decode in flight at a time
      if (Math.abs(video.currentTime - time) < MIN_SEEK) return;
      video.currentTime = time;
    };

    const tick = (timestamp: number) => {
      const dt = lastTs ? Math.min(timestamp - lastTs, 48) : 16.667;
      lastTs = timestamp;

      target = Math.min(1, Math.max(0, (window.scrollY - driverTop) / distance));

      const k = 1 - Math.pow(1 - SMOOTHING, dt / 16.667);
      const delta = target - current;
      if (Math.abs(delta) < 0.0025) current = target;
      else current += delta * k;

      seek(Math.min(current * duration, Math.max(duration - END_GUARD, 0)));
      paint(current);

      if (Math.abs(target - current) > 0.0005 || video.seeking) {
        rafId = requestAnimationFrame(tick);
      } else {
        running = false;
        lastTs = 0;
      }
    };

    const kick = () => {
      if (running) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(tick);
    };

    const measure = () => {
      const rect = driver.getBoundingClientRect();
      driverTop = rect.top + window.scrollY;
      distance = Math.max(rect.height - stage.clientHeight, 1);
      kick();
    };

    const progressNow = () => Math.min(1, Math.max(0, (window.scrollY - driverTop) / distance));

    const onLoadedMetadata = () => {
      duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
    };

    const onReady = () => {
      if (seekable) return;
      if (!duration) onLoadedMetadata();
      if (!duration) return;
      seekable = true;

      // Snap straight to the frame that matches where the page already is.
      const progress = progressNow();
      current = progress;
      target = progress;
      video.currentTime = Math.min(progress * duration, Math.max(duration - END_GUARD, 0));
      paint(progress);
      setReady(true);
      kick();
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('loadeddata', onReady);
    video.addEventListener('canplay', onReady);
    // Cached media can be past `loadeddata` before the listeners attach.
    if (video.readyState >= 2) onReady();

    measure();
    const onResize = () => measure();
    const onScroll = () => kick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(driver);

    return () => {
      cancelAnimationFrame(rafId);
      running = false;
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('loadeddata', onReady);
      video.removeEventListener('canplay', onReady);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      observer?.disconnect();
      video.pause();
    };
  }, [interactive]);

  // Reduced motion (or a clip that will not load): a static, lightweight hero.
  if (!interactive) {
    return (
      <section className="relative isolate overflow-hidden pb-24 pt-[8.5rem] sm:pt-[9.5rem] lg:pb-28 lg:pt-[11rem]">
        <SmartImage
          src={failed ? fallbackSrc : poster}
          alt={failed ? fallbackAlt : ''}
          priority
          sizes="100vw"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(7,10,12,0.95)_0%,rgba(7,10,12,0.82)_34%,rgba(7,10,12,0.28)_68%,rgba(7,10,12,0.6)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-obsidian"
        />
        {children}
      </section>
    );
  }

  return (
    <section ref={driverRef} className="relative h-[260vh] sm:h-[300vh]">
      <div ref={stageRef} className="sticky top-0 isolate h-[100svh] w-full overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-graphite">
          <img
            src={poster}
            alt=""
            decoding="async"
            className="h-full w-full object-cover object-center"
          />
          <video
            ref={videoRef}
            src={src}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            tabIndex={-1}
            aria-hidden="true"
            onError={() => setFailed(true)}
            className={cx(
              'absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-out',
              ready ? 'opacity-100' : 'opacity-0',
            )}
          />
        </div>

        <div
          ref={scrimRef}
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(7,10,12,0.9)_0%,rgba(7,10,12,0.68)_32%,rgba(7,10,12,0.14)_64%,rgba(7,10,12,0.42)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-obsidian"
        />

        <div ref={contentRef} className="relative z-20 flex h-full flex-col justify-center pt-[4.6rem]">
          {children}
        </div>

        {/* Minimal preparation cue: a hairline of gold, well under a spinner. */}
        <div
          aria-hidden="true"
          className={cx(
            'pointer-events-none absolute bottom-5 left-1/2 z-20 h-px w-24 -translate-x-1/2 overflow-hidden bg-hairline transition-opacity duration-700',
            ready ? 'opacity-0' : 'opacity-100',
          )}
        >
          <span className="block h-full w-full animate-pulse bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>
      </div>
    </section>
  );
}
