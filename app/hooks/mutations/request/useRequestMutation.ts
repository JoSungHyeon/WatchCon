import { apiConfig } from '@/app/api/config/api-config';
import { privateApiInstance } from '@/app/lib/axios/instance';
import { TechRequestDto } from '@/app/types/dto/tech/request.dto';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

interface RequestMutationHook {
  createRequest: ReturnType<typeof useMutation>;
  deleteRequest: (
    isDelete: boolean,
    requestId: number,
  ) => void;
}

export const useRequestMutation = (
  onSuccess?: () => void,
): RequestMutationHook => {
  const queryClient = useQueryClient();

  const createRequest = useMutation<
    AxiosResponse,
    Error,
    TechRequestDto['CREATE']
  >({
    mutationFn: async (
      newRequest: TechRequestDto['CREATE'],
    ) => {
      return privateApiInstance.post(
        apiConfig.REQUEST.CREATE,
        newRequest,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    },
    onSuccess: onSuccess ? onSuccess : undefined,
    onError: (error) => {
      console.error('요청 전송 실패:', error);
    },
  });

  const deleteMutation = useMutation<
    AxiosResponse,
    Error,
    TechRequestDto['DELETE']
  >({
    mutationFn: async ({
      requestId,
    }: TechRequestDto['DELETE']) => {
      return privateApiInstance.delete(
        apiConfig.REQUEST.DELETE.replace(
          ':requestId',
          requestId.toString(),
        ),
      );
    },
    onSuccess: (_, { requestId }) => {
      queryClient.setQueriesData(
        { queryKey: ['requests'] },
        (oldData: any) => {
          if (Array.isArray(oldData)) {
            return oldData.filter(
              (item) => item.id !== requestId,
            );
          }
          return oldData;
        },
      );

      queryClient.invalidateQueries({
        queryKey: ['requests'],
        exact: true,
        refetchType: 'all',
      });

      queryClient.refetchQueries({
        queryKey: ['requests'],
        exact: true,
        type: 'all',
      });

      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      console.error('요청 삭제 실패:', error);
    },
  });

  const deleteRequest = (
    isDelete: boolean,
    requestId: number,
  ) => {
    if (isDelete) {
      deleteMutation.mutate({ requestId });
    }
  };

  return {
    createRequest,
    deleteRequest,
  };
};
