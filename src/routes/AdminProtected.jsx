import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { Navigate, useLocation } from 'react-router';

const AdminProtected = ({ children }) => {
    const { authUser, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-base-200/50">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-base-content/60">
                    Verifying administrative credentials...
                </p>
            </div>
        );
    }

    if (!authUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (authUser?.role !== 'admin') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-6 text-center">
                <div className="text-6xl mb-4">🛡️</div>
                <h1 className="text-2xl font-black text-error">Access Restricted</h1>
                <p className="text-sm text-base-content/70 mt-2 max-w-md">
                    You do not have administrative privileges to access this area. If you believe this is an error, please contact the system administrator.
                </p>
                <a href="/" className="btn btn-primary btn-sm rounded-xl mt-6 font-bold px-6">
                    Return to Homepage
                </a>
            </div>
        );
    }

    return children;
};

export default AdminProtected;
