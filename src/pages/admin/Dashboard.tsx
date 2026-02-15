import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Users, Calendar, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { api } from '../../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRooms: 0,
    pendingBookings: 0,
    activeBookingsToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/Dashboard/admin');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch admin dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { 
      label: 'Total Users', 
      value: stats.totalUsers, 
      icon: Users, 
      color: 'bg-blue-500',
      desc: 'Registered users'
    },
    { 
      label: 'Total Rooms', 
      value: stats.totalRooms, 
      icon: CheckCircle, 
      color: 'bg-green-500',
      desc: 'Ready for use'
    },
    { 
      label: 'Pending Requests', 
      value: stats.pendingBookings, 
      icon: Clock, 
      color: 'bg-orange-500',
      desc: 'Awaiting approval'
    },
    { 
      label: 'Today\'s Bookings', 
      value: stats.activeBookingsToday, 
      icon: Calendar, 
      color: 'bg-purple-500',
      desc: 'Scheduled activities'
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">Summary of SmartRoom system activities today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
                ) : (
                  <h3 className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</h3>
                )}
                <p className="text-xs text-gray-400 mt-1">{stat.desc}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} text-white shadow-lg transition-transform group-hover:scale-110`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="font-bold text-blue-800 text-lg">Manage Room Data</h3>
          <p className="text-blue-600 text-sm">
            You have <strong>{stats.pendingBookings}</strong> pending requests to process in the bookings menu.
          </p>
        </div>
        <Link 
          to="/admin/bookings" 
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md shadow-blue-200"
        >
          Check Bookings <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;