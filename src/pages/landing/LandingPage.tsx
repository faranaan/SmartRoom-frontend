import { Link } from "react-router-dom";
import { Building2, CalendarCheck, Users, ArrowRight, ShieldCheck } from "lucide-react";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <Building2 className="text-white" size={24} />
                            </div>
                            <span className="font-bold text-xl text-gray-800">SmartRoom</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="text-gray-600 hover:text-blue-600 font-medium transition"
                            >
                                Login
                            </Link>
                            <Link 
                                to="/register"
                                className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Campus Room Booking System
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
                        Manage & Book Rooms <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                            Faster & Easier Than Ever
                        </span>
                    </h1>
                    <p className="text-xl text-gray-500 mb-10 leading-relaxed">
                        Skip the paperwork. Check room availability in real-time, submit your requests, and track your status instantly from your own device
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition hover:scale-105 shadow-xl shadow-blue-600/20"
                        >
                            Get Started <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition">
                        <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <CalendarCheck className="text-blue-600" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Booking</h3>
                        <p className="text-gray-500">Check empty slots and book instantly without worrying about overlapping class schedules.</p>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition">
                        <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <ShieldCheck className="text-orange-600" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Validation</h3>
                        <p className="text-gray-500">A smart system that automatically validates room capacity and reservation permissions</p>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition">
                        <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <Users className="text-green-600" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Multi-User Roles</h3>
                    <p className="text-gray-500">Specific access portals for Students, Lecturers, and Admin with tailored features.</p>
                    </div>
                </div>
            </section>
            <footer className="bg-white border-t border-gray-100 py-12 mt-12">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
                    <p>&copy; 2026 SmartRoom Campus System. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;