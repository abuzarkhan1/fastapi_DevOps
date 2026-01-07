import React from 'react';
import { useAuth } from '../auth/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-8 flex flex-col gap-8">
            {/* Page Heading */}
            <div className="flex flex-col gap-2">
                <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Dashboard Overview</h1>
                <p className="text-secondary-text text-base font-normal leading-normal">Welcome back, {user?.full_name || user?.username}.</p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Profile Card */}
                <div className="flex flex-col bg-card-dark rounded-xl shadow-xl border border-border-dark overflow-hidden">
                    <div className="p-6 border-b border-border-dark flex justify-between items-center">
                        <h2 className="text-white text-lg font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">badge</span>
                            Profile Information
                        </h2>
                        <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">verified</span>
                    </div>
                    <div className="p-6 flex flex-col gap-6 flex-1">
                        <div className="flex items-center gap-5">
                            <div className="relative group cursor-pointer">
                                <div className="size-20 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-white border-4 border-[#232348]">
                                    {user?.full_name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1 border-2 border-card-dark">
                                    <span className="material-symbols-outlined text-white text-[16px]">edit</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{user?.full_name || 'User'}</h3>
                                <p className="text-secondary-text text-sm capitalize">{user?.role === 'admin' ? 'Super Administrator' : 'Standard User'}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1 pb-3 border-b border-border-dark">
                                <p className="text-secondary-text text-xs uppercase tracking-wider font-semibold">Email Address</p>
                                <p className="text-white text-sm font-medium">{user?.email}</p>
                            </div>
                            <div className="flex flex-col gap-1 pb-3 border-b border-border-dark">
                                <p className="text-secondary-text text-xs uppercase tracking-wider font-semibold">Username</p>
                                <p className="text-white text-sm font-medium">@{user?.username || user?.email?.split('@')[0]}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 pt-0 mt-auto">
                        <button className="w-full flex cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-transparent border border-border-dark hover:bg-[#323267] hover:border-primary/50 text-white gap-2 text-sm font-bold transition-all">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                            <span>Edit Profile</span>
                        </button>
                    </div>
                </div>

                {/* Account Status Card */}
                <div className="flex flex-col bg-card-dark rounded-xl shadow-xl border border-border-dark overflow-hidden">
                    <div className="p-6 border-b border-border-dark flex justify-between items-center">
                        <h2 className="text-white text-lg font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-green-500">shield</span>
                            Account Status
                        </h2>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                            <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-green-500 text-xs font-bold uppercase tracking-wider">Active</span>
                        </div>
                    </div>
                    <div className="p-6 flex flex-col gap-6 flex-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2 p-4 rounded-lg bg-[#232348]/50 border border-border-dark">
                                <span className="material-symbols-outlined text-primary">diamond</span>
                                <div>
                                    <p className="text-secondary-text text-xs uppercase font-semibold">Tier</p>
                                    <p className="text-white font-bold">Enterprise Plan</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 p-4 rounded-lg bg-[#232348]/50 border border-border-dark">
                                <span className="material-symbols-outlined text-blue-400">calendar_month</span>
                                <div>
                                    <p className="text-secondary-text text-xs uppercase font-semibold">Member Since</p>
                                    <p className="text-white font-bold">Jan 12, 2024</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 mt-2">
                            <div className="flex items-center justify-between py-3 border-t border-border-dark">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-secondary-text">schedule</span>
                                    <span className="text-secondary-text text-sm">Last Login</span>
                                </div>
                                <span className="text-white font-medium text-sm">Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 pt-0 mt-auto">
                        <button className="w-full flex cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary hover:bg-primary/90 text-white gap-2 text-sm font-bold shadow-[0_4px_14px_0_rgba(19,19,236,0.39)] transition-all">
                            <span className="material-symbols-outlined text-[20px]">credit_card</span>
                            <span>Manage Subscription</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
