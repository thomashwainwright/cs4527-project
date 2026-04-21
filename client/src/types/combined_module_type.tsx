import type { Dispatch, SetStateAction } from "react";
import type { Module } from "./module_type";

export type CombinedModuleType = Module & {
  allocation?: number;
  del: boolean;
  new: number;
  edit: boolean;
  unique_id: number;
};

export type ModuleContextType = {
  moduleData: CombinedModuleType[] | null;
  setModuleData: Dispatch<SetStateAction<CombinedModuleType[] | null>>;
  incrementModuleRefreshKey: () => void;
  moduleRefreshKey: number;
};
