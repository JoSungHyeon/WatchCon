import { create } from 'zustand';

interface SortConfig {
  column: string;
  isAscending: boolean;
}

interface UserTableStore {
  sortConfig: SortConfig;
  setSortConfig: (column: string) => void;
}

export const useUserTableStore = create<UserTableStore>(
  (set) => ({
    sortConfig: {
      column: 'username',
      isAscending: true,
    },
    setSortConfig: (column) =>
      set((state) => ({
        sortConfig: {
          column,
          isAscending:
            state.sortConfig.column === column
              ? !state.sortConfig.isAscending
              : true,
        },
      })),
  }),
);
