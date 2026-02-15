import { useEffect, useState } from 'react';
import { Clock, BookOpen, AlertCircle, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import { api } from '../../api/axios';

const UserDashboard = () => {
  const navigate = useNavigate(); 
  const [stats, setStats] = useState({
    myActiveBookings: 0,
    myTotalBookings: 0,
    myRejectedBookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/Dashboard/student');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch student dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Active Bookings',
      value: stats.myActiveBookings,
      icon: Clock,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      subtitle: 'Ongoing / Pending'
    },
    {
      label: 'Total History',
      value: stats.myTotalBookings,
      icon: BookOpen,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      subtitle: 'All-time requests'
    },
    {
      label: 'Rejected',
      value: stats.myRejectedBookings,
      icon: AlertCircle,
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-600',
      subtitle: 'Need attention'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl p-8 text-white shadow-lg border border-white/10">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            Welcome Back! 👋
          </h1>
          <p className="opacity-80 text-lg">Here is a quick overview of your room booking statistics.</p>
        </div>
        <LayoutDashboard className="absolute -bottom-6 -right-6 text-white/10 w-48 h-48 rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-all duration-300 group"
          >
            <div className={`p-4 ${card.bgColor} ${card.textColor} rounded-2xl transition-transform group-hover:scale-110 duration-300`}>
              <card.icon size={28} />
            </div>
            <div className="flex-1">
              <p className="text-gray-500 text-sm font-medium">{card.label}</p>
              {loading ? (
                <div className="h-8 w-12 bg-gray-100 animate-pulse rounded-lg mt-1"></div>
              ) : (
                <h3 className="text-3xl font-bold text-gray-800 mt-1 tracking-tight">
                  {card.value}
                </h3>
              )}
              <p className={`text-xs font-semibold mt-1 uppercase tracking-wider ${card.textColor}`}>
                {card.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h3 className="font-bold text-gray-800">Ready to book a room?</h3>
          <p className="text-gray-500 text-sm">Find and reserve the best available space for your activities.</p>
        </div>
        <button 
          onClick={() => navigate('/browse')}
          className="px-6 py-2.5 bg-white border border-gray-200 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition shadow-sm active:scale-95"
        >
          Browse Catalog
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;