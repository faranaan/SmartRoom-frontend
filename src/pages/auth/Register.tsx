import { useState } from "react";
import { api } from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { UserPlus, User, Lock, Briefcase, ChevronDown, Shield, Key } from "lucide-react";

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Mahasiswa');
  const [adminKey, setAdminKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!username || !password) {
      toast.error("Username and Password are required!");
      return;
    }

    if (role === 'Admin' && !adminKey) {
      toast.error("Admin must enter the Secret Code!");
      return;
    }
    setIsLoading(true);

    try {
      await api.post('/Auth/register', {username, password, role, adminSecretKey: role === 'Admin' ? adminKey : undefined});

      toast.success("Registration Successful! Please Login.");

      setTimeout(() => {
        navigate('/login')
      }, 1500);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Registration Failed.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Create New Account</h1>
          <p className="text-sm text-gray-500 mt-2">Join with SmartRoom</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Username"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={password}
              onChange={(e) =>setPassword(e.target.value)} 
            />
          </div>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select 
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none bg-white"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Mahasiswa">Mahasiswa</option>
              <option value="Dosen">Dosen</option>
              <option value="Admin">Admin</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-event-none">
                <ChevronDown size={20} />
            </div>
          </div>
          {role === 'Admin' && (
            <div className="relative transition-all duration-500 ease-in-out">
              <Key className="absolute left-3 top-3 text-red-400" size={20}/>
              <input 
                type="password"
                placeholder="Admin Secret Code"
                className="w-full pl-10 pr-4 py-3 border border-red-200 bg-red-50 rounded-xl focus:outline-none focus:ring-red-500 transition text-red-700 placeholder-red-300"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)} 
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-bold text-white transition transform active:scale-95 ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
            }`}
          >
            {isLoading ? "Processing..." : "Register Now"}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
