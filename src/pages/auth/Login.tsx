import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { Lock, User, LogIn, AlertCircle } from 'lucide-react';
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/Auth/login', {
                username,
                password
            });

            const token = response.data?.token;

            if (!token) {
                throw new Error('Token not found');
            };

            login(token);

            const decoded: any = jwtDecode(token);
            const role = decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            if (role === 'Admin') {
                navigate('/dashboard');
            } else {
                navigate('/browse');
            }
        } catch (err: any) {
            setError(err.response?.data || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-blue-600 p-8 text-center">
                    <h2 className="text-3xl font-bold text-white">SmartRoom</h2>
                    <p className="text-blue-100 mt-2">Campus Booking System</p>
                </div>
                <div className="p-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Sign In to Your Account</h3>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-200">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                required
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                            ) : (
                                <>
                                    <LogIn size={20} /> Log In
                                </>
                            )}
                        </button>
                        <p className="mt-6 text-center text-gray-600">
                            Don''t have an account?{' '}
                            <Link to="/register" className="text-blue-600 font-bold hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;