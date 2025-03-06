import { apiConfig } from '@/app/api/config/api-config';
import { privateApiInstance } from '@/app/lib/axios/instance';
import { AdminFaqRequestDto } from '@/app/types/dto/faq/request.dto';
import { useQuery } from '@tanstack/react-query';

export const useAdminFaqQuery = (
  data: AdminFaqRequestDto['GET'],
) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(
      2,
      '0',
    );
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const {
    data: faqData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      'adminFaq',
      data.startDate,
      data.endDate,
      data.page_no,
      data.page_size,
    ],
    queryFn: () =>
      privateApiInstance.get(apiConfig.FAQ.ADMIN.GET, {
        params: {
          ...data,
          startDate: formatDate(data.startDate),
          endDate: formatDate(data.endDate),
          page_no: data.page_no,
          page_size: data.page_size,
        },
      }),
  });

  return { data: faqData?.data.data, isLoading, error };
};

export const useAdminFaqCategoryQuery = (data: {
  page_no: number;
  page_size: number;
}) => {
  const { data: categoryData, refetch } = useQuery({
    queryKey: [
      'adminFaqCategory',
      data.page_no,
      data.page_size,
    ],
    queryFn: () =>
      privateApiInstance.get(apiConfig.FAQ.CATEGORY.GET, {
        params: {
          page_no: data.page_no,
          page_size: data.page_size,
        },
      }),
    enabled: true,
  });

  return { data: categoryData?.data.data, refetch };
};

export const useAdminFaqDetailQuery = (data: {
  faqId: string;
}) => {
  const { data: faqDetailData, isLoading } = useQuery({
    queryKey: ['adminFaqDetail', data.faqId],
    queryFn: () =>
      privateApiInstance.get(
        apiConfig.FAQ.ADMIN.ACTION.replace(
          ':faqId',
          data.faqId,
        ),
      ),
  });

  return { data: faqDetailData?.data.data, isLoading };
};
