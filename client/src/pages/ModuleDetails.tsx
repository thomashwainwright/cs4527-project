import { useParams } from "react-router-dom";
import type { Module } from "../types/module_type";
import { useState } from "react";
import { fetchModuleDetails } from "../api/modules";

export default function ModuleDetails() {
  const code = useParams().code as string;
  const [moduleDetails, setModuleDetails] = useState<Module | null>(null);

  fetchModuleDetails(code).then((details: Module) => {
    setModuleDetails(details);
  });

  return (
    <div> {moduleDetails ? JSON.stringify(moduleDetails) : "Loading..."} </div>
  );
}
