import { apiConfig } from '@/app/api/config/api-config';
import {
  privateApiInstance,
  publicApiInstance,
} from '@/app/lib/axios/instance';
import { ReplyRequestDto } from '@/app/types/dto/reply/request.dto';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

export const useReplyMutation = () => {
  const queryClient = useQueryClient();

  const { mutate: createMail } = useMutation({
    mutationFn: (mail: ReplyRequestDto['POST']) =>
      privateApiInstance.post(apiConfig.REPLY.POST, mail),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reply'],
      });
    },
  });

  return { createMail };
};

interface FileUploadResponse {
  url_file: string;
}

interface FileUploadPayload {
  file: File;
}

export const useReplyFileMutation = (
  onSuccess: () => void,
) => {
  return useMutation<
    FileUploadResponse,
    Error,
    FileUploadPayload
  >({
    mutationFn: async (payload: FileUploadPayload) => {
      if (!payload.file) {
        throw new Error('파일이 필요합니다');
      }

      const formData = new FormData();
      formData.append('file', payload.file);

      const response = await publicApiInstance.post(
        apiConfig.REPLY.UPLOAD,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (!response.data) {
        throw new Error('업로드 응답이 올바르지 않습니다');
      }

      return response.data;
    },
    onSuccess,
    onError: (error) => {
      console.error('파일 업로드 실패:', error.message);
      alert(
        error.message ||
          '파일 업로드에 실패했습니다. 다시 시도해주세요.',
      );
    },
  });
};
