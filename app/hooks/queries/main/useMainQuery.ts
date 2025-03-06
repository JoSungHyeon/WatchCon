//ts-nocheck

'use client';

import { DownloadResponseDto } from '@/app/types/dto/download/response.dto';
import { NoticeResponseDto } from '@/app/types/dto/notice/response.dto';
import { PricingResponseDto } from '@/app/types/dto/pricing/response.dto';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { apiConfig } from '../../../api/config/api-config';
import { publicApiInstance } from '../../../lib/axios/instance';

export const useMainQuery = (): {
  data: any;
  isLoading: boolean;
  error: any;
  noticeData: any[];
  noticeLoading: boolean;
  noticeError: any;
  priceData: any[];
  featureLimitData: any[];
  downloadOptions: any[];
} => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['main-faq'],
    queryFn: () =>
      publicApiInstance.get(apiConfig.FAQ.MAIN),
  });

  const {
    data: noticeData,
    isLoading: noticeLoading,
    error: noticeError,
  } = useQuery<AxiosResponse<NoticeResponseDto['GET']>>({
    queryKey: ['main-notice'],
    queryFn: () =>
      publicApiInstance.get(apiConfig.MAIN.NOTICE),
  });

  const { data: priceData } = useQuery<
    AxiosResponse<PricingResponseDto['GET']>
  >({
    queryKey: ['main-price'],
    queryFn: () =>
      publicApiInstance.get(apiConfig.PRICING.PUBLIC.PRICE),
  });

  const { data: featureLimitData } = useQuery<
    AxiosResponse<PricingResponseDto['GET']>
  >({
    queryKey: ['main-feature-limit'],
    queryFn: () =>
      publicApiInstance.get(
        apiConfig.PRICING.PUBLIC.FEATURE_LIMIT,
      ),
  });

  const { data: downloadOptions } = useQuery<
    AxiosResponse<DownloadResponseDto>
  >({
    queryKey: ['main-download-option'],
    queryFn: () =>
      publicApiInstance.get(apiConfig.MAIN.DOWNLOAD),
  });

  return {
    data,
    isLoading,
    error,
    noticeData: noticeData?.data?.data?.list ?? [],
    noticeLoading,
    noticeError,
    priceData: priceData?.data?.data?.list ?? [],
    featureLimitData:
      featureLimitData?.data?.data?.list ?? [],
    downloadOptions:
      downloadOptions?.data?.data?.list ?? [],
  };
};
