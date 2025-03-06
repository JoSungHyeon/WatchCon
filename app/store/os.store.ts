import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OsState {
  osType: string;
  setOsType: (os: string) => void;
}

export const useOsStore = create<OsState>()(
  persist(
    (set) => ({
      osType: 'Unknown OS',
      setOsType: (os) => set({ osType: os }),
    }),
    { name: 'os' },
  ),
);
