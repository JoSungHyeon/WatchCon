import { apiConfig } from '@/app/api/config/api-config';
import { privateApiInstance } from '@/app/lib/axios/instance';
import { NoticeRequestDto } from '@/app/types/dto/notice/request.dto';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

export const useNoticeMutation = () => {
  const queryClient = useQueryClient();

  const { mutate: postNotice } = useMutation({
    mutationFn: (
      data: NoticeRequestDto['LIST']['POST'],
    ) => {
      return privateApiInstance.post(
        apiConfig.NOTICE.LIST.POST,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notice'],
      });
    },
  });

  const { mutate: deleteNotice } = useMutation({
    mutationFn: (noticeId: string) => {
      return privateApiInstance.delete(
        apiConfig.NOTICE.LIST.ACTION.replace(
          ':noticeId',
          noticeId,
        ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notice'],
      });
    },
  });

  const { mutate: updateNotice } = useMutation({
    mutationFn: (
      data: NoticeRequestDto['LIST']['UPDATE'],
    ) => {
      return privateApiInstance.put(
        apiConfig.NOTICE.LIST.POST,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notice'],
      });
    },
  });

  return { postNotice, deleteNotice, updateNotice };
};
