import { fetchStaffByEmail } from "@/api/staff";
import type { Staff } from "@/types/staff_type";
import NavButton from "@/ui_components/NavButton";
import PageTitle from "@/ui_components/PageTitle";
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";

export default function StaffDetails() {
  const params = useParams();
  const email = params.email as string;

  const [staff, setStaff] = useState<Staff | null>(null);

  useEffect(() => {
    fetchStaffByEmail(email).then((staff: Staff) => {
      setStaff(staff);
    });
  }, [email]);

  return (
    <div>
      <PageTitle>{email}</PageTitle>
      <div className="w-full flex flex-row gap-16 mt-10 text-2xl">
        <NavButton route={`/staff/${email}`}>Overview</NavButton>
        <NavButton route={`/staff/${email}/teaching`}>Teaching</NavButton>
        <NavButton route={`/staff/${email}/supervision_marking`}>
          Supervision/Marking
        </NavButton>
        <NavButton route={`/staff/${email}/admin`}>Admin</NavButton>
      </div>

      <Outlet context={staff} />
    </div>
  );
}
