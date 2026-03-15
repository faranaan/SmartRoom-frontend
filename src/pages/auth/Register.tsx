import { useState } from "react";
import { register } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Lock, Briefcase, ChevronDown, Key } from "lucide-react";

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Mahasiswa');
  const [registrationToken, setRegistrationToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!username || !password) {
      toast.error("Username and Password are required!");
      return;
    }

    if (!registrationToken) {
      toast.error("Campus Registration Token is required!");
      return;
    }
    setIsLoading(true);

    try {
      await register({
        username,
        password,
        role,
        registrationToken
      });

      toast.success("Registration Successful! Please Login.");

      setTimeout(() => {
        navigate('/login')
      }, 1500);
    } catch (error: any) {
      let errorMsg = "Registration Failed.";

      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const firstKey = Object.keys(validationErrors)[0];
        errorMsg = validationErrors[firstKey][0];
      } else if (error.response?.data?.title) {
        errorMsg = error.response.data.title;
      } else if (typeof error.response?.data === 'string') {
        errorMsg = error.response.data;
      }
      
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
          <div className="relative transition-all duration-500 ease-in-out">
            <Key className="absolute left-3 top-3 text-blue-400" size={20}/>
            <input 
              type="text"
              placeholder={role === 'Admin' ? "Admin Token (e.g. ADM-XXX)" : "Campus Token (e.g. MBR-XXX)"}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-blue-500 transition text-gray-700 placeholder-gray-400"
              value={registrationToken}
              onChange={(e) => setRegistrationToken(e.target.value)} 
            />
          </div>
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
