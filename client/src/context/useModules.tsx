import type { ModuleContextType } from "@/types/combined_module_type";
import { createContext, useContext } from "react";

export const ModuleContext = createContext<ModuleContextType | undefined>(
  undefined,
);

export const useModules = () => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error("useStaff must be used within StaffProvider");
  }
  return context;
};
