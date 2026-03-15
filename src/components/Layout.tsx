import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Building2, CalendarDays, LogOut, User, Database } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";

const Layout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const confirmLogout = () => {
        setIsLogoutModalOpen(false);
        navigate('/', { replace: true });
        setTimeout(() => {
            logout();
        }, 10);
    };

    const userName = user?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "Guest";
    const userRole = user?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "Admin";
    const userInitial = userName.charAt(0).toUpperCase() || "A";

    const superAdminMenus = [
        { name: 'Campuses', path: '/superadmin/dashboard', icon: Building2 },
        { name: 'Profile', path: '/superadmin/profile', icon: User },
    ];

    const adminMenus = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Rooms', path: '/admin/rooms', icon: Building2 },
        { name: 'Bookings', path: '/admin/bookings', icon: CalendarDays },
        { name: 'Master Data', path: '/admin/master-data', icon: Database },
        { name: 'Profile', path: '/admin/profile', icon: User },
    ];

    const menus = userRole === 'SuperAdmin' ? superAdminMenus : adminMenus;

    return (
        <div className="flex h-screen bg-gray-100 pb-16 md:pb-0">
            <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                        <Building2 /> SmartRoom
                    </h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {menus.map(({ name, path, icon: Icon }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                location.pathname === path 
                                ? 'bg-blue-50 text-blue-600 font-semibold' 
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <Icon size={20} /> {name}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-4 px-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            {userInitial}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold truncate">{userName}</p>
                            <p className="text-xs text-gray-500">{userRole}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsLogoutModalOpen(true)} 
                        className="w-full flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                <div className="flex justify-around items-center h-16">
                    {menus.map(({ name, path, icon: Icon }) => (
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
                        className="flex flex-col items-center gap-1 p-2 text-red-500"
                    >
                        <LogOut size={20} />
                        <span className="text-[10px] font-medium">Exit</span>
                    </button>
                </div>
            </nav>

            <main className="flex-1 overflow-auto">
                <div className="p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
            <ConfirmModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={confirmLogout}
                variant="danger"
                title="Confirm Logout"
                message="Are you sure you want to end your current session? You will need to login again to access the dashboard."
                confirmText="Logout Now"
            />
        </div>
    );
};

export default Layout;