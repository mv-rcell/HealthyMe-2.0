
import { useState } from "react";

const TOAST_TIMEOUT = 5000;

type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  status?: "default" | "success" | "error" | "warning" | "info";
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  function toast(props: Omit<ToastProps, "id">) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, ...props };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);
    
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, TOAST_TIMEOUT);
    
    return id;
  }

  function dismissToast(id: string) {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }

  return {
    toast,
    dismissToast,
    toasts,
  };
}

// Export a standalone toast function for easier usage
export const toast = (props: Omit<ToastProps, "id">) => {
  const { toast: toastFn } = useToast();
  return toastFn(props);
};
