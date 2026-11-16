import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      {/* TODO: Add TanStack Router when routes are defined */}
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">VidyaFloww Desktop</h1>
          <p className="mt-2 text-muted-foreground">Enterprise School Management Platform</p>
          <p className="mt-4 text-sm text-muted-foreground">
            🖥️ Desktop scaffold ready for development.
          </p>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
