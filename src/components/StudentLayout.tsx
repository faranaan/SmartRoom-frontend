import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Building2, LogOut, History, Grid } from "lucide-react";

const StudentLayout = () => {
    const { user,logout } = useAuth();
    const navigate = useNavigate();

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
                            <Link to="/browse" className="flex items-center gap-2">
                            <div className="bg-blue-600 p-1.5 rounded-lg">
                                <Building2 className="text-white" size={20} />
                            </div>
                            <span className="font-bold text-xl text-gray-800">SmartRoom</span>
                            </Link>
                            <div className="hidden md:flex gap-6">
                                <Link to="/browse" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition">
                                    <Grid size={18} /> Room Catalog 
                                </Link>
                                <Link to="/my-bookings" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition">
                                    <History size={18} /> My History
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex flex-col items-center justify-center leading-tight text-right">
                                <p className="text-sm font-bold text-gray-800">{user?.unique_name}</p>
                                <p className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block">Mahasiswa</p>
                            </div>
                            <div className="h-8 w-1 bg-gray-200 mx-2 hidden md:block"></div>
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