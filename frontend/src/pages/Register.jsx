import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useToast } from '../components/Toast';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        full_name: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.register(formData);
            showToast('Registration successful! Please login.', 'success');
            navigate('/login');
        } catch (err) {
            const msg = err.response?.data?.detail || 'Registration failed. Please try again.';
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark font-display">
            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-10">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-2xl">sports_esports</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">ArenaX Admin</h2>
                </div>
                <div>
                    <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">
                        Already have an account? Log in
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex flex-1 items-center justify-center p-4">
                <div className="w-full max-w-[1100px] overflow-hidden rounded-2xl bg-white/50 dark:bg-[#1a1a2e]/60 shadow-2xl backdrop-blur-xl border border-white/20 dark:border-white/5">
                    <div className="grid gap-0 lg:grid-cols-2">
                        {/* Left Column: Branding */}
                        <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 lg:flex">
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary to-[#4c4cff] opacity-90"></div>

                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold text-white leading-tight">Empowering your<br />digital command center.</h3>
                                <p className="mt-4 text-white/80 max-w-xs">Manage users, monitor analytics, and control your platform with the new ArenaX dashboard.</p>
                            </div>

                            <div className="relative z-10 mt-auto">
                                <div className="flex items-center gap-4 rounded-xl bg-white/10 p-4 backdrop-blur-md border border-white/10">
                                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white">security</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Enterprise Security</p>
                                        <p className="text-xs text-white/70">SOC2 Compliant & Encrypted</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Form */}
                        <div className="flex flex-col justify-center px-8 py-12 md:px-14 lg:py-16 bg-white dark:bg-[#151528]">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create your account</h1>
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    Start managing your arena today.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</span>
                                    <div className="relative">
                                        <input
                                            className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3.5 pl-11 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700/50 dark:bg-[#1E1E30] dark:text-white dark:placeholder:text-slate-500 focus:outline-none"
                                            placeholder="John Doe"
                                            type="text"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                            <span className="material-symbols-outlined text-[20px] text-slate-400 dark:text-slate-500">person</span>
                                        </div>
                                    </div>
                                </label>

                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Work Email</span>
                                    <div className="relative">
                                        <input
                                            className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3.5 pl-11 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700/50 dark:bg-[#1E1E30] dark:text-white dark:placeholder:text-slate-500 focus:outline-none"
                                            placeholder="name@company.com"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                            <span className="material-symbols-outlined text-[20px] text-slate-400 dark:text-slate-500">mail</span>
                                        </div>
                                    </div>
                                </label>

                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</span>
                                    <div className="relative group">
                                        <input
                                            className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3.5 pl-11 pr-11 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700/50 dark:bg-[#1E1E30] dark:text-white dark:placeholder:text-slate-500 focus:outline-none"
                                            placeholder="••••••••"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            minLength={8}
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                            <span className="material-symbols-outlined text-[20px] text-slate-400 dark:text-slate-500">lock</span>
                                        </div>
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                        </button>
                                    </div>
                                </label>

                                <button
                                    className="mt-4 flex w-full items-center justify-center rounded-xl bg-primary px-8 py-4 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-[#151528] disabled:opacity-70 disabled:cursor-not-allowed"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Register;
