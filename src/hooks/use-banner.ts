import { create } from 'zustand';

type BannerType = "success" | "error" | "info" | "warning";

interface BannerState {
  type: BannerType | null;
  message: string;
  isVisible: boolean;
  showBanner: (type: BannerType, message: string) => void;
  hideBanner: () => void;
}

export const useBanner = create<BannerState>((set) => ({
  type: null,
  message: '',
  isVisible: false,
  showBanner: (type, message) => set({ type, message, isVisible: true }),
  hideBanner: () => set({ isVisible: false }),
}));

export const banner = {
  success: (message: string) => useBanner.getState().showBanner('success', message),
  error: (message: string) => useBanner.getState().showBanner('error', message),
  info: (message: string) => useBanner.getState().showBanner('info', message),
  warning: (message: string) => useBanner.getState().showBanner('warning', message),
};
