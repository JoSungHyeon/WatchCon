import { apiConfig } from '@/app/api/config/api-config';
import { privateApiInstance } from '@/app/lib/axios/instance';
import { UserResponseDto } from '@/app/types/dto/user/response.dto';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useEffect } from 'react';

interface UserQueryParams {
  start_time?: string;
  end_time?: string;
  page_no?: number;
  page_size?: number;
  type: 'user' | 'mail';
}

export const useUserQuery = (
  params: UserQueryParams,
  enabled: boolean = true,
) => {
  const isUserList = params.type === 'user';

  const { data, isLoading, refetch } = useQuery<
    AxiosResponse<
      UserResponseDto[typeof isUserList extends true
        ? 'USER_LIST'
        : 'MAILING_LIST']
    >
  >({
    queryKey: [
      params.type,
      params?.start_time,
      params?.end_time,
      params?.page_no,
      params?.page_size,
    ],
    queryFn: () => {
      const queryParams = new URLSearchParams();
      if (params?.start_time)
        queryParams.append('start_time', params.start_time);
      if (params?.end_time)
        queryParams.append('end_time', params.end_time);
      if (params?.page_no)
        queryParams.append(
          'page_no',
          params.page_no.toString(),
        );
      if (params?.page_size)
        queryParams.append(
          'page_size',
          params.page_size.toString(),
        );

      const queryString = queryParams.toString();
      const url = queryString
        ? `${
            isUserList
              ? apiConfig.USER.USER_LIST.GET
              : apiConfig.USER.MAILING_LIST.GET
          }?${queryString}`
        : isUserList
          ? apiConfig.USER.USER_LIST.GET
          : apiConfig.USER.MAILING_LIST.GET;

      return privateApiInstance.get(url);
    },
    enabled,
  });

  const userResponse = isUserList
    ? data?.data.data.list
    : undefined;
  const mailResponse = !isUserList
    ? data?.data.data.list
    : undefined;

  return {
    userData: userResponse as unknown as
      | UserResponseDto['USER_LIST']['data']['list']
      | undefined,
    mailData: mailResponse as unknown as
      | UserResponseDto['MAILING_LIST']['data']['list']
      | undefined,
    isLoading,
    mailTotal: !isUserList ? data?.data.data.total || 0 : 0,
    total: isUserList ? data?.data.data.total || 0 : 0,
    page: data?.data.data.page || 1,
    pageSize: data?.data.data.page_size || 10,
    refetch,
  };
};

export interface MailResultQueryParams {
  mail_id: number;
  page_size?: number;
  page_no?: number;
}

export const useMailResultQuery = (
  params: MailResultQueryParams,
) => {
  const { data, isLoading } = useQuery<
    AxiosResponse<UserResponseDto['MAILING_LIST']['RESULT']>
  >({
    queryKey: [
      'mailResult',
      params.mail_id,
      params.page_size,
      params.page_no,
    ],
    queryFn: () => {
      const queryParams = new URLSearchParams();
      if (params?.page_size) {
        queryParams.append(
          'page_size',
          params.page_size.toString(),
        );
      }
      if (params?.page_no) {
        queryParams.append(
          'page_no',
          params.page_no.toString(),
        );
      }

      const queryString = queryParams.toString();
      const url = queryString
        ? `${apiConfig.USER.MAILING_LIST.RESULT}?${queryString}`
        : apiConfig.USER.MAILING_LIST.RESULT;

      return privateApiInstance.get(url);
    },
  });

  return {
    mailResultData: data?.data.data.list,
    total: data?.data.total || 0,
    page: data?.data.page || 1,
    pageSize: data?.data.page_size || 10,
    isLoading,
  };
};

export const useUserMailDetailQuery = (mail_id: number) => {
  const { data, isLoading, refetch } = useQuery<
    AxiosResponse<
      UserResponseDto['MAILING_LIST']['RESULT_DETAIL']
    >
  >({
    queryKey: ['mailDetail', mail_id],
    queryFn: () =>
      privateApiInstance.get(
        `${apiConfig.USER.MAILING_LIST.DETAIL}?id=${mail_id}`,
      ),
    enabled: !!mail_id && mail_id > 0,
    staleTime: 0,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (mail_id > 0) {
      refetch();
    }
  }, [mail_id, refetch]);

  return {
    mailDetailData: data?.data.data,
    isLoading,
    refetch,
  };
};
