import { apiConfig } from '@/app/api/config/api-config';
import { privateApiInstance } from '@/app/lib/axios/instance';
import { PricingResponseDto } from '@/app/types/dto/pricing/response.dto';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useMemo } from 'react';

export const usePricingQuery = (
  pageNo?: number,
  priceId?: string,
) => {
  const { data: pricingData, isLoading } = useQuery<
    PricingResponseDto['GET']
  >({
    queryKey: ['pricing', pageNo],
    queryFn: () =>
      privateApiInstance
        .get(apiConfig.PRICING.PRICE_LIST.GET, {
          params: {
            page_no: pageNo,
            page_size: 10,
          },
        })
        .then((res) => res.data),
  });

  const totalPages = pricingData?.data?.total
    ? Math.ceil(pricingData.data.total / 10)
    : 0;

  const { data: detailData } = useQuery<
    AxiosResponse<PricingResponseDto['DETAIL']>
  >({
    queryKey: ['pricing-detail', priceId],
    queryFn: () =>
      privateApiInstance.get(
        apiConfig.PRICING.PRICE_LIST.ACTION.replace(
          ':priceId',
          priceId,
        ),
      ),
    enabled: !!priceId,
  });

  const { data: discountData } = useQuery<
    AxiosResponse<
      PricingResponseDto['DISCOUNT_LIST']['GET']
    >
  >({
    queryKey: ['discount-list', pageNo],
    queryFn: () =>
      privateApiInstance.get(
        apiConfig.PRICING.DISCOUNT_LIST.GET,
        {
          params: {
            page_no: pageNo,
            page_size: 4,
          },
        },
      ),
    select: (response) => ({
      ...response,
      data: {
        ...response.data,
        list: [...response.data.data.list].sort(
          (a, b) => b.before_week - a.before_week,
        ),
      },
    }),
  });

  const latestPrice = useMemo(() => {
    if (pricingData?.data?.list?.[0]) {
      const latest = pricingData.data.list[0];
      return {
        KW: {
          basic_kw: latest.basic_kw,
          premium_kw: latest.premium_kw,
          business_kw: latest.business_kw,
        },
        USD: {
          basic_usd: latest.basic_usd,
          premium_usd: latest.premium_usd,
          business_usd: latest.business_usd,
        },
      };
    }
    return null;
  }, [pricingData]);

  const { data: featureLimitData } = useQuery<
    AxiosResponse<
      PricingResponseDto['FEATURE_LIMIT']['GET']
    >
  >({
    queryKey: ['feature-limit', pageNo],
    queryFn: () =>
      privateApiInstance.get(
        apiConfig.PRICING.FEATURE_LIMIT.GET,
        {
          params: {
            page_no: pageNo,
            page_size: 10,
          },
        },
      ),
  });

  const getPricingDiscounts = (
    discountData: any,
    payUnit: string,
  ) => {
    return discountData?.data?.data?.list;
  };

  const updateActiveDiscountsExpiredAt = (
    expiredAt: string,
  ) => {
    return privateApiInstance.put(
      apiConfig.PRICING.DISCOUNT_LIST.ACTION,
      {
        expired_at: expiredAt,
      },
    );
  };

  const featureLimitTotal =
    featureLimitData?.data?.data?.total;

  return {
    data: pricingData?.data,
    isLoading,
    totalPages,
    detailData: detailData?.data?.data,
    discountData: discountData?.data?.data,
    getPricingDiscounts,
    updateActiveDiscountsExpiredAt,
    latestPrice,
    featureLimitData: featureLimitData?.data?.data?.list,
    featureLimitTotal,
  };
};
