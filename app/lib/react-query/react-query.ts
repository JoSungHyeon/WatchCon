import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 5,
      staleTime: 5 * 60 * 1000,
      select: (data) => data ?? null,
    },
  },
});
