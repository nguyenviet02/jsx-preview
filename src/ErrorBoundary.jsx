import React, { Component } from 'react';

// Error Boundary component to catch errors in the rendered JSX
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('Error in component:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="error-boundary p-4 bg-red-100 border border-red-300 text-red-700 rounded">
          <h3 className="font-bold">Component Error:</h3>
          <p className="mb-2">{this.state.error && this.state.error.toString()}</p>
          <details className="mt-2">
            <summary>Component Stack</summary>
            <pre className="mt-2 text-xs overflow-auto max-h-40">{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
          </details>
          <p className="mt-4 text-sm">The component failed to render. This is likely due to missing dependencies or errors in the component code.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;