import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { AuthContext } from '../../context/AuthProvider';
import { baseurl } from '../../services/BaseUrl';
import {
    HiMagnifyingGlass,
    HiOutlineTrash,
    HiOutlineEye
} from "react-icons/hi2";
import { FaBed } from "react-icons/fa";
import toast from 'react-hot-toast';

const AdminRooms = () => {
    const { accessToken } = useContext(AuthContext);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const loadRooms = async () => {
        if (!accessToken) return;
        setLoading(true);
        try {
            const res = await fetch(`${baseurl}/admin/rooms`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRooms(data || []);
            } else {
                toast.error("Failed to load rooms");
            }
        } catch (err) {
            console.error("Error loading rooms:", err);
            toast.error("Network error loading rooms");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRooms();
    }, [accessToken]);

    const handleDeleteRoom = async () => {
        if (!deleteTarget) return;
        setActionLoadingId(deleteTarget.id);
        try {
            const res = await fetch(`${baseurl}/admin/rooms/${deleteTarget.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "Room removed successfully");
                setRooms(prev => prev.filter(r => r.id !== deleteTarget.id));
                setDeleteTarget(null);
            } else {
                toast.error(data.detail || "Failed to delete room");
            }
        } catch (err) {
            console.error(err);
            toast.error("Network error deleting room");
        } finally {
            setActionLoadingId(null);
        }
    };

    const filteredRooms = rooms.filter(r => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            r.property_title?.toLowerCase().includes(q) ||
            r.owner_name?.toLowerCase().includes(q) ||
            r.room_number?.toString().includes(q) ||
            r.type?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-base-content tracking-tight flex items-center gap-2.5">
                        <span>Room Inventory Management</span>
                        <span className="badge badge-accent font-black text-xs">{rooms.length} Total</span>
                    </h1>
                    <p className="text-sm text-base-content/65 mt-1">
                        Full listing of all rental units, pricing, capacity, and current occupancy.
                    </p>
                </div>

                <div className="relative">
                    <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 text-base" />
                    <input
                        type="text"
                        placeholder="Filter by property, landlord, room #..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input input-sm input-bordered rounded-2xl pl-10 pr-3 text-xs w-64 bg-base-100"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="card bg-base-100 border border-base-200 rounded-3xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <span className="loading loading-spinner loading-lg text-accent"></span>
                        <p className="mt-3 text-xs font-bold text-base-content/60 uppercase">Loading rooms inventory...</p>
                    </div>
                ) : filteredRooms.length === 0 ? (
                    <div className="p-12 text-center text-xs text-base-content/60">
                        No rooms found matching search criteria.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="bg-base-200/50 text-base-content/70 text-xs font-bold">
                                    <th>Room & Photo</th>
                                    <th>Property</th>
                                    <th>Landlord</th>
                                    <th>Rent / Month</th>
                                    <th>Occupancy</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRooms.map(r => (
                                    <tr key={r.id} className="hover:bg-base-200/40 transition-colors">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={r.cover_img}
                                                    alt={`Room ${r.room_number}`}
                                                    className="w-12 h-12 rounded-xl object-cover border border-base-200 shrink-0"
                                                />
                                                <div>
                                                    <div className="font-bold text-sm text-base-content flex items-center gap-1.5">
                                                        <FaBed className="text-primary text-xs" />
                                                        Room #{r.room_number}
                                                    </div>
                                                    <span className="text-[11px] text-base-content/60 font-semibold uppercase">
                                                        {r.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="font-bold text-xs text-base-content line-clamp-1">
                                                {r.property_title}
                                            </div>
                                            <div className="text-[11px] text-base-content/50 line-clamp-1">
                                                {r.property_address}
                                            </div>
                                        </td>

                                        <td className="text-xs font-semibold text-base-content">
                                            {r.owner_name}
                                        </td>

                                        <td className="text-xs font-mono font-bold text-primary">
                                            ৳{r.rent?.toLocaleString()}
                                        </td>

                                        <td>
                                            <div className="text-xs font-semibold text-base-content">
                                                {r.current_members} / {r.capacity} Occupied
                                            </div>
                                            <div className="w-20 bg-base-200 rounded-full h-1.5 mt-1 overflow-hidden">
                                                <div
                                                    className="bg-accent h-full rounded-full"
                                                    style={{ width: `${Math.min(100, (r.current_members / (r.capacity || 1)) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </td>

                                        <td>
                                            <span className={`badge badge-sm font-bold uppercase ${
                                                r.is_availables ? 'badge-success text-white' : 'badge-neutral'
                                            }`}>
                                                {r.is_availables ? 'Available' : 'Full / Closed'}
                                            </span>
                                        </td>

                                        <td className="text-right space-x-1.5">
                                            <Link
                                                to={`/room-details/${r.id}`}
                                                target="_blank"
                                                className="btn btn-ghost btn-xs rounded-lg font-bold"
                                                title="View Room Page"
                                            >
                                                <HiOutlineEye className="text-sm" />
                                            </Link>

                                            <button
                                                disabled={actionLoadingId === r.id}
                                                onClick={() => setDeleteTarget(r)}
                                                className="btn btn-ghost btn-xs text-error font-bold rounded-lg hover:bg-error/10"
                                                title="Delete Room"
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
                                Delete Room #{deleteTarget.room_number}?
                            </h3>
                        </div>

                        <p className="text-xs text-base-content/70 leading-relaxed">
                            Are you sure you want to delete Room #{deleteTarget.room_number} in <strong>{deleteTarget.property_title}</strong>? Any active bookings for this room will be cancelled.
                        </p>

                        <div className="modal-action flex items-center justify-end gap-2 pt-2">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="btn btn-ghost btn-sm rounded-xl font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={actionLoadingId === deleteTarget.id}
                                onClick={handleDeleteRoom}
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

export default AdminRooms;
