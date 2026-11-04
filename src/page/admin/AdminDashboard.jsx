import React, { useContext, useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router';
import { AuthContext } from '../../context/AuthProvider';
import { baseurl } from '../../services/BaseUrl';
import {
    HiOutlineBuildingOffice2,
    HiOutlineUserGroup,
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineBanknotes,
    HiArrowTopRightOnSquare,
    HiOutlineExclamationTriangle
} from "react-icons/hi2";
import { FaBed, FaShieldAlt, FaUserFriends } from "react-icons/fa";
import { SiBookingdotcom } from "react-icons/si";
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const { accessToken } = useContext(AuthContext);
    const { fetchAdminAlerts } = useOutletContext();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pendingOwners, setPendingOwners] = useState([]);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const loadDashboardData = async () => {
        if (!accessToken) return;
        setLoading(true);
        try {
            const [statsRes, ownersRes] = await Promise.all([
                fetch(`${baseurl}/admin/stats`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                }),
                fetch(`${baseurl}/admin/owners?status=pending`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
            ]);

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }

            if (ownersRes.ok) {
                const ownersData = await ownersRes.json();
                setPendingOwners(ownersData || []);
            }
        } catch (err) {
            console.error("Error loading dashboard data:", err);
            toast.error("Failed to load dashboard statistics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, [accessToken]);

    const handleOwnerAction = async (userId, actionStatus) => {
        setActionLoadingId(userId);
        try {
            const res = await fetch(`${baseurl}/admin/owners/${userId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({ status: actionStatus })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || `Owner has been ${actionStatus}!`);
                setPendingOwners(prev => prev.filter(o => o.id !== userId));
                loadDashboardData();
                fetchAdminAlerts();
            } else {
                toast.error(data.detail || `Failed to ${actionStatus} owner`);
            }
        } catch (err) {
            console.error("Action error:", err);
            toast.error("Network error processing owner approval");
        } finally {
            setActionLoadingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <span className="loading loading-spinner loading-lg text-accent"></span>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-base-content/60">
                    Aggregating platform metrics...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-base-content tracking-tight flex items-center gap-2.5">
                        <span>Platform Administration</span>
                        <span className="badge badge-accent badge-outline font-extrabold text-xs">Overview</span>
                    </h1>
                    <p className="text-sm text-base-content/65 mt-1">
                        Real-time oversight of all user registrations, properties, rooms, tenant bookings, and approvals.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={loadDashboardData}
                        className="btn btn-outline btn-sm rounded-xl font-bold"
                    >
                        🔄 Refresh Data
                    </button>
                    <Link
                        to="/admin/owner-requests"
                        className="btn btn-accent btn-sm rounded-xl font-bold shadow-md shadow-accent/20"
                    >
                        Review Owners
                    </Link>
                </div>
            </div>

            {/* URGENT ACTION BANNER: PENDING OWNER APPROVALS */}
            {pendingOwners.length > 0 && (
                <div className="card bg-gradient-to-r from-warning/20 via-base-100 to-warning/10 border-2 border-warning/40 shadow-xl rounded-3xl p-5 sm:p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                            <div className="w-12 h-12 rounded-2xl bg-warning/25 text-warning flex items-center justify-center text-2xl shrink-0 mt-0.5">
                                <HiOutlineExclamationTriangle />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-black text-base-content">
                                        {pendingOwners.length} Landlord {pendingOwners.length === 1 ? 'Account' : 'Accounts'} Awaiting Your Approval!
                                    </h3>
                                    <span className="badge badge-warning badge-sm font-black animate-pulse">Action Required</span>
                                </div>
                                <p className="text-xs sm:text-sm text-base-content/75 mt-1 leading-relaxed">
                                    New property owners cannot list spaces or receive bookings until you verify and activate their account. Review them below or in the Owner Approvals portal.
                                </p>
                            </div>
                        </div>
                        <Link
                            to="/admin/owner-requests"
                            className="btn btn-warning btn-sm rounded-xl font-black shrink-0 shadow-md shadow-warning/25"
                        >
                            Review All Pending ({pendingOwners.length}) →
                        </Link>
                    </div>

                    {/* Quick review table inside banner */}
                    <div className="mt-5 pt-4 border-t border-warning/20 overflow-x-auto">
                        <table className="table table-xs sm:table-sm w-full">
                            <thead>
                                <tr className="text-base-content/70 font-bold border-b border-warning/20">
                                    <th>Applicant Name</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Payment Number</th>
                                    <th>Applied On</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingOwners.slice(0, 3).map(owner => (
                                    <tr key={owner.id} className="hover:bg-warning/5">
                                        <td className="font-bold text-base-content">
                                            {owner.firstname} {owner.lastname}
                                        </td>
                                        <td className="text-base-content/80 font-mono text-xs">
                                            @{owner.username}
                                        </td>
                                        <td className="text-base-content/70 text-xs">
                                            {owner.email}
                                        </td>
                                        <td className="text-base-content/70 text-xs">
                                            {owner.payment_number || 'N/A'}
                                        </td>
                                        <td className="text-base-content/60 text-xs">
                                            {owner.created_at}
                                        </td>
                                        <td className="text-right space-x-2">
                                            <button
                                                disabled={actionLoadingId === owner.id}
                                                onClick={() => handleOwnerAction(owner.id, 'approved')}
                                                className="btn btn-success btn-xs rounded-lg font-bold text-white shadow-xs"
                                            >
                                                <HiOutlineCheckCircle className="text-sm" />
                                                Accept
                                            </button>
                                            <button
                                                disabled={actionLoadingId === owner.id}
                                                onClick={() => handleOwnerAction(owner.id, 'rejected')}
                                                className="btn btn-error btn-xs rounded-lg font-bold text-white shadow-xs"
                                            >
                                                <HiOutlineXCircle className="text-sm" />
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* KPI Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Users */}
                <div className="card bg-base-100 border border-base-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-base-content/60">
                            Total Users
                        </span>
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl">
                            <HiOutlineUserGroup />
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-3xl font-black text-base-content">
                            {stats?.total_users || 0}
                        </span>
                    </div>
                    <div className="mt-2 text-xs text-base-content/60 flex items-center gap-2">
                        <span className="font-semibold text-primary">{stats?.users_count || 0} Tenants</span>
                        <span>•</span>
                        <span className="font-semibold text-secondary">{stats?.owners_count || 0} Landlords</span>
                    </div>
                </div>

                {/* Pending Owner Approvals */}
                <div className={`card border rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow ${
                    (stats?.pending_owners || 0) > 0 
                        ? 'bg-warning/10 border-warning/40' 
                        : 'bg-base-100 border-base-200'
                }`}>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-base-content/60">
                            Pending Landlords
                        </span>
                        <div className="w-10 h-10 rounded-2xl bg-warning/20 text-warning flex items-center justify-center text-xl">
                            <HiOutlineClock />
                        </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-3xl font-black text-base-content">
                            {stats?.pending_owners || 0}
                        </span>
                        {(stats?.pending_owners || 0) > 0 && (
                            <span className="badge badge-warning badge-xs font-bold">Needs Review</span>
                        )}
                    </div>
                    <div className="mt-2 text-xs text-base-content/60">
                        <span className="text-success font-semibold">{stats?.approved_owners || 0} Active</span>
                        <span> / </span>
                        <span className="text-error font-semibold">{stats?.rejected_owners || 0} Rejected</span>
                    </div>
                </div>

                {/* Properties & Rooms */}
                <div className="card bg-base-100 border border-base-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-base-content/60">
                            Listings Inventory
                        </span>
                        <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center text-xl">
                            <HiOutlineBuildingOffice2 />
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-3xl font-black text-base-content">
                            {stats?.total_properties || 0}
                        </span>
                    </div>
                    <div className="mt-2 text-xs text-base-content/60 flex items-center gap-2">
                        <span>{stats?.total_rooms || 0} Total Rooms</span>
                        <span>•</span>
                        <span className="text-success font-semibold">{stats?.available_rooms || 0} Available</span>
                    </div>
                </div>

                {/* Bookings & Advance Volume */}
                <div className="card bg-base-100 border border-base-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-base-content/60">
                            Bookings Volume
                        </span>
                        <div className="w-10 h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-xl">
                            <SiBookingdotcom />
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-3xl font-black text-base-content">
                            {stats?.total_bookings || 0}
                        </span>
                    </div>
                    <div className="mt-2 text-xs text-base-content/60 flex items-center gap-2">
                        <span className="text-success font-bold">৳{(stats?.total_advance_volume || 0).toLocaleString()} Verified</span>
                        <span>•</span>
                        <span>{stats?.confirmed_payments || 0} Paid</span>
                    </div>
                </div>
            </div>

            {/* Quick Navigation Cards */}
            <div>
                <h2 className="text-lg font-black text-base-content mb-3">Management Consoles</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <Link
                        to="/admin/owner-requests"
                        className="p-4 rounded-2xl bg-base-100 border border-base-200 hover:border-accent hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
                    >
                        <div className="w-11 h-11 rounded-xl bg-warning/10 text-warning group-hover:scale-110 transition-transform flex items-center justify-center text-xl">
                            <HiOutlineClock />
                        </div>
                        <span className="text-xs font-bold text-base-content">Owner Approvals</span>
                    </Link>

                    <Link
                        to="/admin/users"
                        className="p-4 rounded-2xl bg-base-100 border border-base-200 hover:border-accent hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
                    >
                        <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform flex items-center justify-center text-xl">
                            <HiOutlineUserGroup />
                        </div>
                        <span className="text-xs font-bold text-base-content">All Users</span>
                    </Link>

                    <Link
                        to="/admin/properties"
                        className="p-4 rounded-2xl bg-base-100 border border-base-200 hover:border-accent hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
                    >
                        <div className="w-11 h-11 rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform flex items-center justify-center text-xl">
                            <HiOutlineBuildingOffice2 />
                        </div>
                        <span className="text-xs font-bold text-base-content">Properties</span>
                    </Link>

                    <Link
                        to="/admin/rooms"
                        className="p-4 rounded-2xl bg-base-100 border border-base-200 hover:border-accent hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
                    >
                        <div className="w-11 h-11 rounded-xl bg-info/10 text-info group-hover:scale-110 transition-transform flex items-center justify-center text-xl">
                            <FaBed />
                        </div>
                        <span className="text-xs font-bold text-base-content">Rooms</span>
                    </Link>

                    <Link
                        to="/admin/bookings"
                        className="p-4 rounded-2xl bg-base-100 border border-base-200 hover:border-accent hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
                    >
                        <div className="w-11 h-11 rounded-xl bg-secondary/10 text-secondary group-hover:scale-110 transition-transform flex items-center justify-center text-xl">
                            <SiBookingdotcom />
                        </div>
                        <span className="text-xs font-bold text-base-content">Bookings</span>
                    </Link>

                    <Link
                        to="/admin/roommates"
                        className="p-4 rounded-2xl bg-base-100 border border-base-200 hover:border-accent hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
                    >
                        <div className="w-11 h-11 rounded-xl bg-success/10 text-success group-hover:scale-110 transition-transform flex items-center justify-center text-xl">
                            <FaUserFriends />
                        </div>
                        <span className="text-xs font-bold text-base-content">Roommate Posts</span>
                    </Link>
                </div>
            </div>

            {/* Recent Platform Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="card bg-base-100 border border-base-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-base text-base-content">
                            Recent Registrations
                        </h3>
                        <Link to="/admin/users" className="text-xs font-bold text-primary hover:underline">
                            View All Users →
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="table table-sm w-full">
                            <thead>
                                <tr className="text-base-content/60 text-xs">
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Registered</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.recent_users?.map(u => (
                                    <tr key={u.id} className="hover:bg-base-200/50">
                                        <td>
                                            <div className="font-bold text-xs text-base-content">{u.name}</div>
                                            <div className="text-[11px] text-base-content/60">@{u.username}</div>
                                        </td>
                                        <td>
                                            <span className={`badge badge-xs font-bold uppercase ${
                                                u.role === 'admin' ? 'badge-accent' : u.role === 'owner' ? 'badge-primary' : 'badge-neutral'
                                            }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge badge-xs font-semibold ${
                                                u.approval_status === 'approved' ? 'badge-success' : u.approval_status === 'pending' ? 'badge-warning' : 'badge-error'
                                            }`}>
                                                {u.approval_status}
                                            </span>
                                        </td>
                                        <td className="text-xs text-base-content/50">
                                            {u.created_at}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="card bg-base-100 border border-base-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-base text-base-content">
                            Recent Tenant Bookings
                        </h3>
                        <Link to="/admin/bookings" className="text-xs font-bold text-primary hover:underline">
                            View All Bookings →
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="table table-sm w-full">
                            <thead>
                                <tr className="text-base-content/60 text-xs">
                                    <th>Tenant & Property</th>
                                    <th>Advance</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.recent_bookings?.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-xs text-base-content/50">
                                            No bookings recorded yet
                                        </td>
                                    </tr>
                                ) : (
                                    stats?.recent_bookings?.map(b => (
                                        <tr key={b.id} className="hover:bg-base-200/50">
                                            <td>
                                                <div className="font-bold text-xs text-base-content">{b.tenant_name}</div>
                                                <div className="text-[11px] text-base-content/60 line-clamp-1">{b.property_title}</div>
                                            </td>
                                            <td className="text-xs font-mono font-bold">
                                                ৳{b.advance_amount?.toLocaleString()}
                                            </td>
                                            <td>
                                                <span className={`badge badge-xs font-semibold ${
                                                    b.payment_status === 'confirmed' ? 'badge-success' : b.payment_status === 'pending_verification' ? 'badge-warning' : 'badge-neutral'
                                                }`}>
                                                    {b.payment_status}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge badge-xs font-bold uppercase ${
                                                    b.status === 'confirmed' || b.status === 'accepted' ? 'badge-success' : b.status === 'pending' ? 'badge-warning' : 'badge-error'
                                                }`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
