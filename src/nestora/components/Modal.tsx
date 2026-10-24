import { useEffect, useRef, type ReactNode } from 'react';
import { CloseIcon } from './Icons';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

/** Accessible modal: Esc to close, focus moved inside, background scroll locked. */
export function Modal({ title, onClose, children, footer, wide }: ModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('input, select, textarea, button')?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-obsidian/80 p-4 py-10 backdrop-blur-sm">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full ${wide ? 'max-w-4xl' : 'max-w-2xl'} rounded-2xl border border-hairline bg-graphite shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]`}
      >
        <div className="flex items-center justify-between gap-6 border-b border-hairline px-6 py-4">
          <h2 className="font-display text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-vapor">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-ash transition-colors hover:border-gold/50 hover:text-gold"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-6">{children}</div>
        {footer && <div className="flex flex-wrap items-center justify-end gap-3 border-t border-hairline px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
