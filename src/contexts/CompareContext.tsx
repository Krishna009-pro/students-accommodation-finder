import React, { createContext, useContext, useState } from "react";
import { Property } from "@/lib/data";

interface CompareContextType {
  compareList: Property[];
  addToCompare: (property: Property) => void;
  removeFromCompare: (propertyId: string) => void;
  clearCompare: () => void;
  isInCompare: (propertyId: string) => boolean;
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareList, setCompareList] = useState<Property[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const addToCompare = (property: Property) => {
    if (compareList.length >= 3) {
      return;
    }
    if (!compareList.find((p) => p.id === property.id)) {
      setCompareList([...compareList, property]);
      setDrawerOpen(true);
    }
  };

  const removeFromCompare = (propertyId: string) => {
    setCompareList(compareList.filter((p) => p.id !== propertyId));
    if (compareList.length <= 1) {
      setDrawerOpen(false);
    }
  };

  const clearCompare = () => {
    setCompareList([]);
    setDrawerOpen(false);
  };

  const isInCompare = (propertyId: string) => {
    return compareList.some((p) => p.id === propertyId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        isDrawerOpen,
        setDrawerOpen,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
