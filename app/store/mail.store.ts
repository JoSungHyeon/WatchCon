import { create } from 'zustand';

interface MailStore {
  sortField: 'no' | 'date' | 'title';
  isAscending: boolean;
  setSortField: (field: 'no' | 'date' | 'title') => void;
  setIsAscending: (isAscending: boolean) => void;
}

export const useMailStore = create<MailStore>((set) => ({
  sortField: 'no',
  isAscending: true,
  setSortField: (field) => set({ sortField: field }),
  setIsAscending: (isAscending) => set({ isAscending }),
}));
