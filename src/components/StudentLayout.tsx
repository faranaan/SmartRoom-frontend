import { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Building2, LogOut, History, Grid, LayoutDashboard, User } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";

const StudentLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const confirmLogout = () => {
        setIsLogoutModalOpen(false);
        navigate('/', { replace: true });
        setTimeout(() => {
            logout();
        }, 10);
    };

    const navLinks = [
        { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
        { name: 'Catalog', path: '/browse', icon: Grid },
        { name: 'History', path: '/my-bookings', icon: History },
        { name: 'Profile', path: '/student/profile', icon: User },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-0">
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
                                {navLinks.map(({ name, path, icon: Icon }) => (
                                    <Link 
                                        key={path} 
                                        to={path} 
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
                                            location.pathname === path 
                                            ? 'bg-blue-600 text-white' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <Icon size={18} /> {name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex flex-col items-end justify-center leading-tight">
                                <p className="text-sm font-bold text-gray-800">{user?.unique_name}</p>
                                <p className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block">Student</p>
                            </div>
                            <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block"></div>
                            <button
                                onClick={() => setIsLogoutModalOpen(true)}
                                className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                <div className="flex justify-around items-center h-16">
                    {navLinks.map(({ name, path, icon: Icon }) => (
                        <Link 
                            key={path} 
                            to={path} 
                            className={`flex flex-col items-center gap-1 p-2 ${
                                location.pathname === path ? 'text-blue-600' : 'text-gray-500'
                            }`}
                        >
                            <Icon size={20} />
                            <span className="text-[10px] font-medium">{name}</span>
                        </Link>
                    ))}
                    <button 
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-red-600"
                    >
                        <LogOut size={20} />
                        <span className="text-[10px] font-medium">Exit</span>
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            <ConfirmModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={confirmLogout}
                variant="danger"
                title="Confirm Logout"
                message="Are you sure you want to log out? Your active session will be ended."
                confirmText="Logout Now"
            />
        </div>
    );
};

export default StudentLayout;