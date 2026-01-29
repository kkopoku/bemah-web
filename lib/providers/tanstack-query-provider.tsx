"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

/**
 * TanstackQueryProvider
 *
 * A component that sets up TanStack Query (React Query) for the application.
 * This provider enables data fetching, caching, synchronization, and updating server state
 * throughout the application.
 *
 * Features:
 * - Creates a new QueryClient instance for managing queries and mutations
 * - Wraps children with QueryClientProvider to provide query capabilities throughout the app
 * - Includes ReactQueryDevtools (collapsed by default) for debugging queries in development
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped by the provider
 * @returns {JSX.Element} The provider component with its children
 */
export default function TanstackQueryProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
