import { useNavigate, useParams } from "react-router-dom";
import type { Module } from "../types/module_type";
import { useEffect, useState } from "react";
import {
  fetchModuleDetails,
  fetchModuleAssignments,
  commitModuleOfferingDetailChanges,
  commitAssignmentData,
} from "../api/modules";
import PageTitle from "../ui_components/PageTitle";
import type { Assignment } from "@/types/assignment_type";
import { fetchStaffByUserId } from "@/api/staff";
import type { ModuleOffering } from "@/types/module_offering_type";
import { useAcademicYear } from "@/context/useAcademicYear";
import type { Staff } from "@/types/staff_type";
import Fullscreen from "@/ui_components/Fullscreen";
import AssignModule from "@/fullscreen_popups/AssignModule";
import type { AssignmentRow } from "@/types/assignment_row";
import deleteIcon from "../assets/icons/delete-icon.svg";
import OkDialog from "@/fullscreen_popups/OkDialog";
import { useStaff } from "@/context/useStaff";

export default function ModuleDetails() {
  const code = useParams().code as string;
  const [moduleDetails, setModuleDetails] = useState<
    (Module & ModuleOffering) | null
  >(null);
  const [moduleAssignments, setModuleAssignments] = useState<AssignmentRow[]>(
    [],
  );
  const [calculationParameterPreset, setCalculationParameterPreset] =
    useState<string>("");
  const [assignMode, setAssignMode] = useState<boolean>(false);
  const [editAssignments, setEditAssignments] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [moduleNotFound, setModuleNotFound] = useState<boolean>(false);
  const [saveConfirmation, setSaveConfirmation] = useState<string>("");
  const { incrementRefreshKey } = useStaff();

  const navigate = useNavigate();
  const { selectedYear } = useAcademicYear();

  const calculationParameterMap: Record<
    string,
    { alpha: number; beta: number }
  > = {
    std_classroom: { alpha: 4.4, beta: 0.15 },
    std_comp_lab: { alpha: 5.14, beta: 0.15 },
    std_proj: { alpha: 3.7, beta: 0 },
    ind_proj: { alpha: 0, beta: 0.5 },
    group_proj: { alpha: 0, beta: 0.8 },
  };

  const reverseCalculationParameterMap = Object.fromEntries(
    Object.entries(calculationParameterMap).map(([key, val]) => [
      `${val.alpha}_${val.beta}`,
      key,
    ]),
  );

  const handleRowClick = (user_id: number | undefined) => {
    if (!user_id) return;
    fetchStaffByUserId(user_id).then((staff) => {
      navigate(`/staff/${staff.email}`);
    });
  };

  useEffect(() => {
    if (!code || !selectedYear) return;

    fetchModuleDetails(code, selectedYear?.year_id)
      .then((details: Module & ModuleOffering) => {
        console.log("Fetched module details.");
        setModuleNotFound(false);
        setModuleDetails(details);

        fetchModuleAssignments(details.module_id, selectedYear?.year_id).then(
          (
            assignments: (Assignment &
              Staff & {
                unique_id: number;
                new: number;
                edit: boolean;
                del: boolean;
              })[],
          ) => {
            console.log("Fetched module assignments");

            setModuleAssignments(assignments);
            setModuleAssignments((prev) =>
              prev?.map((item, index) => ({
                ...item,
                unique_id: index,
              })),
            );
          },
        );
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.message == "Module not found") {
          setModuleNotFound(true);
          console.log("No module found for this year. ");
        }
      });
  }, [code, selectedYear, editAssignments, refreshKey]);

  useEffect(() => {
    if (!moduleDetails) return;

    setCalculationParameterPreset(
      reverseCalculationParameterMap[
        `${Number(moduleDetails?.alpha)}_${Number(moduleDetails?.beta)}`
      ] ?? "Custom",
    );
  }, [moduleDetails, reverseCalculationParameterMap]);

  function saveOfferingData() {
    // save data to db
    commitModuleOfferingDetailChanges(
      moduleDetails?.offering_id,
      moduleDetails?.estimated_number_students,
      moduleDetails?.alpha,
      moduleDetails?.beta,
      moduleDetails?.crit,
      moduleDetails?.credits,
      moduleDetails?.h,
    )
      .then(() => {
        setSaveConfirmation("Saved changes.");
        incrementRefreshKey();
      })
      .catch(() => {
        setSaveConfirmation("Error saving changes.");
      });
  }

  function saveAssignmentData() {
    // save data to db

    // check fields valid
    let error = "";
    moduleAssignments.forEach((assignment) => {
      if (assignment.share && assignment.share > 1) {
        error = "Invalid assignment share value. ";
      }
      // should sum(coordinator) = 1?
    });

    // Alert and don't save data if error exists.
    if (error != "") {
      alert(error);
      return;
    }

    // get changed data
    const deletedData = moduleAssignments?.filter((item) => item.del); // only update table with data that has been modified.
    const editedData = moduleAssignments?.filter(
      (item) => item.edit && item.new == undefined && !item.del,
    );
    const newData = moduleAssignments?.filter((item) => item.new);

    // console.log(editedData);
    // console.log(newData);
    // console.log(deletedData);

    commitAssignmentData(deletedData, editedData, newData)
      .then(() => setRefreshKey(refreshKey + 1))
      .then(() => {
        setSaveConfirmation("Saved changes.");
        incrementRefreshKey();
      })
      .catch(() => setSaveConfirmation("Error saving changes."));
  }

  function addAssignments(staff: Staff[] | undefined): void {
    // console.log(moduleAssignments);
    // console.log(staff)

    setAssignMode(false);

    if (!staff) return;

    setModuleAssignments((prev) => {
      const arr = prev ?? [];

      const maxId = arr.reduce(
        (max, item) => Math.max(max, item.unique_id ?? 0),
        0,
      );

      const newEntries: AssignmentRow[] = staff.map((s, index) => ({
        name: s.name,
        email: s.email,
        user_id: s.user_id,
        role: s.role,
        contract_hours: s.contract_hours,
        contract_type: s.contract_type,
        offering_id: moduleDetails?.offering_id,
        del: false,
        new: Date.now() + index,
        unique_id: maxId + index + 1,
        edit: false,
        delta: 0.0,
        share: 0.0,
        coordinator: 0,
        password_hash: s.password_hash,
        password: undefined,
        active: true,
        allocation: 0,
      }));

      return [...arr, ...newEntries];
    });
  }

  function updateStateData(
    row: HTMLTableRowElement,
    assignment: AssignmentRow,
  ) {
    const newDelta = !moduleDetails?.individual
      ? Number(row.cells[1].textContent)
      : -1; // todo validate type

    const newShare = !moduleDetails?.individual
      ? Number(row.cells[2].textContent)
      : -1;

    const newStudents = moduleDetails?.individual
      ? Number(row.cells[1].textContent)
      : -1;

    const changed =
      newDelta != assignment.delta ||
      newShare != assignment.share ||
      newStudents != assignment.students; // detect if input has resulted in any change, no point changing if not.
    if (!changed) return; // also stops edit: true showing amber bg on unchanged (in reality) rows.

    console.log(newStudents);

    setModuleAssignments((prev) =>
      prev?.map((item) =>
        item.unique_id === assignment.unique_id
          ? {
              ...item,
              edit: true,
              delta: newDelta,
              share: newShare,
              students: newStudents,
            }
          : item,
      ),
    );
  }

  function markDel(assignment: AssignmentRow, value: boolean) {
    setModuleAssignments((prev) =>
      prev
        ?.filter(
          (item) =>
            !(
              item.unique_id === assignment.unique_id &&
              typeof item.new === "number"
            ),
        )
        .map((item) =>
          item.unique_id === assignment.unique_id
            ? { ...item, del: value }
            : item,
        ),
    );
  }

  return (
    <div className="p-12 h-full">
      {moduleDetails && (
        <>
          {/* Module code and name title */}
          <PageTitle>
            {moduleDetails.code}
            {moduleDetails.name ? `: ${moduleDetails.name}` : ""}
          </PageTitle>
          {/* Module details page content*/}
          {!moduleNotFound ? (
            <div className="flex mt-10 gap-4 flex-col md:flex-row text-2xl">
              {/* Module type, estimated number of students, alpha and beta */}
              <div className="lg:w-1/2 pr-16 flex flex-col">
                <div className="flex flex-row">
                  <p className="pt-2 pb-2">Module Code: </p>
                  <input
                    className="border border-gray-300 rounded-md p-2 ml-auto bg-gray-50"
                    value={moduleDetails.code}
                    disabled
                  />
                </div>

                <div className="mt-4 flex flex-row">
                  <p className="pt-2 pb-2">Module Name: </p>
                  <input
                    className="border border-gray-300 rounded-md p-2 ml-auto bg-gray-50"
                    value={moduleDetails.name}
                    disabled
                  />
                </div>

                <div className="mt-4 flex flex-row">
                  <p className="pt-2 pb-2">Module Type: </p>
                  <input
                    className="border border-gray-300 rounded-md p-2 ml-auto bg-gray-50"
                    value={
                      moduleDetails.module_type[0].toUpperCase() +
                      moduleDetails.module_type.slice(1).split("_").join("/")
                    }
                    disabled
                  />
                </div>

                <div className="mt-4 flex flex-row">
                  <p className="pt-2 pb-2">Individually Assigned Module: </p>
                  <input
                    className="border border-gray-300 rounded-md p-2 ml-auto bg-gray-50"
                    value={moduleDetails.individual ? "Yes" : "No"}
                    disabled
                  />
                </div>

                <div className="mt-4 flex flex-row">
                  <p className="pt-2 pb-2">Academic Year: </p>
                  <input
                    className="border border-gray-300 rounded-md p-2 ml-auto bg-gray-50"
                    value={selectedYear?.label}
                    disabled
                  />
                </div>
                <p className="mt-4 flex flex-row">
                  <p className="pt-2 pb-2">Credits: </p>
                  <input
                    type="number"
                    className="border border-gray-300 rounded-md p-2 ml-auto"
                    value={moduleDetails.credits ?? ""}
                    onChange={(e) => {
                      setModuleDetails({
                        ...moduleDetails,
                        credits: parseInt(e.target.value),
                      });
                    }}
                  />
                </p>

                <p className="mt-4 flex flex-row mb-8">
                  <p className="pt-2 pb-2">Estimated Number of Students:</p>
                  <input
                    type="number"
                    className="border border-gray-300 rounded-md p-2 ml-auto"
                    value={moduleDetails.estimated_number_students ?? ""}
                    onChange={(e) => {
                      setModuleDetails({
                        ...moduleDetails,
                        estimated_number_students: parseInt(e.target.value),
                      });
                    }}
                  />
                </p>

                {/* {<b className="flex my-8">Calculation Parameters</b>*} */}

                {moduleDetails.module_type == "teaching" ? (
                  <div className="ring-2 rounded-[1px] ring-gray-200 ring-offset-12">
                    <p className="flex flex-row">
                      <p className="pt-2 pb-2">Alpha/Beta Preset:</p>
                      <select
                        name="module_type"
                        className="border border-gray-300 rounded-md p-2  hover:border-black w-75 ml-auto"
                        value={calculationParameterPreset}
                        onClick={() => console.log(calculationParameterPreset)}
                        onChange={(e) => {
                          // setCalculationParameterPreset(e.target.value);
                          const map = calculationParameterMap[e.target.value];
                          if (e.target.value != "Custom") {
                            setModuleDetails({
                              ...moduleDetails,
                              alpha: map.alpha,
                              beta: map.beta,
                            });
                          }
                        }}
                      >
                        <option value="">Select preset</option>
                        <option value="std_classroom">
                          Standard classroom based
                        </option>
                        <option value="std_comp_lab">
                          Standard computer lab based
                        </option>
                        <option value="std_proj">Standard project based</option>
                        <option value="ind_proj">Individual project</option>
                        <option value="group_proj">Group project</option>
                        <option value="custom">Custom</option>
                      </select>
                    </p>

                    <p className="mt-4 flex flex-row">
                      <p className="pt-2 pb-2">Alpha:</p>
                      <input
                        type="number"
                        className="border border-gray-300 rounded-md p-2 ml-auto"
                        value={moduleDetails.alpha ?? ""}
                        onChange={(e) => {
                          setModuleDetails({
                            ...moduleDetails,
                            alpha: parseFloat(e.target.value),
                          });
                        }}
                        disabled={calculationParameterPreset != "custom"}
                      ></input>
                    </p>

                    <p className="mt-4 flex flex-row">
                      <p className="pt-2 pb-2">Beta:</p>
                      <input
                        type="number"
                        className="border border-gray-300 rounded-md p-2 ml-auto"
                        value={moduleDetails.beta ?? ""}
                        onChange={(e) => {
                          setModuleDetails({
                            ...moduleDetails,
                            beta: parseFloat(e.target.value),
                          });
                        }}
                        disabled={calculationParameterPreset != "custom"}
                      ></input>
                    </p>
                  </div>
                ) : (
                  moduleDetails.module_type == "admin" && (
                    <>
                      <p className="mt-4 flex flex-row">
                        <p className="pt-2 pb-2">Crit:</p>
                        <input
                          type="number"
                          className="border border-gray-300 rounded-md p-2 ml-auto"
                          value={moduleDetails.crit ?? ""}
                          onChange={(e) => {
                            setModuleDetails({
                              ...moduleDetails,
                              crit: parseFloat(e.target.value),
                            });
                          }}
                        ></input>
                      </p>
                    </>
                  )
                )}

                <div className="flex ml-auto mt-8">
                  <button
                    className={
                      "border border-gray-200 rounded-md px-4 py-2 cursor-pointer text-gray text-gray-700 hover:bg-gray-200"
                    }
                    title="Save changes to modules."
                    onClick={saveOfferingData}
                  >
                    Save
                  </button>
                  <Fullscreen
                    open={saveConfirmation != ""}
                    onClose={() => setSaveConfirmation("")}
                  >
                    <OkDialog onOk={() => setSaveConfirmation("")}>
                      {saveConfirmation}
                    </OkDialog>
                  </Fullscreen>
                </div>
              </div>
              {/* Staff assignments table */}
              {
                <div className="lg:w-1/2 pr-16">
                  {" "}
                  <div className="flex flex-row">
                    <b>Assignments</b>
                    <div className="ml-auto flex gap-2">
                      {editAssignments && (
                        <>
                          <button
                            className={
                              "border border-gray-200 rounded-md px-4 py-2 cursor-pointer text-gray text-xl text-gray-700 hover:bg-gray-200"
                            }
                            onClick={() => setAssignMode(true)}
                            title="Add"
                          >
                            Add
                          </button>
                          <button
                            className={
                              "border border-gray-200 rounded-md px-4 py-2 cursor-pointer text-gray text-xl text-gray-700 hover:bg-gray-200"
                            }
                            onClick={() => saveAssignmentData()}
                            title="Save changes to assignments."
                          >
                            Save
                          </button>
                        </>
                      )}
                      <button
                        className={
                          "border border-gray-200 rounded-md px-4 py-2 cursor-pointer text-xl " +
                          (editAssignments
                            ? "bg-blue-600 text-white hover:bg-blue-400"
                            : "text-gray-700 hover:bg-gray-200")
                        }
                        onClick={() => setEditAssignments(!editAssignments)}
                        title="Edit"
                      >
                        {editAssignments ? "Stop editing" : "Edit"}
                      </button>
                      {assignMode && (
                        <Fullscreen
                          open={assignMode}
                          onClose={() => setAssignMode(false)}
                        >
                          <AssignModule
                            offering_id={moduleDetails.offering_id}
                            onAdd={(staff) => addAssignments(staff)}
                            moduleAssignments={moduleAssignments}
                          />
                        </Fullscreen>
                      )}
                    </div>
                  </div>
                  <table className="min-w-full mt-8 text-xl">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 border">Staff Member</th>{" "}
                        {/*TODO: Change to allocatable module*/}
                        {!moduleDetails.individual && (
                          <th className="px-4 py-2 border">Delta</th>
                        )}
                        {!moduleDetails.individual && (
                          <th className="px-4 py-2 border">Share</th>
                        )}
                        {moduleDetails.individual && (
                          <th className="px-4 py-2 border">Students</th>
                        )}
                        {!moduleDetails.individual && (
                          <th className="px-4 py-2 border">Coordinator</th>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {moduleAssignments &&
                        moduleAssignments.map(
                          (assignment: AssignmentRow) =>
                            assignment.user_id && (
                              <tr
                                key={assignment.assignment_id}
                                className={
                                  "clickable-row cursor-pointer " +
                                  (assignment.new
                                    ? "bg-green-200 hover:bg-green-100"
                                    : assignment.del
                                      ? "bg-red-200 hover:bg-red-100"
                                      : assignment.edit
                                        ? "bg-amber-200 hover:bg-amber-100"
                                        : "hover:bg-gray-100")
                                }
                                onClick={(e) => {
                                  if (editAssignments) {
                                    e.stopPropagation();
                                  } else {
                                    handleRowClick(assignment.user_id);
                                  }
                                }}
                                suppressContentEditableWarning
                                onKeyDown={(e) => {
                                  if (e.key == "Enter") {
                                    console.log("Enter submit");
                                    e.preventDefault();
                                    e.currentTarget?.blur();
                                    const row =
                                      e.currentTarget as HTMLTableRowElement;

                                    updateStateData(row, assignment);
                                  }
                                }}
                                onBlur={(e) => {
                                  const row =
                                    e.currentTarget as HTMLTableRowElement;
                                  updateStateData(row, assignment);
                                }}
                              >
                                <td className="px-4 py-2 border">
                                  {assignment.name}
                                </td>
                                {!moduleDetails.individual && (
                                  <td
                                    className="px-4 py-2 border"
                                    contentEditable={editAssignments}
                                    suppressContentEditableWarning
                                  >
                                    {assignment.delta}
                                  </td>
                                )}
                                {!moduleDetails.individual && (
                                  <td
                                    className="px-4 py-2 border"
                                    contentEditable={editAssignments}
                                    suppressContentEditableWarning
                                  >
                                    {assignment.share}
                                  </td>
                                )}
                                {moduleDetails.individual && (
                                  <td
                                    className="px-4 py-2 border"
                                    contentEditable={editAssignments}
                                    suppressContentEditableWarning
                                  >
                                    {assignment.students}
                                  </td>
                                )}
                                {!moduleDetails.individual && (
                                  <td className="px-4 py-2 border">
                                    {/* {assignment.coordinator ? "Yes" : "No"} */}
                                    <select
                                      name="coordinator"
                                      className={
                                        !editAssignments
                                          ? "appearance-none"
                                          : "w-full"
                                      }
                                      value={assignment.coordinator}
                                      onChange={(e) => {
                                        const value = e.currentTarget.value;
                                        setModuleAssignments((prev) =>
                                          prev?.map((item) =>
                                            item.unique_id ===
                                            assignment.unique_id
                                              ? {
                                                  ...item,
                                                  coordinator: Number(value),
                                                  edit: true,
                                                }
                                              : item,
                                          ),
                                        );
                                      }}
                                      disabled={!editAssignments}
                                    >
                                      <option value="15">Yes (15)</option>
                                      <option value="0">No (0)</option>
                                    </select>
                                  </td>
                                )}
                                {editAssignments ? (
                                  <td
                                    className="group-hover:bg-white bg-white"
                                    contentEditable={false}
                                  >
                                    <button
                                      aria-label="Delete"
                                      title="Delete module"
                                      className="hover:bg-gray-200 ml-2 rounded-lg"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        markDel(assignment, !assignment.del);
                                      }}
                                    >
                                      <img
                                        alt=""
                                        src={deleteIcon}
                                        className="w-6 m-2"
                                      />
                                    </button>
                                  </td>
                                ) : (
                                  <></>
                                )}
                              </tr>
                            ),
                        )}
                    </tbody>
                  </table>
                </div>
              }
            </div>
          ) : (
            <div className="flex items-center justify-center text-4xl mt-24">
              Error: module not assigned to {selectedYear?.label}
            </div>
          )}
        </>
      )}
    </div>
  );
}
