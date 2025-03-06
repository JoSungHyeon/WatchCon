import { create } from 'zustand';

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface PurchaseStore {
  sortConfig: SortConfig;
  setSortConfig: (config: SortConfig) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const usePurchaseStore = create<PurchaseStore>(
  (set) => ({
    sortConfig: {
      key: 'id',
      direction: 'asc',
    },
    setSortConfig: (config) => set({ sortConfig: config }),
    searchTerm: '',
    setSearchTerm: (term) => set({ searchTerm: term }),
  }),
);
