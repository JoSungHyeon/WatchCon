'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { apiConfig } from '../../../api/config/api-config';
import { privateApiInstance } from '../../../lib/axios/instance';

interface PurchaseCancelParams {
  is_purchase_cancel: number;
}

export const usePurchaseCancelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: PurchaseCancelParams) => {
      return privateApiInstance.put(
        apiConfig.LICENSE.PURCHASE.CANCEL,
        params,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['purchases'],
      });
      queryClient.invalidateQueries({
        queryKey: ['user-info'],
      });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    },
  });
};

interface UpdateAutoRenewalParams {
  id: string;
  auto_update: number;
}

export const useUpdateLicenseAutoRenewalMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateAutoRenewalParams) => {
      const url = apiConfig.LICENSE.PURCHASE.AUTO_RENEWAL;
      const response = await privateApiInstance.put(
        url,
        params,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['license'],
      });
    },
  });
};