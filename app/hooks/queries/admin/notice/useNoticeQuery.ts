import { apiConfig } from '@/app/api/config/api-config';
import { privateApiInstance } from '@/app/lib/axios/instance';
import { NoticeResponseDto } from '@/app/types/dto/notice/response.dto';
import { useQuery } from '@tanstack/react-query';

export const useNoticeQuery = (data, enabled = false) => {
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
    data: notice,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      'notice',
      data.start_time,
      data.end_time,
      data.page_no,
      data.page_size,
    ],
    queryFn: () =>
      privateApiInstance.get(apiConfig.NOTICE.LIST.GET, {
        params: {
          ...data,
          startDate: formatDate(data.startDate),
          endDate: formatDate(data.endDate),
        },
      }),
    enabled: enabled,
  });

  const {
    data: noticeDetail,
    isLoading: noticeDetailLoading,
    error: noticeDetailError,
  } = useQuery<{ data: NoticeResponseDto['DETAIL'] }>({
    queryKey: ['notice-detail', data.id],
    queryFn: () =>
      privateApiInstance.get(
        apiConfig.NOTICE.LIST.ACTION.replace(
          ':noticeId',
          data.id,
        ),
      ),
    enabled:
      data.id !== undefined &&
      (data.list === 'details' || data.list === 'edit'),
  });

  return {
    data: notice?.data.data,
    isLoading,
    error,
    noticeDetail: noticeDetail?.data.data,
    noticeDetailLoading,
    noticeDetailError,
  };
};
