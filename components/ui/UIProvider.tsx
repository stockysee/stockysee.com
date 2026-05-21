"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ModalOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: 'danger' | 'primary';
}

interface UIContextType {
  showToast: (message: string, type?: ToastType) => void;
  showConfirm: (options: ModalOptions) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [modal, setModal] = useState<ModalOptions | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const showConfirm = useCallback((options: ModalOptions) => {
    setModal(options);
  }, []);

  const closeModal = () => setModal(null);

  return (
    <UIContext.Provider value={{ showToast, showConfirm }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-20 right-4 md:top-24 md:right-10 z-[9999] flex flex-col gap-2 md:gap-3 pointer-events-none items-end">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-center gap-2 md:gap-3 px-3 py-2 md:px-5 md:py-4 rounded-xl md:rounded-2xl shadow-2xl border backdrop-blur-xl ${
                toast.type === 'success' 
                  ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                  : toast.type === 'error'
                    ? 'bg-red-500/10 border-red-500/20 text-red-400'
                    : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
              }`}
            >
              {toast.type === 'success' && (
                <svg className="w-3.5 h-3.5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {toast.type === 'error' && (
                <svg className="w-3.5 h-3.5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Action Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-[9998] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[340px] bg-[#0a0f1d] border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden"
            >
              {/* Background Glow */}
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 blur-[80px] opacity-20 -z-10 ${modal.variant === 'danger' ? 'bg-red-500' : 'bg-blue-500'}`} />
              
              <div className="text-center space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${modal.variant === 'danger' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                  {modal.variant === 'danger' ? (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                
                <h3 className="text-sm font-black text-white uppercase tracking-widest">{modal.title}</h3>
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                  {modal.message}
                </p>
                
                <div className={`${modal.cancelText === 'hidden' ? 'flex justify-center' : 'grid grid-cols-2 gap-3'} pt-4`}>
                  {modal.cancelText !== 'hidden' && (
                    <button
                      onClick={() => {
                        if (modal.onCancel) modal.onCancel();
                        closeModal();
                      }}
                      className="py-3 px-4 rounded-2xl bg-white/5 border border-white/10 text-[9px] font-black text-gray-400 uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
                    >
                      {modal.cancelText || 'Batal'}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      modal.onConfirm();
                      if (modal.cancelText !== 'hidden') closeModal();
                    }}
                    className={`py-3 px-4 rounded-2xl text-[9px] font-black text-white uppercase tracking-widest transition-all active:scale-95 shadow-xl ${
                      modal.cancelText === 'hidden' ? 'w-full' : ''
                    } ${
                      modal.variant === 'danger' 
                        ? 'bg-red-600 hover:bg-red-500 shadow-red-500/20' 
                        : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
                    }`}
                  >
                    {modal.confirmText || 'Ya, Lanjutkan'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </UIContext.Provider>
  );
}

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
