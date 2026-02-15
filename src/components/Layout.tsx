import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Building2, CalendarDays, LogOut } from "lucide-react";

const Layout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/', { replace: true});

        setTimeout(() => {
            logout();
        }, 10);
    };

    const menus = [
        {
            name:'Dashboard',
            path: '/dashboard',
            icon: LayoutDashboard
        },
        {
            name:'Rooms',
            path: '/rooms',
            icon: Building2
        },
        {
            name:'Bookings',
            path: '/admin/bookings',
            icon: CalendarDays
        },
    ];

    const userName = user?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "Guest";
    const userInitial = userName.charAt(0).toUpperCase() || "";

    return(
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                        <Building2 /> SmartRoom
                    </h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {menus.map((menu) => {
                        const isActive = location.pathname === menu.path;
                        return (
                            <Link
                                key={menu.path}
                                to={menu.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-600 font-semibold'
                                        : 'text-gray-600 hover:bg-gray-50'    
                                }`}
                            >
                                <menu.icon size={20} />
                                {menu.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-4 px-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            {userInitial}
                        </div>
                        <div>
                            <p className="text-sm font-semibold">
                                {user?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "Guest"}
                            </p>
                            <p className="text-xs text-gray-500">
                                {user?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "User"}
                            </p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;