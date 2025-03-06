'use client';

import { AddressRequestDto } from '@/app/types/dto/address/request.dto';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { apiConfig } from '../../../api/config/api-config';
import { privateApiInstance } from '../../../lib/axios/instance';

interface CreateAddressData {
  alias: string;
  hostname: string;
  platform: string;
  tags: string[];
  username: string;
}

export const useAddressCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: AddressRequestDto['CREATE'],
    ) => {
      const response = await privateApiInstance.post(
        apiConfig.ADDRESS.CREATE,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      // 성공 후 캐시 초기화
      queryClient.invalidateQueries({
        queryKey: ['address'],
      });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

export const useAddressUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: AddressRequestDto['UPDATE'],
    ) => {
      console.log('Original data:', data);
      // 필수 필드만 전송하고 row_id를 기준으로 수정
      const updateData = {
        row_id: String(data.row_id), // 수정할 대상의 row_id
        id: String(data.id), // 새로운 WatchCon ID
        alias: data.alias || '',
        tags: data.tags || [],
        hostname: data.hostname || '',
        platform: data.platform || '',
        username: data.username || '',
      };
      console.log('Address update data:', updateData);
      const response = await privateApiInstance
        .put(apiConfig.ADDRESS.UPDATE, updateData)
        .catch((error) => {
          console.error(
            'Update error:',
            error.response?.data || error,
            '\nRequest data:', updateData,
          );
          throw error;
        });
      return response.data;
    },
    onSuccess: () => {
      // 성공 후 캐시 초기화
      queryClient.invalidateQueries({
        queryKey: ['address'],
      });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

export const useAddressDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await privateApiInstance.delete(
        `${apiConfig.ADDRESS.DELETE}${id}`,
      );
      return response.data;
    },
    onSuccess: () => {
      // 성공 후 캐시 초기화
      queryClient.invalidateQueries({
        queryKey: ['address'],
      });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};