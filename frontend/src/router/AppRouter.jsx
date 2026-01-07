import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthContext';
import ProtectedRoute from '../auth/ProtectedRoute';
import Layout from '../components/Layout';
import { ToastProvider } from '../components/Toast';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ToastProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route element={<ProtectedRoute />}>
                            <Route element={<Layout />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/users" element={<Users />} />
                            </Route>
                        </Route>

                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/unauthorized" element={<div className="auth-container"><h1 className="text-white">403 - Unauthorized</h1></div>} />
                        <Route path="*" element={<div className="auth-container"><h1 className="text-white">404 - Not Found</h1></div>} />
                    </Routes>
                </ToastProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default AppRouter;
