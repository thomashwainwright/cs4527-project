import type { Module } from "./module_type";

export type CombinedModuleType = Module & { allocation?: number, del: boolean, new: number, edit: boolean, unique_id: number }
