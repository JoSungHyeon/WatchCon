import { apiConfig } from '@/app/api/config/api-config';
import { privateApiInstance } from '@/app/lib/axios/instance';
import { useModalStore } from '@/app/store/modal.store';
import { PurchaseRequestDto } from '@/app/types/dto/purchase/request.dto';
import { useMutation } from '@tanstack/react-query';

export const usePurchaseMutation = () => {
  const { toggleState } = useModalStore();

  const {
    mutate: purchase,
    error: purchaseError,
    isError,
    isPending,
  } = useMutation({
    mutationFn: async (data: PurchaseRequestDto) => {
      try {
        const response = await privateApiInstance.post(
          apiConfig.LICENSE.PURCHASE.CANCEL,
          data,
        );
        return response;
      } catch (error: any) {
        console.log(
          'Error Response:',
          error?.response?.data.response.message,
        );

        const errorData = error?.response?.data;
        const errorMessage = errorData?.response?.message;

        if (typeof errorMessage === 'object') {
          // message가 객체인 경우 첫 번째 에러 메시지를 사용
          const messages = Object.values(errorMessage);
          const firstMessage = messages[0];
          throw new Error(
            typeof firstMessage === 'string'
              ? firstMessage
              : '알 수 없는 오류가 발생했습니다.',
          );
        } else if (errorMessage) {
          // message가 문자열인 경우
          throw new Error(errorMessage);
        }

        throw new Error('알 수 없는 오류가 발생했습니다.');
      }
    },
    onSuccess: () => {
      toggleState('MAIN.purchase_success');
    },
    onError: () => {
      toggleState('MAIN.purchase_error');
    },
  });

  return {
    purchase,
    purchaseError,
    isError,
    isPending,
  };
};
