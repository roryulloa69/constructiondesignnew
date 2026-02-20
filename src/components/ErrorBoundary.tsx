import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
          <div className="text-center max-w-md space-y-4">
            <h1 className="text-3xl font-playfair font-bold">Something went wrong</h1>
            <p className="text-muted-foreground font-inter">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="text-left text-xs bg-muted p-4 rounded overflow-auto max-h-48">
                {this.state.error.toString()}
              </pre>
            )}
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function RouteErrorElement() {
  const error = useRouteError();
  console.error("Route error caught by boundary:", error);

  let errorMessage = "An unexpected error occurred.";
  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message || error.statusText || "Route not found or failed to load.";
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="text-center max-w-md space-y-4">
        <h1 className="text-3xl font-playfair font-bold">Oops! Something went wrong</h1>
        <p className="text-muted-foreground font-inter">
          {errorMessage}
        </p>
        <Button
          onClick={() => window.location.href = '/'}
          className="mt-4"
        >
          Return Home
        </Button>
      </div>
    </div>
  );
}
