import { NavLink, useLocation } from "react-router-dom";

export default function NavButton({
  route,
  children,
}: {
  route: string;
  children: React.ReactNode;
}) {
  const location = useLocation().pathname.toString();
  const locationIncludesRoute = location.includes(route);

  return (
    <NavLink
      className={
        "p-5 md:px-6 md:py-4 rounded flex justify-center md:justify-start items-center " +
        ((locationIncludesRoute && route != "/") ||
        (route == "/" && location == "/")
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
