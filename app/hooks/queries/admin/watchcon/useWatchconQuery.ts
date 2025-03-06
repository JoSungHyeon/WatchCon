import { apiConfig } from '@/app/api/config/api-config';
import { privateApiInstance } from '@/app/lib/axios/instance';
import { WatchConResponseDto } from '@/app/types/dto/watchCon/response.dto';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

interface WatchconQueryParams {
  total_list: {
    pageNo?: number;
    pageSize?: number;
  };
  black_list: {
    pageNo?: number;
    pageSize?: number;
  };
  disabled_list: {
    pageNo?: number;
    pageSize?: number;
  };
}

export const useWatchconQuery = (
  params: WatchconQueryParams,
) => {
  const {
    data,
    isLoading,
    refetch: refetchTotal,
  } = useQuery<
    AxiosResponse<WatchConResponseDto['TOTAL_LIST']>
  >({
    queryKey: [
      'watchcon',
      'total_list',
      params.total_list.pageNo,
      params.total_list.pageSize,
    ],
    queryFn: () =>
      privateApiInstance.get(
        apiConfig.WATCHCON.TOTAL_LIST.GET,
        {
          params: {
            page_no: params.total_list.pageNo,
            page_size: params.total_list.pageSize,
          },
        },
      ),
  });

  const {
    data: blackList,
    isLoading: isLoadingBlack,
    refetch: refetchBlack,
  } = useQuery<
    AxiosResponse<WatchConResponseDto['BLACK_LIST']>
  >({
    queryKey: [
      'watchcon',
      'black_list',
      params.black_list.pageNo,
      params.black_list.pageSize,
    ],
    queryFn: () =>
      privateApiInstance.get(
        apiConfig.WATCHCON.BLACK_LIST.GET,
        {
          params: {
            page_no: params.black_list.pageNo,
            page_size: params.black_list.pageSize,
          },
        },
      ),
  });

  const {
    data: disabledList,
    isLoading: isLoadingDisabled,
    refetch: refetchDisabled,
  } = useQuery<
    AxiosResponse<WatchConResponseDto['DISABLED_LIST']>
  >({
    queryKey: [
      'watchcon',
      'disabled_list',
      params.disabled_list.pageNo,
      params.disabled_list.pageSize,
    ],
    queryFn: () =>
      privateApiInstance.get(
        apiConfig.WATCHCON.DISABLED_LIST.GET,
        {
          params: {
            page_no: params.disabled_list.pageNo,
            page_size: params.disabled_list.pageSize,
          },
        },
      ),
  });

  return {
    data: data?.data.data.list,
    isLoading,
    page: data?.data.data.page,
    total: data?.data.data.total,
    pageSize: data?.data.data.page_size,
    blackList: blackList?.data.data.list,
    blackListTotal: blackList?.data.data.total,
    blackListPageSize: blackList?.data.data.page_size,
    refetchTotal,
    refetchBlack,
    isLoadingBlack,
    disabledList: disabledList?.data.data.list,
    disabledListTotal: disabledList?.data.data.total,
    disabledListPageSize: disabledList?.data.data.page_size,
    isLoadingDisabled,
    refetchDisabled,
  };
};

