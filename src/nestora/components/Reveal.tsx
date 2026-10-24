import type { ReactNode } from 'react';
import { useReveal } from '../data/hooks';
import { cx } from '../lib/format';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/** Fades content up as it enters the viewport. Disabled for reduced-motion users. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const { ref, className: revealClass } = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className={cx(revealClass, className)} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}
