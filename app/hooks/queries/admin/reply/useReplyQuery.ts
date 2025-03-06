import { apiConfig } from '@/app/api/config/api-config';
import { privateApiInstance } from '@/app/lib/axios/instance';
import { ReplyListResponse } from '@/app/types/dto/reply/response.dto';
import { useQuery } from '@tanstack/react-query';

export const useReplyQuery = (
  data: Record<string, unknown>,
  initialPageSize: number = 10,
  enabled = true,
) => {
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['reply', data, initialPageSize],
    queryFn: async () => {
      const initialResponse =
        await privateApiInstance.get<ReplyListResponse>(
          apiConfig.REPLY.GET,
          {
            params: {
              request_id: data,
              page_size: initialPageSize,
            },
          },
        );

      if (
        initialResponse.data.data.total &&
        initialPageSize <
          initialResponse.data.data.total + 30
      ) {
        const newPageSize =
          initialResponse.data.data.total + 30;
        const response =
          await privateApiInstance.get<ReplyListResponse>(
            apiConfig.REPLY.GET,
            {
              params: {
                request_id: data,
                page_size: newPageSize,
              },
            },
          );
        return response.data;
      }

      return initialResponse.data;
    },
    enabled,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  return {
    data: response?.data?.list ?? [],
    total: response?.data?.total ?? 0,
    isLoading,
    error,
    refetch,
  };
};

export const useReplyItemQuery = (
  data: Record<string, unknown>,
) => {
  const {
    data: replyItem,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['replyItem', data],
    queryFn: async () => {
      const response = await privateApiInstance.get(
        apiConfig.REPLY.ITEM_GET,
        { params: data },
      );
      return response.data.data.list;
    },
  });

  return {
    data: replyItem ?? [],
    isLoading,
    error,
    refetch,
  };
};
