import { create } from 'zustand';

interface NoticeStore {
  selectedNoticeId: string;
  setSelectedNoticeId: (id: string) => void;
  sortConfig: {
    key: string;
    direction: 'asc' | 'desc';
  };
  setSortConfig: (config: {
    key: string;
    direction: 'asc' | 'desc';
  }) => void;
}

export const useNoticeStore = create<NoticeStore>(
  (set) => ({
    selectedNoticeId: '',
    setSelectedNoticeId: (id) =>
      set({ selectedNoticeId: id }),
    sortConfig: {
      key: 'id',
      direction: 'asc',
    },
    setSortConfig: (config) => set({ sortConfig: config }),
  }),
);
