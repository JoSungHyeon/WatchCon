import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Price {
  kw: number;
  usd: number;
}

interface MainStore {
  price: Price;
  setPrice: (price: Price) => void;

  licenseType: number;
  setLicenseType: (licenseType: number) => void;

  featureId: number;
  setFeatureId: (featureId: number) => void;
}

export const useMainStore = create<MainStore>()(
  persist(
    (set) => ({
      price: {
        kw: 0,
        usd: 0,
      },
      setPrice: (price) => set({ price }),

      licenseType: 0,
      setLicenseType: (licenseType) => set({ licenseType }),

      featureId: 0,
      setFeatureId: (featureId) => set({ featureId }),
    }),
    { name: 'main' },
  ),
);
