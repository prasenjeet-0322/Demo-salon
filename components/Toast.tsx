"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  toast: (options: { type?: ToastType; title: string; description?: string }) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = "info", title, description }: { type?: ToastType; title: string; description?: string }) => {
      const id = "toast-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
      const newToast: ToastMessage = { id, type, title, description };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  const success = useCallback((title: string, description?: string) => {
    addToast({ type: "success", title, description });
  }, [addToast]);

  const error = useCallback((title: string, description?: string) => {
    addToast({ type: "error", title, description });
  }, [addToast]);

  const info = useCallback((title: string, description?: string) => {
    addToast({ type: "info", title, description });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info }}>
      {children}
      {/* Toast container floating at top right */}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-3 fade-in ${
              item.type === "success"
                ? "bg-[#141416]/95 border-emerald-500/30 text-white"
                : item.type === "error"
                ? "bg-[#141416]/95 border-rose-500/30 text-white"
                : "bg-[#141416]/95 border-amber-500/30 text-white"
            }`}
          >
            {item.type === "success" && (
              <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
            {item.type === "error" && (
              <div className="p-1 rounded-full bg-rose-500/10 text-rose-400 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
            )}
            {item.type === "info" && (
              <div className="p-1 rounded-full bg-amber-500/10 text-amber-400 mt-0.5">
                <Info className="w-5 h-5" />
              </div>
            )}

            <div className="flex-1 text-sm">
              <h4 className="font-semibold text-white tracking-wide">{item.title}</h4>
              {item.description && (
                <p className="text-zinc-300 text-xs mt-0.5 leading-relaxed">{item.description}</p>
              )}
            </div>

            <button
              onClick={() => removeToast(item.id)}
              className="text-zinc-400 hover:text-white transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
