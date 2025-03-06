import { apiConfig } from '@/app/api/config/api-config';
import { privateApiInstance } from '@/app/lib/axios/instance';
import { useModalStore } from '@/app/store/modal.store';
import { AdminFaqRequestDto } from '@/app/types/dto/faq/request.dto';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

export const useAdminFaqMutation = () => {
  const queryClient = useQueryClient();
  const { toggleState } = useModalStore();

  const deleteFaq = useMutation({
    mutationFn: (id: string) =>
      privateApiInstance.delete(
        apiConfig.FAQ.ADMIN.ACTION.replace(':faqId', id),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['adminFaq'],
      });
    },
  });

  const createFaq = useMutation({
    mutationFn: (data: AdminFaqRequestDto['CREATE']) =>
      privateApiInstance.post(apiConfig.FAQ.ADMIN.CREATE, {
        is_notice: Number(data.is_notice),
        category_id: Number(data.category_id),
        subject: data.subject,
        content: data.content,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['adminFaq'],
      });
    },
  });

  const updateFaq = useMutation({
    mutationFn: (data: AdminFaqRequestDto['UPDATE']) =>
      privateApiInstance.put(apiConfig.FAQ.ADMIN.CREATE, {
        id: data.id,
        is_notice: Number(data.is_notice),
        category_id: Number(data.category_id),
        subject: data.subject,
        content: data.content,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['adminFaq'],
      });
      toggleState('FAQ.edit_category');
    },
  });

  const createFaqCategory = useMutation({
    mutationFn: (
      data: AdminFaqRequestDto['CREATE_CATEGORY'],
    ) =>
      privateApiInstance.post(
        apiConfig.FAQ.CATEGORY.CREATE_UPDATE,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['adminFaqCategory'],
      });
    },
  });

  const updateFaqCategory = useMutation({
    mutationFn: (
      data: AdminFaqRequestDto['UPDATE_CATEGORY'],
    ) =>
      privateApiInstance.put(
        apiConfig.FAQ.CATEGORY.CREATE_UPDATE,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['adminFaqCategory'],
      });
    },
  });

  const deleteFaqCategory = useMutation({
    mutationFn: (id: number) =>
      privateApiInstance.delete(
        apiConfig.FAQ.CATEGORY.DELETE.replace(
          ':categoryId',
          id.toString(),
        ),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['adminFaqCategory'],
      });
    },
  });

  return {
    deleteFaq,
    createFaq,
    updateFaq,
    createFaqCategory,
    updateFaqCategory,
    deleteFaqCategory,
  };
};
