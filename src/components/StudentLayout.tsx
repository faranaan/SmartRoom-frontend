import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Building2, LogOut, History, Grid, LayoutDashboard } from "lucide-react";

const StudentLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        navigate('/', { replace: true });
        setTimeout(() => {
            logout();
        }, 10);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-8">
                            <Link to="/student/dashboard" className="flex items-center gap-2">
                                <div className="bg-blue-600 p-1.5 rounded-lg">
                                    <Building2 className="text-white" size={20} />
                                </div>
                                <span className="font-bold text-xl text-gray-800">SmartRoom</span>
                            </Link>
                            <div className="hidden md:flex gap-4">
                                <Link 
                                    to="/student/dashboard" 
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
                                        location.pathname === '/student/dashboard' 
                                            ? 'bg-blue-600 text-white' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <LayoutDashboard size={18} /> Dashboard
                                </Link>
                                <Link 
                                    to="/browse" 
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
                                        location.pathname === '/browse' 
                                            ? 'bg-blue-600 text-white' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <Grid size={18} /> Room Catalog 
                                </Link>
                                <Link 
                                    to="/my-bookings" 
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
                                        location.pathname === '/my-bookings' 
                                            ? 'bg-blue-600 text-white' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <History size={18} /> My History
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex flex-col items-end justify-center leading-tight">
                                <p className="text-sm font-bold text-gray-800">{user?.unique_name}</p>
                                <p className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block">Student</p>
                            </div>
                            <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block"></div>
                            <button
                                onClick={handleLogout}
                                className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default StudentLayout;