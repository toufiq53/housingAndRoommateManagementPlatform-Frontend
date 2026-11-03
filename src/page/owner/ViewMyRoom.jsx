import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { Link, useParams } from 'react-router';
import { baseurl } from '../../services/BaseUrl';
import toast from 'react-hot-toast';
import {
    HiArrowLeft,
    HiOutlinePlusCircle,
    HiOutlineTrash,
    HiOutlinePencilSquare,
    HiXMark
} from "react-icons/hi2";
import { FaUserFriends } from "react-icons/fa";

const ViewMyRoom = () => {
    const { id } = useParams(); // property_id
    const { accessToken } = useContext(AuthContext);

    const [property, setProperty] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        property_id: Number(id),
        room_number: '',
        rent: '',
        type: 'Single',
        is_availables: true,
        capacity: 1,
        current_members: 0,
        cover_img: ''
    });

    const fetchPropertyAndRooms = () => {
        setLoading(true);

        // Fetch property
        fetch(`${baseurl}/owner/specific_property/${id}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data && data.id) setProperty(data);
            })
            .catch(() => {});

        // Fetch rooms
        fetch(`${baseurl}/specific_properties/${id}/all_room`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
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
                console.error(err);
                setRooms([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (id && accessToken) {
            fetchPropertyAndRooms();
        }
    }, [id, accessToken]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'room_number' || name === 'rent' || name === 'capacity' || name === 'current_members'
                ? Number(value)
                : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.room_number || !formData.rent) {
            toast.error("Please provide room number and rent");
            return;
        }

        try {
            const payload = {
                ...formData,
                property_id: Number(id)
            };

            const res = await fetch(`${baseurl}/owner/create_room`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.detail || "Failed to create room");
                return;
            }

            toast.success(data.message || "Room created successfully!");
            setIsModalOpen(false);
            setFormData({
                property_id: Number(id),
                room_number: '',
                rent: '',
                type: 'Single',
                is_availables: true,
                capacity: 1,
                current_members: 0,
                cover_img: ''
            });
            fetchPropertyAndRooms();
        } catch (error) {
            console.error(error);
            toast.error("Network error while creating room");
        }
    };

    const deleteRoom = async (room_id, room_num) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete Room #${room_num}?`);
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${baseurl}/owner/delete_room/${room_id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message || "Room deleted successfully");
                fetchPropertyAndRooms();
            } else {
                toast.error(data.detail || "Failed to delete room");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error while deleting room");
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Top Navigation */}
            <div className="flex items-center gap-2 text-xs font-semibold text-base-content/60">
                <Link to="/owner/manage-property" className="hover:text-primary flex items-center gap-1">
                    <HiArrowLeft /> Back to Properties
                </Link>
                <span>/</span>
                <span className="text-base-content font-bold">{property?.title || `Property #${id}`}</span>
            </div>

            {/* Header Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-6 rounded-3xl border border-base-200 shadow-sm">
                <div>
                    <span className="text-xs uppercase font-extrabold tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
                        Room Inventory
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-base-content mt-1">
                        {property?.title || "Property Rooms"}
                    </h1>
                    <p className="text-xs text-base-content/60 mt-0.5">
                        Manage room numbers, rent, capacity, and current tenants.
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary btn-sm rounded-xl font-bold flex items-center gap-2 shadow-md shadow-primary/25 cursor-pointer self-start sm:self-auto"
                >
                    <HiOutlinePlusCircle className="text-base" />
                    <span>Add New Room</span>
                </button>
            </div>

            {/* Rooms Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : rooms.length === 0 ? (
                <div className="text-center py-20 bg-base-100 rounded-3xl border border-dashed border-base-200 p-8 space-y-3">
                    <div className="text-5xl">🚪</div>
                    <h2 className="text-xl font-bold text-base-content">No Rooms Added Yet</h2>
                    <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                        Add the individual rooms available in this property to let tenants start booking.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-primary btn-sm rounded-xl font-bold mt-2 px-6"
                    >
                        + Add First Room
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map(room => {
                        const occupancyPct = Math.min(100, Math.round(((room.current_members || 0) / (room.capacity || 1)) * 100));

                        return (
                            <div
                                key={room.id}
                                className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
                            >
                                <figure className="relative h-48 bg-base-300">
                                    <img
                                        src={
                                            room.cover_img ||
                                            "https://images.unsplash.com/photo-1560185008-b033106af5c3?q=80&w=600"
                                        }
                                        alt={`Room ${room.room_number}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="badge badge-neutral bg-black/60 backdrop-blur-md text-white border-0 text-xs font-bold py-2.5 px-3">
                                            Room #{room.room_number}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <span className={`badge text-xs font-bold border-0 py-2.5 px-3 ${
                                            room.is_availables ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                                        }`}>
                                            {room.is_availables ? 'Available' : 'Full'}
                                        </span>
                                    </div>
                                </figure>

                                <div className="card-body p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-xs uppercase font-extrabold text-primary">{room.type} Room</span>
                                            <h3 className="text-2xl font-black text-base-content">
                                                ৳{room.rent?.toLocaleString()}
                                                <span className="text-xs text-base-content/60 font-normal"> /mo</span>
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Occupancy Indicator */}
                                    <div className="space-y-1.5 bg-base-200/50 p-3 rounded-2xl border border-base-200 text-xs">
                                        <div className="flex justify-between font-semibold text-base-content/80">
                                            <span className="flex items-center gap-1">
                                                <FaUserFriends className="text-secondary" /> Occupancy:
                                            </span>
                                            <span className="font-bold">
                                                {room.current_members || 0} / {room.capacity || 1}
                                            </span>
                                        </div>
                                        <div className="w-full bg-base-300 rounded-full h-2 overflow-hidden">
                                            <div
                                                className={`h-2 rounded-full ${
                                                    occupancyPct >= 100 ? 'bg-rose-500' : 'bg-emerald-500'
                                                }`}
                                                style={{ width: `${occupancyPct}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-base-200">
                                        <Link
                                            to={`/owner/room-edit/${room.id}`}
                                            className="btn btn-outline btn-xs rounded-xl font-bold flex-1"
                                        >
                                            <HiOutlinePencilSquare /> Edit Room
                                        </Link>
                                        <button
                                            onClick={() => deleteRoom(room.id, room.room_number)}
                                            className="btn btn-ghost btn-xs text-error rounded-xl"
                                            title="Delete Room"
                                        >
                                            <HiOutlineTrash className="text-base" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Room Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                    <div className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-lg border border-base-200">
                        <div className="flex justify-between items-center p-6 border-b border-base-200">
                            <div>
                                <h3 className="text-xl font-black text-base-content">Add New Room</h3>
                                <p className="text-xs text-base-content/60 mt-0.5">Specify room number, rent, and capacity.</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="btn btn-ghost btn-circle btn-sm"
                            >
                                <HiXMark className="text-lg" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                        Room Number *
                                    </label>
                                    <input
                                        type="number"
                                        name="room_number"
                                        value={formData.room_number}
                                        onChange={handleChange}
                                        placeholder="e.g. 101"
                                        className="input input-bordered input-sm w-full rounded-xl"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                        Monthly Rent (৳) *
                                    </label>
                                    <input
                                        type="number"
                                        name="rent"
                                        value={formData.rent}
                                        onChange={handleChange}
                                        placeholder="e.g. 8000"
                                        className="input input-bordered input-sm w-full rounded-xl"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                        Room Type
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="select select-bordered select-sm w-full rounded-xl"
                                    >
                                        <option value="Single">Single</option>
                                        <option value="Shared">Shared</option>
                                        <option value="Double">Double</option>
                                        <option value="Master Bed">Master Bed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                        Capacity (Persons) *
                                    </label>
                                    <input
                                        type="number"
                                        name="capacity"
                                        value={formData.capacity}
                                        onChange={handleChange}
                                        min="1"
                                        className="input input-bordered input-sm w-full rounded-xl"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                        Current Occupants
                                    </label>
                                    <input
                                        type="number"
                                        name="current_members"
                                        value={formData.current_members}
                                        onChange={handleChange}
                                        min="0"
                                        max={formData.capacity}
                                        className="input input-bordered input-sm w-full rounded-xl"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                        Availability
                                    </label>
                                    <select
                                        name="is_availables"
                                        value={formData.is_availables.toString()}
                                        onChange={(e) => setFormData(prev => ({ ...prev, is_availables: e.target.value === 'true' }))}
                                        className="select select-bordered select-sm w-full rounded-xl"
                                    >
                                        <option value="true">Available</option>
                                        <option value="false">Unavailable</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                    Cover Image URL (optional)
                                </label>
                                <input
                                    type="url"
                                    name="cover_img"
                                    value={formData.cover_img}
                                    onChange={handleChange}
                                    placeholder="https://images.unsplash.com/..."
                                    className="input input-bordered input-sm w-full rounded-xl"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-base-200">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn btn-ghost btn-sm rounded-xl font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-sm rounded-xl font-bold px-6 shadow-md shadow-primary/25"
                                >
                                    Add Room
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewMyRoom;
