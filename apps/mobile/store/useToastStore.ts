import { create } from 'zustand';

export type ToastType = 'success' | 'warning' | 'error' | 'info' | 'critical';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  duration?: number; // Optional duration for progress bar (seconds)
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  message: '',
  type: 'info',
  duration: undefined,
  showToast: (message, type = 'info', duration) => set({ visible: true, message, type, duration }),
  hideToast: () => set({ visible: false, duration: undefined }),
}));
