import React, { useContext, useEffect, useState, useMemo } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { baseurl } from '../../services/BaseUrl';
import toast from 'react-hot-toast';
import {
    HiOutlineUser,
    HiOutlineEnvelope,
    HiOutlineBuildingOffice2,
    HiOutlineCalendar,
    HiOutlineCheck,
    HiOutlineXMark,
    HiOutlineCreditCard,
    HiOutlineClipboardDocument,
    HiOutlineCheckCircle
} from "react-icons/hi2";
import { FaClock, FaCheckCircle, FaTimesCircle, FaMobileAlt } from "react-icons/fa";

const BookingDetails = () => {
    const { accessToken, authUser } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('pending_verification');
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [copiedTrxId, setCopiedTrxId] = useState(null);

    const fetchBookings = () => {
        setLoading(true);
        fetch(`${baseurl}/owner/bookings`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setBookings(data);
                    // If there are pending verifications, default to that filter
                    const hasPendingVerifications = data.some(b => b.payment_status === 'pending_verification');
                    if (!hasPendingVerifications && filterStatus === 'pending_verification') {
                        setFilterStatus('all');
                    }
                } else {
                    setBookings([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching owner bookings:', err);
                setBookings([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (accessToken) {
            fetchBookings();
        }
    }, [accessToken]);

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedTrxId(id);
        toast.success(`TrxID copied: ${text}`);
        setTimeout(() => setCopiedTrxId(null), 2500);
    };

    // Owner confirms 50% advance payment & booking reservation
    const handleConfirmPayment = async (booking_id) => {
        const bookingToConfirm = bookings.find(b => b.id === booking_id);
        if (!bookingToConfirm?.transaction_id || !bookingToConfirm.transaction_id.trim()) {
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

            toast.success(data.message || "Payment verified & booking confirmed! Room is reserved.");
            setActionLoadingId(null);
            fetchBookings();
        } catch (error) {
            console.error(error);
            toast.error("Network error while confirming payment");
            setActionLoadingId(null);
        }
    };

    // Owner rejects payment and cancels booking, releasing room
    const handleRejectPayment = async (booking_id) => {
        const confirmReject = window.confirm(
            "Are you sure you want to reject this payment and cancel the booking? The room will be released for other tenants."
        );
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

            toast.success(data.message || "Payment rejected and room released for others.");
            setActionLoadingId(null);
            fetchBookings();
        } catch (error) {
            console.error(error);
            toast.error("Network error while rejecting payment");
            setActionLoadingId(null);
        }
    };

    // Counts for tabs
    const counts = useMemo(() => {
        return {
            all: bookings.length,
            pending_verification: bookings.filter(b => b.payment_status === 'pending_verification' && Boolean(b.transaction_id && b.transaction_id.trim())).length,
            pending: bookings.filter(b => b.status === 'pending').length,
            confirmed: bookings.filter(b => b.payment || b.payment_status === 'confirmed' || b.status === 'confirmed' || b.status === 'accepted').length,
            rejected: bookings.filter(b => b.status === 'rejected' || b.status === 'cancelled' || b.payment_status === 'rejected').length
        };
    }, [bookings]);

    const filteredBookings = useMemo(() => {
        if (filterStatus === 'pending_verification') {
            return bookings.filter(b => b.payment_status === 'pending_verification' && Boolean(b.transaction_id && b.transaction_id.trim()));
        }
        if (filterStatus === 'pending') {
            return bookings.filter(b => b.status === 'pending');
        }
        if (filterStatus === 'confirmed') {
            return bookings.filter(b => b.payment || b.payment_status === 'confirmed' || b.status === 'confirmed' || b.status === 'accepted');
        }
        if (filterStatus === 'rejected') {
            return bookings.filter(b => b.status === 'rejected' || b.status === 'cancelled' || b.payment_status === 'rejected');
        }
        return bookings;
    }, [bookings, filterStatus]);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span className="text-xs uppercase font-extrabold tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
                        Tenancy Management
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-base-content mt-2 tracking-tight">
                        Review & Verify Tenant Bookings
                    </h1>
                    <p className="text-xs sm:text-sm text-base-content/65 mt-0.5">
                        Verify 50% advance payments from your bKash/Nagad statement and confirm room reservations.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-1.5 p-1.5 bg-base-100 rounded-2xl border border-base-200 shadow-xs">
                    {[
                        { id: 'pending_verification', label: 'Payment Verifications', count: counts.pending_verification, highlight: true },
                        { id: 'pending', label: 'All Pending', count: counts.pending },
                        { id: 'confirmed', label: 'Confirmed & Rented', count: counts.confirmed },
                        { id: 'rejected', label: 'Rejected', count: counts.rejected },
                        { id: 'all', label: 'All Requests', count: counts.all },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilterStatus(tab.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                filterStatus === tab.id
                                    ? 'bg-primary text-primary-content shadow-xs'
                                    : 'text-base-content/70 hover:bg-base-200'
                            }`}
                        >
                            <span>{tab.label}</span>
                            {tab.count > 0 && (
                                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                                    tab.highlight && filterStatus !== tab.id
                                        ? 'bg-amber-500 text-white animate-pulse'
                                        : filterStatus === tab.id
                                        ? 'bg-primary-content/20 text-primary-content'
                                        : 'bg-base-300 text-base-content/80'
                                }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="text-center py-20 bg-base-100 rounded-3xl border border-dashed border-base-200 p-8 space-y-2">
                    <div className="text-5xl">📋</div>
                    <h2 className="text-xl font-bold text-base-content">No Bookings in this Category</h2>
                    <p className="text-xs text-base-content/60">
                        There are currently no {filterStatus.replace('_', ' ')} requests to review.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredBookings.map(b => {
                        const hasTransactionId = Boolean(b.transaction_id && b.transaction_id.trim());
                        const isUnderVerification = b.payment_status === 'pending_verification' && hasTransactionId;
                        const isConfirmed = b.payment || b.payment_status === 'confirmed' || b.status === 'confirmed' || b.status === 'accepted';
                        const isRejected = b.status === 'rejected' || b.status === 'cancelled' || b.payment_status === 'rejected';
                        const advanceAmount = b.advance_amount || Math.floor((b.room_rent || 0) / 2);

                        return (
                            <div
                                key={b.id}
                                className={`card bg-base-100 rounded-3xl border transition-all p-6 space-y-4 flex flex-col justify-between ${
                                    isUnderVerification
                                        ? 'border-amber-500/40 shadow-md shadow-amber-500/5 bg-gradient-to-b from-amber-500/5 via-base-100 to-base-100'
                                        : 'border-base-200 shadow-sm hover:shadow-md'
                                }`}
                            >
                                <div className="space-y-4">
                                    {/* Top Row: Tenant & Status */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-primary-content flex items-center justify-center font-black text-lg shadow-sm">
                                                {b.tenant_name ? b.tenant_name[0]?.toUpperCase() : "T"}
                                            </div>
                                            <div>
                                                <h3 className="font-extrabold text-base text-base-content">
                                                    {b.tenant_name}
                                                </h3>
                                                <p className="text-xs text-base-content/60">@{b.tenant_username} • {b.tenant_email}</p>
                                            </div>
                                        </div>

                                        <span className={`badge text-xs font-bold border-0 px-2.5 py-1 ${
                                            isConfirmed
                                                ? 'bg-emerald-500/15 text-emerald-600'
                                                : isRejected
                                                ? 'bg-rose-500/15 text-rose-600'
                                                : isUnderVerification
                                                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 font-extrabold animate-pulse'
                                                : 'bg-base-200 text-base-content/70'
                                        }`}>
                                            {isConfirmed ? '✓ Confirmed' : isRejected ? 'Cancelled' : isUnderVerification ? '⚡ Verification Pending' : b.status}
                                        </span>
                                    </div>

                                    {/* Room & Property Info Box */}
                                    <div className="bg-base-200/50 p-3.5 rounded-2xl space-y-2 text-xs border border-base-200">
                                        <div className="flex justify-between items-center">
                                            <span className="text-base-content/60 flex items-center gap-1.5 font-medium">
                                                <HiOutlineBuildingOffice2 /> Property:
                                            </span>
                                            <span className="font-bold text-base-content">{b.property_title}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-base-content/60 font-medium">Room Assigned:</span>
                                            <span className="badge badge-neutral badge-xs font-bold">
                                                Room #{b.room_number} ({b.room_type})
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-base-content/60 font-medium">Full Monthly Rent:</span>
                                            <span className="font-bold text-base-content">৳{b.room_rent?.toLocaleString()}/mo</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-1 border-t border-base-300/60">
                                            <span className="text-base-content/60 font-medium">50% Advance Requirement:</span>
                                            <span className="font-black text-primary text-sm">৳{advanceAmount?.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Notice if booking has no TrxID yet */}
                                    {!isConfirmed && !isRejected && !hasTransactionId && (
                                        <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/25 text-xs flex items-center justify-between text-amber-800 dark:text-amber-300">
                                            <span className="flex items-center gap-1.5 font-medium">
                                                <span>⏳</span>
                                                <span>Advance Payment Pending: No TrxID Submitted</span>
                                            </span>
                                            <span className="badge badge-warning badge-xs font-bold">
                                                Unpaid
                                            </span>
                                        </div>
                                    )}

                                    {/* Payment Verification Highlight Card */}
                                    {isUnderVerification && (
                                        <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/30 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs uppercase font-extrabold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                                                    <FaClock className="text-amber-600 animate-spin text-xs" />
                                                    Pending Advance Verification
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider text-white ${
                                                    b.payment_method === 'nagad' ? 'bg-[#F7941D]' : 'bg-[#E2136E]'
                                                }`}>
                                                    {b.payment_method || 'bKash'}
                                                </span>
                                            </div>

                                            <div className="space-y-1.5 text-xs">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-base-content/70">Amount Expected:</span>
                                                    <span className="font-black text-base-content">৳{advanceAmount.toLocaleString()}</span>
                                                </div>

                                                <div className="flex justify-between items-center bg-base-100 p-2 rounded-xl border border-amber-500/20">
                                                    <span className="text-base-content/70 font-medium">Transaction ID:</span>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-mono font-black text-primary text-xs">
                                                            {b.transaction_id || "N/A"}
                                                        </span>
                                                        {b.transaction_id && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCopy(b.transaction_id, b.id)}
                                                                className="btn btn-ghost btn-xs px-1 text-primary hover:bg-primary/10"
                                                                title="Copy TrxID"
                                                            >
                                                                {copiedTrxId === b.id ? "✓" : <HiOutlineClipboardDocument className="text-sm" />}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <p className="text-[11px] text-base-content/65 italic pt-1">
                                                    👉 Please verify this TrxID in your actual <strong>{(b.payment_method || 'mobile banking').toUpperCase()}</strong> transaction history before approving.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Confirmed Details */}
                                    {isConfirmed && (
                                        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-xs flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                                            <span className="flex items-center gap-1.5">
                                                <FaCheckCircle className="text-sm" /> 50% Advance Verified & Reserved
                                            </span>
                                            {b.transaction_id && (
                                                <span className="font-mono text-[11px] bg-emerald-500/20 px-2 py-0.5 rounded">
                                                    {b.transaction_id}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-1.5 text-[11px] text-base-content/50">
                                        <HiOutlineCalendar /> Requested on: {b.created_date}
                                    </div>
                                </div>

                                {/* Decision Actions Bar */}
                                {(!isConfirmed && !isRejected) && (
                                    <div className="pt-3 border-t border-base-200 flex items-center justify-between gap-3">
                                        <button
                                            onClick={() => handleRejectPayment(b.id)}
                                            disabled={actionLoadingId === b.id}
                                            className="btn btn-ghost btn-sm text-error rounded-xl font-bold flex-1 cursor-pointer hover:bg-error/10"
                                        >
                                            <HiOutlineXMark /> Reject
                                        </button>

                                        {hasTransactionId ? (
                                            <button
                                                onClick={() => handleConfirmPayment(b.id)}
                                                disabled={actionLoadingId === b.id}
                                                className="btn btn-primary btn-sm rounded-xl font-bold flex-1 shadow-sm shadow-primary/25 cursor-pointer"
                                            >
                                                {actionLoadingId === b.id ? (
                                                    <span className="loading loading-spinner loading-xs"></span>
                                                ) : (
                                                    <span className="flex items-center gap-1">
                                                        <HiOutlineCheck /> Confirm & Reserve
                                                    </span>
                                                )}
                                            </button>
                                        ) : (
                                            <div
                                                className="flex-1 text-center py-2 px-3 bg-base-200/70 rounded-xl text-xs font-semibold text-base-content/50 border border-base-200 flex items-center justify-center gap-1.5 cursor-not-allowed select-none"
                                                title="Tenant must submit their Transaction ID before payment can be verified."
                                            >
                                                <span>🔒</span>
                                                <span>Awaiting Tenant TrxID</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* If already confirmed, allow cancellation/release if needed */}
                                {isConfirmed && (
                                    <div className="pt-2 border-t border-base-200 flex justify-end">
                                        <button
                                            onClick={() => handleRejectPayment(b.id)}
                                            disabled={actionLoadingId === b.id}
                                            className="btn btn-ghost btn-xs text-error/80 hover:text-error hover:bg-error/10 rounded-lg font-semibold"
                                        >
                                            Release Room
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default BookingDetails;
