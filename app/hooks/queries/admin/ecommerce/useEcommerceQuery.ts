import { EcommerceResponseDto } from '@/app/types/dto/ecommerce/response.dto';
import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../../../../api/config/api-config';
import { privateApiInstance } from '../../../../lib/axios/instance';

export const useTotalConnectionQuery = (
  options?: number,
) => {
  return useQuery({
    queryKey: ['totalConnection', options],
    queryFn: async () => {
      const endpoint =
        options !== undefined
          ? apiConfig.ECOMMERCE.TOTAL_CONNECTION.replace(
              ':number',
              options.toString(),
            )
          : apiConfig.ECOMMERCE.TOTAL_CONNECTION.replace(
              '?options=:number',
              '',
            );

      const response =
        await privateApiInstance.get<
          EcommerceResponseDto['TOTAL_CONNECTION']
        >(endpoint);
      return response.data;
    },
  });
};

export const useTotalSalesQuery = (options?: number) => {
  return useQuery({
    queryKey: ['totalSales', options],
    queryFn: async () => {
      const endpoint =
        options !== undefined
          ? apiConfig.ECOMMERCE.TOTAL_SALES.replace(
              ':number',
              options.toString(),
            )
          : apiConfig.ECOMMERCE.TOTAL_SALES.replace(
              '?options=:number',
              '',
            );

      const response =
        await privateApiInstance.get<
          EcommerceResponseDto['TOTAL_SALES']
        >(endpoint);
      return response.data;
    },
  });
};

export const useTotalDownloadQuery = (options?: number) => {
  return useQuery({
    queryKey: ['totalDownload', options],
    queryFn: async () => {
      const endpoint =
        options !== undefined
          ? apiConfig.ECOMMERCE.TOTAL_DOWNLOAD.replace(
              ':number',
              options.toString(),
            )
          : apiConfig.ECOMMERCE.TOTAL_DOWNLOAD.replace(
              '?options=:number',
              '',
            );

      const response =
        await privateApiInstance.get<
          EcommerceResponseDto['TOTAL_DOWNLOAD']
        >(endpoint);
      return response.data;
    },
  });
};

export const useTotalUserQuery = (options?: number) => {
  return useQuery({
    queryKey: ['totalUser', options],
    queryFn: async () => {
      const endpoint =
        options !== undefined
          ? apiConfig.ECOMMERCE.TOTAL_USER.replace(
              ':number',
              options.toString(),
            )
          : apiConfig.ECOMMERCE.TOTAL_USER.replace(
              '?options=:number',
              '',
            );

      const response =
        await privateApiInstance.get<
          EcommerceResponseDto['TOTAL_USER']
        >(endpoint);
      return response.data;
    },
  });
};

export const useGraphConnectionMonthQuery = (
  options?: number,
) => {
  return useQuery({
    queryKey: ['graphConnectionMonth', options],
    queryFn: async () => {
      const endpoint =
        options !== undefined
          ? apiConfig.ECOMMERCE.GRAPH_CONNECTION_MONTH.replace(
              ':number',
              options.toString(),
            )
          : apiConfig.ECOMMERCE.GRAPH_CONNECTION_MONTH.replace(
              '?options=:number',
              '',
            );

      const response =
        await privateApiInstance.get<
          EcommerceResponseDto['GRAPH_CONNECTION']['MONTH']
        >(endpoint);
      return response.data;
    },
  });
};

export const useGraphConnectionWeekQuery = (
  options?: number,
) => {
  return useQuery({
    queryKey: ['graphConnectionWeek', options],
    queryFn: async () => {
      const endpoint =
        options !== undefined
          ? apiConfig.ECOMMERCE.GRAPH_CONNECTION_WEEK.replace(
              ':number',
              options.toString(),
            )
          : apiConfig.ECOMMERCE.GRAPH_CONNECTION_WEEK.replace(
              '?options=:number',
              '',
            );

      const response =
        await privateApiInstance.get<
          EcommerceResponseDto['GRAPH_CONNECTION']['WEEK']
        >(endpoint);
      return response.data;
    },
  });
};

export const useGraphDownloadMonthQuery = (
  options?: number,
) => {
  return useQuery({
    queryKey: ['graphDownloadMonth', options],
    queryFn: async () => {
      const response = await privateApiInstance.get<
        EcommerceResponseDto['GRAPH_DOWNLOAD']['MONTH']
      >(apiConfig.ECOMMERCE.GRAPH_DOWNLOAD_MONTH);
      return response.data;
    },
  });
};

export const useGraphDownloadWeekQuery = (
  options?: number,
) => {
  return useQuery({
    queryKey: ['graphDownloadWeek', options],
    queryFn: async () => {
      const response = await privateApiInstance.get<
        EcommerceResponseDto['GRAPH_DOWNLOAD']['WEEK']
      >(apiConfig.ECOMMERCE.GRAPH_DOWNLOAD_WEEK);
      return response.data;
    },
  });
};

export const useListUserQuery = () => {
  return useQuery({
    queryKey: ['listUser'],
    queryFn: async () => {
      const response = await privateApiInstance.get<
        EcommerceResponseDto['LIST_USER']
      >(apiConfig.ECOMMERCE.LIST_USER);
      return response.data;
    },
  });
};
