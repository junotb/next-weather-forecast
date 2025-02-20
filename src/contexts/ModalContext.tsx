'use client';

import { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextProps {
  modals: Record<string, boolean>;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<Record<string, boolean>>({});

  const openModal = (id: string) => setModals(prev => ({ ...prev, [id]: true }));
  const closeModal = (id: string) => setModals(prev => ({ ...prev, [id]: false }));

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
