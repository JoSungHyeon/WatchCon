import { apiConfig } from '@/app/api/config/api-config';
import { privateApiInstance } from '@/app/lib/axios/instance';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

export const useWatchconMutation = () => {
  const queryClient = useQueryClient();

  const { mutate: disableWatchcon } = useMutation({
    mutationFn: (id: string) => {
      return privateApiInstance.put(
        apiConfig.WATCHCON.BLACK_LIST.PUT,
        {
          id,
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['watchcon'],
      });
    },
  });

  return { disableWatchcon };
};
