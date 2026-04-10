import { createContext, useContext } from "react";
import type { StaffContextType } from "@/types/staff_type";

export const StaffContext = createContext<StaffContextType | undefined>(
  undefined,
);

export const useStaff = () => {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error("useStaff must be used within StaffProvider");
  }
  return context;
};
