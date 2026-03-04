import type { ReactNode } from "react";
import PageTitle from "../ui_components/PageTitle";

export function Dashboard({ children }: { children: ReactNode }) {
  return (
    <div className="p-12">
      <PageTitle>Dashboard</PageTitle>
      {children}
    </div>
  );
}
