import type { ModuleContextType } from "@/types/combined_module_type";
import { createContext, useContext } from "react";

// create module context
export const ModuleContext = createContext<ModuleContextType | undefined>(
  undefined,
);

export const useModules = () => {
  const context = useContext(ModuleContext);
  if (!context) {
    // if app not wrapped in provider, error.
    throw new Error("useStaff must be used within StaffProvider");
  }
  return context;
};
