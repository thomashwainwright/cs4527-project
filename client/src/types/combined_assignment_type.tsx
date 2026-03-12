import type { Assignment } from "./assignment_type";
import type { ModuleOffering } from "./module_offering_type";
import type { Module } from "./module_type";

export type CombinedAssignmentType = (Assignment & Module & ModuleOffering & {hours: number | string, focused: boolean, edit: boolean})
