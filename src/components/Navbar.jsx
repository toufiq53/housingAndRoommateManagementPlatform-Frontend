import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { AuthContext } from '../context/AuthProvider';
import { HiHomeModern, HiMagnifyingGlass, HiUserCircle, HiArrowRightOnRectangle } from "react-icons/hi2";
import { FaUserFriends, FaRegBookmark, FaShieldAlt } from "react-icons/fa";

const Navbar = () => {
    const { authUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [navSearch, setNavSearch] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (navSearch.trim()) {
            navigate(`/property?search=${encodeURIComponent(navSearch.trim())}`);
            setNavSearch('');
        }
    };

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-base-100/90 border-b border-base-200/80 transition-all shadow-xs">
            <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Navbar Start: Mobile Menu & Brand */}
                <div className="navbar-start flex items-center gap-2">
                    <div className="dropdown lg:hidden">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </div>
                        <ul tabIndex={-1} className="menu menu-sm dropdown-content bg-base-100 rounded-2xl z-50 mt-3 w-64 p-3 shadow-xl border border-base-200">
                            <li>
                                <Link to="/" className={isActive('/') ? 'active font-semibold' : ''}>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/property" className={isActive('/property') ? 'active font-semibold' : ''}>
                                    Browse Properties
                                </Link>
                            </li>
                            <li>
                                <Link to="/roommate" className={isActive('/roommate') ? 'active font-semibold' : ''}>
                                    Find Roommates
                                </Link>
                            </li>
                            {authUser && (
                                <li>
                                    <Link to="/my-booking" className={isActive('/my-booking') ? 'active font-semibold' : ''}>
                                        My Bookings
                                    </Link>
                                </li>
                            )}
                            {authUser?.role === 'owner' && (
                                <li>
                                    <Link to="/owner" className="text-primary font-semibold">
                                        Owner Dashboard
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>

                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-content shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                            <HiHomeModern className="text-2xl" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Nestora
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-base-content/60 -mt-1 hidden sm:inline-block">
                                Housing & Roommates
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Navbar Center: Desktop Links */}
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 gap-1 text-sm font-medium">
                        <li>
                            <Link
                                to="/"
                                className={`rounded-xl px-4 py-2 transition-colors ${
                                    isActive('/') ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-base-200'
                                }`}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/property"
                                className={`rounded-xl px-4 py-2 transition-colors ${
                                    isActive('/property') ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-base-200'
                                }`}
                            >
                                Browse Properties
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/roommate"
                                className={`rounded-xl px-4 py-2 transition-colors ${
                                    isActive('/roommate') ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-base-200'
                                }`}
                            >
                                <span className="flex items-center gap-1.5">
                                    <FaUserFriends className="text-secondary" />
                                    Find Roommate
                                </span>
                            </Link>
                        </li>
                        {authUser && (
                            <li>
                                <Link
                                    to="/my-booking"
                                    className={`rounded-xl px-4 py-2 transition-colors ${
                                        isActive('/my-booking') ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-base-200'
                                    }`}
                                >
                                    <span className="flex items-center gap-1.5">
                                        <FaRegBookmark className="text-primary text-xs" />
                                        My Bookings
                                    </span>
                                </Link>
                            </li>
                        )}
                        {authUser?.role === 'owner' && (
                            <li>
                                <Link
                                    to="/owner"
                                    className="rounded-xl px-4 py-2 bg-gradient-to-r from-primary/15 to-secondary/15 text-primary font-semibold border border-primary/20 hover:shadow-sm"
                                >
                                    <span className="flex items-center gap-1.5">
                                        <FaShieldAlt className="text-primary text-xs" />
                                        Owner Portal
                                    </span>
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Navbar End: Search & User Controls */}
                <div className="navbar-end flex items-center gap-3">
                    {authUser ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ring-2 ring-primary/30 ring-offset-2 ring-offset-base-100 transition-all hover:scale-105">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary text-primary-content flex items-center justify-center font-bold text-sm">
                                    {authUser.firstname ? authUser.firstname[0]?.toUpperCase() : authUser.username[0]?.toUpperCase()}
                                </div>
                            </div>
                            <ul tabIndex={-1} className="menu menu-sm dropdown-content bg-base-100 rounded-2xl z-50 mt-3 w-64 p-3 shadow-2xl border border-base-200 space-y-1">
                                <li className="menu-title px-3 py-2 border-b border-base-200">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-base text-base-content">
                                            {authUser.firstname} {authUser.lastname}
                                        </span>
                                        <span className="text-xs text-base-content/60 font-normal">
                                            @{authUser.username} • {authUser.email}
                                        </span>
                                        <div className="mt-1">
                                            <span className={`badge badge-sm font-semibold capitalize ${authUser.role === 'owner' ? 'badge-primary' : 'badge-neutral'}`}>
                                                {authUser.role}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <Link to="/user/profile" className="flex items-center gap-2 py-2">
                                        <HiUserCircle className="text-lg text-primary" />
                                        Profile Settings
                                    </Link>
                                </li>
                                {authUser.role === 'owner' && (
                                    <li>
                                        <Link to="/owner" className="flex items-center gap-2 py-2 text-primary font-medium">
                                            <FaShieldAlt className="text-base" />
                                            Owner Dashboard
                                        </Link>
                                    </li>
                                )}
                                <li>
                                    <Link to="/my-booking" className="flex items-center gap-2 py-2">
                                        <FaRegBookmark className="text-sm" />
                                        My Bookings
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/roommate/profile" className="flex items-center gap-2 py-2">
                                        <FaUserFriends className="text-sm" />
                                        My Roommate Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/change/password" className="py-2">
                                        Change Password
                                    </Link>
                                </li>
                                <div className="divider my-1"></div>
                                <li>
                                    <button
                                        onClick={logout}
                                        className="text-error flex items-center gap-2 py-2 hover:bg-error/10 rounded-xl"
                                    >
                                        <HiArrowRightOnRectangle className="text-lg" />
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="btn btn-ghost btn-sm font-semibold rounded-xl">
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="btn btn-primary btn-sm rounded-xl font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 transition-all"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
