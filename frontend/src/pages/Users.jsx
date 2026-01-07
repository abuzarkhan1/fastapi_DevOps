import React, { useState, useEffect } from 'react';
import UserModal from '../components/UserModal';
import { userService } from '../services/userService';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../components/Toast';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const { user: authUser } = useAuth();
    const { showToast } = useToast();

    // Filtering state
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getUsers();
            setUsers(data);
        } catch (err) {
            showToast('Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreate = () => {
        setCurrentUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userService.deleteUser(id);
                showToast('User deleted successfully', 'success');
                fetchUsers();
            } catch (err) {
                showToast('Failed to delete user', 'error');
            }
        }
    };

    const handleSave = async (userData) => {
        try {
            if (currentUser) {
                const payload = { ...userData };
                if (!payload.password) delete payload.password;
                await userService.updateUser(currentUser.id, payload);
                showToast('User updated successfully', 'success');
            } else {
                await userService.createUser(userData);
                showToast('User created successfully', 'success');
            }
            fetchUsers();
            setIsModalOpen(false); // Close modal on success
        } catch (error) {
            // Error handled in modal or throw to let modal handle it?
            // The modal calls this prop. We should let modal catch it if we want the form to show error.
            // Actually, let's throw it so UserModal can display the error inside the modal.
            throw error;
        }
    };

    // Filter Logic
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            (user.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter ? user.role === roleFilter : true;
        const matchesStatus = statusFilter
            ? (statusFilter === 'active' ? user.is_active : !user.is_active)
            : true;
        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-8 flex flex-col gap-6 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border-dark">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-bold text-white tracking-tight">User Management</h2>
                    <p className="text-slate-400 text-sm">Manage system access, user roles, and account status across the platform.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCreate}
                        className="flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-all shadow-[0_0_20px_rgba(19,19,236,0.3)] hover:shadow-[0_0_25px_rgba(19,19,236,0.5)] active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Add User</span>
                    </button>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Search */}
                <div className="md:col-span-6 lg:col-span-5 relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-500 group-focus-within:text-primary transition-colors">search</span>
                    </div>
                    <input
                        className="block w-full pl-11 pr-4 py-3.5 bg-surface-dark border border-border-dark rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                        placeholder="Search users by name, email, or ID..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* Role Filter */}
                <div className="md:col-span-3 lg:col-span-2 relative">
                    <select
                        className="appearance-none block w-full pl-4 pr-10 py-3.5 bg-surface-dark border border-border-dark rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm cursor-pointer"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
                        <span className="material-symbols-outlined text-xl">expand_more</span>
                    </div>
                </div>
                {/* Status Filter */}
                <div className="md:col-span-3 lg:col-span-2 relative">
                    <select
                        className="appearance-none block w-full pl-4 pr-10 py-3.5 bg-surface-dark border border-border-dark rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
                        <span className="material-symbols-outlined text-xl">expand_more</span>
                    </div>
                </div>
                {/* Export Button */}
                <div className="md:col-span-12 lg:col-span-3 flex justify-end">
                    <button className="flex items-center justify-center gap-2 w-full lg:w-auto px-4 py-3.5 rounded-lg border border-border-dark bg-surface-dark hover:bg-border-dark text-slate-300 hover:text-white font-medium text-sm transition-colors">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="rounded-lg border border-border-dark bg-surface-dark overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-darker border-b border-border-dark">
                                <th className="p-4 pl-6 text-xs font-semibold tracking-wider text-slate-400 uppercase w-[300px]">User</th>
                                <th className="p-4 text-xs font-semibold tracking-wider text-slate-400 uppercase hidden md:table-cell">Role</th>
                                <th className="p-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">Status</th>
                                <th className="p-4 pr-6 text-xs font-semibold tracking-wider text-slate-400 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-dark">
                            {loading ? (
                                <tr><td colSpan="4" className="p-8 text-center text-slate-400">Loading users...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="4" className="p-8 text-center text-slate-400">No users found matching filters.</td></tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0 border border-slate-700">
                                                    {user.full_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{user.full_name || 'No Name'}</span>
                                                    <span className="text-xs text-slate-500">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 hidden md:table-cell">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${user.role === 'admin'
                                                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                    : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                                }`}>
                                                {user.role === 'admin' ? 'Administrator' : 'User'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`relative flex h-2.5 w-2.5 ${user.is_active ? '' : ''}`}>
                                                    {user.is_active && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                                                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${user.is_active ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                                </span>
                                                <span className={`text-sm font-medium ${user.is_active ? 'text-emerald-500' : 'text-red-500'}`}>
                                                    {user.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(user)} className="p-2 rounded-lg hover:bg-primary/20 hover:text-primary text-slate-400 transition-colors" title="Edit User">
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button onClick={() => handleDelete(user.id)} className="p-2 rounded-lg hover:bg-red-500/20 hover:text-red-500 text-slate-400 transition-colors" title="Delete User">
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Footer (Static for now to match UI template but could be wired up) */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border-dark bg-surface-darker">
                    <p className="text-sm text-slate-400">Showing <span className="font-semibold text-white">{filteredUsers.length}</span> users</p>
                    <div className="flex items-center gap-1">
                        <button className="size-9 flex items-center justify-center rounded-lg bg-primary text-white font-medium text-sm shadow-lg shadow-primary/25">1</button>
                    </div>
                </div>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={currentUser}
                onSave={handleSave}
            />
        </div>
    );
};

export default Users;
