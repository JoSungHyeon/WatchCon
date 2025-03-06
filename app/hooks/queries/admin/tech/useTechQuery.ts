import { apiConfig } from '@/app/api/config/api-config';
import { privateApiInstance } from '@/app/lib/axios/instance';
import { useQuery } from '@tanstack/react-query';

export const useTechQuery = (data, enabled = true) => {
  const {
    data: tech,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tech'],
    queryFn: () => {
      return privateApiInstance.get(
        apiConfig.REQUEST.LIST.GET,
        {
          params: data,
        },
      );
    },
    enabled: enabled,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  return {
    data: tech?.data.data,
    isLoading,
    error,
    refetch,
  };
};
