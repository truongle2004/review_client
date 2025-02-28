import { toast, type ToastOptions } from 'react-toastify';

export const ToastSuccess = (message: string, options?: ToastOptions) => {
  toast.success(message, options);
};

export const ToastError = (message: string, options?: ToastOptions) => {
  toast.error(message, options);
};

export const ToastWarning = (message: string, options?: ToastOptions) => {
  toast.warning(message, options);
};
