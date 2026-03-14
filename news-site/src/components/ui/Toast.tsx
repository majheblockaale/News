"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastStore {
  toasts: Toast[];
  add: (message: string, type?: Toast["type"]) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (message, type = "info") => {
    const id = Math.random().toString(36).slice(2);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  remove: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const colors = {
  success: "border-green-500 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  error: "border-red-500 bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  info: "border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
};

export function ToastContainer() {
  const { toasts, remove } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border-l-4 shadow-lg text-sm animate-slide-in ${colors[toast.type]}`}
          >
            <Icon size={16} className="shrink-0" />
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => remove(toast.id)} className="p-0.5 rounded hover:opacity-70 shrink-0">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
