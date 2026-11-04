import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { baseurl } from '../../services/BaseUrl';
import {
    HiMagnifyingGlass,
    HiOutlineTrash,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineCreditCard,
    HiOutlinePhone
} from "react-icons/hi2";
import { SiBookingdotcom } from "react-icons/si";
import toast from 'react-hot-toast';

const AdminBookings = () => {
    const { accessToken } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const loadBookings = async () => {
        if (!accessToken) return;
        setLoading(true);
        try {
            const res = await fetch(`${baseurl}/admin/bookings?status=${statusFilter}&payment_status=${paymentFilter}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (res.ok) {
                const data = await res.json();
                setBookings(data || []);
            } else {
                toast.error("Failed to load platform bookings");
            }
        } catch (err) {
            console.error("Error loading bookings:", err);
            toast.error("Network error loading bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, [accessToken, statusFilter, paymentFilter]);

    const handleUpdateStatus = async (bookingId, newStatus, newPaymentStatus) => {
        setActionLoadingId(bookingId);
        try {
            const payload = {};
            if (newStatus) payload.status = newStatus;
            if (newPaymentStatus) payload.payment_status = newPaymentStatus;

            const res = await fetch(`${baseurl}/admin/bookings/${bookingId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "Booking updated successfully");
                loadBookings();
            } else {
                toast.error(data.detail || "Failed to update booking status");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error updating booking status");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDeleteBooking = async () => {
        if (!deleteTarget) return;
        setActionLoadingId(deleteTarget.id);
        try {
            const res = await fetch(`${baseurl}/admin/bookings/${deleteTarget.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "Booking cancelled and removed");
                setBookings(prev => prev.filter(b => b.id !== deleteTarget.id));
                setDeleteTarget(null);
            } else {
                toast.error(data.detail || "Failed to delete booking");
            }
        } catch (err) {
            console.error(err);
            toast.error("Network error deleting booking");
        } finally {
            setActionLoadingId(null);
        }
    };

    const filteredBookings = bookings.filter(b => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            b.tenant_name?.toLowerCase().includes(q) ||
            b.owner_name?.toLowerCase().includes(q) ||
            b.property_title?.toLowerCase().includes(q) ||
            b.transaction_id?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-base-content tracking-tight flex items-center gap-2.5">
                        <span>Bookings & Advance Verification</span>
                        <span className="badge badge-accent font-black text-xs">{bookings.length} Total</span>
                    </h1>
                    <p className="text-sm text-base-content/65 mt-1">
                        Monitor room reservation requests, verify bKash/Nagad advance payments, and resolve disputes.
                    </p>
                </div>

                <div className="relative">
                    <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 text-base" />
                    <input
                        type="text"
                        placeholder="Search tenant, landlord, TrxID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input input-sm input-bordered rounded-2xl pl-10 pr-3 text-xs w-64 bg-base-100"
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-base-200 pb-3">
                {/* Booking Status Tabs */}
                <div className="flex flex-wrap gap-1.5">
                    {['all', 'pending', 'accepted', 'confirmed', 'cancelled'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`btn btn-xs sm:btn-sm rounded-xl font-bold capitalize transition-all ${
                                statusFilter === s
                                    ? 'btn-accent text-accent-content shadow-sm'
                                    : 'btn-ghost text-base-content/70'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Payment Status Dropdown / Pills */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-base-content/60">Payment:</span>
                    <select
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                        className="select select-bordered select-xs sm:select-sm rounded-xl text-xs bg-base-100"
                    >
                        <option value="all">All Payments</option>
                        <option value="pending_verification">Pending Verification</option>
                        <option value="confirmed">Confirmed / Paid</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="card bg-base-100 border border-base-200 rounded-3xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <span className="loading loading-spinner loading-lg text-accent"></span>
                        <p className="mt-3 text-xs font-bold text-base-content/60 uppercase">Loading bookings...</p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="p-12 text-center text-xs text-base-content/60">
                        No bookings matching current criteria.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="bg-base-200/50 text-base-content/70 text-xs font-bold">
                                    <th>Booking ID & Date</th>
                                    <th>Tenant Info</th>
                                    <th>Property & Room</th>
                                    <th>Landlord</th>
                                    <th>Payment & Trx</th>
                                    <th>Booking Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map(b => (
                                    <tr key={b.id} className="hover:bg-base-200/40 transition-colors">
                                        <td>
                                            <div className="font-mono font-bold text-xs text-base-content">
                                                #{b.id}
                                            </div>
                                            <div className="text-[11px] text-base-content/50">
                                                {b.created_date}
                                            </div>
                                        </td>

                                        <td>
                                            <div className="font-bold text-xs text-base-content">
                                                {b.tenant_name}
                                            </div>
                                            <div className="text-[11px] text-base-content/60 font-mono">
                                                {b.tenant_email}
                                            </div>
                                        </td>

                                        <td>
                                            <div className="font-bold text-xs text-base-content line-clamp-1">
                                                {b.property_title}
                                            </div>
                                            <div className="text-[11px] text-primary font-semibold">
                                                Room #{b.room_number} • ৳{b.room_rent?.toLocaleString()}
                                            </div>
                                        </td>

                                        <td>
                                            <div className="font-semibold text-xs text-base-content">
                                                {b.owner_name}
                                            </div>
                                            <div className="text-[11px] text-base-content/60 flex items-center gap-1">
                                                <HiOutlinePhone className="text-xs" />
                                                {b.owner_phone || 'N/A'}
                                            </div>
                                        </td>

                                        <td>
                                            <div className="flex flex-col gap-0.5">
                                                <span className={`badge badge-xs font-bold ${
                                                    b.payment_status === 'confirmed'
                                                        ? 'badge-success text-white'
                                                        : b.payment_status === 'pending_verification'
                                                            ? 'badge-warning'
                                                            : 'badge-neutral'
                                                }`}>
                                                    {b.payment_status}
                                                </span>
                                                <div className="text-xs font-mono font-bold text-base-content">
                                                    ৳{b.advance_amount?.toLocaleString()} {b.payment_method ? `(${b.payment_method.toUpperCase()})` : ''}
                                                </div>
                                                {b.transaction_id && (
                                                    <div className="text-[10px] font-mono text-base-content/60">
                                                        Trx: {b.transaction_id}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td>
                                            <span className={`badge badge-sm font-bold uppercase ${
                                                b.status === 'confirmed' || b.status === 'accepted'
                                                    ? 'badge-success text-white'
                                                    : b.status === 'pending'
                                                        ? 'badge-warning'
                                                        : 'badge-error text-white'
                                            }`}>
                                                {b.status}
                                            </span>
                                        </td>

                                        <td className="text-right space-x-1.5">
                                            {/* Admin Payment Verification Override */}
                                            {b.payment_status !== 'confirmed' && b.transaction_id && (
                                                <button
                                                    disabled={actionLoadingId === b.id}
                                                    onClick={() => handleUpdateStatus(b.id, 'confirmed', 'confirmed')}
                                                    className="btn btn-success btn-xs text-white rounded-lg font-bold"
                                                    title="Verify Payment & Confirm Booking"
                                                >
                                                    <HiOutlineCheckCircle className="text-xs" />
                                                    Confirm
                                                </button>
                                            )}

                                            {b.status !== 'cancelled' && (
                                                <button
                                                    disabled={actionLoadingId === b.id}
                                                    onClick={() => handleUpdateStatus(b.id, 'cancelled', 'rejected')}
                                                    className="btn btn-ghost btn-xs text-warning font-bold rounded-lg hover:bg-warning/10"
                                                    title="Cancel Booking"
                                                >
                                                    Cancel
                                                </button>
                                            )}

                                            <button
                                                disabled={actionLoadingId === b.id}
                                                onClick={() => setDeleteTarget(b)}
                                                className="btn btn-ghost btn-xs text-error font-bold rounded-lg hover:bg-error/10"
                                                title="Delete Record"
                                            >
                                                <HiOutlineTrash className="text-sm" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {deleteTarget && (
                <div className="modal modal-open">
                    <div className="modal-box rounded-3xl border border-base-200 max-w-sm p-6 space-y-4">
                        <div className="flex items-center gap-2 text-error">
                            <HiOutlineTrash className="text-2xl" />
                            <h3 className="font-black text-lg text-base-content">
                                Delete Booking Record?
                            </h3>
                        </div>

                        <p className="text-xs text-base-content/70 leading-relaxed">
                            Are you sure you want to remove Booking #{deleteTarget.id} for <strong>{deleteTarget.tenant_name}</strong>? Any room slots held by this booking will be automatically released back to inventory.
                        </p>

                        <div className="modal-action flex items-center justify-end gap-2 pt-2">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="btn btn-ghost btn-sm rounded-xl font-bold"
                            >
                                Back
                            </button>
                            <button
                                disabled={actionLoadingId === deleteTarget.id}
                                onClick={handleDeleteBooking}
                                className="btn btn-error btn-sm rounded-xl font-bold text-white shadow-md shadow-error/20"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBookings;
