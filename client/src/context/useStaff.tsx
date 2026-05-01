import { createContext, useContext } from "react";
import type { StaffContextType } from "@/types/staff_type";

// create staff context
export const StaffContext = createContext<StaffContextType | undefined>(
  undefined,
);

export const useStaff = () => {
  const context = useContext(StaffContext);
  if (!context) {
    // if app not wrapped in provider, error.

    throw new Error("useStaff must be used within StaffProvider");
  }
  return context;
};
