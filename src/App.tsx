import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { useAuth } from './context/AuthContext';
import type { ReactNode } from "react";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import Rooms from "./pages/Rooms";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import StudentLayout from "./components/StudentLayout";
import RoomCatalog from "./pages/student/RoomCatalog";

const ProtectedRoute = ({ children, allowedRoles }: { children: ReactNode, allowedRoles?: string[]}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if(isLoading) return null;

  if(!isAuthenticated) return <Navigate to="/login" replace />

  if(allowedRoles && !allowedRoles.includes(user?.role || "")){
    console.warn("Redirecting due to role mismatch");
    return <Navigate to={user?.role === 'Admin' ? '/dashboard' : '/browse'} />
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute allowedRoles={["Admin"]}><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rooms" element={<Rooms />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["Mahasiswa", "Dosen"]}><StudentLayout /></ProtectedRoute>}>
          <Route path="/browse" element={<RoomCatalog />} />
          <Route path="/my-bookings" element={<div className="p-10"> History Page Coming Soon</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;