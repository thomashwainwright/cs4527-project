import type { ReactNode } from "react";
import AcademicYearSelector from "./AcademicYearSelector";

export default function PageTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-row items-center mb-10">
      <h1 className="text-2xl md:text-5xl font-bold cursor-default select-none ">
        {children}
      </h1>

      <AcademicYearSelector />
    </div>
  );
}
