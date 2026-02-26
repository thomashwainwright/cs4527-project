import { useAuth } from "@/auth/useAuth";
import NavButton from "./NavButton";

export default function NavBar() {
  const { logout } = useAuth();

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    await logout();
  };

  return (
    <nav className="flex flex-col gap-4 p-8 text-4xl">
      {/* Title */}
      <h1 className="text-6xl pb-16 font-bold">
        Workload
        <br />
        Manager
      </h1>

      {/* Page routing */}
      <NavButton route="/">Dashboard</NavButton>
      <NavButton route="/modules">Modules</NavButton>
      <NavButton route="/staff">Staff</NavButton>

      {/* User / log out section */}
      <div className="mt-auto flex flex-row items-center gap-4">
        <div>
          <p className="text-lg text-gray-500">Logged in as</p>
          <p className="text-lg font-bold">(user)</p>{" "}
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
