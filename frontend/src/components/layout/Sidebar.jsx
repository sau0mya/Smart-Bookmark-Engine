import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bookmark, History, LogOut, ChevronRight, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { logout } = useAuth();

    const navItems = [
        { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { to: '/bookmarks', icon: <Bookmark size={20} />, label: 'Bookmarks' },
        { to: '/collections', icon: <History size={20} />, label: 'Collections' }, // Using History as a placeholder, will change to something else if needed
        { to: '/activity', icon: <History size={20} />, label: 'Activity Log' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-zinc-950 to-zinc-900 border-r border-white/5 z-50 transition-all duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 shadow-2xl shadow-black/40`}>
                <div className="p-8 h-full flex flex-col">
                    <div className="flex items-center space-x-3 mb-10 px-2">
                        <div className="w-9 h-9 bg-zinc-800/50 rounded-xl flex items-center justify-center text-zinc-100 border border-white/10 shadow-inner">
                            <Zap size={20} fill="currentColor" className="text-indigo-400" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">SmartMark</span>
                    </div>

                    <nav className="flex-1 space-y-1.5">
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest pl-3 mb-4">Core Workspace</p>
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-indigo-500/10 text-indigo-100 border border-indigo-500/20 shadow-sm'
                                        : 'text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300 border border-transparent'
                                    }`
                                }
                                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                            >
                                <div className="flex items-center space-x-3.5">
                                    <span className={`transition-colors duration-200 group-[.active]:text-indigo-400 text-zinc-500 group-hover:text-zinc-300`}>
                                        {React.cloneElement(item.icon, { size: 19 })}
                                    </span>
                                    <span className="font-semibold text-[13px] tracking-tight">{item.label}</span>
                                </div>
                                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 text-zinc-700" />
                            </NavLink>
                        ))}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-white/5">
                        <button
                            onClick={logout}
                            className="flex items-center space-x-3.5 px-3.5 py-2.5 w-full text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200 font-semibold text-[13px] group"
                        >
                            <LogOut size={19} className="group-hover:translate-x-0.5 transition-transform" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
