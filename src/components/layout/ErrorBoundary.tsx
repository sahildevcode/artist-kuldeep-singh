import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-artisan-crimson/10 text-artisan-crimson flex items-center justify-center mb-4 text-2xl font-serif font-bold">
            KS
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
            Section Refreshing
          </h2>
          <p className="text-sm text-stone-500 max-w-md mb-6 leading-relaxed">
            A temporary display error occurred. Click below to reload cleanly.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.hash = '';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-2.5 bg-[#1A1816] text-white rounded-full text-xs font-bold hover:bg-stone-800 transition-colors shadow-md"
            >
              Return to Gallery Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-stone-100 text-stone-800 rounded-full text-xs font-bold hover:bg-stone-200 transition-colors border border-stone-200"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
