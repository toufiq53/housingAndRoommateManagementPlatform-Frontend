import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { AuthContext } from '../context/AuthProvider';
import { baseurl } from '../services/BaseUrl';
import {
    HiHomeModern,
    HiOutlineArrowLeftOnRectangle,
    HiOutlineBuildingOffice2,
    HiOutlineUserGroup,
    HiOutlineBell,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineSparkles
} from "react-icons/hi2";
import { RxDashboard } from "react-icons/rx";
import { SiBookingdotcom } from "react-icons/si";
import { FaUserFriends, FaBed, FaShieldAlt } from "react-icons/fa";
import toast from 'react-hot-toast';

const AdminLayout = () => {
    const { authUser, logout, accessToken } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const [pendingCount, setPendingCount] = useState(0);
    const [unreadNotifCount, setUnreadNotifCount] = useState(0);
    const [recentNotifs, setRecentNotifs] = useState([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const fetchAdminAlerts = useCallback(async () => {
        if (!accessToken) return;
        try {
            const [statsRes, notifRes] = await Promise.all([
                fetch(`${baseurl}/admin/stats`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                }),
                fetch(`${baseurl}/admin/notifications?unread_only=false&limit=6`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
            ]);

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setPendingCount(statsData.pending_owners || 0);
                setUnreadNotifCount(statsData.unread_notifications || 0);
            }

            if (notifRes.ok) {
                const notifsData = await notifRes.json();
                setRecentNotifs(notifsData || []);
            }
        } catch (err) {
            console.error("Error fetching admin alerts:", err);
        }
    }, [accessToken]);

    useEffect(() => {
        fetchAdminAlerts();
        const interval = setInterval(fetchAdminAlerts, 20000); // Poll every 20s for new notifications
        return () => clearInterval(interval);
    }, [fetchAdminAlerts]);

    const markAllRead = async () => {
        try {
            const res = await fetch(`${baseurl}/admin/notifications/mark-all-read`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (res.ok) {
                setUnreadNotifCount(0);
                setRecentNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
                toast.success("All notifications marked as read");
            }
        } catch (err) {
            console.error("Failed marking read:", err);
        }
    };

    const isActive = (path) => {
        if (path === '/admin' && location.pathname === '/admin') return true;
        if (path !== '/admin' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <div className="drawer lg:drawer-open min-h-screen bg-base-200/40">
            <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

            {/* Main Content Area */}
            <div className="drawer-content flex flex-col">
                {/* Topbar */}
                <header className="navbar bg-base-100 border-b border-base-200 px-4 sm:px-6 sticky top-0 z-30 backdrop-blur-md bg-base-100/90">
                    <div className="flex-none lg:hidden">
                        <label htmlFor="admin-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </label>
                    </div>

                    <div className="flex-1 flex items-center gap-2">
                        <span className="badge badge-accent badge-sm font-extrabold uppercase tracking-widest text-[10px]">
                            Admin  Control
                        </span>
                        
                    </div>

                    <div className="flex-none flex items-center gap-2 sm:gap-4">
                        {/* Notification Bell Dropdown */}
                        <div className="dropdown dropdown-end">
                            <button
                                tabIndex={0}
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className="btn btn-ghost btn-circle btn-sm relative"
                                title="System Notifications"
                            >
                                <HiOutlineBell className="text-xl text-base-content" />
                                {unreadNotifCount > 0 && (
                                    <span className="absolute -top-1 -right-1 badge badge-error badge-xs font-black animate-pulse text-[10px] min-w-4.5 h-4.5 rounded-full p-0 flex items-center justify-center">
                                        {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                                    </span>
                                )}
                            </button>

                            <div tabIndex={0} className="dropdown-content z-50 mt-3 w-80 sm:w-96 card card-compact bg-base-100 shadow-2xl border border-base-200 rounded-3xl p-4">
                                <div className="flex items-center justify-between pb-3 border-b border-base-200">
                                    <div className="flex items-center gap-2">
                                        <span className="font-extrabold text-sm text-base-content">
                                            Admin Alerts
                                        </span>
                                        {unreadNotifCount > 0 && (
                                            <span className="badge badge-primary badge-xs font-bold">
                                                {unreadNotifCount} new
                                            </span>
                                        )}
                                    </div>
                                    {unreadNotifCount > 0 && (
                                        <button
                                            onClick={markAllRead}
                                            className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                </div>

                                <div className="divide-y divide-base-200 max-h-72 overflow-y-auto py-1">
                                    {recentNotifs.length === 0 ? (
                                        <div className="py-8 text-center text-xs text-base-content/50">
                                            No system notifications yet
                                        </div>
                                    ) : (
                                        recentNotifs.map(n => (
                                            <div
                                                key={n.id}
                                                className={`py-2.5 px-2 hover:bg-base-200/50 rounded-xl transition-colors ${
                                                    !n.is_read ? 'bg-primary/5 font-medium' : ''
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="text-xs font-bold text-base-content">
                                                        {n.title}
                                                    </div>
                                                    <span className="text-[10px] text-base-content/50 whitespace-nowrap">
                                                        {n.created_at}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-base-content/70 mt-1 leading-relaxed">
                                                    {n.message}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="pt-2 border-t border-base-200 text-center">
                                    <Link
                                        to="/admin/notifications"
                                        className="text-xs font-bold text-primary hover:underline"
                                    >
                                        View All Notifications & History →
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Public Site Link */}
                        <Link to="/" className="btn btn-ghost btn-xs sm:btn-sm rounded-xl font-bold hidden sm:inline-flex">
                            🌐 Live Site
                        </Link>

                        {/* Admin Profile Avatar */}
                        <div className="flex items-center gap-2 pl-2 border-l border-base-200">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-primary text-primary-content flex items-center justify-center font-black text-xs shadow-sm">
                                {authUser?.firstname ? authUser.firstname[0]?.toUpperCase() : 'A'}
                            </div>
                            <span className="text-xs font-extrabold text-base-content hidden sm:inline-block">
                                @{authUser?.username}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page Outlet */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <Outlet context={{ pendingCount, fetchAdminAlerts }} />
                </main>
            </div>

            {/* Admin Sidebar */}
            <div className="drawer-side z-40">
                <label htmlFor="admin-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <aside className="w-68 bg-base-100 min-h-full border-r border-base-200 flex flex-col justify-between p-4 shadow-2xl lg:shadow-none">
                    <div className="space-y-6">
                        {/* Logo */}
                        <Link to="/admin" className="flex items-center gap-2.5 px-3 py-2">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent to-primary flex items-center justify-center text-primary-content shadow-lg shadow-accent/25">
                                <FaShieldAlt className="text-xl" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                                    Nestora Admin
                                </span>
                                <span className="text-[10px] font-extrabold uppercase text-base-content/50 -mt-1 tracking-wider">
                                    System Control
                                </span>
                            </div>
                        </Link>

                        {/* Menu */}
                        <ul className="menu menu-sm w-full gap-1 p-0 text-sm font-semibold">
                            <li>
                                <Link
                                    to="/admin"
                                    className={`rounded-2xl py-2.5 px-4 flex items-center gap-3 ${
                                        isActive('/admin')
                                            ? 'bg-accent text-accent-content font-bold shadow-md shadow-accent/20'
                                            : 'text-base-content/75 hover:bg-base-200'
                                    }`}
                                >
                                    <RxDashboard className="text-lg" />
                                    <span>Dashboard Overview</span>
                                </Link>
                            </li>

                            {/* Owner Approvals (With highlighted pending badge) */}
                            <li>
                                <Link
                                    to="/admin/owner-requests"
                                    className={`rounded-2xl py-2.5 px-4 flex items-center justify-between ${
                                        isActive('/admin/owner-requests')
                                            ? 'bg-accent text-accent-content font-bold shadow-md shadow-accent/20'
                                            : 'text-base-content/75 hover:bg-base-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <HiOutlineClock className="text-lg" />
                                        <span>Owner Approvals</span>
                                    </div>
                                    {pendingCount > 0 && (
                                        <span className={`badge badge-sm font-black ${
                                            isActive('/admin/owner-requests') ? 'badge-neutral' : 'badge-warning'
                                        }`}>
                                            {pendingCount}
                                        </span>
                                    )}
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/admin/users"
                                    className={`rounded-2xl py-2.5 px-4 flex items-center gap-3 ${
                                        isActive('/admin/users')
                                            ? 'bg-accent text-accent-content font-bold shadow-md shadow-accent/20'
                                            : 'text-base-content/75 hover:bg-base-200'
                                    }`}
                                >
                                    <HiOutlineUserGroup className="text-lg" />
                                    <span>Manage Users</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/admin/properties"
                                    className={`rounded-2xl py-2.5 px-4 flex items-center gap-3 ${
                                        isActive('/admin/properties')
                                            ? 'bg-accent text-accent-content font-bold shadow-md shadow-accent/20'
                                            : 'text-base-content/75 hover:bg-base-200'
                                    }`}
                                >
                                    <HiOutlineBuildingOffice2 className="text-lg" />
                                    <span>Manage Properties</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/admin/rooms"
                                    className={`rounded-2xl py-2.5 px-4 flex items-center gap-3 ${
                                        isActive('/admin/rooms')
                                            ? 'bg-accent text-accent-content font-bold shadow-md shadow-accent/20'
                                            : 'text-base-content/75 hover:bg-base-200'
                                    }`}
                                >
                                    <FaBed className="text-lg" />
                                    <span>Manage Rooms</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/admin/bookings"
                                    className={`rounded-2xl py-2.5 px-4 flex items-center gap-3 ${
                                        isActive('/admin/bookings')
                                            ? 'bg-accent text-accent-content font-bold shadow-md shadow-accent/20'
                                            : 'text-base-content/75 hover:bg-base-200'
                                    }`}
                                >
                                    <SiBookingdotcom className="text-lg" />
                                    <span>Bookings & Payments</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/admin/roommates"
                                    className={`rounded-2xl py-2.5 px-4 flex items-center gap-3 ${
                                        isActive('/admin/roommates')
                                            ? 'bg-accent text-accent-content font-bold shadow-md shadow-accent/20'
                                            : 'text-base-content/75 hover:bg-base-200'
                                    }`}
                                >
                                    <FaUserFriends className="text-lg" />
                                    <span>Roommate Posts</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/admin/notifications"
                                    className={`rounded-2xl py-2.5 px-4 flex items-center justify-between ${
                                        isActive('/admin/notifications')
                                            ? 'bg-accent text-accent-content font-bold shadow-md shadow-accent/20'
                                            : 'text-base-content/75 hover:bg-base-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <HiOutlineBell className="text-lg" />
                                        <span>Notifications</span>
                                    </div>
                                    {unreadNotifCount > 0 && (
                                        <span className="badge badge-error badge-xs font-bold">
                                            {unreadNotifCount}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-4 border-t border-base-200 space-y-2">
                        <Link to="/" className="btn btn-ghost btn-sm w-full justify-start rounded-xl text-xs font-bold gap-2">
                            <span>🏠 Go to Main Platform</span>
                        </Link>
                        <button
                            onClick={logout}
                            className="btn btn-ghost btn-sm w-full justify-start rounded-xl text-xs font-bold text-error gap-2 hover:bg-error/10"
                        >
                            <HiOutlineArrowLeftOnRectangle className="text-base" />
                            <span>Sign Out Admin</span>
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default AdminLayout;
