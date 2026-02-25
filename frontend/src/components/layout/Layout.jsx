import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Layout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 selection:bg-indigo-100">

            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={() => setSidebarOpen(false)}
            />

            {/* Main wrapper */}
            <div className="min-h-screen flex flex-col lg:ml-72 transition-all duration-300">

                {/* Topbar */}
                <header className="h-16 bg-white/80 backdrop-blur-xl sticky top-0 z-30 border-b border-zinc-200/60 flex items-center justify-between px-6 lg:px-10">
                    <button
                        className="lg:hidden p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={20} />
                    </button>

                    <div className="flex-1" />

                    <div className="flex items-center space-x-5">
                        <button className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors relative">
                            <Bell size={18} />
                            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                        </button>

                        <div className="flex items-center space-x-3 bg-zinc-100/50 pl-1.5 pr-3.5 py-1 rounded-full border border-zinc-200/50 hover:bg-zinc-100 transition-colors cursor-pointer group">
                            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-zinc-700 font-bold text-[10px] border border-zinc-200 shadow-sm transition-colors">
                                {user?.name?.[0]?.toUpperCase()}
                            </div>
                            <span className="text-[12px] font-semibold text-zinc-600 group-hover:text-zinc-900 transition-colors hidden sm:block">
                                {user?.name}
                            </span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
                    <div className="max-w-6xl mx-auto w-full space-y-8">
                        <Outlet />
                    </div>
                </main>

            </div>
        </div>
    );
};

export default Layout;