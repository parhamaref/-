import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/** Last-resort boundary so a render error never leaves a blank page. */
export class NestoraErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Nestora render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-obsidian px-6 text-center">
          <div className="flex max-w-md flex-col items-center gap-5 rounded-2xl border border-hairline bg-card/70 p-8">
            <h1 className="font-display text-lg font-semibold uppercase tracking-[0.2em] text-vapor">
              Something went wrong
            </h1>
            <p className="text-sm text-ash">
              The page could not be displayed. Reload to try again — nothing you entered has been lost.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex min-h-11 items-center rounded-full border border-gold bg-gold px-6 font-display text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-obsidian transition-colors hover:bg-gold-light"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
