import { publicApiInstance } from '@/app/lib/axios/instance';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { apiConfig } from '../../../api/config/api-config';

interface MailPayload {
  username: string;
  email: string;
  subject: string;
  reciver: number;
  message: string;
  file?: File;
}

interface FileUploadResponse {
  UPLOAD: {
    url_file: string;
  };
}

export const useContactMutation = (
  onSuccess: () => void,
) => {
  return useMutation<AxiosResponse, Error, MailPayload>({
    mutationFn: async (newMail: MailPayload) => {
      return publicApiInstance.post(
        apiConfig.CONTACT.POST,
        {
          username: newMail.username,
          email: newMail.email,
          subject: newMail.subject,
          reciver: newMail.reciver,
          message: newMail.message,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    },
    onSuccess,
    onError: (error) => {
      console.error('메일 전송 실패:', error);
    },
  });
};

export const useContactFileMutation = (
  onSuccess: () => void,
) => {
  return useMutation<
    FileUploadResponse,
    Error,
    MailPayload
  >({
    mutationFn: async (newMail?: MailPayload) => {
      if (!newMail?.file) {
        throw new Error('파일이 필요합니다');
      }

      const formData = new FormData();
      formData.append('file', newMail.file);

      const response =
        await publicApiInstance.post<FileUploadResponse>(
          apiConfig.CONTACT.UPLOAD,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
      return response.data;
    },
    onSuccess,
    onError: (error) => {
      console.error('파일 업로드 실패:', error);
      alert(
        '파일 업로드에 실패했습니다. 다시 시도해주세요.',
      );
    },
  });
};