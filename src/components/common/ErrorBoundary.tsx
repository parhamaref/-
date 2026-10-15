import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-[#F3F3F3] flex items-center justify-center p-6 font-mono select-none">
          <div className="max-w-md w-full bg-[#0E0E0E] border border-[#2B2B2B] p-8 rounded-sm shadow-2xl space-y-6 text-left">
            <div className="flex items-center gap-3 text-rose-400 border-b border-[#2B2B2B] pb-4">
              <ShieldAlert className="w-6 h-6 text-rose-500" />
              <div>
                <h2 className="font-serif text-lg text-white uppercase font-bold tracking-widest">
                  SYSTEM RECOVERY
                </h2>
                <span className="text-[8px] text-neutral-500 uppercase tracking-widest">
                  ANOMALY MITIGATED // PROTOCOL 503
                </span>
              </div>
            </div>

            <p className="text-[10px] text-neutral-400 font-sans leading-relaxed text-justify">
              An unexpected interface anomaly occurred. The system has sealed corrupted render state to preserve secure data integrity.
            </p>

            <button
              onClick={this.handleReload}
              className="w-full py-3 bg-white hover:bg-neutral-200 text-black text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>REINITIALIZE MAISON INTERFACE</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
