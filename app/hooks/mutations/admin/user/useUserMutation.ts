import { apiConfig } from '@/app/api/config/api-config';
import { privateApiInstance } from '@/app/lib/axios/instance';
import { UserRequestDto } from '@/app/types/dto/user/request.dto';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

export const useUserMutation = () => {
  const queryClient = useQueryClient();

  const { mutate: createMail } = useMutation({
    mutationFn: (
      mail: UserRequestDto['MAILING_LIST']['POST'],
    ) =>
      privateApiInstance.post(
        apiConfig.USER.MAILING_LIST.POST,
        mail,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });
    },
  });

  return { createMail };
};
