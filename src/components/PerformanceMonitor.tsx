import { useEffect, ReactNode } from 'react';
import { sentryService } from '../services/sentryService';

interface PerformanceMonitorProps {
  children: ReactNode;
  id: string;
  description?: string;
}

export function PerformanceMonitor({ children, id, description }: PerformanceMonitorProps) {
  useEffect(() => {
    // Start a transaction when the component mounts
    const transaction = sentryService.startTransaction({
      name: `component:${id}`,
      description: description || `Performance monitoring for ${id}`,
    });

    // End the transaction when the component unmounts
    return () => {
      transaction?.finish();
    };
  }, [id, description]);

  return <>{children}</>;
}

// Higher-order component for performance monitoring
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  options: { id: string; description?: string }
): React.FC<P> {
  const MonitoredComponent: React.FC<P> = (props) => {
    return (
      <PerformanceMonitor id={options.id} description={options.description}>
        <Component {...props} />
      </PerformanceMonitor>
    );
  };

  // Set display name for the wrapped component
  MonitoredComponent.displayName = `WithPerformanceMonitoring(${
    Component.displayName || Component.name || 'Component'
  })`;

  return MonitoredComponent;
}