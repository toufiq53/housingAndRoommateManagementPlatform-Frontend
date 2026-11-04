import React, { useContext, useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router';
import { AuthContext } from '../../context/AuthProvider';
import { baseurl } from '../../services/BaseUrl';
import {
    HiOutlineBell,
    HiOutlineCheckCircle,
    HiOutlineTrash,
    HiOutlineClock,
    HiArrowTopRightOnSquare
} from "react-icons/hi2";
import toast from 'react-hot-toast';

const AdminNotifications = () => {
    const { accessToken } = useContext(AuthContext);
    const { fetchAdminAlerts } = useOutletContext();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadOnly, setUnreadOnly] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const loadNotifications = async () => {
        if (!accessToken) return;
        setLoading(true);
        try {
            const res = await fetch(`${baseurl}/admin/notifications?unread_only=${unreadOnly}&limit=100`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data || []);
            } else {
                toast.error("Failed to load notifications");
            }
        } catch (err) {
            console.error("Error loading notifications:", err);
            toast.error("Network error loading notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, [accessToken, unreadOnly]);

    const handleMarkRead = async (id) => {
        setActionLoadingId(id);
        try {
            const res = await fetch(`${baseurl}/admin/notifications/${id}/read`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (res.ok) {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
                fetchAdminAlerts();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const res = await fetch(`${baseurl}/admin/notifications/mark-all-read`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (res.ok) {
                toast.success("All notifications marked as read");
                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                fetchAdminAlerts();
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to mark all as read");
        }
    };

    const handleDeleteNotif = async (id) => {
        setActionLoadingId(id);
        try {
            const res = await fetch(`${baseurl}/admin/notifications/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (res.ok) {
                toast.success("Notification removed");
                setNotifications(prev => prev.filter(n => n.id !== id));
                fetchAdminAlerts();
            }
        } catch (err) {
            console.error(err);
            toast.error("Error deleting notification");
        } finally {
            setActionLoadingId(null);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-base-content tracking-tight flex items-center gap-2.5">
                        <HiOutlineBell className="text-accent" />
                        <span>System Notifications & Audit</span>
                    </h1>
                    <p className="text-sm text-base-content/65 mt-1">
                        Log of system events, new owner registrations, and critical administrative notices.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="btn btn-sm btn-outline rounded-xl font-bold text-xs"
                        >
                            Mark All as Read
                        </button>
                    )}
                    <button
                        onClick={() => setUnreadOnly(!unreadOnly)}
                        className={`btn btn-sm rounded-xl font-bold text-xs ${
                            unreadOnly ? 'btn-accent' : 'btn-ghost border border-base-200'
                        }`}
                    >
                        {unreadOnly ? 'Showing Unread Only' : 'Show All'}
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="card bg-base-100 border border-base-200 rounded-3xl shadow-sm divide-y divide-base-200 overflow-hidden">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <span className="loading loading-spinner loading-lg text-accent"></span>
                        <p className="mt-3 text-xs font-bold text-base-content/60 uppercase">Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-12 text-center text-xs text-base-content/60">
                        No notifications to display.
                    </div>
                ) : (
                    notifications.map(n => {
                        const isOwnerAlert = n.type === 'owner_registration';

                        return (
                            <div
                                key={n.id}
                                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-colors ${
                                    !n.is_read ? 'bg-primary/5 font-medium' : 'hover:bg-base-200/30'
                                }`}
                            >
                                <div className="flex items-start gap-3.5">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0 ${
                                        isOwnerAlert ? 'bg-warning/20 text-warning' : 'bg-accent/20 text-accent'
                                    }`}>
                                        {isOwnerAlert ? <HiOutlineClock /> : <HiOutlineBell />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-extrabold text-sm text-base-content">
                                                {n.title}
                                            </h4>
                                            {!n.is_read && (
                                                <span className="badge badge-accent badge-xs font-black">
                                                    NEW
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-base-content/75 mt-1 leading-relaxed">
                                            {n.message}
                                        </p>
                                        <div className="text-[11px] text-base-content/50 mt-2 flex items-center gap-2">
                                            <span>{n.created_at}</span>
                                            {isOwnerAlert && (
                                                <Link
                                                    to="/admin/owner-requests"
                                                    className="font-bold text-primary hover:underline flex items-center gap-1"
                                                >
                                                    Open Approvals Portal <HiArrowTopRightOnSquare className="text-xs" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                    {!n.is_read && (
                                        <button
                                            disabled={actionLoadingId === n.id}
                                            onClick={() => handleMarkRead(n.id)}
                                            className="btn btn-ghost btn-xs text-primary font-bold rounded-lg"
                                            title="Mark as read"
                                        >
                                            <HiOutlineCheckCircle className="text-sm" />
                                            Read
                                        </button>
                                    )}

                                    <button
                                        disabled={actionLoadingId === n.id}
                                        onClick={() => handleDeleteNotif(n.id)}
                                        className="btn btn-ghost btn-xs text-error font-bold rounded-lg hover:bg-error/10"
                                        title="Delete"
                                    >
                                        <HiOutlineTrash className="text-sm" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AdminNotifications;
