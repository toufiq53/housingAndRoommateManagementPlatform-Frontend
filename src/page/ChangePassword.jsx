import React, { useContext, useState } from 'react';
import { baseurl } from '../services/BaseUrl';
import { AuthContext } from '../context/AuthProvider';
import toast from 'react-hot-toast';
import { HiOutlineLockClosed, HiOutlineKey } from "react-icons/hi2";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { accessToken } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }

        setLoading(true);
        try {
            const passwordData = {
                current_password: currentPassword,
                new_password: newPassword
            };

            const res = await fetch(`${baseurl}/passwordchange`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(passwordData)
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.detail || "Failed to update password");
                setLoading(false);
                return;
            }

            toast.success(data.message || "Password updated successfully!");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Network error. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-100 py-12 flex items-center justify-center px-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl rounded-3xl border border-base-200 p-6 sm:p-8 space-y-6">
                <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl mx-auto mb-3">
                        <HiOutlineKey />
                    </div>
                    <h2 className="text-2xl font-black text-base-content">
                        Change Password
                    </h2>
                    <p className="text-xs text-base-content/60 mt-1">
                        Ensure your account stays secure with a strong password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
                            Current Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter current password"
                            className="input input-bordered w-full rounded-2xl text-sm"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
                            New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter at least 6 characters"
                            className="input input-bordered w-full rounded-2xl text-sm"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Re-enter new password"
                            className="input input-bordered w-full rounded-2xl text-sm"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full rounded-2xl font-black shadow-md shadow-primary/25 mt-4"
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            "Update Password"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
