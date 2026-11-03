import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { baseurl } from '../../services/BaseUrl';
import { AuthContext } from '../../context/AuthProvider';
import toast from 'react-hot-toast';
import {
    HiOutlineBuildingOffice2,
    HiOutlineCurrencyBangladeshi,
    HiOutlineClock,
    HiOutlineUserGroup,
    HiArrowRight,
    HiOutlinePlusCircle,
    HiOutlineCheck,
    HiOutlineXMark,
    HiOutlineClipboardDocument
} from "react-icons/hi2";
import { MdMeetingRoom } from "react-icons/md";
import { SiBookingdotcom } from "react-icons/si";
import { FaMobileAlt, FaClock, FaCheckCircle } from "react-icons/fa";

const OwnerDashBoard = () => {
    const { accessToken, authUser } = useContext(AuthContext);

    const [stats, setStats] = useState({
        total_properties: 0,
        total_rooms: 0,
        occupied_members: 0,
        available_spots: 0,
        pending_bookings: 0,
        pending_verifications: 0,
        monthly_revenue: 0
    });
    const [properties, setProperties] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const fetchData = () => {
        if (!accessToken) return;

        // Fetch owner stats
        fetch(`${baseurl}/owner/stats`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data && !data.detail) setStats(data);
            })
            .catch(() => {});

        // Fetch properties
        fetch(`${baseurl}/owner/my_property`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setProperties(data);
            })
            .catch(() => {});

        // Fetch bookings
        fetch(`${baseurl}/owner/bookings`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setAllBookings(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, [accessToken]);

    // Quick Confirm from Dashboard
    const handleConfirmPayment = async (booking_id) => {
        const booking = allBookings.find(b => b.id === booking_id);
        if (!booking?.transaction_id || !booking.transaction_id.trim()) {
            toast.error("Cannot confirm: Tenant has not submitted a Transaction ID yet!");
            return;
        }

        setActionLoadingId(booking_id);
        try {
            const res = await fetch(`${baseurl}/owner/confirm_payment/${booking_id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.detail || "Failed to confirm payment");
                setActionLoadingId(null);
                return;
            }

            toast.success("Payment verified and room reserved!");
            setActionLoadingId(null);
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error("Network error while confirming");
            setActionLoadingId(null);
        }
    };

    // Quick Reject from Dashboard
    const handleRejectPayment = async (booking_id) => {
        const confirmReject = window.confirm("Decline this payment request and release room?");
        if (!confirmReject) return;

        setActionLoadingId(booking_id);
        try {
            const res = await fetch(`${baseurl}/owner/reject_payment/${booking_id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.detail || "Failed to reject payment");
                setActionLoadingId(null);
                return;
            }

            toast.success("Payment rejected and room released.");
            setActionLoadingId(null);
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error("Network error while rejecting");
            setActionLoadingId(null);
        }
    };

    const pendingVerifications = allBookings.filter(
        b => b.payment_status === 'pending_verification' && Boolean(b.transaction_id && b.transaction_id.trim())
    );
    const recentBookings = allBookings.slice(0, 5);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header Greeting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-base-100 to-secondary/10 p-6 sm:p-8 rounded-3xl border border-base-200">
                <div>
                    <span className="badge badge-primary badge-sm font-bold uppercase tracking-wider">
                        Owner Control Center
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-base-content mt-1">
                        Welcome back, {authUser?.firstname || "Landlord"}!
                    </h1>
                    <p className="text-xs sm:text-sm text-base-content/65 mt-0.5">
                        Manage your property listings, verify tenant 50% advance payments, and confirm bookings.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                    <Link
                        to="/owner/manage-property"
                        className="btn btn-primary btn-sm rounded-xl font-bold gap-2 shadow-md shadow-primary/25 cursor-pointer"
                    >
                        <HiOutlinePlusCircle className="text-base" />
                        <span>Add Property</span>
                    </Link>
                </div>
            </div>

            {/* Owner Payment Number Info Strip */}
            <div className="p-4 bg-base-100 rounded-2xl border border-base-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
                        <FaMobileAlt />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-base-content flex items-center gap-2">
                            <span>Registered Payment Number (bKash & Nagad):</span>
                            <span className="font-mono text-primary font-black">
                                {authUser?.payment_number || "01712-345678"}
                            </span>
                        </div>
                        <p className="text-[11px] text-base-content/60">
                            Tenants send 50% advance payments to this single number for both bKash and Nagad.
                        </p>
                    </div>
                </div>

                <Link
                    to="/user/profile"
                    className="btn btn-ghost btn-xs text-primary font-bold hover:underline self-start sm:self-center"
                >
                    Change Number &rarr;
                </Link>
            </div>

            {/* HIGH-PRIORITY ALERT BANNER: Pending Payment Verifications */}
            {pendingVerifications.length > 0 && (
                <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-primary/10 border-2 border-amber-500/30 p-5 rounded-3xl space-y-3 shadow-md shadow-amber-500/5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl shrink-0 animate-bounce">
                                ⚡
                            </div>
                            <div>
                                <h3 className="font-black text-base text-base-content">
                                    {pendingVerifications.length} Tenant Advance Payment(s) Waiting For Verification
                                </h3>
                                <p className="text-xs text-base-content/70">
                                    Tenants have sent 50% advance to your number and submitted Transaction IDs. Review and confirm to reserve their rooms.
                                </p>
                            </div>
                        </div>

                        <Link
                            to="/owner/manage-booking-details"
                            className="btn btn-warning btn-sm rounded-xl font-bold shrink-0 shadow-sm"
                        >
                            View All Verifications ({pendingVerifications.length}) &rarr;
                        </Link>
                    </div>

                    {/* Quick review row of up to 2 items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        {pendingVerifications.slice(0, 2).map(b => (
                            <div
                                key={b.id}
                                className="bg-base-100 p-3.5 rounded-2xl border border-amber-500/25 space-y-2 flex flex-col justify-between shadow-xs"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-xs text-base-content">{b.tenant_name}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${
                                            b.payment_method === 'nagad' ? 'bg-[#F7941D]' : 'bg-[#E2136E]'
                                        }`}>
                                            {b.payment_method || 'bKash'}
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-base-content/70 flex justify-between">
                                        <span>Room #{b.room_number} • {b.property_title}</span>
                                        <span className="font-black text-primary">৳{(b.advance_amount || Math.floor((b.room_rent || 0)/2)).toLocaleString()}</span>
                                    </div>
                                    <div className="bg-base-200/60 px-2 py-1 rounded text-[11px] font-mono text-base-content font-bold flex justify-between">
                                        <span>TrxID: {b.transaction_id || "N/A"}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-1 border-t border-base-200">
                                    <button
                                        onClick={() => handleRejectPayment(b.id)}
                                        disabled={actionLoadingId === b.id}
                                        className="btn btn-ghost btn-xs text-error font-bold flex-1 cursor-pointer"
                                    >
                                        Reject
                                    </button>
                                    {Boolean(b.transaction_id && b.transaction_id.trim()) ? (
                                        <button
                                            onClick={() => handleConfirmPayment(b.id)}
                                            disabled={actionLoadingId === b.id}
                                            className="btn btn-primary btn-xs font-bold flex-1 shadow-xs cursor-pointer"
                                        >
                                            {actionLoadingId === b.id ? (
                                                <span className="loading loading-spinner loading-xs"></span>
                                            ) : (
                                                "Confirm & Reserve"
                                            )}
                                        </button>
                                    ) : (
                                        <div className="flex-1 text-center text-[10px] py-1 px-2 bg-base-200 rounded text-base-content/50 font-semibold cursor-not-allowed select-none">
                                            No TrxID
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* KPI Cards Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Total Properties */}
                <div className="card bg-base-100 rounded-3xl p-5 border border-base-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">Properties</span>
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl">
                            <HiOutlineBuildingOffice2 />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-black text-base-content">{stats.total_properties}</div>
                        <p className="text-[11px] text-base-content/60 mt-0.5">Active listings</p>
                    </div>
                </div>

                {/* Total Rooms & Vacancy */}
                <div className="card bg-base-100 rounded-3xl p-5 border border-base-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">Rooms / Spots</span>
                        <div className="w-10 h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-xl">
                            <MdMeetingRoom />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-black text-base-content">{stats.total_rooms}</div>
                        <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
                            {stats.available_spots} vacant spots open
                        </p>
                    </div>
                </div>

                {/* Pending Verifications / Requests */}
                <div className="card bg-base-100 rounded-3xl p-5 border border-base-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">Payment Verifications</span>
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl">
                            <HiOutlineClock />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-base-content">{pendingVerifications.length}</span>
                            {pendingVerifications.length > 0 && (
                                <span className="badge badge-warning badge-xs font-bold animate-pulse">Action Needed</span>
                            )}
                        </div>
                        <Link to="/owner/manage-booking-details" className="text-[11px] text-primary font-bold hover:underline mt-0.5 inline-block">
                            Review payments &rarr;
                        </Link>
                    </div>
                </div>

                {/* Monthly Projected Revenue */}
                <div className="card bg-base-100 rounded-3xl p-5 border border-base-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">Est. Monthly Rent</span>
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl">
                            <HiOutlineCurrencyBangladeshi />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-black text-base-content">৳{stats.monthly_revenue?.toLocaleString()}</div>
                        <p className="text-[11px] text-base-content/60 mt-0.5">From active tenants</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions & Recent Bookings Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Properties Overview List */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
                            <span>My Listed Properties</span>
                            <span className="badge badge-sm badge-ghost">{properties.length}</span>
                        </h2>
                        <Link to="/owner/manage-property" className="text-xs font-bold text-primary hover:underline">
                            View All &rarr;
                        </Link>
                    </div>

                    {properties.length === 0 ? (
                        <div className="p-8 text-center bg-base-100 rounded-3xl border border-dashed border-base-200 space-y-3">
                            <div className="text-4xl">🏢</div>
                            <h3 className="font-bold text-sm text-base-content">No properties listed yet</h3>
                            <p className="text-xs text-base-content/60">Add your first property to start receiving tenants.</p>
                            <Link to="/owner/manage-property" className="btn btn-primary btn-xs rounded-xl font-bold mt-2">
                                + Add Property
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {properties.slice(0, 4).map(prop => (
                                <div key={prop.id} className="card bg-base-100 rounded-2xl p-4 border border-base-200 shadow-xs hover:shadow-md transition-all flex flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <img
                                            src={prop.cover_img}
                                            alt={prop.title}
                                            className="w-14 h-14 rounded-xl object-cover shrink-0 bg-base-300"
                                        />
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-sm text-base-content truncate">{prop.title}</h4>
                                            <p className="text-xs text-base-content/60 truncate">📍 {prop.upazila}, {prop.district}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="badge badge-xs badge-neutral">{prop.type}</span>
                                                <span className="text-[11px] text-base-content/70 font-medium">
                                                    {prop.available_room} of {prop.total_room} rooms open
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <Link
                                            to={`/owner/view/rooms/${prop.id}`}
                                            className="btn btn-outline btn-xs rounded-xl font-bold"
                                        >
                                            Rooms
                                        </Link>
                                        <Link
                                            to={`/owner/edit/property/${prop.id}`}
                                            className="btn btn-ghost btn-xs text-primary font-bold"
                                        >
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Bookings Box */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
                            <span>Recent Tenant Bookings</span>
                            <span className="badge badge-sm badge-ghost">{recentBookings.length}</span>
                        </h2>
                        <Link to="/owner/manage-booking-details" className="text-xs font-bold text-primary hover:underline">
                            Manage All &rarr;
                        </Link>
                    </div>

                    {recentBookings.length === 0 ? (
                        <div className="p-8 text-center bg-base-100 rounded-3xl border border-dashed border-base-200 space-y-2">
                            <div className="text-4xl">📋</div>
                            <h3 className="font-bold text-sm text-base-content">No booking requests</h3>
                            <p className="text-xs text-base-content/60">New booking requests from tenants will appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentBookings.map(b => {
                                const hasTransactionId = Boolean(b.transaction_id && b.transaction_id.trim());
                                const isPendingVerification = b.payment_status === 'pending_verification' && hasTransactionId;
                                const isConfirmed = b.payment || b.payment_status === 'confirmed' || b.status === 'accepted';

                                return (
                                    <div key={b.id} className="card bg-base-100 rounded-2xl p-4 border border-base-200 shadow-xs space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-bold text-sm text-base-content">{b.tenant_name}</h4>
                                                <p className="text-xs text-base-content/60">Room #{b.room_number} • {b.property_title}</p>
                                            </div>
                                            <span className={`badge badge-xs font-bold ${
                                                isConfirmed
                                                    ? 'badge-success text-white'
                                                    : isPendingVerification
                                                    ? 'badge-warning animate-pulse'
                                                    : b.status === 'rejected'
                                                    ? 'badge-error text-white'
                                                    : 'badge-ghost'
                                            }`}>
                                                {isPendingVerification ? 'Verify TrxID' : isConfirmed ? 'Confirmed' : b.status}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-xs pt-1 border-t border-base-200">
                                            <span className="text-base-content/60 font-medium">Rent: ৳{b.room_rent?.toLocaleString()}</span>
                                            <span className={
                                                isConfirmed
                                                    ? 'text-emerald-600 font-bold'
                                                    : isPendingVerification
                                                    ? 'text-amber-600 font-bold'
                                                    : 'text-base-content/50'
                                            }>
                                                {isConfirmed
                                                    ? '✓ 50% Verified'
                                                    : isPendingVerification
                                                    ? `TrxID: ${b.transaction_id || 'Submitted'}`
                                                    : 'Advance Unpaid'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OwnerDashBoard;
