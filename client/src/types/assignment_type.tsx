export type Assignment = {
  assignment_id: number | undefined;
  user_id: number;
  offering_id: number | undefined;
  delta: number | undefined;
  share: number | undefined;
  coordinator: number | undefined;
  custom_formula: string | undefined;
};
