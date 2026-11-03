import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { AuthContext } from '../context/AuthProvider';
import { baseurl } from '../services/BaseUrl';
import { HiOutlineMapPin, HiOutlineBuildingOffice2, HiOutlineUserCircle, HiOutlineShieldCheck, HiArrowLeft } from "react-icons/hi2";
import { MdMeetingRoom, MdBed } from "react-icons/md";
import { FaUserFriends, FaArrowRight } from "react-icons/fa";

const ViewRoom = () => {
    const { id } = useParams(); // property id
    const { accessToken } = useContext(AuthContext);

    const [property, setProperty] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('All');
    const [availableOnly, setAvailableOnly] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc');

    // Fetch property details
    useEffect(() => {
        if (!id) return;

        fetch(`${baseurl}/specific_property/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.id) {
                    setProperty(data);
                }
            })
            .catch(err => console.error("Error fetching property:", err));
    }, [id]);

    // Fetch all rooms for this property
    const fetchRooms = () => {
        setLoading(true);
        fetch(`${baseurl}/specific_properties/${id}/all_room`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setRooms(data);
                } else {
                    setRooms([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching rooms:", err);
                setRooms([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (id) {
            fetchRooms();
        }
    }, [id]);

    // Filter and Sort Rooms in Memory
    const filteredRooms = useMemo(() => {
        return rooms
            .filter(room => {
                if (selectedType !== 'All' && room.type?.toLowerCase() !== selectedType.toLowerCase()) {
                    return false;
                }
                if (availableOnly && !room.is_availables) {
                    return false;
                }
                return true;
            })
            .sort((a, b) => {
                if (sortOrder === 'asc') return (a.rent || 0) - (b.rent || 0);
                if (sortOrder === 'desc') return (b.rent || 0) - (a.rent || 0);
                return (a.room_number || 0) - (b.room_number || 0);
            });
    }, [rooms, selectedType, availableOnly, sortOrder]);

    const roomTypes = ['All', 'Single', 'Shared', 'Double', 'Master Bed'];

    return (
        <div className="w-full min-h-screen bg-base-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs font-semibold text-base-content/60">
                    <Link to="/property" className="hover:text-primary flex items-center gap-1">
                        <HiArrowLeft /> All Properties
                    </Link>
                    <span>/</span>
                    <span className="text-base-content line-clamp-1">{property?.title || `Property #${id}`}</span>
                </div>

                {/* Property Showcase Hero Card */}
                {property && (
                    <div className="bg-base-200/50 backdrop-blur-md rounded-3xl overflow-hidden border border-base-200 shadow-md">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                            {/* Photo */}
                            <div className="lg:col-span-5 h-64 lg:h-auto relative bg-base-300">
                                <img
                                    src={property.cover_img}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="badge badge-neutral bg-black/60 backdrop-blur-md text-white border-0 py-2.5 px-3 text-xs font-bold">
                                        {property.type}
                                    </span>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                                <div>
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <h1 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
                                            {property.title}
                                        </h1>
                                        <span
                                            className={`badge text-xs font-bold px-3 py-2 border-0 ${
                                                property.status?.toLowerCase() === 'available'
                                                    ? 'bg-emerald-500/15 text-emerald-600'
                                                    : 'bg-rose-500/15 text-rose-600'
                                            }`}
                                        >
                                            {property.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-base-content/70 mt-2 font-medium">
                                        <HiOutlineMapPin className="text-primary text-base shrink-0" />
                                        <span>{property.address}, {property.upazila}, {property.district}</span>
                                    </div>

                                    <p className="text-xs sm:text-sm text-base-content/75 mt-4 leading-relaxed line-clamp-3">
                                        {property.description || "Spacious, modern property with fully equipped living facilities, attached washrooms, and high-speed broadband internet."}
                                    </p>
                                </div>

                                {/* Metadata Pills */}
                                <div className="pt-4 border-t border-base-300/60 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="bg-base-100 p-2.5 rounded-xl border border-base-200">
                                        <div className="text-[10px] text-base-content/50 uppercase font-bold">Total Rooms</div>
                                        <div className="text-sm font-extrabold text-base-content">{property.total_room}</div>
                                    </div>
                                    <div className="bg-base-100 p-2.5 rounded-xl border border-base-200">
                                        <div className="text-[10px] text-base-content/50 uppercase font-bold">Available</div>
                                        <div className="text-sm font-extrabold text-emerald-600">{property.available_room}</div>
                                    </div>
                                    <div className="bg-base-100 p-2.5 rounded-xl border border-base-200 col-span-2">
                                        <div className="text-[10px] text-base-content/50 uppercase font-bold">Landlord / Contact</div>
                                        <div className="text-xs font-bold text-base-content truncate">{property.owner_name || "Verified Landlord"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filter & Sort Bar */}
                <div className="bg-base-200/40 p-4 rounded-2xl border border-base-200 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Types */}
                    <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                        <span className="text-xs font-bold text-base-content/60 mr-1 flex items-center gap-1">
                            <MdMeetingRoom className="text-sm" /> Type:
                        </span>
                        {roomTypes.map(type => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    selectedType === type
                                        ? 'bg-primary text-primary-content shadow-xs'
                                        : 'bg-base-100 text-base-content/70 hover:bg-base-300'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    {/* Toggle and Sort */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-base-content/80">
                            <input
                                type="checkbox"
                                checked={availableOnly}
                                onChange={(e) => setAvailableOnly(e.target.checked)}
                                className="checkbox checkbox-primary checkbox-xs rounded"
                            />
                            <span>Available Only</span>
                        </label>

                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="select select-sm select-bordered rounded-xl text-xs bg-base-100 cursor-pointer"
                        >
                            <option value="asc">Rent: Low to High</option>
                            <option value="desc">Rent: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Room Cards Grid */}
                <div>
                    <h2 className="text-xl font-bold text-base-content mb-4 flex items-center gap-2">
                        <span>Available Rooms In This Property</span>
                        <span className="badge badge-sm badge-primary">{filteredRooms.length}</span>
                    </h2>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(idx => (
                                <div key={idx} className="card bg-base-100 border border-base-200 rounded-2xl p-5 shadow-sm animate-pulse space-y-4">
                                    <div className="h-48 bg-base-300 rounded-xl w-full"></div>
                                    <div className="h-4 bg-base-300 rounded w-1/2"></div>
                                    <div className="h-3 bg-base-300 rounded w-3/4"></div>
                                    <div className="h-8 bg-base-300 rounded-xl mt-4"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredRooms.length === 0 ? (
                        <div className="text-center py-16 bg-base-200/30 rounded-3xl border border-dashed border-base-300 p-8">
                            <div className="text-5xl mb-3">🚪</div>
                            <h3 className="text-lg font-bold text-base-content">No rooms match your filter</h3>
                            <p className="text-xs text-base-content/60 mt-1">Try resetting the room type or availability filter.</p>
                            <button
                                onClick={() => {
                                    setSelectedType('All');
                                    setAvailableOnly(false);
                                }}
                                className="btn btn-primary btn-sm rounded-xl mt-4 px-6 font-bold"
                            >
                                Show All Rooms
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRooms.map(room => {
                                const occupancyPct = Math.min(100, Math.round(((room.current_members || 0) / (room.capacity || 1)) * 100));
                                const isRoomAvailable = room.is_availables && (room.current_members || 0) < (room.capacity || 1);

                                return (
                                    <div
                                        key={room.id}
                                        className="card bg-base-100 rounded-2xl border border-base-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                                    >
                                        {/* Image */}
                                        <figure className="relative h-52 w-full bg-base-300 overflow-hidden">
                                            <img
                                                src={
                                                    room.cover_img ||
                                                    "https://images.unsplash.com/photo-1560185008-b033106af5c3?q=80&w=800"
                                                }
                                                alt={`Room ${room.room_number}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                                loading="lazy"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <span className="badge badge-neutral bg-black/60 backdrop-blur-md text-white border-0 text-xs font-bold py-2.5 px-3">
                                                    {room.type} Room
                                                </span>
                                            </div>

                                            <div className="absolute top-3 right-3">
                                                <span
                                                    className={`badge text-xs font-bold border-0 py-2.5 px-3 ${
                                                        isRoomAvailable
                                                            ? "bg-emerald-500 text-white shadow-sm"
                                                            : "bg-rose-500 text-white shadow-sm"
                                                    }`}
                                                >
                                                    {isRoomAvailable ? "Available" : "Occupied"}
                                                </span>
                                            </div>

                                            <div className="absolute bottom-3 left-3 text-white text-xs font-extrabold drop-shadow-md">
                                                Room #{room.room_number}
                                            </div>
                                        </figure>

                                        {/* Card Body */}
                                        <div className="card-body p-5 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-xl font-black text-base-content">
                                                        ৳{room.rent?.toLocaleString()}
                                                        <span className="text-xs text-base-content/60 font-normal"> /month</span>
                                                    </h3>
                                                </div>
                                                <span className="text-xs font-semibold text-primary px-2.5 py-1 bg-primary/10 rounded-full">
                                                    #{room.room_number}
                                                </span>
                                            </div>

                                            {/* Capacity & Occupancy Meter */}
                                            <div className="space-y-1.5 bg-base-200/40 p-3 rounded-xl border border-base-200">
                                                <div className="flex justify-between text-xs font-medium text-base-content/80">
                                                    <span className="flex items-center gap-1">
                                                        <FaUserFriends className="text-secondary text-xs" />
                                                        Occupancy:
                                                    </span>
                                                    <span className="font-bold">
                                                        {room.current_members || 0} / {room.capacity || 1} Persons
                                                    </span>
                                                </div>
                                                <div className="w-full bg-base-300 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-500 ${
                                                            occupancyPct >= 100
                                                                ? 'bg-rose-500'
                                                                : occupancyPct > 50
                                                                ? 'bg-amber-500'
                                                                : 'bg-emerald-500'
                                                        }`}
                                                        style={{ width: `${occupancyPct}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="pt-2">
                                                <Link
                                                    to={`/room-details/${room.id}`}
                                                    className="btn btn-primary btn-sm w-full rounded-xl font-bold flex items-center justify-center gap-2 group-hover:shadow-md group-hover:shadow-primary/25 transition-all"
                                                >
                                                    <span>View Details & Book</span>
                                                    <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
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

export default ViewRoom;
