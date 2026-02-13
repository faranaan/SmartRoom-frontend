import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { useAuth } from './context/AuthContext';
import type { ReactNode } from "react";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import Rooms from "./pages/Rooms";

const Dashboard = () => {
  const { logout, user } = useAuth();
  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.unique_name}!</h1>
      <p className="mb-6">You are logged in as <span className="font-bold text-blue-600">{user?.role}</span></p>
      <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: ReactNode}) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace/>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rooms" element={<Rooms />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;