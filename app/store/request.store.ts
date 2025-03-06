import { create } from 'zustand';

export interface RequestPayload {
  title: string;
  content: string;
  file_yn: 'Y' | 'N';
  file_name: string;
  reply_yn: 'Y' | 'N';
  request_type: number;
  request_name: string;
  request_email: string;
}

interface RequestStore {
  requestData: RequestPayload;
  setRequestData: (data: Partial<RequestPayload>) => void;
}

export const useRequestStore = create<RequestStore>((set) => ({
  requestData: {
    title: '',
    content: '',
    file_yn: 'Y',
    file_name: '',
    reply_yn: 'N',
    request_type: 1,
    request_name: '',
    request_email: '',
  },
  setRequestData: (data) =>
    set((state) => ({
      requestData: { ...state.requestData, ...data },
    })),
}));