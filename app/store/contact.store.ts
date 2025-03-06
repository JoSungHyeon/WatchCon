import { create } from 'zustand';

export interface MailPayload {
  username: string;
  email: string;
  subject: string;
  reciver: number;
  message: string;
  file?: File;
}

interface ContactStore {
  isOpen: boolean;
  title: string;
  formData: {
    username: string;
    email: string;
    subject: string;
    reciver: string;
    message: string;
  };
  selectedFile: File | null;
  fileName: string;
  setFormData: (
    data: Partial<ContactStore['formData']>,
  ) => void;
  setSelectedFile: (file: File | null) => void;
  setFileName: (name: string) => void;
  onOpen: (title: string) => void;
  onClose: () => void;
  resetForm: () => void;
}

export const useContactStore = create<ContactStore>(
  (set) => ({
    isOpen: false,
    title: '',
    formData: {
      username: '',
      email: '',
      subject: '',
      reciver: '',
      message: '',
    },
    selectedFile: null,
    fileName: '',

    setFormData: (data) =>
      set((state) => ({
        formData: { ...state.formData, ...data },
      })),

    setSelectedFile: (file) => set({ selectedFile: file }),
    setFileName: (name) => set({ fileName: name }),

    onOpen: (title) => set({ isOpen: true, title }),
    onClose: () => {
      set({ isOpen: false });
      set((state) => {
        state.resetForm();
        return state;
      });
    },

    resetForm: () =>
      set({
        formData: {
          username: '',
          email: '',
          subject: '',
          reciver: '',
          message: '',
        },
        selectedFile: null,
        fileName: '',
      }),
  }),
);
