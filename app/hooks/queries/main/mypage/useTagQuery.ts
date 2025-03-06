'use client';

import { TagItem } from '@/app/types/dto/tag/response.dto';
import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../../../../api/config/api-config';
import { privateApiInstance } from '../../../../lib/axios/instance';

export const useTagQuery = () => {
  const { data, isLoading, error } = useQuery<
    TagItem['LIST']['GET']
  >({
    queryKey: ['tags'],
    queryFn: () =>
      privateApiInstance
        .get(apiConfig.ADDRESS.TAG.GET)
        .then((response) => response.data),
  });

  return {
    tagList: data?.data?.list || [],
    isLoading,
    error,
  };
};
