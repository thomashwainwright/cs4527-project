import { useStaff } from "@/context/useStaff";
import PageTitle from "../ui_components/PageTitle";

export function Dashboard() {
  const { staffData } = useStaff();

  function getAllocation(tolerance = 5) {
    // Tolerance (in %)
    const allocated = staffData?.filter(
      (staffMember) =>
        Math.abs(100 - (staffMember.allocation ?? 0)) < tolerance,
    );
    console.log(allocated);
    return (
      <>
        {allocated?.length}/{staffData?.length}
      </>
    );
  }

  return (
    <div className="p-12">
      <PageTitle>Dashboard</PageTitle>
      {getAllocation()}
    </div>
  );
}
