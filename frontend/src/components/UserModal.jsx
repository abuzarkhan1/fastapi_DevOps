import React, { useState, useEffect } from 'react';

const UserModal = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState({
        email: '',
        full_name: '',
        role: 'user',
        password: '',
        is_active: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email,
                full_name: user.full_name || '',
                role: user.role,
                is_active: user.is_active,
                password: ''
            });
        } else {
            setFormData({
                email: '',
                full_name: '',
                role: 'user',
                password: '',
                is_active: true
            });
        }
        setError('');
    }, [user, isOpen]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await onSave(formData);
            // Modal closed by parent on success
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to save user');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050510]/80 backdrop-blur-sm p-4 animate-fade-in">
            {/* Modal Card */}
            <div className="w-full max-w-xl bg-[#1e1e35] rounded-2xl border border-border-dark shadow-2xl flex flex-col overflow-hidden animate-zoom-in">
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-border-dark flex items-center justify-between bg-[#232348]/30">
                    <div>
                        <h3 className="text-white text-xl font-bold leading-tight tracking-tight">{user ? 'Edit User' : 'Create User'}</h3>
                        <p className="text-text-muted text-sm mt-1">{user ? 'Update user details and permissions.' : 'Add a new user to the dashboard.'}</p>
                    </div>
                    <button onClick={onClose} className="text-text-muted hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Modal Body (Form) */}
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">{error}</div>}

                    <form id="userForm" onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Full Name */}
                        <div className="flex flex-col gap-2">
                            <label className="text-white text-sm font-medium leading-normal">Full Name</label>
                            <div className="relative">
                                <input
                                    className="w-full rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-input-bg focus:border-primary h-12 placeholder:text-text-muted px-4 text-base font-normal leading-normal transition-all shadow-inner"
                                    placeholder="e.g. Jane Doe"
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                                    <span className="material-symbols-outlined text-[20px]">person</span>
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <label className="text-white text-sm font-medium leading-normal">Email Address</label>
                            <div className="relative">
                                <input
                                    className="w-full rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-input-bg focus:border-primary h-12 placeholder:text-text-muted px-4 text-base font-normal leading-normal transition-all shadow-inner"
                                    placeholder="jane@arenax.com"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                                    <span className="material-symbols-outlined text-[20px]">mail</span>
                                </div>
                            </div>
                        </div>

                        {/* Role */}
                        <div className="flex flex-col gap-2">
                            <label className="text-white text-sm font-medium leading-normal">Role</label>
                            <div className="relative">
                                <select
                                    className="w-full appearance-none rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-input-bg focus:border-primary h-12 px-4 text-base font-normal leading-normal transition-all cursor-pointer shadow-inner"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Administrator</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none flex items-center">
                                    <span className="material-symbols-outlined text-[24px]">keyboard_arrow_down</span>
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2">
                            <label className="text-white text-sm font-medium leading-normal">{user ? "Password (leave blank to keep current)" : "Temporary Password"}</label>
                            <div className="relative group">
                                <input
                                    className="w-full rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-input-bg focus:border-primary h-12 placeholder:text-text-muted px-4 pr-12 text-base font-normal leading-normal transition-all shadow-inner"
                                    placeholder="••••••••"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required={!user}
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white p-1 rounded-md transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                            {!user && <p className="text-xs text-text-muted pl-1">Must be at least 8 characters.</p>}
                        </div>

                        {/* Active Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-xl border border-border-dark bg-[#232348]/20 mt-2">
                            <div className="flex flex-col">
                                <span className="text-white text-sm font-semibold">Active Account</span>
                                <span className="text-text-muted text-xs">Enable this user account immediately.</span>
                            </div>
                            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    id="toggle"
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                    className="peer absolute block w-6 h-6 rounded-full bg-white border-4 border-[#323267] appearance-none cursor-pointer transition-all duration-300 left-0 checked:left-6 checked:border-primary"
                                />
                                <label htmlFor="toggle" className="block overflow-hidden h-6 rounded-full bg-[#323267] cursor-pointer transition-colors duration-300 peer-checked:bg-primary"></label>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-[#151528] border-t border-border-dark flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="userForm"
                        disabled={loading}
                        className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-blue-600 shadow-[0_0_20px_rgba(19,19,236,0.4)] hover:shadow-[0_0_25px_rgba(19,19,236,0.6)] transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-[18px]">save</span>
                        {loading ? 'Saving...' : 'Save User'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserModal;
