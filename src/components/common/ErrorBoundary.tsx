import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error in component tree:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl bg-white dark:bg-[#0a140f] border border-rose-300 dark:border-rose-900/60 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-sm">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
            {this.props.fallbackTitle || 'Unable to display results'}
          </h3>
          <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            An unexpected error occurred while rendering the assessment visualization. Your answers are saved locally.
          </p>
          {this.state.error && (
            <pre className="text-xs font-mono p-3 rounded-xl bg-slate-100 dark:bg-zinc-950 text-rose-600 dark:text-rose-400 overflow-x-auto text-left">
              {this.state.error.message}
            </pre>
          )}
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-colors cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Visualization</span>
            </button>
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-300 dark:border-zinc-700 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
