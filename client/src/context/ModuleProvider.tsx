import { useEffect, useState, type ReactNode } from "react";

import { ModuleContext } from "./useModules";
import type { CombinedModuleType } from "@/types/combined_module_type";
import { fetchModulesWithOfferings } from "@/api/modules";
import { useAcademicYear } from "./useAcademicYear";

export function ModuleProvider({ children }: { children: ReactNode }) {
  const [moduleData, setModuleData] = useState<CombinedModuleType[] | null>([]);
  const [moduleRefreshKey, setRefreshKey] = useState<number>(0);
  const { selectedYear } = useAcademicYear();

  const incrementModuleRefreshKey = () => {
    console.log("inc");
    setRefreshKey(moduleRefreshKey + 1);
  };

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
      },
    );
  }, [selectedYear, moduleRefreshKey]);

  return (
    <ModuleContext.Provider
      value={{
        moduleData,
        setModuleData,
        incrementModuleRefreshKey,
        moduleRefreshKey,
      }}
    >
      {children}
    </ModuleContext.Provider>
  );
}
