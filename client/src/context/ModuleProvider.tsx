import { useEffect, useState, type ReactNode } from "react";

import { ModuleContext } from "./useModules";
import type { CombinedModuleType } from "@/types/combined_module_type";
import { fetchModulesWithOfferings } from "@/api/modules";
import { useAcademicYear } from "./useAcademicYear";

export function ModuleProvider({ children }: { children: ReactNode }) {
  const [moduleData, setModuleData] = useState<CombinedModuleType[] | null>([]);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const { selectedYear } = useAcademicYear();

  const incrementModuleRefreshKey = () => setRefreshKey(refreshKey + 1);

  useEffect(() => {
    if (!selectedYear) return;

    fetchModulesWithOfferings(selectedYear.year_id).then(
      (modules: CombinedModuleType[]) => {
        console.log("Fetched modules with offerings");
        setModuleData(modules);
        setModuleData((prev) => {
          if (!prev) return prev;

          return prev.map((item, index) => ({
            ...item,
            unique_id: index,
          }));
        });
        console.log("fetch");
      },
    );
  }, [selectedYear]);

  return (
    <ModuleContext.Provider
      value={{ moduleData, setModuleData, incrementModuleRefreshKey }}
    >
      {children}
    </ModuleContext.Provider>
  );
}
