import React from "react";

interface ErrorBoundaryState
{
    hasError: boolean;
}

interface ErrorBoundaryProps
{
    severity?: "error" | "warn" | "fine" | "none";
    fallback?: JSX.Element;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState>
{
    constructor(props)
    {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error)
    {
        return { hasError: true }; 
    }

    componentDidCatch(error, errorInfo)
    {
        switch(this.props.severity)
        {
            case "error":
                console.error("ErrorBoundary caught error", error, errorInfo);
                break;
            case "warn":
                console.warn("ErrorBoundary caught error", error, errorInfo);
                break;
            case "fine":
                console.log("ErrorBoundary caught error", error, errorInfo);
                break;
        }
    }

    render() {
        if (this.state.hasError)
        {
            return this.props.fallback? this.props.fallback : <p>error...</p>;
        }
        return this.props.children; 
    }
}