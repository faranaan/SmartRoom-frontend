import { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, CalendarCheck, Users, ArrowRight, ShieldCheck, Menu, X } from "lucide-react";

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 p-1.5 rounded-lg">
                                <Building2 className="text-white" size={20} />
                            </div>
                            <span className="font-bold text-lg md:text-xl text-gray-800">SmartRoom</span>
                        </div>

                        <div className="hidden md:flex items-center gap-6">
                            <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition">
                                Login
                            </Link>
                            <Link 
                                to="/register"
                                className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
                            >
                                Sign Up
                            </Link>
                        </div>

                        <div className="md:hidden">
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-600 p-2 focus:outline-none"
                            >
                                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
                        <Link 
                            to="/login" 
                            className="text-gray-600 font-medium py-2 px-4 hover:bg-gray-50 rounded-lg"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Login
                        </Link>
                        <Link 
                            to="/register"
                            className="bg-blue-600 text-white px-4 py-3 rounded-xl font-bold text-center shadow-lg shadow-blue-600/20"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Sign Up Free
                        </Link>
                    </div>
                )}
            </nav>

            <section className="pt-28 md:pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:sm font-semibold mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Campus Room Booking System
                    </div>
                    
                    <h1 className="text-3xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-[1.15]">
                        Manage & Book Rooms <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                            Faster & Easier
                        </span>
                    </h1>
                    
                    <p className="text-base md:text-xl text-gray-500 mb-8 md:mb-10 leading-relaxed px-2">
                        Skip the paperwork. Check room availability in real-time and track your status instantly from your own device.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition active:scale-95 shadow-xl shadow-blue-600/20"
                        >
                            Get Started <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>

                <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    <div className="bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                        <div className="bg-blue-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <CalendarCheck className="text-blue-600" size={24} />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Real-Time Booking</h3>
                        <p className="text-sm md:text-base text-gray-500">Check empty slots and book instantly without overlapping schedules.</p>
                    </div>

                    <div className="bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                        <div className="bg-orange-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="text-orange-600" size={24} />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Instant Validation</h3>
                        <p className="text-sm md:text-base text-gray-500">Smart system that automatically validates capacity and permissions.</p>
                    </div>

                    <div className="bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                        <div className="bg-green-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Users className="text-green-600" size={24} />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Multi-User Roles</h3>
                        <p className="text-sm md:text-base text-gray-500">Specific access portals for Students, Lecturers, and Admins.</p>
                    </div>
                </div>
            </section>

            <footer className="bg-gray-50 border-t border-gray-100 py-10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4 opacity-50 grayscale">
                        <Building2 size={20} />
                        <span className="font-bold">SmartRoom</span>
                    </div>
                    <p className="text-sm text-gray-400">&copy; 2026 SmartRoom Campus System. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;