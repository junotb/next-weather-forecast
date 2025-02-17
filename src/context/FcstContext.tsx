'use client';

import { createContext, ReactNode, useContext, useState } from "react";

interface FcstContextType {
  fcstData: FcstInstance[];
  setFcstData: (fcstData: FcstInstance[]) => void;
}

export const FcstContext = createContext<FcstContextType>({
  fcstData: [],
  setFcstData: () => {},
});

export default function FcstProvider({ children }: { children: ReactNode }) {
  const [fcstData, setFcstData] = useState<FcstInstance[]>([]);

  return (
    <FcstContext.Provider value={{ fcstData, setFcstData }}>
      {children}
    </FcstContext.Provider>
  );
}

export const useFcstContext = () => {
  const context = useContext(FcstContext);
  if (!context) {
    throw new Error('useFcstContext must be used within a FcstProvider');
  }
  return context;
};