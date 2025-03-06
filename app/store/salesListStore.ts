import { create } from 'zustand';

interface SalesListState {
  isAscending: boolean;
  sortField: string;
  setIsAscending: (isAscending: boolean) => void;
  setSortField: (field: string) => void;
}

export const useSalesListStore = create<SalesListState>(
  (set) => ({
    isAscending: true,
    sortField: 'id',
    setIsAscending: (isAscending) => set({ isAscending }),
    setSortField: (sortField) => set({ sortField }),
  }),
);
