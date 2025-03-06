import { apiConfig } from '@/app/api/config/api-config';
import { privateApiInstance } from '@/app/lib/axios/instance';
import { PricingRequestDto } from '@/app/types/dto/pricing/request.dto';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
export const usePricingMutation = () => {
  const queryClient = useQueryClient();

  const { mutate: deletePricing } = useMutation({
    mutationFn: (priceId: string) =>
      privateApiInstance.delete(
        apiConfig.PRICING.PRICE_LIST.ACTION.replace(
          ':priceId',
          priceId,
        ),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pricing'],
      });
    },
  });

  const { mutate: createPricing } = useMutation({
    mutationFn: (
      price: PricingRequestDto['PRICE_LIST']['POST'],
    ) =>
      privateApiInstance.post(
        apiConfig.PRICING.PRICE_LIST.POST,
        price,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pricing'],
      });
    },
  });

  const { mutate: updatePricing } = useMutation({
    mutationFn: ({
      price,
    }: {
      price: PricingRequestDto['PRICE_LIST']['PUT'];
    }) =>
      privateApiInstance.put(
        apiConfig.PRICING.PRICE_LIST.POST,
        price,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pricing'],
      });
    },
  });

  const { mutateAsync: createDiscount } = useMutation({
    mutationFn: (
      discount: PricingRequestDto['DISCOUNT_LIST']['POST'],
    ) =>
      privateApiInstance.post(
        apiConfig.PRICING.DISCOUNT_LIST.POST,
        discount,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['discount-list'],
      });
    },
  });

  const { mutateAsync: updateDiscount } = useMutation({
    mutationFn: (
      discount: PricingRequestDto['DISCOUNT_LIST']['PUT'],
    ) =>
      privateApiInstance.put(
        apiConfig.PRICING.DISCOUNT_LIST.POST,
        discount,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['discount-list'],
      });
    },
  });

  const { mutateAsync: deleteDiscount } = useMutation({
    mutationFn: (discountId: string) =>
      privateApiInstance.delete(
        apiConfig.PRICING.DISCOUNT_LIST.ACTION.replace(
          ':discountId',
          discountId,
        ),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['discount-list'],
      });
    },
  });

  const { mutate: createFeature } = useMutation({
    mutationFn: (
      feature: PricingRequestDto['FEATURE_LIST']['POST'],
    ) =>
      privateApiInstance.post(
        apiConfig.PRICING.FEATURE_LIMIT.POST,
        feature,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['feature-limit'],
      });
    },
  });

  const { mutate: updateFeature } = useMutation({
    mutationFn: (
      feature: PricingRequestDto['FEATURE_LIST']['PUT'],
    ) =>
      privateApiInstance.put(
        apiConfig.PRICING.FEATURE_LIMIT.POST,
        feature,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['feature-limit'],
      });
    },
  });

  return {
    deletePricing,
    createPricing,
    updatePricing,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    createFeature,
    updateFeature,
  };
};
