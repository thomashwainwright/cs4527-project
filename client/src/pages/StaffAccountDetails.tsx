import { deleteStaff, fetchStaffByEmail, saveStaff } from "@/api/staff"
import Confirm from "@/fullscreen_popups/Confirm";
import OkDialog from "@/fullscreen_popups/OkDialog";
import type { Staff } from "@/types/staff_type";
import Fullscreen from "@/ui_components/Fullscreen";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router"



export default function AccountDetails() {
  const email = useLocation().pathname.split("/")[2]
  const new_user = email == "new-user"
  const navigate = useNavigate();

  const empty_staff: Staff & {pw_changed: boolean} = {
    name: "",
    email: "",
    user_id: undefined,
    role: "teaching",
    contract_type: undefined,
    contract_hours: undefined,
    password_hash: undefined,
    password: undefined,
    pw_changed: false,
    active: true,
  }

  const [staff, setStaff] = useState<Staff & {pw_changed: boolean}>(empty_staff);
  const [confirmPopup, setConfirmPopup] = useState<boolean>(false);
  const [saveConfirmation, setSaveConfirmation] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState<number>(0);


  useEffect(() => {
    if (new_user) return;
    console.log("awa")
    fetchStaffByEmail(email).then((staff_data: Staff & {pw_changed: boolean} ) => {
      setStaff(staff_data)
    })
  }, [new_user, email, refreshKey])

  function defaultHours(value: string) : string {
    switch (value) {
      case "TS":
        return "1360";
      case "TR":
        return "960";
      case "TRP1":
        return "720";
      case "TRP2":
        return "480";
    }
    return "0";
  }

  function saveStaffData(): void {
    // check required fields present

    if (!staff.name) {
      setSaveConfirmation("Missing required field \"name\"")
      return
    }
    if (!staff.email) {
      setSaveConfirmation("Missing required field \"email\"")
      return
    }

    if (new_user && !staff.password) {
      setSaveConfirmation("Missing required field for new user \"password\"")
      return
    }

    // save data
    
    saveStaff(staff).then(() => {navigate(`/staff/${staff.email}/account_details`); setSaveConfirmation("Changes saved.")}).catch(() => {
      setSaveConfirmation("Error saving changes.")})
  }

  function deleteStaffData(): void {
    setConfirmPopup(false)
    deleteStaff(staff).then(() => setRefreshKey(refreshKey + 1))
    navigate("/staff")
    
  }

  return <div className="flex mt-10 gap-4 flex-col md:flex-row text-2xl">
      <div className="lg:w-1/2 pr-16 flex flex-col">
        <div className="flex flex-row">
          <p className="pt-2 pb-2">Name: </p>
          <input
            className="border border-gray-300 rounded-md p-2 ml-auto bg-gray-50"
            value={staff?.name ?? ""}
            onChange={(e) => {
              setStaff({
                ...staff,
                name: e.target.value,
              });
            }}
          />
        </div>

        <div className="mt-4 flex flex-row">
          <p className="pt-2 pb-2">Email: </p>
          <input
            className="border border-gray-300 rounded-md p-2 ml-auto bg-gray-50"
            value={staff?.email ?? ""}
            type="email"
            onChange={(e) => {
              setStaff({
                ...staff,
                email: e.target.value,
              });
            }}
          />
        </div>

        <div className="mt-4 flex flex-row">
          <p className="pt-2 pb-2">Password: </p>
          <input
            className="border border-gray-300 rounded-md p-2 ml-auto bg-gray-50"
            placeholder="Overwrite password"
            type="password"
            autoComplete="new-password"
            onChange={(e) => {
              setStaff({
                ...staff,
                password : e.target.value,
                pw_changed: true
              });
            }}
          />
        </div>

        <div className="mt-4 flex flex-row">
          <p className="pt-2 pb-2">Contract Type: </p>
          <input
            list="contract_types"
            value={staff.contract_type}
            className="border border-gray-300 rounded-md p-2 ml-auto bg-gray-50"
            onChange={(e) => {
              setStaff({ ...staff, contract_type: e.target.value, contract_hours:  (["TS", "TR", "TRP1", "TRP2"].includes(e.target.value)) ? defaultHours(e.target.value) : staff.contract_hours})
            }}
          />

          <datalist id="contract_types">
            <option value="TS">Teaching and Scholarship</option>
            <option value="TR">Teaching and Reaserch</option>
            <option value="TRP2">Probation year 1</option>
            <option value="TRP1">Probation year 2</option>
          </datalist>
        </div>

        <div className="mt-4 flex flex-row">
          <p className="pt-2 pb-2">Contract Hours: </p>
          <input
            className="border border-gray-300 rounded-md p-2 ml-auto bg-gray-50"
            value={staff.contract_hours}
            onChange={(e) => {
              setStaff({
                ...staff,
                contract_hours : (e.target.value),
              });
            }}
          />
        </div>

        <div className="flex mt-4 ml-auto">
          <button className={"border border-gray-200 rounded-md px-4 py-2 cursor-pointer text-xl text-white bg-red-500 hover:bg-red-400 mr-4"} onClick={() => setConfirmPopup(true)} title="Delete staff member">Delete user</button>
          <Fullscreen open={confirmPopup} className="w-1/7 h-1/8">
            <Confirm onYes={deleteStaffData} onNo={() => setConfirmPopup(false)}>Are you sure you want to delete user: {staff.name}?</Confirm>
          </Fullscreen>
          <button className={"border border-gray-200 rounded-md px-4 py-2 cursor-pointer text-gray text-xl text-gray-700 hover:bg-gray-200"} onClick={() => saveStaffData()} title="Save changes to staff member.">Save</button>
          <Fullscreen open={saveConfirmation != ""} onClose={() => setSaveConfirmation("")}><OkDialog onOk={() => setSaveConfirmation("")}>{saveConfirmation}</OkDialog></Fullscreen>
        </div>
      </div>


  </div>
}