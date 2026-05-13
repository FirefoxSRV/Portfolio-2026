import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  fallback?: ReactNode;
  label?: string;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error(`[ErrorBoundary${this.props.label ? ` · ${this.props.label}` : ''}]`, error, info);
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      const msg = (this.state.error.message || '').toLowerCase();
      const isWebGL = msg.includes('webgl');
      const sectionName = this.props.label ?? 'this section';
      return (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 text-bone/70 font-mono text-xs tracking-[0.3em] uppercase px-6 text-center">
          <div>▸ {sectionName} failed to render</div>
          {isWebGL && (
            <div className="max-w-md text-bone/50 text-[10px] leading-relaxed normal-case tracking-wider">
              your browser couldn’t open a WebGL context. enable hardware
              acceleration at{' '}
              <span className="text-wolf-red">chrome://settings/system</span>{' '}
              and reload. on chrome you can also check{' '}
              <span className="text-gs-blue">chrome://gpu/</span>.
            </div>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
