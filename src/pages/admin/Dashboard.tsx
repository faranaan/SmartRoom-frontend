import { Link } from "react-router-dom";
import { Building2, Users, Calendar, ArrowRight } from "lucide-react";

const Dashboard = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-500">Welcome back to the administrator panel.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Rooms</p>
                            <h3 className="text-2xl font-bold text-gray-800">12</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Active Users</p>
                            <h3 className="text-2xl font-bold text-gray-800">1,240</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Today's Bookings</p>
                            <h3 className="text-2xl font-bold text-gray-800">5</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex justify-between items-ceneter">
                <div>
                    <h3 className="font-bold text-blue-800">Manage Room Data</h3>
                    <p className="text-blue-600 text-sm">Add, Edit or remove campus facilities and rooms.</p>
                </div>
                <Link to="/rooms" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    Rooms Page <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;