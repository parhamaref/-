import { useState } from 'react';
import { cx } from '../lib/format';
import { NestoraMark } from './Icons';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/** Image with lazy loading and a graceful branded fallback when the asset cannot load. */
export function SmartImage({ src, alt, className, priority, sizes }: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={`${alt} (image unavailable)`}
        className={cx(
          'flex items-center justify-center bg-[linear-gradient(135deg,#202428_0%,#15191c_45%,#101315_100%)]',
          className,
        )}
      >
        <NestoraMark className="h-9 w-9 text-gold/35" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
