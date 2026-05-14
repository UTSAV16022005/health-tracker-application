import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard, Activity, Utensils, Droplets,
    Moon, Scale, User, LogOut, LogIn, UserPlus, Menu, X, Zap
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    const navItems = isAuthenticated ? [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Workouts',  path: '/workouts',  icon: Activity },
        { name: 'Meals',     path: '/meals',     icon: Utensils },
        { name: 'Water',     path: '/water',     icon: Droplets },
        { name: 'Sleep',     path: '/sleep',     icon: Moon },
        { name: 'Weight',    path: '/weight',    icon: Scale },
        { name: 'Profile',   path: '/profile',   icon: User },
    ] : [
        { name: 'Login',    path: '/login',    icon: LogIn },
        { name: 'Register', path: '/register', icon: UserPlus },
    ];

    return (
        <>
            <nav className="fixed md:relative top-0 left-0 w-full md:w-60 h-16 md:h-[100dvh] z-50 flex flex-col"
                 style={{ background: '#0d0d14', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex-center flex-shrink-0"
                             style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', boxShadow: '0 0 16px rgba(124,58,237,0.4)' }}>
                            <Zap size={18} className="text-white" />
                        </div>
                        <span className="font-bold text-lg text-white tracking-tight">HealthTrack</span>
                    </Link>
                    <button className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {/* Nav Links */}
                <div className={clsx(
                    "md:flex flex-col flex-1 overflow-y-auto p-3 absolute md:relative top-16 left-0 w-full md:w-auto transition-transform duration-300 transform",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )} style={{ background: '#0d0d14', height: 'calc(100dvh - 4rem)' }}>

                    <div className="mb-2 px-3 pt-3">
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Main Menu</span>
                    </div>

                    <div className="flex flex-col gap-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;
                            return (
                                <Link key={item.path} to={item.path}
                                      onClick={() => setIsMobileMenuOpen(false)}
                                      className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group">
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNavIndicator"
                                            className="absolute inset-0 rounded-xl"
                                            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    <Icon size={18} className={clsx(
                                        "relative z-10 transition-colors duration-200 flex-shrink-0",
                                        isActive ? "text-purple-400" : "text-gray-600 group-hover:text-gray-300"
                                    )} />
                                    <span className={clsx(
                                        "relative z-10 text-sm font-medium transition-colors duration-200",
                                        isActive ? "text-purple-300" : "text-gray-500 group-hover:text-gray-200"
                                    )}>
                                        {item.name}
                                    </span>
                                    {isActive && (
                                        <div className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* User & Logout */}
                    {isAuthenticated && (
                        <div className="mt-auto pt-4 pb-3 flex flex-col gap-2"
                             style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center gap-3 px-3 py-2">
                                <div className="w-9 h-9 rounded-full flex-center font-bold text-white text-sm flex-shrink-0"
                                     style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-semibold text-white truncate">{user?.name}</span>
                                    <span className="text-[11px] text-gray-500 truncate">{user?.email}</span>
                                </div>
                            </div>
                            <button onClick={handleLogout}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full text-left">
                                <LogOut size={18} />
                                <span className="text-sm font-medium">Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                     onClick={() => setIsMobileMenuOpen(false)} />
            )}
        </>
    );
};

export default Navbar;
