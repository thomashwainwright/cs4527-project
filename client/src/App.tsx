import { NavLink, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Dashboard } from "./pages/Dashboard";
import { Modules } from "./pages/Modules";
import { Staff } from "./pages/Staff";
import NavBar from "./ui_components/NavBar";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import ModuleDetails from "./pages/ModuleDetails";
import StaffDetails from "./pages/StaffDetails";
import StaffOverview from "./pages/StaffOverview";
import { AcademicYearProvider } from "./context/AcademicYearProvider";
import HoursTab from "./pages/StaffHoursTab";
import AccountDetails from "./pages/StaffAccountDetails";
import { StaffProvider } from "./context/StaffProvider";
import { ModuleProvider } from "./context/ModuleProvider";

// layout for pages with navigation bar
function NavLayout() {
  return (
    <>
      <NavBar />
      <div className="w-full min-h-0 mr-48">
        <Outlet />
      </div>
    </>
  );
}

// main app component
function App() {
  return (
    <div className="flex flex-row h-dvh overflow-hidden">
      <AcademicYearProvider>
        <StaffProvider>
          <ModuleProvider>
            <Routes>
              <Route path="login" element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<NavLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="modules" element={<Modules />} />
                  <Route path="modules/:code" element={<ModuleDetails />} />
                  <Route path="staff" element={<Staff />} />
                  <Route path="staff/:email" element={<StaffDetails />}>
                    <Route index element={<StaffOverview />} />
                    <Route
                      path="teaching"
                      element={
                        <HoursTab
                          tab="teaching"
                          include={[
                            "alpha",
                            "beta",
                            "delta",
                            "share",
                            "credits",
                            "students",
                            "coordinator",
                          ]}
                        />
                      }
                    />
                    <Route
                      path="supervision_marking"
                      element={
                        <HoursTab
                          tab="supervision_marking"
                          include={["credits", "students_groups", "h"]}
                        />
                      }
                    />
                    <Route
                      path="admin"
                      element={
                        <HoursTab
                          tab="admin"
                          include={["credits", "students_groups"]}
                        />
                      }
                    />
                    <Route
                      path="account_details"
                      element={<AccountDetails />}
                    />
                  </Route>
                </Route>
              </Route>

              {/* Invalid page (must be last route) */}
              <Route
                path="*"
                element={
                  <div className="m-auto text-6xl flex flex-col items-center gap-4">
                    Page not found{" "}
                    <NavLink
                      to="/"
                      className="bg-gray-200 hover:bg-gray-300 px-6 py-4 rounded-xl mt-4"
                    >
                      Redirect
                    </NavLink>
                  </div>
                }
              />
            </Routes>
          </ModuleProvider>
        </StaffProvider>
      </AcademicYearProvider>
    </div>
  );
}

export default App;
