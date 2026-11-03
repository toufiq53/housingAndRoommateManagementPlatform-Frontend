import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { Navigate, useLocation } from 'react-router';

const OwnerProtected = ({ children }) => {
    const { authUser, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!authUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (authUser?.role !== 'owner' && authUser?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default OwnerProtected;
