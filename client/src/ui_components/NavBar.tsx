import { useAuth } from "@/auth/useAuth";
import NavButton from "./NavButton";

import DashboardIcon from "../assets/icons/dashboard-tab.svg";
import ModuleIcon from "../assets/icons/module-tab.svg";
import StaffIcon from "../assets/icons/staff-tab.svg";

export default function NavBar() {
  const { logout, userEmail } = useAuth();

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    await logout();
  };

  return (
    <nav className="flex flex-col gap-4 p-8 w-32 sm:w-auto text-3xl h-screen">
      {/* Title */}
      <h1 className="hidden sm:block text-xl sm:text-5xl pb-16 pl-6 pt-4 font-bold cursor-default select-none">
        Workload Manager
      </h1>

      {/* Page routing */}
      <NavButton route="/">
        <img src={DashboardIcon} className="w-8 h-8 sm:mr-2" />
        <p className="hidden sm:block">Dashboard</p>
      </NavButton>
      <NavButton route="/modules">
        <img src={ModuleIcon} className="w-8 h-8 sm:mr-2" />
        <p className="hidden sm:block">Modules</p>
      </NavButton>
      <NavButton route="/staff">
        <img src={StaffIcon} className="w-8 h-8 sm:mr-2" />
        <p className="hidden sm:block">Staff</p>
      </NavButton>

      {/* User / log out section */}
      <div className="mt-auto flex flex-row items-center gap-4">
        <div className="hidden sm:block">
          <p className="text-lg text-gray-500">Logged in as</p>
          <p className="text-lg font-bold">{userEmail}</p>{" "}
          {/* TODO: Implement real user system from db */}
        </div>
        <form className="ml-auto" onSubmit={handleLogout} method="POST">
          <button
            className="text-lg hover:underline mt-auto ml-auto cursor-pointer"
            type="submit"
          >
            Log Out
          </button>
        </form>
      </div>
    </nav>
  );
}
