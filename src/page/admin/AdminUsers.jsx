import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { baseurl } from '../../services/BaseUrl';
import {
    HiOutlineUserGroup,
    HiMagnifyingGlass,
    HiOutlineTrash,
    HiOutlinePencilSquare,
    HiOutlineCheckCircle,
    HiOutlineNoSymbol,
    HiOutlineShieldCheck
} from "react-icons/hi2";
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const { accessToken, authUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [actionLoadingId, setActionLoadingId] = useState(null);

    // Role Edit Modal
    const [selectedUser, setSelectedUser] = useState(null);
    const [targetRole, setTargetRole] = useState('user');
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

    // Delete Confirm Modal
    const [deleteUserTarget, setDeleteUserTarget] = useState(null);

    const loadUsers = async () => {
        if (!accessToken) return;
        setLoading(true);
        try {
            const res = await fetch(`${baseurl}/admin/users?role=${roleFilter}&search=${encodeURIComponent(searchQuery)}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data || []);
            } else {
                toast.error("Failed to load users list");
            }
        } catch (err) {
            console.error("Error loading users:", err);
            toast.error("Network error loading users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, [accessToken, roleFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        loadUsers();
    };

    const handleToggleStatus = async (userId, currentIsActive) => {
        if (userId === authUser?.id) {
            toast.error("You cannot deactivate your own administrative account");
            return;
        }

        setActionLoadingId(userId);
        try {
            const res = await fetch(`${baseurl}/admin/users/${userId}/status`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "User status updated");
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: data.is_active } : u));
            } else {
                toast.error(data.detail || "Failed to update status");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error updating user status");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleRoleUpdate = async () => {
        if (!selectedUser) return;
        setActionLoadingId(selectedUser.id);
        try {
            const res = await fetch(`${baseurl}/admin/users/${selectedUser.id}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({ role: targetRole })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || `User role updated to ${targetRole}`);
                setIsRoleModalOpen(false);
                setSelectedUser(null);
                loadUsers();
            } else {
                toast.error(data.detail || "Failed to update user role");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error changing role");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDeleteUser = async () => {
        if (!deleteUserTarget) return;
        setActionLoadingId(deleteUserTarget.id);
        try {
            const res = await fetch(`${baseurl}/admin/users/${deleteUserTarget.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "User deleted successfully");
                setUsers(prev => prev.filter(u => u.id !== deleteUserTarget.id));
                setDeleteUserTarget(null);
            } else {
                toast.error(data.detail || "Failed to delete user");
            }
        } catch (err) {
            console.error(err);
            toast.error("Network error deleting user");
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
                        <span>User Management Directory</span>
                        <span className="badge badge-accent font-black text-xs">Total: {users.length}</span>
                    </h1>
                    <p className="text-sm text-base-content/65 mt-1">
                        Oversee all registered accounts, change roles, activate/deactivate accounts, and remove abusive users.
                    </p>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <div className="relative">
                        <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 text-base" />
                        <input
                            type="text"
                            placeholder="Search by name, email, username..."
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
                {['all', 'user', 'owner', 'admin'].map(r => (
                    <button
                        key={r}
                        onClick={() => setRoleFilter(r)}
                        className={`btn btn-sm rounded-2xl font-bold capitalize transition-all ${
                            roleFilter === r
                                ? 'btn-accent text-accent-content shadow-md shadow-accent/20'
                                : 'btn-ghost text-base-content/70'
                        }`}
                    >
                        {r === 'all' ? 'All Roles' : r === 'user' ? 'Tenants (user)' : r === 'owner' ? 'Landlords (owner)' : 'Admins'}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="card bg-base-100 border border-base-200 rounded-3xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <span className="loading loading-spinner loading-lg text-accent"></span>
                        <p className="mt-3 text-xs font-bold text-base-content/60 uppercase">Loading users...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-12 text-center text-xs text-base-content/60">
                        No users found matching current filters.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="bg-base-200/50 text-base-content/70 text-xs font-bold">
                                    <th>User Info</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Payment No</th>
                                    <th>Registered</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => {
                                    const isSelf = u.id === authUser?.id;
                                    const isActive = u.is_active;

                                    return (
                                        <tr key={u.id} className="hover:bg-base-200/40 transition-colors">
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent/20 to-primary/20 text-accent font-black text-sm flex items-center justify-center">
                                                        {u.firstname ? u.firstname[0]?.toUpperCase() : u.username[0]?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-sm text-base-content flex items-center gap-1.5">
                                                            <span>{u.firstname} {u.lastname}</span>
                                                            {isSelf && (
                                                                <span className="badge badge-accent badge-xs font-black">You</span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-base-content/60 font-mono">
                                                            @{u.username} • {u.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <span className={`badge badge-sm font-extrabold uppercase ${
                                                    u.role === 'admin'
                                                        ? 'badge-accent'
                                                        : u.role === 'owner'
                                                            ? 'badge-primary'
                                                            : 'badge-neutral'
                                                }`}>
                                                    {u.role}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className={`badge badge-xs font-bold ${
                                                        isActive ? 'badge-success text-white' : 'badge-error text-white'
                                                    }`}>
                                                        {isActive ? 'Active' : 'Suspended'}
                                                    </span>
                                                    {u.role === 'owner' && (
                                                        <span className="text-[10px] text-base-content/60">
                                                            ({u.approval_status})
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="text-xs font-mono text-base-content/75">
                                                {u.payment_number || 'N/A'}
                                            </td>

                                            <td className="text-xs text-base-content/50">
                                                {u.created_at}
                                            </td>

                                            <td className="text-right space-x-1.5">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(u);
                                                        setTargetRole(u.role);
                                                        setIsRoleModalOpen(true);
                                                    }}
                                                    className="btn btn-ghost btn-xs rounded-lg font-bold"
                                                    title="Change Role"
                                                >
                                                    <HiOutlinePencilSquare className="text-sm" />
                                                    Role
                                                </button>

                                                {!isSelf && (
                                                    <button
                                                        disabled={actionLoadingId === u.id}
                                                        onClick={() => handleToggleStatus(u.id, isActive)}
                                                        className={`btn btn-xs rounded-lg font-bold ${
                                                            isActive ? 'btn-ghost text-warning hover:bg-warning/10' : 'btn-ghost text-success hover:bg-success/10'
                                                        }`}
                                                        title={isActive ? 'Suspend User' : 'Activate User'}
                                                    >
                                                        {isActive ? <HiOutlineNoSymbol className="text-sm" /> : <HiOutlineCheckCircle className="text-sm" />}
                                                        {isActive ? 'Suspend' : 'Activate'}
                                                    </button>
                                                )}

                                                {!isSelf && (
                                                    <button
                                                        disabled={actionLoadingId === u.id}
                                                        onClick={() => setDeleteUserTarget(u)}
                                                        className="btn btn-ghost btn-xs text-error font-bold rounded-lg hover:bg-error/10"
                                                        title="Delete User"
                                                    >
                                                        <HiOutlineTrash className="text-sm" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Change Role Modal */}
            {isRoleModalOpen && selectedUser && (
                <div className="modal modal-open">
                    <div className="modal-box rounded-3xl border border-base-200 max-w-sm p-6 space-y-4">
                        <div className="flex items-center gap-2">
                            <HiOutlineShieldCheck className="text-2xl text-accent" />
                            <h3 className="font-black text-lg text-base-content">
                                Change Role for @{selectedUser.username}
                            </h3>
                        </div>

                        <p className="text-xs text-base-content/70">
                            Select the permissions level for <strong>{selectedUser.firstname} {selectedUser.lastname}</strong>:
                        </p>

                        <div className="space-y-2">
                            {[
                                { id: 'user', label: 'Tenant / Seeker (user)', desc: 'Can browse properties, book rooms, and find roommates.' },
                                { id: 'owner', label: 'Landlord / Property Owner (owner)', desc: 'Can list properties, manage rooms, and verify bookings.' },
                                { id: 'admin', label: 'Platform Administrator (admin)', desc: 'Has full master access to all system data and settings.' }
                            ].map(item => (
                                <label
                                    key={item.id}
                                    onClick={() => setTargetRole(item.id)}
                                    className={`p-3 rounded-2xl border-2 cursor-pointer flex flex-col gap-1 transition-all ${
                                        targetRole === item.id ? 'border-accent bg-accent/10 shadow-xs' : 'border-base-200 hover:border-base-300'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-xs text-base-content">{item.label}</span>
                                        <input
                                            type="radio"
                                            name="user_role"
                                            checked={targetRole === item.id}
                                            onChange={() => setTargetRole(item.id)}
                                            className="radio radio-accent radio-xs"
                                        />
                                    </div>
                                    <span className="text-[11px] text-base-content/60">{item.desc}</span>
                                </label>
                            ))}
                        </div>

                        <div className="modal-action flex items-center justify-end gap-2 pt-2">
                            <button
                                onClick={() => setIsRoleModalOpen(false)}
                                className="btn btn-ghost btn-sm rounded-xl font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={actionLoadingId === selectedUser.id}
                                onClick={handleRoleUpdate}
                                className="btn btn-accent btn-sm rounded-xl font-bold shadow-md shadow-accent/20"
                            >
                                Save Role
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteUserTarget && (
                <div className="modal modal-open">
                    <div className="modal-box rounded-3xl border border-base-200 max-w-sm p-6 space-y-4">
                        <div className="flex items-center gap-2 text-error">
                            <HiOutlineTrash className="text-2xl" />
                            <h3 className="font-black text-lg text-base-content">
                                Permanently Delete User?
                            </h3>
                        </div>

                        <p className="text-xs text-base-content/70 leading-relaxed">
                            Are you sure you want to permanently delete <strong>{deleteUserTarget.firstname} {deleteUserTarget.lastname}</strong> (@{deleteUserTarget.username})? This action cannot be undone and will remove all their associated bookings and listings.
                        </p>

                        <div className="modal-action flex items-center justify-end gap-2 pt-2">
                            <button
                                onClick={() => setDeleteUserTarget(null)}
                                className="btn btn-ghost btn-sm rounded-xl font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={actionLoadingId === deleteUserTarget.id}
                                onClick={handleDeleteUser}
                                className="btn btn-error btn-sm rounded-xl font-bold text-white shadow-md shadow-error/20"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
