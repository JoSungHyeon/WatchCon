import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;

  userInfo: {
    userName: string;
    email: string;
    nickname: string;
    isAdmin?: boolean;
  };

  setUserInfo: (userInfo: {
    userName: string;
    email: string;
    nickname: string;
    isAdmin?: boolean;
  }) => void;

  clearUserInfo: () => void;

  isIdFound: boolean;
  setIsIdFound: (isIdFound: boolean) => void;

  foundId: string;
  setFoundId: (foundId: string) => void;

  loginTab: string;
  setLoginTab: (loginTab: string) => void;

  otpTab: string;
  setOtpTab: (otpTab: string) => void;

  ADMIN: {
    isAdminLoggedIn: boolean;
  };
  setIsAdminLoggedIn: (isAdminLoggedIn: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),

      otpTab: 'otp',
      setOtpTab: (otpTab) => set({ otpTab }),

      userInfo: {
        userName: '',
        email: '',
        nickname: '',
        isAdmin: false,
      },
      setUserInfo: (userInfo) => set({ userInfo }),
      clearUserInfo: () =>
        set({
          userInfo: {
            userName: '',
            email: '',
            nickname: '',
            isAdmin: false,
          },
        }),

      isIdFound: false,
      setIsIdFound: (isIdFound) => set({ isIdFound }),

      foundId: '',
      setFoundId: (foundId) => set({ foundId }),

      loginTab: 'login',
      setLoginTab: (loginTab) => set({ loginTab }),

      ADMIN: {
        isAdminLoggedIn: false,
      },
      setIsAdminLoggedIn: (isAdminLoggedIn) =>
        set({ ADMIN: { isAdminLoggedIn } }),
    }),
    {
      name: 'watchconToken',
    },
  ),
);
