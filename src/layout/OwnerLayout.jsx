import React, { useContext } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { AuthContext } from '../context/AuthProvider';
import { HiHomeModern, HiOutlineArrowLeftOnRectangle, HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { RxDashboard } from "react-icons/rx";
import { SiBookingdotcom } from "react-icons/si";

const OwnerLayout = () => {
    const { authUser, logout } = useContext(AuthContext);
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/owner' && location.pathname === '/owner') return true;
        if (path !== '/owner' && location.pathname.includes(path)) return true;
        return false;
    };

    return (
        <div className="drawer lg:drawer-open min-h-screen bg-base-200/50">
            <input id="owner-drawer" type="checkbox" className="drawer-toggle" />

            {/* Main Content Area */}
            <div className="drawer-content flex flex-col">
                {/* Topbar for mobile & quick info */}
                <div className="navbar bg-base-100 border-b border-base-200 px-4 sm:px-6 sticky top-0 z-30 backdrop-blur-md bg-base-100/90">
                    <div className="flex-none lg:hidden">
                        <label htmlFor="owner-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </label>
                    </div>

                    <div className="flex-1">
                        <span className="text-sm font-extrabold text-base-content hidden sm:inline-block">
                            Landlord Management Suite
                        </span>
                    </div>

                    <div className="flex-none flex items-center gap-3">
                        <Link to="/" className="btn btn-ghost btn-xs sm:btn-sm rounded-xl font-bold">
                            View Website
                        </Link>
                        <div className="avatar">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-xs">
                                {authUser?.firstname ? authUser.firstname[0]?.toUpperCase() : 'O'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Outlet */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>

            {/* Sidebar */}
            <div className="drawer-side z-40">
                <label htmlFor="owner-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <aside className="w-64 bg-base-100 min-h-full border-r border-base-200 flex flex-col justify-between p-4 shadow-xl lg:shadow-none">
                    <div className="space-y-6">
                        {/* Logo */}
                        <Link to="/owner" className="flex items-center gap-2.5 px-3 py-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-content shadow-md shadow-primary/25">
                                <HiHomeModern className="text-2xl" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    Nestora Owner
                                </span>
                                <span className="text-[10px] font-bold uppercase text-base-content/50 -mt-1 tracking-wider">
                                    Landlord Portal
                                </span>
                            </div>
                        </Link>

                        {/* Navigation Menu */}
                        <ul className="menu menu-sm w-full gap-1 p-0 text-sm font-semibold">
                            <li>
                                <Link
                                    to="/owner"
                                    className={`rounded-2xl py-2.5 px-4 flex items-center gap-3 ${
                                        isActive('/owner')
                                            ? 'bg-primary text-primary-content font-bold shadow-md shadow-primary/20'
                                            : 'text-base-content/75 hover:bg-base-200'
                                    }`}
                                >
                                    <RxDashboard className="text-lg" />
                                    <span>Dashboard Overview</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/owner/manage-property"
                                    className={`rounded-2xl py-2.5 px-4 flex items-center gap-3 ${
                                        isActive('manage-property') || isActive('edit/property') || isActive('view/rooms')
                                            ? 'bg-primary text-primary-content font-bold shadow-md shadow-primary/20'
                                            : 'text-base-content/75 hover:bg-base-200'
                                    }`}
                                >
                                    <HiOutlineBuildingOffice2 className="text-lg" />
                                    <span>Manage Properties</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/owner/manage-booking-details"
                                    className={`rounded-2xl py-2.5 px-4 flex items-center gap-3 ${
                                        isActive('manage-booking-details')
                                            ? 'bg-primary text-primary-content font-bold shadow-md shadow-primary/20'
                                            : 'text-base-content/75 hover:bg-base-200'
                                    }`}
                                >
                                    <SiBookingdotcom className="text-lg" />
                                    <span>Tenant Bookings</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Bottom User Card & Return */}
                    <div className="pt-4 border-t border-base-200 space-y-2">
                        <Link to="/" className="btn btn-ghost btn-sm w-full justify-start rounded-xl text-xs font-bold gap-2">
                            <span>🏠 Return to Homepage</span>
                        </Link>
                        <button
                            onClick={logout}
                            className="btn btn-ghost btn-sm w-full justify-start rounded-xl text-xs font-bold text-error gap-2 hover:bg-error/10"
                        >
                            <HiOutlineArrowLeftOnRectangle className="text-base" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default OwnerLayout;
