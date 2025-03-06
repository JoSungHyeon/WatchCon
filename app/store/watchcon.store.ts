import { create } from 'zustand';

interface WatchconStore {
  disabledId: string;
  setDisabledId: (id: string) => void;
  sortField: string;
  isAscending: boolean;
  setSortField: (field: string) => void;
  setIsAscending: (isAscending: boolean) => void;
}

export const useWatchconStore = create<WatchconStore>(
  (set) => ({
    disabledId: '',
    setDisabledId: (id) => set({ disabledId: id }),
    sortField: 'no',
    isAscending: true,
    setSortField: (field) => set({ sortField: field }),
    setIsAscending: (isAscending) => set({ isAscending }),
  }),
);
