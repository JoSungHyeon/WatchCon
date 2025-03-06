'use client';

import { TagRequestDto } from '@/app/types/dto/tag/request.dto';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiConfig } from '../../../api/config/api-config';
import { privateApiInstance } from '../../../lib/axios/instance';

export const useTagCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TagRequestDto['CREATE']) =>
      privateApiInstance
        .post(apiConfig.ADDRESS.TAG.CREATE, data)
        .then((response) => response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

export const useTagUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TagRequestDto['UPDATE']) => {
      // 그룹 수정은 id를 기준으로 수정
      const updateData = {
        id: data.id, // 수정할 대상의 id
        name: data.name,
      };
      console.log('Tag update data:', updateData);
      return privateApiInstance
        .put(apiConfig.ADDRESS.TAG.UPDATE, updateData)
        .then((response) => response.data)
        .catch((error) => {
          console.error(
            'Update tag error:',
            error.response?.data || error,
          );
          throw error;
        });
    },
    onSuccess: () => {
      // 성공 후 캐시 초기화
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({
        queryKey: ['address'],
      });
    },
  });
};

export const useTagDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TagRequestDto['DELETE']) => {
      const url = apiConfig.ADDRESS.TAG.DELETE.replace(
        ':tagId',
        data.id,
      );
      const response = await privateApiInstance.delete(url);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};
