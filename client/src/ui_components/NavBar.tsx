import { useAuth } from "@/auth/useAuth";
import NavButton from "./NavButton";

import DashboardIcon from "../assets/icons/dashboard-tab.svg";
import ModuleIcon from "../assets/icons/module-tab.svg";
import StaffIcon from "../assets/icons/staff-tab.svg";

export default function NavBar() {
  const { logout, userEmail, role } = useAuth();

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    await logout();
  };

  return (
    <nav className="flex flex-row md:flex-col gap-4 p-8 md:w-auto md:max-w-90 md:min-w-80 text-3xl w-screen md:h-screen overflow-y-auto">
      {/* Title */}
      <h1 className="hidden sm:block max-w-25 text-xl md:text-5xl md:pb-16 md:pl-6 md:pt-4 font-bold cursor-default select-none">
        Workload Manager
      </h1>

      {/* Page routing */}
      {role == "user" && (
        <>
          <NavButton route="/">
            <img src={DashboardIcon} className="w-8 h-8 md:mr-2" />
            <p className="hidden md:block">Dashboard</p>
          </NavButton>
          <NavButton route="/modules">
            <img src={ModuleIcon} className="w-8 h-8 md:mr-2" />
            <p className="hidden md:block">Modules</p>
          </NavButton>
          <NavButton route="/staff">
            <img src={StaffIcon} className="w-8 h-8 md:mr-2" />
            <p className="hidden md:block">Staff</p>
          </NavButton>
        </>
      )}

      {role == "teaching" && (
        <NavButton route={`/staff/${userEmail}`}>
          <img src={StaffIcon} className="w-8 h-8 md:mr-2" />
          <p className="hidden md:block">My Workload</p>
        </NavButton>
      )}

      {/* User / log out section */}
      <div className="mt-auto flex flex-row items-center gap-4">
        <div className="md:block">
          <p className="text-base md:text-lg text-gray-500">Logged in as</p>
          <p className="text-base md:text-lg font-bold">{userEmail}</p>{" "}
          {/* TODO: Implement real user system from db */}
        </div>
        <form className="ml-auto" onSubmit={handleLogout} method="POST">
          <button
            className="text-base md:text-lg hover:underline mt-auto ml-auto cursor-pointer"
            type="submit"
          >
            Log Out
          </button>
        </form>
      </div>
    </nav>
  );
}
