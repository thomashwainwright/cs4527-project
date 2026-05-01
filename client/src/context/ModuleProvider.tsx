import { useEffect, useState, type ReactNode } from "react";

import { ModuleContext } from "./useModules";
import type { CombinedModuleType } from "@/types/combined_module_type";
import { fetchModulesWithOfferings } from "@/api/modules";
import { useAcademicYear } from "./useAcademicYear";

export function ModuleProvider({ children }: { children: ReactNode }) {
  const [moduleData, setModuleData] = useState<CombinedModuleType[] | null>([]);
  const [moduleRefreshKey, setRefreshKey] = useState<number>(0);
  const { selectedYear } = useAcademicYear();

  // used to refresh module data.
  const incrementModuleRefreshKey = () => {
    setRefreshKey(moduleRefreshKey + 1);
  };

  // update effect when selected year is changed or refresh key is changed (used to manually update data after change)
  useEffect(() => {
    if (!selectedYear) return;

    // get module offerings to be made accessible through this context provider.
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

  // provide module state and updater to child components

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
