import { fetchStaffByEmail, saveStaff } from "@/api/staff"
import type { Staff } from "@/types/staff_type";
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
    staff_id: undefined,
    role: undefined,
    contract_type: undefined,
    contract_hours: undefined,
    password_hash: undefined,
    password: undefined,
    pw_changed: false,
  }

  const [staff, setStaff] = useState<Staff & {pw_changed: boolean}>(empty_staff);
  
  useEffect(() => {
    if (new_user) return;

    fetchStaffByEmail(email).then((staff_data: Staff & {pw_changed: boolean} ) => {
      setStaff(staff_data)
    })
  }, [new_user, email])

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
      alert("Missing required field \"name\"")
      return
    }
    if (!staff.email) {
      alert("Missing required field \"email\"")
      return
    }

    // save data
    
    saveStaff(staff).then(() => navigate(`/staff/${staff.email}/account_details`))
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
              console.log(["TS", "TR", "TRP1", "TRP2"].includes(e.target.value))
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

        <div className="flex mt-4">
          <button className={"border border-gray-200 rounded-md px-4 py-2 cursor-pointer text-gray text-xl text-gray-700 hover:bg-gray-200 ml-auto"} onClick={() => saveStaffData()} title="Save changes to staff member.">Save</button>
        </div>
      </div>


  </div>
}