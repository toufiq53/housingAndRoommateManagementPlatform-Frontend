import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { AuthContext } from '../../context/AuthProvider';
import { baseurl } from '../../services/BaseUrl';
import {
    HiOutlineBuildingOffice2,
    HiMagnifyingGlass,
    HiOutlineTrash,
    HiOutlineEye,
    HiOutlineMapPin,
    HiOutlineUser
} from "react-icons/hi2";
import toast from 'react-hot-toast';

const AdminProperties = () => {
    const { accessToken } = useContext(AuthContext);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const loadProperties = async () => {
        if (!accessToken) return;
        setLoading(true);
        try {
            const res = await fetch(`${baseurl}/admin/properties?status=${statusFilter}&search=${encodeURIComponent(searchQuery)}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProperties(data || []);
            } else {
                toast.error("Failed to load properties");
            }
        } catch (err) {
            console.error("Error loading properties:", err);
            toast.error("Network error loading properties");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProperties();
    }, [accessToken, statusFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        loadProperties();
    };

    const handleToggleStatus = async (propertyId, currentStatus) => {
        const nextStatus = currentStatus === 'available' ? 'unavailable' : 'available';
        setActionLoadingId(propertyId);
        try {
            const res = await fetch(`${baseurl}/admin/properties/${propertyId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({ status: nextStatus })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || `Status changed to ${nextStatus}`);
                setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, status: nextStatus } : p));
            } else {
                toast.error(data.detail || "Failed to update property status");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error updating status");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDeleteProperty = async () => {
        if (!deleteTarget) return;
        setActionLoadingId(deleteTarget.id);
        try {
            const res = await fetch(`${baseurl}/admin/properties/${deleteTarget.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "Property and associated rooms deleted");
                setProperties(prev => prev.filter(p => p.id !== deleteTarget.id));
                setDeleteTarget(null);
            } else {
                toast.error(data.detail || "Failed to delete property");
            }
        } catch (err) {
            console.error(err);
            toast.error("Network error deleting property");
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-base-content tracking-tight flex items-center gap-2.5">
                        <span>Properties Management</span>
                        <span className="badge badge-accent font-black text-xs">{properties.length} Total</span>
                    </h1>
                    <p className="text-sm text-base-content/65 mt-1">
                        Platform-wide property oversight across all registered landlords.
                    </p>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <div className="relative">
                        <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 text-base" />
                        <input
                            type="text"
                            placeholder="Search title, district, address..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input input-sm input-bordered rounded-2xl pl-10 pr-3 text-xs w-64 bg-base-100"
                        />
                    </div>
                    <button type="submit" className="btn btn-sm btn-accent rounded-xl font-bold">
                        Search
                    </button>
                </form>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-base-200 pb-3">
                {['all', 'available', 'unavailable'].map(s => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`btn btn-sm rounded-2xl font-bold capitalize transition-all ${
                            statusFilter === s
                                ? 'btn-accent text-accent-content shadow-md shadow-accent/20'
                                : 'btn-ghost text-base-content/70'
                        }`}
                    >
                        {s === 'all' ? 'All Status' : s}
                    </button>
                ))}
            </div>

            {/* Table or Cards */}
            <div className="card bg-base-100 border border-base-200 rounded-3xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <span className="loading loading-spinner loading-lg text-accent"></span>
                        <p className="mt-3 text-xs font-bold text-base-content/60 uppercase">Loading properties...</p>
                    </div>
                ) : properties.length === 0 ? (
                    <div className="p-12 text-center text-xs text-base-content/60">
                        No properties found matching current filters.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="bg-base-200/50 text-base-content/70 text-xs font-bold">
                                    <th>Property</th>
                                    <th>Landlord</th>
                                    <th>Location</th>
                                    <th>Rooms</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.map(p => {
                                    const isAvailable = p.status === 'available';

                                    return (
                                        <tr key={p.id} className="hover:bg-base-200/40 transition-colors">
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={p.cover_img}
                                                        alt={p.title}
                                                        className="w-12 h-12 rounded-xl object-cover border border-base-200 shrink-0"
                                                    />
                                                    <div>
                                                        <div className="font-bold text-sm text-base-content line-clamp-1">
                                                            {p.title}
                                                        </div>
                                                        <div className="text-[11px] text-base-content/60 font-semibold uppercase tracking-wider">
                                                            Type: {p.type}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="font-bold text-xs text-base-content flex items-center gap-1">
                                                    <HiOutlineUser className="text-xs text-primary" />
                                                    {p.owner_name}
                                                </div>
                                                <div className="text-[11px] text-base-content/60 font-mono">
                                                    {p.owner_email}
                                                </div>
                                            </td>

                                            <td>
                                                <div className="text-xs text-base-content flex items-center gap-1">
                                                    <HiOutlineMapPin className="text-xs text-secondary shrink-0" />
                                                    <span>{p.district}, {p.upazila}</span>
                                                </div>
                                                <div className="text-[11px] text-base-content/50 line-clamp-1">
                                                    {p.address}
                                                </div>
                                            </td>

                                            <td>
                                                <div className="text-xs font-semibold text-base-content">
                                                    {p.available_room} / {p.total_room} Available
                                                </div>
                                                <div className="text-[11px] text-base-content/50">
                                                    {p.rooms_count} Rooms Configured
                                                </div>
                                            </td>

                                            <td>
                                                <button
                                                    disabled={actionLoadingId === p.id}
                                                    onClick={() => handleToggleStatus(p.id, p.status)}
                                                    className={`badge badge-sm font-bold uppercase cursor-pointer hover:opacity-80 transition-opacity ${
                                                        isAvailable ? 'badge-success text-white' : 'badge-neutral'
                                                    }`}
                                                    title="Click to toggle status"
                                                >
                                                    {p.status}
                                                </button>
                                            </td>

                                            <td className="text-right space-x-1.5">
                                                <Link
                                                    to={`/properties-room/${p.id}`}
                                                    target="_blank"
                                                    className="btn btn-ghost btn-xs rounded-lg font-bold"
                                                    title="View Public Listing"
                                                >
                                                    <HiOutlineEye className="text-sm" />
                                                </Link>

                                                <button
                                                    disabled={actionLoadingId === p.id}
                                                    onClick={() => setDeleteTarget(p)}
                                                    className="btn btn-ghost btn-xs text-error font-bold rounded-lg hover:bg-error/10"
                                                    title="Delete Property"
                                                >
                                                    <HiOutlineTrash className="text-sm" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
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
                                Delete Property Listing?
                            </h3>
                        </div>

                        <p className="text-xs text-base-content/70 leading-relaxed">
                            Are you sure you want to permanently delete <strong>{deleteTarget.title}</strong> owned by <strong>{deleteTarget.owner_name}</strong>? All rooms and tenant bookings under this property will also be purged.
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
                                onClick={handleDeleteProperty}
                                className="btn btn-error btn-sm rounded-xl font-bold text-white shadow-md shadow-error/20"
                            >
                                Delete Property
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProperties;
