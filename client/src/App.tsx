import { Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Dashboard } from "./pages/Dashboard";
import { Modules } from "./pages/Modules";
import { Staff } from "./pages/Staff";
import NavBar from "./ui_components/NavBar";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import ModuleDetails from "./pages/ModuleDetails";

// layout for pages with navigation bar
function NavLayout() {
  return (
    <>
      <NavBar />
      <div className="p-8 w-full">
        <Outlet />
      </div>
    </>
  );
}

// main app component
function App() {
  return (
    <div className="flex flex-row min-h-screen">
      <Routes>
        <Route path="login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<NavLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="modules" element={<Modules />} />
            <Route path="module/:code" element={<ModuleDetails />} />
            <Route path="staff" element={<Staff />} />
          </Route>
        </Route>

        {/* Invalid page (must be last route) */}
        <Route
          path="*"
          element={<div className="m-auto text-6xl">Page not found</div>}
        />
      </Routes>
    </div>
  );
}

export default App;
