import type { Dispatch, SetStateAction } from "react";

export type Staff = {
  user_id: number | undefined;
  role: string | undefined;
  name: string | undefined;
  email: string | undefined;
  contract_type: string | undefined;
  contract_hours: string | undefined;
  password_hash: string | undefined;
  password: string | undefined;
  active: boolean | undefined;
  allocation: number | undefined;
  allocation_admin: number;
  allocation_supervision_marking: number;
  allocation_teaching: number;
};

export type StaffContextType = {
  staffData: Staff[] | null;
  setStaffData: Dispatch<SetStateAction<Staff[]>>;
  incrementRefreshKey: () => void;
};
