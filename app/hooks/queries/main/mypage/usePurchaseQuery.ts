import { useQuery } from '@tanstack/react-query';

import { PurchaseItem } from '@/app/types/dto/purchase/response.dto';
import { apiConfig } from '../../../../api/config/api-config';
import { privateApiInstance } from '../../../../lib/axios/instance';

export const usePurchaseQuery = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['purchaseHistory'],
    queryFn: async () => {
      const response = await privateApiInstance.get<
        PurchaseItem['LIST']['GET']
      >(apiConfig.LICENSE.PURCHASE.LIST.GET);
      return response.data;
    },
  });

  return { data, isLoading, error, refetch };
};
