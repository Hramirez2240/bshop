import React from 'react';
import { useAppStore } from '../store';
import { X } from 'lucide-react';

export const Toaster = () => {
  const { toasts, removeToast } = useAppStore();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto transform transition-all duration-500 animate-slide-in
            flex items-center justify-between p-4 rounded-xl shadow-2xl border
            ${toast.type === 'success' ? 'bg-zinc-900 border-green-500/50 text-green-500' : ''}
            ${toast.type === 'error' ? 'bg-zinc-900 border-red-500/50 text-red-500' : ''}
            ${toast.type === 'info' ? 'bg-zinc-900 border-blue-500/50 text-blue-400' : ''}
          `}
        >
          <span className="text-sm font-medium text-white">{toast.title}</span>
          <button 
            onClick={() => removeToast(toast.id)}
            className="ml-4 hover:text-white opacity-70 hover:opacity-100"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};