// Function to get default workload formula, given tab (module type)

export const default_formula = (tab: string) =>
  tab == "teaching"
    ? "credits * (alpha * delta + beta * students) * share + coordinator"
    : tab == "supervision_marking"
      ? "credits * students"
      : "0";
