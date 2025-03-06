import { create } from 'zustand';

interface PricingStore {
  payUnit: string;
  setPayUnit: (unit: string) => void;
  priceId: string;
  setPriceId: (id: string) => void;

  DISCOUNT_LIST: {
    payUnit: string;
    setPayUnit: (unit: string) => void;
    expirationDate: string;
    setExpirationDate: (date: string) => void;
  };
}

export const usePricingStore = create<PricingStore>(
  (set) => ({
    payUnit: 'kw',
    setPayUnit: (unit) => set({ payUnit: unit }),

    priceId: '',
    setPriceId: (id) => set({ priceId: id }),

    DISCOUNT_LIST: {
      payUnit: 'kw',
      expirationDate: '',
      setPayUnit: (unit) =>
        set((state) => ({
          DISCOUNT_LIST: {
            ...state.DISCOUNT_LIST,
            payUnit: unit,
          },
        })),
      setExpirationDate: (date) =>
        set((state) => ({
          DISCOUNT_LIST: {
            ...state.DISCOUNT_LIST,
            expirationDate: date,
          },
        })),
    },
  }),
);
