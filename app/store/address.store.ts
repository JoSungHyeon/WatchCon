import { create } from 'zustand';

interface AddressStore {
  // Form state
  form: 'list' | 'write';
  setForm: (form: 'list' | 'write') => void;

  // Edit mode
  isEditMode: boolean;
  setIsEditMode: (isEdit: boolean) => void;

  // Search state
  searchTerm: string;
  currentSearchTerm: string;
  setSearchTerm: (term: string) => void;
  setCurrentSearchTerm: (term: string) => void;

  // Pagination state
  pageNo: number;
  pageSize: number;
  tempPageSize: number;
  setPageNo: (page: number) => void;
  setPageSize: (size: number) => void;
  setTempPageSize: (size: number) => void;

  // Sort state
  sortField: keyof AddressItemType | null;
  sortDirection: 'asc' | 'desc';
  setSortField: (field: AddressStore['sortField']) => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
  toggleSort: (field: keyof AddressItemType) => void;

  // Form data
  formData: {
    id: string;
    row_id: string;
    tags: string[];
    alias: string;
  };
  setFormData: (
    data: Partial<AddressStore['formData']>,
  ) => void;
  resetFormData: () => void;
}

export interface AddressItemType {
  row_id: string;
  index: number;
  hostname: string;
  id: string;
  online: boolean;
  username: string;
  alias: string;
  tags: string[];
}

const initialFormData = {
  id: '',
  row_id: '',
  tags: [],
  alias: '',
};

export const useAddressStore = create<AddressStore>(
  (set) => ({
    // Form state
    form: 'list',
    setForm: (form) => set({ form }),

    // Edit mode
    isEditMode: false,
    setIsEditMode: (isEdit) => set({ isEditMode: isEdit }),

    // Search state
    searchTerm: '',
    currentSearchTerm: '',
    setSearchTerm: (searchTerm) => set({ searchTerm }),
    setCurrentSearchTerm: (currentSearchTerm) =>
      set({ currentSearchTerm }),

    // Pagination state
    pageNo: 1,
    pageSize: 10,
    tempPageSize: 10,
    setPageNo: (pageNo) => set({ pageNo }),
    setPageSize: (pageSize) => set({ pageSize }),
    setTempPageSize: (tempPageSize) =>
      set({ tempPageSize }),

    // Sort state
    sortField: null,
    sortDirection: 'asc',
    setSortField: (sortField) => set({ sortField }),
    setSortDirection: (sortDirection) =>
      set({ sortDirection }),
    toggleSort: (field) => {
      set((state) => {
        if (state.sortField === field) {
          return {
            ...state,
            sortDirection:
              state.sortDirection === 'asc'
                ? 'desc'
                : 'asc',
          };
        }
        return {
          ...state,
          sortField: field,
          sortDirection: 'asc',
        };
      });
    },

    // Form data
    formData: initialFormData,
    setFormData: (data) =>
      set((state) => ({
        formData: { ...state.formData, ...data },
      })),
    resetFormData: () => set({ formData: initialFormData }),
  }),
);
