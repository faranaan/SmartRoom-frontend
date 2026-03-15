import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/auth/Login";
import { useAuth } from "./context/AuthContext";
import type { ReactNode } from "react";
import Register from "./pages/auth/Register";
import Layout from "./components/Layout";
import Rooms from "./pages/admin/Rooms";
import LandingPage from "./pages/landing/LandingPage";
import Dashboard from "./pages/admin/Dashboard";
import StudentLayout from "./components/StudentLayout";
import RoomCatalog from "./pages/student/RoomCatalog";
import MyBookings from "./pages/student/MyBookings";
import ManageBookings from "./pages/admin/ManageBookings";
import StudentDashboard from "./pages/student/Dashboard";
import Profile from "./pages/user/Profile";
import SuperAdminDashboard from "./pages/superadmin/Dashboard";
import MasterData from "./pages/admin/MasterData";

const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: string[];
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const userRole = user?.[ROLE_CLAIM] || "";

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (userRole === "SuperAdmin") return <Navigate to="/superadmin/dashboard" replace />;
    if (userRole === "Admin") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

function App() {
  const { user } = useAuth();
  const userRole = user?.[ROLE_CLAIM] || "";
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{ 
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff'
          },
          success: { style: { background: '#10B981', color: 'white' },},
          error: { style: { background: '#EF4444', color: 'white' },},
         }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          element={
            <ProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/rooms" element={<Rooms />} />
          <Route path="/admin/bookings" element={<ManageBookings />} />
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/master-data" element={<MasterData />} />
          <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/profile" element={<Profile />} />
          <Route
            path="/dashboard"
            element={<Navigate to={userRole === "SuperAdmin" ? "/superadmin/dashboard" : "/admin/dashboard"} replace />}
          />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRoles={["Mahasiswa", "Dosen"]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/browse" element={<RoomCatalog />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/student/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;