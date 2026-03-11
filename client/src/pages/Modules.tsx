import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { Module } from "../types/module_type";
import PageTitle from "../ui_components/PageTitle";
import { useAcademicYear } from "@/context/useAcademicYear";
import { commitModuleChanges, commitModuleOfferingChanges, fetchModules, fetchModulesWithOfferings } from "@/api/modules";
import deleteIcon from "../assets/icons/delete-icon.svg"
import Fullscreen from "@/ui_components/Fullscreen";
import type { CombinedModuleType } from "@/types/combined_module_type";
import AddModule from "@/fullscreen_popups/AddModule";


export function Modules() {
  const navigate = useNavigate();
  const [data, setData] = useState<
    (CombinedModuleType)[] | null
  >();
  const [filter, setFilter] = useState({
    teaching: true,
    admin: true,
    supervision_marking: true,
    search: "",
  });
  const [editModules, setEditModules] = useState<boolean>(false);
  const [assignModuleWindow, setAssignModuleWindow] = useState<boolean>(false); // window to assign module to academic year => creates offering
  const[refreshKey, setRefreshKey] = useState<number>(0);

  const { selectedYear } = useAcademicYear();

  const handleRowClick = (code: string) => {
    navigate(`/module/${code}`);
  };

  const handleModuleTypeFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFilter((previous) => ({
      ...previous,
      [name]: checked,
    }));
  };

  useEffect(() => {
    if (!selectedYear) {
      return;
    }

    // If in editing mode, fetch all modules. Else, fetch only with offerings in current context academic year.
    if (editModules) {
      fetchModules().then(
        (modules: (CombinedModuleType)[]) => {
          console.log("Fetched modules with offerings");
          setData(modules);
          setData(prev =>
            prev?.map((item, index) => ({
              ...item,
              unique_id: index
            }))
          );
        },
      );
    } else {
      fetchModulesWithOfferings(selectedYear?.year_id).then(
        (modules: (CombinedModuleType)[]) => {
          console.log("Fetched modules with offerings");
          setData(modules);
          setData(prev =>
            prev?.map((item, index) => ({
              ...item,
              unique_id: index
            }))
          );
        },
      );
    }

  }, [selectedYear, editModules, refreshKey]);

  function getFilteredData() {
    return (
      data && 
      data.filter((item: Module) => {
        let type_filter = false;
        if (filter.teaching && item.module_type == "teaching") {
          type_filter = true;
        }

        if (filter.admin && item.module_type == "admin") {
          type_filter = true;
        }

        if (filter.supervision_marking && item.module_type == "supervision/marking") {
          type_filter = true;
        }

        const searchFilter =
          item.code.toLowerCase().includes(filter.search.toLowerCase()) ||
          item.name.toLowerCase().includes(filter.search.toLowerCase());

        return type_filter && searchFilter;
      })
    );
  }

  function markDel(module: CombinedModuleType, value: boolean) {
    setData(prev =>
      prev?.filter(item => !(item.unique_id === module.unique_id && typeof item.new === "number")).map(item =>
        item.unique_id === module.unique_id
          ? { ...item, del: value }
          : item
      )
    );
  }

  function addModule() {
    setData(prev => {
      const arr = prev ?? [];

      const maxId = arr.reduce(
        (max, item) => Math.max(max, item.unique_id ?? 0),
        0
      );

      const new_entry: CombinedModuleType = {
        code: "",
        name: "",
        module_type: "teaching",
        del: false,
        new: Date.now(),
        unique_id: maxId + 1,
        edit: false
      };

      return [...arr, new_entry];
    });
  }

  function updateStateData(row: HTMLTableRowElement, module: CombinedModuleType) {
    const newCode = row.cells[0].textContent
    const newName = row.cells[1].textContent

    const changed = newCode != module.code || newName != module.name // detect if input has resulted in any change, no point changing if not.
    if (!changed) return // also stops edit: true showing amber bg on unchanged (in reality) rows.

    setData(prev =>
      prev?.map(item =>
        item.unique_id === module.unique_id
          ? { ...item, edit: true, code: newCode, name: newName }
          : item
      )
    );
  }

  function saveData() {
    const deletedData = data?.filter(item => item.del) // only update table with data that has been modified.
    const editedData = data?.filter(item => item.edit && item.new == undefined && !item.del)
    const newData = data?.filter(item => item.new)

    console.log(editedData)
    console.log(newData)
    console.log(deletedData)

    if (editModules) {
      // editModules => data is module, to update the "modules" table.
      let err = false;
      newData?.forEach(item => {
        console.log(item.code)
        if (item.code == "") {
          err = true;
          alert("Missing required field: Code");
          return;
        }
      })
      if (!err) commitModuleChanges(deletedData, editedData, newData).then(() => setRefreshKey(refreshKey + 1));
    } else {
      // !editModules => data is module offering, to update "module_offerings" table. This represents assignments of a module to a specific year.
      if (!selectedYear) return;
      commitModuleOfferingChanges(deletedData, editedData, newData, selectedYear?.year_id).then(() => setRefreshKey(refreshKey + 1))
    }

  }

  function onModuleOfferingAdd(modules: Module[] | undefined) {
    if (!modules) return;
    
    setAssignModuleWindow(false);

    let maxId = data ? data.reduce(
      (max, item) => Math.max(max, item.unique_id ?? 0),
      0
    ) : -1;

    const converted_modules: CombinedModuleType[] = modules.map(module => {
      maxId++;
      return {
        module_id: module.module_id,
        code: module.code,
        name: module.name,
        module_type: module.module_type,
        del: false,
        edit: false,
        new: Date.now(),
        unique_id: maxId,
        allocation: 0
      }
    })

    setData(prev => [...(prev || []), ...converted_modules]);
  }

  return (
    <div className="flex flex-col h-dvh p-12">
      <PageTitle>{editModules ? "All" : "Active"} Modules</PageTitle>

      <div className="flex flex-row mb-4 items-center gap-4 text-xl">
        <p>Module Type</p>

        <div className="border border-gray-300 rounded-md px-4 py-2 flex flex-row gap-8">
          <label>
            <input
              name="teaching"
              type="checkbox"
              onChange={handleModuleTypeFilter}
              className=" mr-2"
              checked={filter.teaching}
            />
            Teaching
          </label>
          <label>
            <input
              name="supervision_marking"
              type="checkbox"
              onChange={handleModuleTypeFilter}
              className=" mr-2"
              checked={filter.supervision_marking}
            />
            Supervision/Marking
          </label>
          <label>
            <input
              name="admin"
              type="checkbox"
              onChange={handleModuleTypeFilter}
              className=" mr-2"
              checked={filter.admin}
            />
            Admin
          </label>
        </div>
        <div className="ml-auto flex flex-row gap-4 items-center">
          <input
            className="border border-gray-300 rounded-md p-2 hover:border-black w-120"
            placeholder="Search"
            onChange={(e) => {
              setFilter((previous) => ({
                ...previous,
                search: e.target.value,
              }));
            }}
          />
        </div>
      </div>
      <div className="flex flex-row gap-4 mb-4 items-center">
        <p className="text-xl">{editModules ? <>Showing all modules</> : <>Showing active modules for <b>{selectedYear?.label}</b></>}</p>
        <div className="flex ml-auto gap-2">
          <button className={"border border-gray-200 rounded-md px-4 py-2 cursor-pointer text-gray text-xl text-gray-700"} onClick={() => {return editModules ? addModule() : setAssignModuleWindow(true)}} title="Add module.">Add</button>
          <button className={"border border-gray-200 rounded-md px-4 py-2 cursor-pointer text-gray text-xl text-gray-700"} onClick={saveData} title="Save changes to modules.">Save</button>
          <button className={"border border-gray-200 rounded-md px-4 py-2 cursor-pointer text-gray text-xl " + (editModules ? "bg-blue-600 text-white hover:bg-blue-400" : "text-gray-700 hover:bg-gray-200")} onClick={() => setEditModules(!editModules)} title="Edit all modules available to all academic years.">Edit all modules</button>
        </div>
        <Fullscreen open={assignModuleWindow} onClose={()=>{setAssignModuleWindow(false)}}><AddModule onAdd={(d: Module[] | undefined) => onModuleOfferingAdd(d)} /></Fullscreen>
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        
        <table className="min-w-full text-xl">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-2 border">Code</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Module Type</th>
              {!editModules && <th className="px-4 py-2 border">Allocation</th>}
            </tr>
          </thead>

          <tbody>
            {getFilteredData()
              ?.slice()
              .sort((a, b) => {
                if (a.new && b.new) {
                  return b.new - a.new; // newest first
                }
                if (a.new) return -1;   // a has new → goes first
                if (b.new) return 1;    // b has new → goes first
                return a.code.localeCompare(b.code); // normal items sorted by code
              })
              .map(
                (module: CombinedModuleType, index) => (
                  <tr
                    key={index}
                    className={"clickable-row cursor-pointer group " + (module.new && !module.del ? "bg-green-200 hover:bg-green-100 " : "") + (module.del ? "bg-red-200 hover:bg-red-100 " : "") + (module.edit ? "bg-amber-200 hover:bg-amber-100 " : "") + (!module.new && !module.del && !module.edit ? "hover:bg-gray-100" : "")}
                    onClick={(e) => {
                      if (module.new) {
                        e.stopPropagation();
                      } else if (!editModules) {
                        handleRowClick(module.code);
                      }
                    }}
                    suppressContentEditableWarning
                    onKeyDown={(e) => {
                      if (e.key == "Enter") {
                        console.log("Enter submit");
                        e.preventDefault();
                        e.currentTarget?.blur();
                        const row = e.currentTarget as HTMLTableRowElement

                        updateStateData(row, module);
                      }
                    }}
                    onBlur={(e) => {
                      const row = e.currentTarget as HTMLTableRowElement
                      updateStateData(row, module)}
                    }  
                  >
                    <td className="px-4 py-2 border" tabIndex={0} contentEditable={editModules}>
                      {module.code}
                    </td>
                    <td className="px-4 py-2 border" tabIndex={0} contentEditable={editModules}>
                      {module.name}
                    </td>
                    <td className="px-4 py-2 border" tabIndex={0}>
                      <select
                        name="module_type"
                        className={!editModules ? "appearance-none" : "w-full"}
                        value={module.module_type}
                        onChange={(e) => {
                          const value = e.currentTarget.value;
                          setData(prev =>
                            prev?.map(item =>
                              item.unique_id === module.unique_id
                                ? { ...item, module_type: value, edit: true }
                                : item
                            )
                          );
                        }}
                        disabled={!editModules}
                      >
                        <option value="teaching">Teaching</option>
                        <option value="admin">Admin</option>
                        <option value="supervision/marking">
                          Supervision/Marking
                        </option>
                      </select>
                    </td>

                    {!editModules && <td
                      className={
                        "px-4 py-2 border " +
                        (module.allocation == 1
                          ? "bg-green-200"
                          : module.allocation == 0
                            ? "bg-red-200"
                            : "bg-orange-200")
                      }
                    >
                      {module.allocation}
                    </td>}
                                     
                    <td className="group-hover:bg-white bg-white" contentEditable={false}>
                      <button aria-label="Delete" title="Delete module" className="hover:bg-gray-200 ml-2 rounded-lg" onClick={(e) => {e.stopPropagation(); markDel(module, !module.del)}}><img alt="" src={deleteIcon} className="w-6 m-2"/></button>
                    </td>
                  </tr>
                ),
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
