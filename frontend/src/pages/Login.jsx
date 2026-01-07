import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../components/Toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            showToast('Login successful!', 'success');
            navigate('/dashboard');
        } catch (err) {
            const msg = typeof err.response?.data?.detail === 'string' ? err.response.data.detail : 'Invalid email or password';
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 z-10 overflow-hidden bg-background-light dark:bg-background-dark">
            {/* Background Decoration: Subtle Orbs */}
            <div className="fixed top-[-10%] left-[-10%] h-[50vh] w-[50vw] rounded-full bg-primary/20 blur-[120px] pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] right-[-10%] h-[50vh] w-[50vw] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none z-0"></div>

            {/* Login Card */}
            <div className="w-full max-w-[480px] flex flex-col gap-1 rounded-xl border border-[#232348] bg-[#111122]/90 backdrop-blur-md shadow-2xl overflow-hidden z-20">
                {/* Header Section */}
                <div className="flex flex-col items-center pt-10 px-8 pb-2 text-center">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#191933] border border-[#232348] text-primary shadow-inner shadow-primary/10">
                        <span className="material-symbols-outlined text-3xl">sports_esports</span>
                    </div>
                    <h1 className="text-white tracking-tight text-[28px] font-bold leading-tight">Welcome Back</h1>
                    <p className="text-[#9292c9] text-sm font-normal leading-normal mt-2">Enter your credentials to access the ArenaX admin panel.</p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-8 py-6">
                    <label className="flex flex-col gap-2">
                        <p className="text-white text-sm font-medium leading-normal">Email</p>
                        <input
                            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#323267] bg-[#191933] focus:border-primary h-12 placeholder:text-[#9292c9] p-3 text-base font-normal leading-normal transition-all duration-200"
                            placeholder="Enter your email address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <label className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <p className="text-white text-sm font-medium leading-normal">Password</p>
                            <a className="text-primary hover:text-blue-400 text-xs font-medium transition-colors cursor-pointer" href="#">Forgot Password?</a>
                        </div>
                        <div className="flex w-full flex-1 items-stretch rounded-lg group focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary border border-[#323267] bg-[#191933] transition-all duration-200">
                            <input
                                className="flex w-full min-w-0 flex-1 bg-transparent border-none text-white focus:ring-0 focus:outline-none h-12 placeholder:text-[#9292c9] p-3 text-base font-normal leading-normal"
                                placeholder="Enter your password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div
                                className="flex items-center justify-center pr-3 cursor-pointer text-[#9292c9] hover:text-white transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                            </div>
                        </div>
                    </label>
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary hover:bg-blue-600 text-white text-base font-bold leading-normal tracking-[0.015em] transition-all duration-200 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <span className="truncate">{loading ? 'Signing In...' : 'Sign In'}</span>
                    </button>
                </form>

                {/* Footer Section */}
                <div className="border-t border-[#232348] bg-[#14142b]/50 p-4 text-center">
                    <p className="text-[#9292c9] text-sm font-normal">
                        New to ArenaX?
                        <Link to="/register" className="text-white font-medium hover:text-primary transition-colors ml-1 underline decoration-[#323267] underline-offset-4 hover:decoration-primary">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
