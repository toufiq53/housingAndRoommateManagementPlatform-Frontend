import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { baseurl } from '../../services/BaseUrl';
import {
    HiMagnifyingGlass,
    HiOutlineTrash,
    HiOutlineMapPin,
    HiOutlineBriefcase,
    HiOutlineBanknotes
} from "react-icons/hi2";
import { FaUserFriends } from "react-icons/fa";
import toast from 'react-hot-toast';

const AdminRoommates = () => {
    const { accessToken } = useContext(AuthContext);
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const loadProfiles = async () => {
        if (!accessToken) return;
        setLoading(true);
        try {
            const res = await fetch(`${baseurl}/admin/roommate-profiles`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProfiles(data || []);
            } else {
                toast.error("Failed to load roommate seeker profiles");
            }
        } catch (err) {
            console.error("Error loading profiles:", err);
            toast.error("Network error loading roommate profiles");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfiles();
    }, [accessToken]);

    const handleToggleStatus = async (profileId, currentStatus) => {
        const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
        setActionLoadingId(profileId);
        try {
            const res = await fetch(`${baseurl}/admin/roommate-profiles/${profileId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({ status: nextStatus })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || `Status updated to ${nextStatus}`);
                setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, status: nextStatus } : p));
            } else {
                toast.error(data.detail || "Failed to update profile status");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error updating status");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDeleteProfile = async () => {
        if (!deleteTarget) return;
        setActionLoadingId(deleteTarget.id);
        try {
            const res = await fetch(`${baseurl}/admin/roommate-profiles/${deleteTarget.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "Roommate seeker post removed");
                setProfiles(prev => prev.filter(p => p.id !== deleteTarget.id));
                setDeleteTarget(null);
            } else {
                toast.error(data.detail || "Failed to delete profile");
            }
        } catch (err) {
            console.error(err);
            toast.error("Network error deleting roommate profile");
        } finally {
            setActionLoadingId(null);
        }
    };

    const filteredProfiles = profiles.filter(p => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            p.name?.toLowerCase().includes(q) ||
            p.renting_location?.toLowerCase().includes(q) ||
            p.occupation?.toLowerCase().includes(q) ||
            p.gender?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-base-content tracking-tight flex items-center gap-2.5">
                        <span>Roommate Seekers Directory</span>
                        <span className="badge badge-accent font-black text-xs">{profiles.length} Profiles</span>
                    </h1>
                    <p className="text-sm text-base-content/65 mt-1">
                        Review community roommate seeker posts, adjust visibility, and remove inappropriate content.
                    </p>
                </div>

                <div className="relative">
                    <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 text-base" />
                    <input
                        type="text"
                        placeholder="Search location, name, occupation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input input-sm input-bordered rounded-2xl pl-10 pr-3 text-xs w-64 bg-base-100"
                    />
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                    <span className="loading loading-spinner loading-lg text-accent"></span>
                    <p className="mt-3 text-xs font-bold text-base-content/60 uppercase">Loading roommate posts...</p>
                </div>
            ) : filteredProfiles.length === 0 ? (
                <div className="card bg-base-100 border border-base-200 rounded-3xl p-12 text-center text-xs text-base-content/60">
                    No roommate seeker posts found.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProfiles.map(p => {
                        const isActive = p.status === 'active';

                        return (
                            <div
                                key={p.id}
                                className="card bg-base-100 border border-base-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-secondary/20 to-primary/20 text-secondary font-black text-base flex items-center justify-center shadow-xs">
                                                {p.profile_img ? (
                                                    <img src={p.profile_img} alt={p.name} className="w-full h-full rounded-2xl object-cover" />
                                                ) : (
                                                    p.name[0]?.toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-base text-base-content leading-tight">
                                                    {p.name}
                                                </h4>
                                                <span className="text-xs text-base-content/60 capitalize">
                                                    {p.gender} • {p.age} yrs
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            disabled={actionLoadingId === p.id}
                                            onClick={() => handleToggleStatus(p.id, p.status)}
                                            className={`badge badge-sm font-bold uppercase cursor-pointer hover:opacity-80 ${
                                                isActive ? 'badge-success text-white' : 'badge-neutral'
                                            }`}
                                            title="Click to toggle status"
                                        >
                                            {p.status}
                                        </button>
                                    </div>

                                    <div className="bg-base-200/50 rounded-2xl p-3 space-y-1.5 text-xs">
                                        <div className="flex items-center gap-2 text-base-content/75">
                                            <HiOutlineMapPin className="text-sm shrink-0 text-primary" />
                                            <span>Looking in: <strong>{p.renting_location}</strong></span>
                                        </div>
                                        <div className="flex items-center gap-2 text-base-content/75">
                                            <HiOutlineBriefcase className="text-sm shrink-0 text-secondary" />
                                            <span>Occupation: <strong>{p.occupation}</strong></span>
                                        </div>
                                        <div className="flex items-center gap-2 text-base-content/75">
                                            <HiOutlineBanknotes className="text-sm shrink-0 text-success" />
                                            <span>Budget: <strong className="font-mono text-base-content">৳{p.budget?.toLocaleString()} / mo</strong></span>
                                        </div>
                                        {p.description && (
                                            <p className="text-[11px] text-base-content/60 pt-1.5 border-t border-base-200 line-clamp-2">
                                                "{p.description}"
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-base-200 flex items-center justify-between">
                                    <span className="text-[11px] text-base-content/50 font-mono">
                                        @{p.username}
                                    </span>

                                    <button
                                        disabled={actionLoadingId === p.id}
                                        onClick={() => setDeleteTarget(p)}
                                        className="btn btn-ghost btn-xs text-error font-bold rounded-lg hover:bg-error/10"
                                        title="Delete Seeker Profile"
                                    >
                                        <HiOutlineTrash className="text-sm" />
                                        Delete Post
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Delete Modal */}
            {deleteTarget && (
                <div className="modal modal-open">
                    <div className="modal-box rounded-3xl border border-base-200 max-w-sm p-6 space-y-4">
                        <div className="flex items-center gap-2 text-error">
                            <HiOutlineTrash className="text-2xl" />
                            <h3 className="font-black text-lg text-base-content">
                                Delete Roommate Post?
                            </h3>
                        </div>

                        <p className="text-xs text-base-content/70 leading-relaxed">
                            Are you sure you want to remove the seeker profile for <strong>{deleteTarget.name}</strong>?
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
                                onClick={handleDeleteProfile}
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

export default AdminRoommates;
