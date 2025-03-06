import { apiConfig } from '@/app/api/config/api-config';
import { privateApiInstance } from '@/app/lib/axios/instance';
import { PurchaseResponseDto } from '@/app/types/dto/purchase/response.dto';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

interface PurchaseQueryParams {
  start_time?: string;
  end_time?: string;
  page_no?: number;
  page_size?: number;
}

export const usePurchaseQuery = (
  params?: PurchaseQueryParams,
) => {
  const { data: purchaseData, isLoading } = useQuery<
    AxiosResponse<PurchaseResponseDto['GET']>
  >({
    queryKey: [
      'purchase',
      params?.start_time,
      params?.end_time,
      params?.page_no,
      params?.page_size,
    ],
    queryFn: () => {
      const queryParams = new URLSearchParams();
      if (params?.start_time)
        queryParams.append('start_time', params.start_time);
      if (params?.end_time)
        queryParams.append('end_time', params.end_time);
      if (params?.page_no)
        queryParams.append(
          'page_no',
          params.page_no.toString(),
        );
      if (params?.page_size)
        queryParams.append(
          'page_size',
          params.page_size.toString(),
        );

      const queryString = queryParams.toString();
      const url = queryString
        ? `${apiConfig.PURCHASE.GET}?${queryString}`
        : apiConfig.PURCHASE.GET;

      return privateApiInstance.get(url);
    },
  });

  return {
    purchaseData: purchaseData?.data.data
      .list as PurchaseResponseDto['GET']['data']['list'],
    isLoading,
    page: purchaseData?.data.data.page || 1,
    total: purchaseData?.data.data.total || 0,
    pageSize: purchaseData?.data.data.page_size || 10,
  };
};
