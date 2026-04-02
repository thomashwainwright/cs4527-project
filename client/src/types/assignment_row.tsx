import type { Assignment } from "./assignment_type";
import type { Staff } from "./staff_type";

export type AssignmentRow = Partial<Assignment> &
  Staff & {
    unique_id: number;
    new: number;
    edit: boolean;
    del: boolean;
  };
