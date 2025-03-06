import { useQuery } from '@tanstack/react-query';

import { LicenseItem } from '@/app/types/dto/license/response.dto';
import { apiConfig } from '../../../../api/config/api-config';
import { privateApiInstance } from '../../../../lib/axios/instance';

export const useLicenseQuery = () => {
  return useQuery({
    queryKey: ['license'],
    queryFn: async () => {
      const response = await privateApiInstance.get<
        LicenseItem['LIST']['GET']
      >(apiConfig.LICENSE.LIST.GET);
      return response.data;
    },
  });
};
