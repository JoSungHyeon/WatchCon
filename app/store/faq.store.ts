import { create } from 'zustand';

interface FaqFilterState {
  tempStartDate: Date;
  tempEndDate: Date;
  setTempStartDate: (date: Date) => void;

  startDate: Date;
  endDate: Date;

  applyDateFilter: () => void;

  pagesize: number;
  setPagesize: (size: number) => void;

  pageno: number;
  setPageno: (page: number) => void;

  faqEditMode: boolean;
  setFaqEditMode: (mode: boolean) => void;

  selectedFaqId: string;
  setSelectedFaqId: (id: string) => void;

  list: string;
  setList: (list: string) => void;

  sortConfig: {
    key: string;
    direction: 'asc' | 'desc';
  };
  setSortConfig: (config: {
    key: string;
    direction: 'asc' | 'desc';
  }) => void;
}

export const useFaqStore = create<FaqFilterState>(
  (set) => ({
    tempStartDate: new Date(
      new Date().setMonth(new Date().getMonth() - 2),
    ),
    tempEndDate: new Date(),
    setTempStartDate: (date: Date) =>
      set({ tempStartDate: date }),

    startDate: new Date(
      new Date().setMonth(new Date().getMonth() - 2),
    ),
    endDate: new Date(),

    applyDateFilter: () =>
      set((state) => ({
        startDate: state.tempStartDate,
        endDate: new Date(),
      })),

    pagesize: 10,
    setPagesize: (size: number) => set({ pagesize: size }),

    pageno: 1,
    setPageno: (page: number) => set({ pageno: page }),

    faqEditMode: false,
    setFaqEditMode: (mode: boolean) =>
      set({ faqEditMode: mode }),

    selectedFaqId: '',
    setSelectedFaqId: (id: string) =>
      set({ selectedFaqId: id }),

    list: 'faq',
    setList: (list: string) => set({ list: list }),

    sortConfig: {
      key: 'id',
      direction: 'asc',
    },
    setSortConfig: (config) => set({ sortConfig: config }),
  }),
);
