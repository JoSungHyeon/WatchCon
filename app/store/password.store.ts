import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PasswordStore {
  emailForPassword: string;
  setEmailForPassword: (emailForPassword: string) => void;
}

export const usePasswordStore = create<PasswordStore>()(
  persist(
    (set) => ({
      emailForPassword: '',
      setEmailForPassword: (emailForPassword: string) =>
        set({ emailForPassword }),
    }),
    { name: 'password' },
  ),
);
