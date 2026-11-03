import React, { useContext, useEffect, useState, useMemo } from 'react';
import { baseurl } from '../services/BaseUrl';
import { AuthContext } from '../context/AuthProvider';
import toast from 'react-hot-toast';
import { Link } from 'react-router';
import {
    HiOutlineMapPin,
    HiOutlineShieldCheck,
    HiOutlineCreditCard,
    HiOutlineXCircle,
    HiOutlineBuildingOffice2,
    HiOutlineCalendar,
    HiOutlineCurrencyBangladeshi,
    HiOutlineClipboardDocument,
    HiOutlineCheckCircle
} from "react-icons/hi2";
import { FaCheckCircle, FaClock, FaTimesCircle, FaMobileAlt } from "react-icons/fa";

const MyBooking = () => {
    const { accessToken } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    // Reserved Room Payment Modal State
    const [paymentModalBooking, setPaymentModalBooking] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('bkash');
    const [transactionId, setTransactionId] = useState('');
    const [copiedNumber, setCopiedNumber] = useState(false);
    const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

    // Fetch user bookings
    const fetchBooking = () => {
        setLoading(true);
        fetch(`${baseurl}/booking/my`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setBookings(data);
                } else {
                    setBookings([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching bookings:", err);
                setBookings([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (!accessToken) return;
        fetchBooking();
    }, [accessToken]);

    const cancelBooking = async (id) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this booking request?");
        if (!confirmCancel) return;

        try {
            const res = await fetch(`${baseurl}/booking_room/cancel/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "Booking cancelled successfully");
                fetchBooking();
            } else {
                toast.error(data.detail || "Failed to cancel booking");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while canceling");
        }
    };

    const handleOpenPaymentModal = (booking) => {
        setPaymentModalBooking(booking);
        setPaymentMethod(booking.payment_method || 'bkash');
        setTransactionId(booking.transaction_id || '');
        setCopiedNumber(false);
    };

    const handleCopyNumber = (number) => {
        if (!number) return;
        navigator.clipboard.writeText(number);
        setCopiedNumber(true);
        toast.success(`Owner's number (${number}) copied!`);
        setTimeout(() => setCopiedNumber(false), 3000);
    };

    const handleSubmitAdvancePayment = async (e) => {
        e.preventDefault();
        if (!paymentModalBooking) return;

        const cleanTrxId = transactionId.trim();
        if (!cleanTrxId || cleanTrxId.length < 4) {
            toast.error("Please enter a valid Transaction ID from your bKash/Nagad app or SMS");
            return;
        }

        setIsSubmittingPayment(true);
        try {
            const res = await fetch(`${baseurl}/booking/advance-payment/${paymentModalBooking.id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    payment_method: paymentMethod,
                    transaction_id: cleanTrxId
                })
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.detail || "Failed to submit advance payment");
                setIsSubmittingPayment(false);
                return;
            }

            toast.success(data.message || "50% advance payment submitted! Status is pending verification by owner.");
            setIsSubmittingPayment(false);
            setPaymentModalBooking(null);
            setTransactionId('');
            fetchBooking();
        } catch (error) {
            console.error(error);
            toast.error("Network error while submitting payment verification");
            setIsSubmittingPayment(false);
        }
    };

    // Filter by tab
    const filteredBookings = useMemo(() => {
        if (activeTab === 'pending_verification') {
            return bookings.filter(b => b.payment_status === 'pending_verification');
        }
        if (activeTab === 'confirmed') {
            return bookings.filter(b => b.payment || b.payment_status === 'confirmed' || b.status === 'confirmed' || b.status === 'accepted');
        }
        if (activeTab === 'unpaid') {
            return bookings.filter(b => !b.payment && b.payment_status !== 'pending_verification' && b.status !== 'cancelled' && b.status !== 'rejected');
        }
        return bookings;
    }, [bookings, activeTab]);

    return (
        <div className="w-full min-h-screen bg-base-100 py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs uppercase font-extrabold tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
                            Tenant Portal
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-black text-base-content mt-2 tracking-tight">
                            My Bookings & Reservations
                        </h1>
                        <p className="text-sm text-base-content/70 mt-1">
                            Pay 50% advance to secure your room reservation and track owner verification.
                        </p>
                    </div>

                    <Link to="/property" className="btn btn-outline btn-primary btn-sm rounded-2xl font-bold self-start">
                        + Book Another Space
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 p-1.5 bg-base-200/60 rounded-2xl border border-base-200 w-fit">
                    {[
                        { id: 'all', label: 'All Requests' },
                        { id: 'unpaid', label: 'Advance Unpaid' },
                        { id: 'pending_verification', label: 'Under Verification' },
                        { id: 'confirmed', label: 'Confirmed & Reserved' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                activeTab === tab.id
                                    ? 'bg-primary text-primary-content shadow-xs'
                                    : 'text-base-content/70 hover:text-base-content hover:bg-base-100'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Booking Cards */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map(idx => (
                            <div key={idx} className="card bg-base-100 border border-base-200 p-6 rounded-3xl animate-pulse space-y-4">
                                <div className="h-6 bg-base-300 rounded w-1/3"></div>
                                <div className="h-4 bg-base-300 rounded w-2/3"></div>
                                <div className="h-20 bg-base-300 rounded-2xl"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="text-center py-20 bg-base-200/30 rounded-3xl border border-dashed border-base-300 p-8">
                        <div className="text-6xl mb-4">🏠</div>
                        <h2 className="text-2xl font-black text-base-content">No Bookings Found</h2>
                        <p className="text-sm text-base-content/60 mt-2 max-w-md mx-auto">
                            {activeTab === 'all'
                                ? "You haven't requested any room bookings yet. Explore our verified properties and reserve your room today!"
                                : `You don't have any bookings in the '${activeTab.replace('_', ' ')}' category.`}
                        </p>
                        <Link to="/property" className="btn btn-primary btn-sm rounded-xl mt-6 px-6 font-bold">
                            Explore Properties
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredBookings.map(booking => {
                            const advanceAmount = booking.advance_amount || Math.floor((booking.room_rent || 0) / 2);
                            const isPaid = booking.payment || booking.payment_status === 'confirmed';
                            const isPendingVerification = booking.payment_status === 'pending_verification';
                            const isRejected = booking.status === 'cancelled' || booking.status === 'rejected' || booking.payment_status === 'rejected';
                            const isConfirmed = isPaid || booking.status === 'confirmed' || booking.status === 'accepted';
                            const isPending = !isConfirmed && !isRejected;

                            return (
                                <div
                                    key={booking.id}
                                    className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                                >
                                    {/* Top Property Info Banner */}
                                    <div className="p-6 pb-4 border-b border-base-200 flex gap-4">
                                        <img
                                            src={booking.cover_img}
                                            alt={booking.property_title}
                                            className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-base-300"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-extrabold text-base text-base-content truncate">
                                                    {booking.property_title}
                                                </h3>
                                                <span
                                                    className={`badge text-xs font-bold border-0 px-2.5 py-1 shrink-0 ${
                                                        isConfirmed
                                                            ? "bg-emerald-500/15 text-emerald-600"
                                                            : isRejected
                                                            ? "bg-rose-500/15 text-rose-600"
                                                            : "bg-amber-500/15 text-amber-600"
                                                    }`}
                                                >
                                                    {isConfirmed ? "Confirmed" : isRejected ? "Cancelled" : "Pending"}
                                                </span>
                                            </div>

                                            <p className="text-xs text-base-content/60 flex items-center gap-1 mt-1 truncate">
                                                <HiOutlineMapPin className="text-primary shrink-0" />
                                                <span>{booking.property_address}</span>
                                            </p>

                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="badge badge-sm badge-neutral">
                                                    Room #{booking.room_number} ({booking.room_type})
                                                </span>
                                                <span className="text-xs font-bold text-primary">
                                                    ৳{booking.room_rent?.toLocaleString()}/mo
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Body Metadata */}
                                    <div className="p-6 space-y-3.5 text-xs">
                                        {/* Advance Pricing Banner */}
                                        <div className="p-3 bg-primary/5 rounded-2xl border border-primary/15 flex items-center justify-between">
                                            <div>
                                                <span className="text-[10px] uppercase font-bold text-primary block">
                                                    50% Advance Requirement
                                                </span>
                                                <span className="text-base font-black text-base-content">
                                                    ৳{advanceAmount.toLocaleString()}
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-base-content/60 font-medium">
                                                Full Rent: ৳{booking.room_rent?.toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-base-content/70">
                                            <span className="flex items-center gap-1.5">
                                                <HiOutlineCalendar /> Requested On:
                                            </span>
                                            <span className="font-bold text-base-content">{booking.created_date}</span>
                                        </div>

                                        <div className="flex justify-between items-center text-base-content/70">
                                            <span className="flex items-center gap-1.5">
                                                <HiOutlineCreditCard /> Payment Status:
                                            </span>
                                            {isConfirmed ? (
                                                <span className="font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center gap-1">
                                                    <FaCheckCircle className="text-[10px]" /> Verified & Confirmed
                                                </span>
                                            ) : isPendingVerification ? (
                                                <span className="font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center gap-1 animate-pulse">
                                                    <FaClock className="text-[10px]" /> Verification Pending
                                                </span>
                                            ) : isRejected ? (
                                                <span className="font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600">
                                                    Rejected
                                                </span>
                                            ) : (
                                                <span className="font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600">
                                                    50% Advance Unpaid
                                                </span>
                                            )}
                                        </div>

                                        {/* TrxID banner if submitted */}
                                        {booking.transaction_id && (
                                            <div className="p-2.5 bg-base-200/50 rounded-xl border border-base-200 flex items-center justify-between">
                                                <span className="text-base-content/70 text-[11px]">
                                                    Method: <strong className="uppercase text-primary">{booking.payment_method || 'bKash'}</strong>
                                                </span>
                                                <span className="font-mono text-xs font-bold text-base-content bg-base-100 px-2 py-0.5 rounded border border-base-300">
                                                    TrxID: {booking.transaction_id}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center text-base-content/70">
                                            <span>Landlord Contact:</span>
                                            <span className="font-semibold text-base-content">{booking.owner_email || "N/A"}</span>
                                        </div>
                                    </div>

                                    {/* Action Bar */}
                                    <div className="p-6 pt-3 bg-base-200/30 border-t border-base-200 flex items-center justify-between gap-3 flex-wrap">
                                        {/* Cancel Button */}
                                        {isPending ? (
                                            <button
                                                onClick={() => cancelBooking(booking.id)}
                                                className="btn btn-ghost btn-sm text-error rounded-xl font-bold cursor-pointer"
                                            >
                                                Cancel Request
                                            </button>
                                        ) : (
                                            <span className="text-xs text-base-content/60 font-medium">
                                                {isConfirmed ? "Room Reserved for You" : "Request " + booking.status}
                                            </span>
                                        )}

                                        {/* Payment Button / Status Actions */}
                                        {isConfirmed ? (
                                            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-500/10 px-3.5 py-1.5 rounded-xl border border-emerald-500/20">
                                                <FaCheckCircle /> 50% Advance Verified
                                            </span>
                                        ) : isPendingVerification ? (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleOpenPaymentModal(booking)}
                                                    className="btn btn-ghost btn-xs text-primary font-bold hover:underline"
                                                    title="Click to update TrxID if entered incorrectly"
                                                >
                                                    Edit TrxID
                                                </button>
                                                <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 font-bold bg-amber-500/15 px-3 py-1 rounded-xl border border-amber-500/25">
                                                    <FaClock /> Awaiting Landlord Approval
                                                </span>
                                            </div>
                                        ) : !isRejected ? (
                                            <button
                                                onClick={() => handleOpenPaymentModal(booking)}
                                                className="btn btn-primary btn-sm rounded-xl font-bold px-4 shadow-sm shadow-primary/30 cursor-pointer"
                                            >
                                                Pay 50% Advance (৳{advanceAmount.toLocaleString()})
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Reserved Room Advance Payment Modal */}
            {paymentModalBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                    <div className="bg-base-100 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-base-200 space-y-6 max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-orange-500/20 text-primary flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
                                📱
                            </div>
                            <h3 className="text-2xl font-black text-base-content">
                                Reserved Room Advance Payment
                            </h3>
                            <p className="text-xs text-base-content/65 mt-1">
                                Send 50% advance rent to the owner's registered number to confirm reservation.
                            </p>
                        </div>

                        {/* Amount Card */}
                        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 text-center space-y-1">
                            <span className="text-xs uppercase font-extrabold text-primary tracking-wider">
                                Required 50% Advance
                            </span>
                            <div className="text-3xl font-black text-base-content tracking-tight">
                                ৳{(paymentModalBooking.advance_amount || Math.floor((paymentModalBooking.room_rent || 0) / 2)).toLocaleString()}
                            </div>
                            <div className="flex items-center justify-center gap-2 text-xs text-base-content/65 pt-1">
                                <span>Room #{paymentModalBooking.room_number}</span>
                                <span>•</span>
                                <span>Total Rent: ৳{paymentModalBooking.room_rent?.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Owner Registered Number Display */}
                        <div className="bg-base-200/60 p-4 rounded-2xl border border-base-200 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] uppercase font-bold text-base-content/70">
                                    Owner's Registered bKash / Nagad Number
                                </span>
                                <span className="badge badge-neutral badge-xs font-bold">Personal Account</span>
                            </div>

                            <div className="flex items-center justify-between gap-3 bg-base-100 p-3 rounded-xl border border-base-300">
                                <div className="flex items-center gap-2">
                                    <FaMobileAlt className="text-primary text-lg" />
                                    <span className="font-mono text-lg font-black text-base-content tracking-wider">
                                        {paymentModalBooking.owner_payment_number || "01712-345678"}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleCopyNumber(paymentModalBooking.owner_payment_number || "01712-345678")}
                                    className={`btn btn-xs rounded-lg font-bold transition-all ${
                                        copiedNumber ? 'btn-success text-white' : 'btn-primary'
                                    }`}
                                >
                                    {copiedNumber ? "✓ Copied" : "Copy Number"}
                                </button>
                            </div>
                            <p className="text-[11px] text-base-content/60 italic">
                                * The owner has one registered mobile banking number for both bKash and Nagad.
                            </p>
                        </div>

                        {/* Payment Method Selector */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-base-content/80">
                                Select Your Payment Method:
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {/* bKash */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('bkash')}
                                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                                        paymentMethod === 'bkash'
                                            ? 'border-[#E2136E] bg-[#E2136E]/10 shadow-sm'
                                            : 'border-base-200 bg-base-200/40 hover:bg-base-200/70'
                                    }`}
                                >
                                    <div>
                                        <div className="font-black text-sm text-[#E2136E]">bKash</div>
                                        <div className="text-[10px] text-base-content/60 font-semibold">Send Money (Personal)</div>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                        paymentMethod === 'bkash' ? 'border-[#E2136E] bg-[#E2136E]' : 'border-base-300'
                                    }`}>
                                        {paymentMethod === 'bkash' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                    </div>
                                </button>

                                {/* Nagad */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('nagad')}
                                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                                        paymentMethod === 'nagad'
                                            ? 'border-[#F7941D] bg-[#F7941D]/10 shadow-sm'
                                            : 'border-base-200 bg-base-200/40 hover:bg-base-200/70'
                                    }`}
                                >
                                    <div>
                                        <div className="font-black text-sm text-[#F7941D]">Nagad</div>
                                        <div className="text-[10px] text-base-content/60 font-semibold">Send Money (Personal)</div>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                        paymentMethod === 'nagad' ? 'border-[#F7941D] bg-[#F7941D]' : 'border-base-300'
                                    }`}>
                                        {paymentMethod === 'nagad' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="bg-base-200/40 p-3.5 rounded-2xl border border-base-200 text-xs space-y-1.5 text-base-content/75">
                            <div className="font-bold text-base-content flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                                <span>📋 Payment Steps</span>
                            </div>
                            <ol className="list-decimal list-inside space-y-1 text-[11px]">
                                <li>Open your <strong>{paymentMethod.toUpperCase()}</strong> app.</li>
                                <li>Select <strong>Send Money</strong> to <strong>{paymentModalBooking.owner_payment_number || "01712-345678"}</strong>.</li>
                                <li>Amount: <strong>৳{(paymentModalBooking.advance_amount || Math.floor((paymentModalBooking.room_rent || 0) / 2)).toLocaleString()}</strong>.</li>
                                <li>Copy the <strong>Transaction ID (TrxID)</strong> and paste it below.</li>
                            </ol>
                        </div>

                        {/* Transaction ID Input Form */}
                        <form onSubmit={handleSubmitAdvancePayment} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-base-content/80 mb-1.5">
                                    Transaction ID (TrxID) <span className="text-error">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    placeholder={paymentMethod === 'bkash' ? "e.g. BKA73849201" : "e.g. NAG92847291"}
                                    className="input input-bordered w-full rounded-2xl text-sm font-mono tracking-wider font-bold"
                                    required
                                />
                                <span className="text-[10px] text-base-content/60 mt-1 block">
                                    Find this TrxID in your {paymentMethod.toUpperCase()} SMS or transaction statement.
                                </span>
                            </div>

                            {/* Modal Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setPaymentModalBooking(null)}
                                    disabled={isSubmittingPayment}
                                    className="btn btn-ghost flex-1 rounded-2xl font-bold cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingPayment}
                                    className="btn btn-primary flex-1 rounded-2xl font-bold shadow-md shadow-primary/30 cursor-pointer"
                                >
                                    {isSubmittingPayment ? (
                                        <span className="loading loading-spinner loading-sm"></span>
                                    ) : (
                                        "Submit For Verification"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBooking;
