'use client';

import { AddressItem } from '@/app/types/dto/address/response.dto';
import { AddressRequestDto } from '@/app/types/dto/address/request.dto';
import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../../../../api/config/api-config';
import { privateApiInstance } from '../../../../lib/axios/instance';

type UseAddressQueryParams = AddressRequestDto['LIST'];

export const useAddressQuery = ({
  page_no = 1,
  page_size = 10,
  search_term = '',
}: Partial<UseAddressQueryParams> = {}) => {
  const { data, isLoading, error } = useQuery<
    AddressItem['LIST']['GET']
  >({
    queryKey: ['address', page_no, page_size, search_term],
    queryFn: () => {
      return privateApiInstance
        .get(apiConfig.ADDRESS.LIST.GET, {
          params: {
            page_no,
            page_size,
            search_term,
          },
        })
        .then((response) => {
          return response.data;
        });
    },
  });

  // tags를 문자열에서 배열로 변환
  const transformedList = data?.data?.list.map((item) => {
    return {
      ...item,
      tags: item.tags ? JSON.parse(item.tags) : [],
      online: Number(item.online),
    };
  });

  return {
    addressList: transformedList || [],
    page: data?.data?.page || 1,
    total: data?.data?.total || 0,
    pageSize: data?.data?.page_size || 10,
    isLoading,
    error,
  };
};
