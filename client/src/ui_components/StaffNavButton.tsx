import { NavLink } from "react-router-dom";

export default function NavButton({
  route,
  children,
}: {
  route: string;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      className={({ isActive }) =>
        "p-2 sm:px-6 sm:py-4 rounded flex items-center " +
        (isActive
          ? "bg-blue-600 text-white "
          : "text-gray-700 hover:bg-gray-200")
      }
      to={route}
      end
    >
      {children}
    </NavLink>
  );
}
