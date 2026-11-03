import React from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { HiHomeModern, HiOutlineUserGroup, HiOutlineUserCircle, HiArrowLeft } from "react-icons/hi2";

const RoommateLayout = () => {
    const location = useLocation();

    const isBrowse = location.pathname === '/roommate' || location.pathname === '/roommate/browse-profile';
    const isProfile = location.pathname === '/roommate/profile';

    return (
        <div className="min-h-screen bg-base-100 flex flex-col">
            {/* Top Subheader Bar */}
            <div className="bg-base-200/60 border-b border-base-200 py-3 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="btn btn-ghost btn-xs rounded-xl font-bold flex items-center gap-1">
                            <HiArrowLeft /> Home
                        </Link>
                        <span className="text-base-content/30">/</span>
                        <span className="text-xs font-black text-base-content uppercase tracking-wider">
                            Roommate Community Hub
                        </span>
                    </div>

                    {/* Navigation Pills */}
                    <div className="flex items-center gap-2 p-1 bg-base-100 rounded-2xl border border-base-200 shadow-xs">
                        <Link
                            to="/roommate/browse-profile"
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                isBrowse
                                    ? 'bg-primary text-primary-content shadow-xs'
                                    : 'text-base-content/70 hover:bg-base-200'
                            }`}
                        >
                            <HiOutlineUserGroup className="text-sm" />
                            <span>Browse Roommates</span>
                        </Link>

                        <Link
                            to="/roommate/profile"
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                isProfile
                                    ? 'bg-primary text-primary-content shadow-xs'
                                    : 'text-base-content/70 hover:bg-base-200'
                            }`}
                        >
                            <HiOutlineUserCircle className="text-sm" />
                            <span>My Roommate Profile</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content Outlet */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default RoommateLayout;
