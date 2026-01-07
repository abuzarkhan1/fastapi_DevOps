import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Layout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/dashboard', label: 'Overview', icon: 'dashboard' },
        { path: '/users', label: 'Users', icon: 'group', adminOnly: true },
        // Add more items as per template if needed
    ];

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex w-64 flex-col bg-[#111122] border-r border-border-dark h-full shrink-0">
                <div className="p-6 flex items-center gap-3 border-b border-border-dark">
                    <div className="size-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined">sports_esports</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-white text-base font-bold leading-normal">ArenaX Admin</h1>
                        <p className="text-secondary-text text-xs font-normal">v2.4.0</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 p-4 overflow-y-auto flex-1">
                    {navItems.map((item) => {
                        if (item.adminOnly && user?.role !== 'admin') return null;
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer group ${active
                                        ? 'bg-primary shadow-[0_0_15px_rgba(19,19,236,0.3)]'
                                        : 'hover:bg-[#232348]'
                                    }`}
                            >
                                <span className={`material-symbols-outlined ${active ? 'text-white' : 'text-secondary-text group-hover:text-white'}`}>
                                    {item.icon}
                                </span>
                                <p className={`text-sm font-medium leading-normal ${active ? 'text-white' : 'text-secondary-text group-hover:text-white'}`}>
                                    {item.label}
                                </p>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-border-dark flex flex-col gap-4">
                    <div className="flex items-center gap-3 px-2">
                        <div className="size-8 rounded-full bg-cover bg-center border-2 border-primary/30 bg-primary" >
                            {/* Placeholder generic avatar */}
                            <span className="flex items-center justify-center h-full w-full text-xs font-bold text-white">{user?.full_name?.[0] || 'U'}</span>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-white text-sm font-semibold truncate max-w-[120px]">{user?.full_name || user?.email}</p>
                            <p className="text-secondary-text text-xs">{user?.role === 'admin' ? 'Super Admin' : 'User'}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#232348] transition-colors text-secondary-text hover:text-red-400"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="text-sm font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}

            {/* Mobile Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#111122] border-r border-border-dark transform transition-transform duration-300 md:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-4 border-b border-border-dark">
                    <h1 className="text-white font-bold">Menu</h1>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-secondary-text">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                {/* Reusing Nav Links for Mobile */}
                <div className="flex flex-col gap-2 p-4 flex-1">
                    {navItems.map((item) => {
                        if (item.adminOnly && user?.role !== 'admin') return null;
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${active ? 'bg-primary text-white' : 'text-secondary-text hover:text-white'
                                    }`}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <p className="text-sm font-medium">{item.label}</p>
                            </Link>
                        );
                    })}
                </div>
                <div className="p-4 border-t border-border-dark">
                    <button onClick={logout} className="flex items-center gap-3 text-red-400">
                        <span className="material-symbols-outlined">logout</span>
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 bg-[#111122] border-b border-border-dark shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined">sports_esports</span>
                        </div>
                        <h1 className="text-white font-bold">ArenaX</h1>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(true)} className="text-white p-2">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>

                {/* Content Outlet */}
                <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
