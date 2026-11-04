import React, { useContext, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';
import { AuthContext } from '../../context/AuthProvider';
import { baseurl } from '../../services/BaseUrl';
import {
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineClock,
    HiMagnifyingGlass,
    HiOutlinePhone,
    HiOutlineEnvelope,
    HiOutlineBuildingOffice2,
    HiOutlineUser
} from "react-icons/hi2";
import toast from 'react-hot-toast';

const AdminOwnerRequests = () => {
    const { accessToken } = useContext(AuthContext);
    const { fetchAdminAlerts } = useOutletContext();
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'rejected', 'all'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    const loadOwners = async () => {
        if (!accessToken) return;
        setLoading(true);
        try {
            const statusParam = activeTab === 'all' ? 'all' : activeTab;
            const res = await fetch(`${baseurl}/admin/owners?status=${statusParam}&search=${encodeURIComponent(searchQuery)}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (res.ok) {
                const data = await res.json();
                setOwners(data || []);
            } else {
                toast.error("Failed to load owner accounts");
            }
        } catch (err) {
            console.error("Error loading owners:", err);
            toast.error("Network error loading owners");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOwners();
    }, [accessToken, activeTab]);

    const handleSearch = (e) => {
        e.preventDefault();
        loadOwners();
    };

    const handleAction = async (ownerId, status, reason = '') => {
        setActionLoadingId(ownerId);
        try {
            const res = await fetch(`${baseurl}/admin/owners/${ownerId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({ status, reason })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || `Owner account ${status} successfully`);
                setIsRejectModalOpen(false);
                setRejectReason('');
                setSelectedOwner(null);
                loadOwners();
                fetchAdminAlerts();
            } else {
                toast.error(data.detail || `Failed to ${status} owner`);
            }
        } catch (err) {
            console.error("Error updating status:", err);
            toast.error("Network error processing status update");
        } finally {
            setActionLoadingId(null);
        }
    };

    const openRejectModal = (owner) => {
        setSelectedOwner(owner);
        setRejectReason('');
        setIsRejectModalOpen(true);
    };

    const pendingCount = owners.filter(o => o.approval_status === 'pending').length;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-base-content tracking-tight flex items-center gap-2.5">
                        <span>Owner Account Approvals</span>
                        <span className="badge badge-warning font-black text-xs">Verification Queue</span>
                    </h1>
                    <p className="text-sm text-base-content/65 mt-1">
                        Review, verify, accept, or reject property owner registrations before they can publish listings.
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <div className="relative">
                        <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 text-base" />
                        <input
                            type="text"
                            placeholder="Search name, username, email..."
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
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`btn btn-sm rounded-2xl font-bold transition-all ${
                        activeTab === 'pending'
                            ? 'btn-warning text-warning-content shadow-md shadow-warning/20'
                            : 'btn-ghost text-base-content/70'
                    }`}
                >
                    <HiOutlineClock className="text-base" />
                    <span>Pending Review</span>
                    {activeTab === 'pending' && owners.length > 0 && (
                        <span className="badge badge-sm badge-neutral font-black ml-1">
                            {owners.length}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('approved')}
                    className={`btn btn-sm rounded-2xl font-bold transition-all ${
                        activeTab === 'approved'
                            ? 'btn-success text-white shadow-md shadow-success/20'
                            : 'btn-ghost text-base-content/70'
                    }`}
                >
                    <HiOutlineCheckCircle className="text-base" />
                    <span>Approved Landlords</span>
                </button>

                <button
                    onClick={() => setActiveTab('rejected')}
                    className={`btn btn-sm rounded-2xl font-bold transition-all ${
                        activeTab === 'rejected'
                            ? 'btn-error text-white shadow-md shadow-error/20'
                            : 'btn-ghost text-base-content/70'
                    }`}
                >
                    <HiOutlineXCircle className="text-base" />
                    <span>Rejected</span>
                </button>

                <button
                    onClick={() => setActiveTab('all')}
                    className={`btn btn-sm rounded-2xl font-bold transition-all ${
                        activeTab === 'all'
                            ? 'btn-neutral shadow-md'
                            : 'btn-ghost text-base-content/70'
                    }`}
                >
                    <span>All Accounts</span>
                </button>
            </div>

            {/* Content Table or Cards */}
            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                    <span className="loading loading-spinner loading-lg text-accent"></span>
                    <p className="mt-3 text-xs font-bold text-base-content/60 uppercase tracking-wider">
                        Fetching applicant profiles...
                    </p>
                </div>
            ) : owners.length === 0 ? (
                <div className="card bg-base-100 border border-base-200 rounded-3xl p-12 text-center space-y-3">
                    <div className="w-16 h-16 rounded-3xl bg-base-200 flex items-center justify-center text-3xl mx-auto text-base-content/40">
                        {activeTab === 'pending' ? '🎉' : '📂'}
                    </div>
                    <h3 className="text-lg font-black text-base-content">
                        {activeTab === 'pending' ? 'No Pending Owner Requests!' : 'No Owners Found'}
                    </h3>
                    <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                        {activeTab === 'pending'
                            ? 'All landlord registration applications have been reviewed. When someone signs up as an owner, they will appear here.'
                            : 'There are no owner accounts matching the selected criteria.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {owners.map(owner => {
                        const isPending = owner.approval_status === 'pending';
                        const isApproved = owner.approval_status === 'approved';
                        const isRejected = owner.approval_status === 'rejected';

                        return (
                            <div
                                key={owner.id}
                                className={`card bg-base-100 border rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                                    isPending ? 'border-warning/40 ring-1 ring-warning/30 bg-warning/5' : 'border-base-200'
                                }`}
                            >
                                <div className="space-y-3">
                                    {/* Top: Avatar & Status */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent to-primary text-primary-content font-black text-base flex items-center justify-center shadow-md shadow-accent/20">
                                                {owner.firstname ? owner.firstname[0]?.toUpperCase() : 'O'}
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-base text-base-content leading-tight">
                                                    {owner.firstname} {owner.lastname}
                                                </h4>
                                                <span className="text-xs font-mono text-base-content/60">
                                                    @{owner.username}
                                                </span>
                                            </div>
                                        </div>

                                        <span className={`badge badge-sm font-extrabold uppercase tracking-wider ${
                                            isApproved ? 'badge-success text-white' : isPending ? 'badge-warning' : 'badge-error text-white'
                                        }`}>
                                            {owner.approval_status}
                                        </span>
                                    </div>

                                    {/* Applicant Details */}
                                    <div className="bg-base-200/50 rounded-2xl p-3 space-y-2 text-xs">
                                        <div className="flex items-center gap-2 text-base-content/75 truncate">
                                            <HiOutlineEnvelope className="text-sm shrink-0 text-base-content/50" />
                                            <span className="truncate">{owner.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-base-content/75">
                                            <HiOutlinePhone className="text-sm shrink-0 text-base-content/50" />
                                            <span>bKash/Nagad: <strong className="font-mono text-base-content">{owner.payment_number || '01712-345678'}</strong></span>
                                        </div>
                                        <div className="flex items-center gap-2 text-base-content/75">
                                            <HiOutlineBuildingOffice2 className="text-sm shrink-0 text-base-content/50" />
                                            <span>Properties: <strong className="text-base-content">{owner.property_count || 0}</strong> • Rooms: <strong className="text-base-content">{owner.room_count || 0}</strong></span>
                                        </div>
                                        <div className="text-[11px] text-base-content/50 pt-1 border-t border-base-200">
                                            Applied on: {owner.created_at}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-2 border-t border-base-200 flex items-center gap-2">
                                    {isPending ? (
                                        <>
                                            <button
                                                disabled={actionLoadingId === owner.id}
                                                onClick={() => handleAction(owner.id, 'approved')}
                                                className="btn btn-success btn-sm rounded-xl font-bold flex-1 text-white shadow-xs"
                                            >
                                                <HiOutlineCheckCircle className="text-base" />
                                                Accept Owner
                                            </button>
                                            <button
                                                disabled={actionLoadingId === owner.id}
                                                onClick={() => openRejectModal(owner)}
                                                className="btn btn-error btn-sm rounded-xl font-bold flex-1 text-white shadow-xs"
                                            >
                                                <HiOutlineXCircle className="text-base" />
                                                Reject
                                            </button>
                                        </>
                                    ) : isApproved ? (
                                        <div className="w-full flex items-center justify-between gap-2">
                                            <span className="text-xs font-semibold text-success flex items-center gap-1">
                                                <HiOutlineCheckCircle /> Account Verified & Active
                                            </span>
                                            <button
                                                disabled={actionLoadingId === owner.id}
                                                onClick={() => openRejectModal(owner)}
                                                className="btn btn-ghost btn-xs text-error font-bold rounded-lg hover:bg-error/10"
                                            >
                                                Revoke Access
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-full flex items-center justify-between gap-2">
                                            <span className="text-xs font-semibold text-error flex items-center gap-1">
                                                <HiOutlineXCircle /> Application Rejected
                                            </span>
                                            <button
                                                disabled={actionLoadingId === owner.id}
                                                onClick={() => handleAction(owner.id, 'approved')}
                                                className="btn btn-outline btn-success btn-xs font-bold rounded-lg"
                                            >
                                                Re-Approve
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Rejection Modal */}
            {isRejectModalOpen && selectedOwner && (
                <div className="modal modal-open">
                    <div className="modal-box rounded-3xl border border-base-200 max-w-md p-6 space-y-4">
                        <div className="flex items-center gap-3 text-error">
                            <div className="w-10 h-10 rounded-2xl bg-error/10 flex items-center justify-center text-xl">
                                <HiOutlineXCircle />
                            </div>
                            <h3 className="font-black text-lg text-base-content">
                                Reject Owner Application
                            </h3>
                        </div>

                        <p className="text-xs text-base-content/70 leading-relaxed">
                            Are you sure you want to reject the landlord account for <strong>{selectedOwner.firstname} {selectedOwner.lastname}</strong> (@{selectedOwner.username})? They will be unable to log in as a landlord.
                        </p>

                        <div>
                            <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
                                Reason or Feedback (Optional)
                            </label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="E.g., Incomplete phone number, unverified contact, duplicate account..."
                                className="textarea textarea-bordered w-full rounded-2xl text-xs h-20 bg-base-200/50"
                            ></textarea>
                        </div>

                        <div className="modal-action flex items-center justify-end gap-2 pt-2">
                            <button
                                onClick={() => setIsRejectModalOpen(false)}
                                className="btn btn-ghost btn-sm rounded-xl font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={actionLoadingId === selectedOwner.id}
                                onClick={() => handleAction(selectedOwner.id, 'rejected', rejectReason)}
                                className="btn btn-error btn-sm rounded-xl font-bold text-white"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOwnerRequests;
