import { useCallback, useEffect, useRef, useState } from 'react';
import { formatPriceLabel } from '../lib/format';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  valueMin: number;
  valueMax: number;
  currency?: string;
  labelMin?: string;
  labelMax?: string;
  onChange: (valueMin: number, valueMax: number) => void;
}

/** Dual-handle price range built on two native range inputs (keyboard accessible). */
export function PriceRangeSlider({
  min,
  max,
  step = 50_000,
  valueMin,
  valueMax,
  currency = 'USD',
  labelMin = 'Minimum price',
  labelMax = 'Maximum price',
  onChange,
}: PriceRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const clamp = useCallback((value: number) => Math.min(Math.max(value, min), max), [min, max]);

  useEffect(() => {
    if (!dragging) return;
    const stop = () => setDragging(false);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    return () => {
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
  }, [dragging]);

  const span = max - min || 1;
  const leftPct = ((clamp(valueMin) - min) / span) * 100;
  const rightPct = ((clamp(valueMax) - min) / span) * 100;

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between gap-3 text-xs text-ash">
        <span className="font-display tracking-[0.12em]">{formatPriceLabel(valueMin, currency)}</span>
        <span className="font-display tracking-[0.12em] text-gold">{formatPriceLabel(valueMax, currency)}</span>
      </div>

      <div ref={trackRef} className="relative mt-3 h-5">
        <div className="absolute top-1/2 h-[3px] w-full -translate-y-1/2 rounded-full bg-elevated" aria-hidden="true" />
        <div
          className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-gold"
          style={{ left: `${leftPct}%`, width: `${Math.max(rightPct - leftPct, 0)}%` }}
          aria-hidden="true"
        />
        <input
          type="range"
          aria-label={labelMin}
          className="nestora-range absolute inset-0 h-5 w-full"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onPointerDown={() => setDragging(true)}
          onChange={(event) => {
            const next = Number(event.target.value);
            onChange(Math.min(next, valueMax - step), Math.max(valueMax, next + step));
          }}
        />
        <input
          type="range"
          aria-label={labelMax}
          className="nestora-range absolute inset-0 h-5 w-full"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onPointerDown={() => setDragging(true)}
          onChange={(event) => {
            const next = Number(event.target.value);
            onChange(Math.min(valueMin, next - step), Math.max(next, valueMin + step));
          }}
        />
      </div>
    </div>
  );
}
