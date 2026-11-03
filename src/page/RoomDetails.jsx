import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { AuthContext } from '../context/AuthProvider';
import { baseurl } from '../services/BaseUrl';
import toast from 'react-hot-toast';
import {
    HiOutlineMapPin,
    HiOutlineShieldCheck,
    HiOutlineCheckCircle,
    HiOutlineBuildingOffice2,
    HiArrowLeft,
    HiOutlineWifi,
    HiOutlineSparkles
} from "react-icons/hi2";
import { MdMeetingRoom, MdBathtub, MdBalcony, MdKitchen } from "react-icons/md";
import { FaUserFriends, FaRegCheckCircle } from "react-icons/fa";

const RoomDetails = () => {
    const { id } = useParams();
    const { accessToken, authUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        fetch(`${baseurl}/specific_room/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.id) {
                    setRoom(data);
                } else {
                    setRoom(null);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching room details:", err);
                setLoading(false);
            });
    }, [id]);

    const handleBook = async () => {
        if (!accessToken) {
            toast.error("Please login to book this room");
            navigate('/login');
            return;
        }

        setBookingLoading(true);
        try {
            const res = await fetch(`${baseurl}/booking_room/${id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.detail || "Booking failed");
                setBookingLoading(false);
                setIsConfirmModalOpen(false);
                return;
            }

            toast.success(data.message || "Room booked successfully!");
            setIsConfirmModalOpen(false);
            setBookingLoading(false);
            navigate('/my-booking');
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit booking request. Try again.");
            setBookingLoading(false);
            setIsConfirmModalOpen(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="text-sm font-semibold text-base-content/60">Loading room details...</p>
                </div>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="max-w-xl mx-auto p-8 text-center my-16 bg-base-200/50 rounded-3xl border border-dashed border-base-300">
                <div className="text-6xl mb-3">🚪</div>
                <h2 className="text-2xl font-bold text-base-content">Room Not Found</h2>
                <p className="text-sm text-base-content/60 mt-1">
                    This room may have been removed or does not exist.
                </p>
                <Link to="/property" className="btn btn-primary btn-sm rounded-xl mt-6 px-6 font-bold">
                    Browse Other Properties
                </Link>
            </div>
        );
    }

    const isAvailable = room.is_availables && (room.current_members || 0) < (room.capacity || 1);
    const isOwner = authUser && authUser.id === room.owner_id;
    const occupancyPct = Math.min(100, Math.round(((room.current_members || 0) / (room.capacity || 1)) * 100));

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between text-xs font-semibold text-base-content/60">
                <div className="flex items-center gap-2">
                    <Link to={`/properties-room/${room.property_id}`} className="hover:text-primary flex items-center gap-1">
                        <HiArrowLeft /> Back to Property Rooms
                    </Link>
                    <span>/</span>
                    <span className="text-base-content">Room #{room.room_number}</span>
                </div>
                <span className="badge badge-sm badge-ghost">{room.type} Room</span>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Image & Amenities */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="relative rounded-3xl overflow-hidden bg-base-300 shadow-lg border border-base-200">
                        <img
                            src={
                                room.cover_img ||
                                "https://images.unsplash.com/photo-1560185008-b033106af5c3?q=80&w=1200"
                            }
                            alt={`Room ${room.room_number}`}
                            className="w-full h-[400px] sm:h-[450px] object-cover"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className="badge badge-neutral bg-black/60 backdrop-blur-md text-white border-0 py-2.5 px-3 text-xs font-bold">
                                {room.type}
                            </span>
                            <span
                                className={`badge text-xs font-bold border-0 py-2.5 px-3 ${
                                    isAvailable
                                        ? "bg-emerald-500 text-white"
                                        : "bg-rose-500 text-white"
                                }`}
                            >
                                {isAvailable ? "Available For Booking" : "Fully Occupied"}
                            </span>
                        </div>
                    </div>

                    {/* Room Key Features */}
                    <div className="bg-base-100 rounded-3xl p-6 border border-base-200 shadow-sm space-y-4">
                        <h3 className="font-bold text-base text-base-content flex items-center gap-2">
                            <HiOutlineSparkles className="text-primary text-lg" />
                            <span>Room Amenities & Highlights</span>
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-semibold text-base-content/80">
                            <div className="flex items-center gap-2 p-3 bg-base-200/50 rounded-2xl">
                                <HiOutlineWifi className="text-primary text-base" />
                                <span>High-Speed WiFi</span>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-base-200/50 rounded-2xl">
                                <MdBathtub className="text-secondary text-base" />
                                <span>Attached Bath</span>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-base-200/50 rounded-2xl">
                                <MdBalcony className="text-emerald-500 text-base" />
                                <span>Private Balcony</span>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-base-200/50 rounded-2xl">
                                <MdKitchen className="text-amber-500 text-base" />
                                <span>Shared Kitchen</span>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-base-200/50 rounded-2xl">
                                <HiOutlineShieldCheck className="text-indigo-500 text-base" />
                                <span>CCTV Security</span>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-base-200/50 rounded-2xl">
                                <HiOutlineCheckCircle className="text-teal-500 text-base" />
                                <span>Furnished Bed & Desk</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Pricing & Booking Card */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-xl p-6 sm:p-8 space-y-6 sticky top-24">
                        {/* Title & Rent */}
                        <div className="border-b border-base-200 pb-5">
                            <p className="text-xs uppercase font-extrabold tracking-widest text-primary">
                                {room.type} Room Accommodation
                            </p>
                            <h1 className="text-3xl font-black text-base-content mt-1">
                                Room #{room.room_number}
                            </h1>
                            <div className="flex items-baseline gap-2 mt-4">
                                <span className="text-4xl font-black text-base-content">
                                    ৳{room.rent?.toLocaleString()}
                                </span>
                                <span className="text-sm font-semibold text-base-content/60">/ month</span>
                            </div>
                            <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-xl text-xs font-bold border border-amber-500/25">
                                <span>⚡ 50% Advance Required:</span>
                                <span>৳{Math.floor((room.rent || 0) / 2)?.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Property Context */}
                        <div className="bg-base-200/50 p-4 rounded-2xl space-y-2 border border-base-200">
                            <div className="flex items-start gap-2">
                                <HiOutlineBuildingOffice2 className="text-primary text-lg shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-bold text-base-content">{room.property_title}</h4>
                                    <p className="text-xs text-base-content/60">{room.property_address}, {room.upazila}, {room.district}</p>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-base-300/60 flex items-center justify-between text-xs text-base-content/70">
                                <span>Landlord: <strong className="text-base-content">{room.owner_name}</strong></span>
                                <span className="text-emerald-600 font-bold flex items-center gap-1">
                                    <HiOutlineShieldCheck /> Verified
                                </span>
                            </div>
                        </div>

                        {/* Occupancy Progress */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-semibold">
                                <span className="text-base-content/70">Current Capacity</span>
                                <span className="text-base-content font-bold">
                                    {room.current_members || 0} of {room.capacity} beds occupied
                                </span>
                            </div>
                            <div className="w-full bg-base-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className={`h-3 rounded-full transition-all duration-500 ${
                                        occupancyPct >= 100 ? 'bg-rose-500' : 'bg-emerald-500'
                                    }`}
                                    style={{ width: `${occupancyPct}%` }}
                                ></div>
                            </div>
                            <p className="text-[11px] text-base-content/60">
                                {isAvailable
                                    ? `There are ${room.capacity - (room.current_members || 0)} vacant spot(s) remaining in this room.`
                                    : "This room is currently fully booked."}
                            </p>
                        </div>

                        {/* Booking Button */}
                        <div>
                            {isOwner ? (
                                <div className="p-4 bg-warning/10 text-warning-content rounded-2xl text-xs font-semibold border border-warning/20 text-center">
                                    ℹ️ You are the owner of this property. Owners cannot book their own rooms.
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsConfirmModalOpen(true)}
                                    disabled={!isAvailable}
                                    className="btn btn-primary btn-lg w-full rounded-2xl font-black text-base shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/35 transition-all cursor-pointer"
                                >
                                    {isAvailable ? "Request To Book Room" : "Room Unavailable"}
                                </button>
                            )}

                            <p className="text-center text-[11px] text-base-content/50 mt-3">
                                🔒 Secure booking • No upfront charge until confirmed
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Confirmation Modal */}
            {isConfirmModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                    <div className="bg-base-100 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-base-200 space-y-6">
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl mx-auto mb-3">
                                📋
                            </div>
                            <h3 className="text-2xl font-black text-base-content">Confirm Room Booking</h3>
                            <p className="text-xs text-base-content/60 mt-1">
                                Review your reservation summary before submitting.
                            </p>
                        </div>

                        {/* Summary Box */}
                        <div className="bg-base-200/50 p-4 rounded-2xl space-y-2.5 text-xs text-base-content border border-base-200">
                            <div className="flex justify-between">
                                <span className="text-base-content/60">Property</span>
                                <span className="font-bold">{room.property_title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-base-content/60">Room Number</span>
                                <span className="font-bold">Room #{room.room_number} ({room.type})</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-base-content/60">Monthly Rent</span>
                                <span className="font-bold text-base-content">৳{room.rent?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 px-3 bg-primary/10 rounded-xl border border-primary/20">
                                <span className="text-primary font-bold">50% Advance Required:</span>
                                <span className="font-black text-primary text-sm">৳{Math.floor((room.rent || 0) / 2)?.toLocaleString()}</span>
                            </div>
                            <p className="text-[11px] text-base-content/65 italic pt-1 border-t border-base-300/60">
                                Once booked, send the 50% advance to owner's registered bKash/Nagad and submit your TrxID to secure reservation.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsConfirmModalOpen(false)}
                                disabled={bookingLoading}
                                className="btn btn-ghost flex-1 rounded-2xl font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleBook}
                                disabled={bookingLoading}
                                className="btn btn-primary flex-1 rounded-2xl font-bold shadow-md shadow-primary/30"
                            >
                                {bookingLoading ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    "Confirm Booking"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomDetails;
