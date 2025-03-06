import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { apiConfig } from '../../../api/config/api-config';
import {
  privateApiInstance,
  publicApiInstance,
} from '../../../lib/axios/instance';
import { useAuthStore } from '../../../store/auth.store';
import {
  AuthRequestDto,
  AuthResponseDto,
} from '../../../types/dto/auth';

export const useAuthMutation = () => {
  const router = useRouter();
  const {
    setToken,
    setUserInfo,
    clearUserInfo,
    setIsIdFound,
    setFoundId,
    setIsAdminLoggedIn,
    setOtpTab,
  } = useAuthStore();

  const { mutate: login, error: loginError } = useMutation({
    mutationFn: async (data: AuthRequestDto['Login']) => {
      const response = await privateApiInstance.post<
        AuthResponseDto['Login']['Success']
      >(apiConfig.AUTH.LOGIN, data);
      return response.data.data;
    },
    onError: (error: AxiosError) => {
      console.log('Login Error:', error.response?.data);
      throw error;
    },
    onSuccess: (response) => {
      sessionStorage.setItem(
        'watchconUserToken',
        response.token,
      );
      setToken(response.token);
      setUserInfo({
        userName: response.username,
        email: response.email,
        nickname: response.nickname,
        isAdmin: response.is_admin === 0 ? false : true,
      });
      router.push('/');
    },
  });

  const { mutate: logout } = useMutation({
    mutationFn: () =>
      privateApiInstance.post(apiConfig.AUTH.LOGOUT),
    onSuccess: () => {
      setToken(null);
      clearUserInfo();
      sessionStorage.removeItem('watchconToken');
      setIsAdminLoggedIn(false);
      router.push('/');
    },
  });

  const { mutate: findId, error: findIdError } =
    useMutation<
      AuthResponseDto['FindId']['Success'],
      AxiosError<AuthResponseDto['FindId']['Error']>,
      AuthRequestDto['FindId']
    >({
      mutationFn: async (
        data: AuthRequestDto['FindId'],
      ) => {
        const response = await publicApiInstance.get<
          AuthResponseDto['FindId']['Success']
        >(apiConfig.AUTH.FIND_ID, { params: data });
        return response.data;
      },
      onError: (error: AxiosError) => {
        console.log('FindId Error:', error.response?.data);
        setIsIdFound(true);
        throw error;
      },
      onSuccess: (response) => {
        setIsIdFound(true);
        setFoundId(response.username);
      },
    });

  const { mutate: adminLogin, error: adminLoginError } =
    useMutation<
      AuthResponseDto['ADMIN']['LOGIN']['Success'],
      AxiosError<
        AuthResponseDto['ADMIN']['LOGIN']['ERROR']
      >,
      AuthRequestDto['ADMIN']['LOGIN']
    >({
      mutationFn: async (
        data: AuthRequestDto['ADMIN']['LOGIN'],
      ) => {
        const response = await publicApiInstance.post<
          AuthResponseDto['ADMIN']['LOGIN']['Success']
        >(apiConfig.AUTH.ADMIN.LOGIN, data);
        return response.data;
      },
      onError: (error: AxiosError) => {
        console.log(
          'Admin Login Error:',
          error.response?.data,
        );
        throw error;
      },
      onSuccess: (response) => {
        setIsAdminLoggedIn(true);
        setToken(response.data.token);
        router.push('/admin/ecommerce');
      },
    });

  const {
    mutate: findPassword,
    error: findPasswordError,
    reset: resetFindPasswordError,
  } = useMutation({
    mutationFn: async (email: string) => {
      const response = await publicApiInstance.post(
        apiConfig.AUTH.FIND_PASSWORD,
        { email },
      );

      return response.data;
    },
    onSuccess: () => {
      router.push('/password');
    },
  });

  const {
    mutate: verifyOtp,
    error: verifyOtpError,
    reset: resetVerifyOtpError,
  } = useMutation({
    mutationFn: async (data: {
      otpCode: string;
      email: string;
    }) => {
      const response = await publicApiInstance.post(
        apiConfig.AUTH.VERIFY_OTP,
        data,
      );
      return response.data;
    },
    onError: (error: AxiosError) => {
      console.log(
        'Verify OTP Error:',
        error.response?.data,
      );
      throw error;
    },
    onSuccess: () => {
      setOtpTab('complete');
    },
  });

  const {
    mutate: changePassword,
    error: changePasswordError,
    reset: resetChangePasswordError,
  } = useMutation({
    mutationFn: async (data: {
      newPassword: string;
      email: string;
    }) => {
      const response = await privateApiInstance.post(
        apiConfig.AUTH.CHANGE_PASSWORD,
        data,
      );
      return response.data;
    },
    onError: (error: AxiosError) => {
      throw error;
    },
  });

  return {
    login,
    logout,
    loginError,
    findId,
    findIdError,
    adminLogin,
    adminLoginError,
    findPassword,
    findPasswordError,
    resetFindPasswordError,
    verifyOtp,
    verifyOtpError,
    resetVerifyOtpError,
    changePassword,
    changePasswordError: (
      changePasswordError as AxiosError<any>
    )?.response?.data?.response?.message,
    resetChangePasswordError,
  };
};
