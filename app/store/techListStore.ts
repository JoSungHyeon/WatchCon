import { create } from 'zustand';

interface TechListState {
  isAscending: boolean;
  sortField: string;
  setIsAscending: (isAscending: boolean) => void;
  setSortField: (field: string) => void;
}

export const useTechListStore = create<TechListState>(
  (set) => ({
    isAscending: true,
    sortField: 'id',
    setIsAscending: (isAscending) => set({ isAscending }),
    setSortField: (sortField) => set({ sortField }),
  }),
);
