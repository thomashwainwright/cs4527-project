import { NavLink, useLocation } from "react-router-dom";

export default function NavButton({
  route,
  children,
}: {
  route: string;
  children: React.ReactNode;
}) {
  const location = useLocation().pathname.toString()
  const locationIncludesRoute = location.includes(route)
  console.log(location)
  return (
    <NavLink
      className={
        "p-2 sm:px-6 sm:py-4 rounded flex items-center " +
        (((locationIncludesRoute && route != "/") || (route == "/" && location == "/"))
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
