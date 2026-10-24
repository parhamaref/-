import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  /** Home keeps the header floating over the hero; inner pages get the solid treatment. */
  overlayHeader?: boolean;
}

export function Layout({ children, overlayHeader = false }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-obsidian">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:border focus:border-gold focus:bg-obsidian focus:px-5 focus:py-3 focus:font-display focus:text-xs focus:uppercase focus:tracking-[0.2em] focus:text-gold"
      >
        Skip to content
      </a>
      <Header overlay={overlayHeader} />
      <main id="main-content" className={overlayHeader ? 'flex-1' : 'flex-1 pt-[4.6rem]'}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
