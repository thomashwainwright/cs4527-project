import type { ReactNode } from "react";

export default function PageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-5xl font-bold cursor-default select-none">
      {children}
    </h1>
  );
}
