import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { baseurl } from '../services/BaseUrl';
import { VerifiedBadge } from '../utils/verification';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineEnvelope, HiOutlineShieldCheck, HiOutlineSparkles } from "react-icons/hi2";

const UserProfile = () => {
    const { authUser, accessToken, refreshUser } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        firstname: '',
        lastname: '',
        payment_number: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (authUser) {
            setFormData({
                email: authUser.email || '',
                username: authUser.username || '',
                firstname: authUser.firstname || '',
                lastname: authUser.lastname || '',
                payment_number: authUser.payment_number || '01712-345678'
            });
        }
    }, [authUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`${baseurl}/edituser`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message || "Profile updated successfully!");
                if (refreshUser) refreshUser();
            } else {
                toast.error(data.detail || "Failed to update profile");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error updating profile");
        } finally {
            setSaving(false);
        }
    };

    if (!authUser) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 py-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header */}
                <div>
                    <span className="text-xs uppercase font-extrabold tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
                        Account Settings
                    </span>
                    <h1 className="text-3xl font-black text-base-content mt-2 tracking-tight">
                        Personal Profile
                    </h1>
                    <p className="text-sm text-base-content/65 mt-1">
                        Manage your account details and contact information.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Avatar Card */}
                    <div className="lg:col-span-4">
                        <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm p-6 text-center space-y-4">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary text-primary-content flex items-center justify-center text-4xl font-black mx-auto shadow-xl shadow-primary/25">
                                {authUser.firstname ? authUser.firstname[0]?.toUpperCase() : authUser.username[0]?.toUpperCase()}
                            </div>

                            <div>
                                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                    <h3 className="font-extrabold text-xl text-base-content">
                                        {authUser.firstname} {authUser.lastname}
                                    </h3>
                                    <VerifiedBadge email={authUser.email} className="text-[#1877F2] text-xl" />
                                </div>
                                <p className="text-xs text-base-content/60 font-medium mt-0.5">@{authUser.username}</p>
                                <span className={`badge badge-sm font-bold uppercase mt-2 ${
                                    authUser.role === 'owner' ? 'badge-primary' : 'badge-neutral'
                                }`}>
                                    {authUser.role}
                                </span>
                            </div>

                            <div className="pt-4 border-t border-base-200 text-left text-xs space-y-2.5 text-base-content/75">
                                <div className="flex items-center gap-2">
                                    <HiOutlineEnvelope className="text-primary text-base shrink-0" />
                                    <span className="truncate">{authUser.email}</span>
                                </div>
                                {authUser.role === 'owner' && (
                                    <div className="p-3 bg-base-200/50 rounded-2xl border border-base-200 space-y-1">
                                        <span className="text-[10px] uppercase font-bold text-base-content/60 block">
                                            bKash & Nagad (Personal)
                                        </span>
                                        <span className="font-black text-sm text-primary flex items-center gap-1.5">
                                            <span>📱</span>
                                            <span>{authUser.payment_number || '01712-345678'}</span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Edit Form */}
                    <div className="lg:col-span-8">
                        <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-base-content mb-6">
                                Update Information
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstname"
                                            value={formData.firstname}
                                            onChange={handleChange}
                                            className="input input-bordered w-full rounded-2xl text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastname"
                                            value={formData.lastname}
                                            onChange={handleChange}
                                            className="input input-bordered w-full rounded-2xl text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="input input-bordered w-full rounded-2xl text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input input-bordered w-full rounded-2xl text-sm"
                                        required
                                    />
                                </div>

                                {authUser.role === 'owner' && (
                                    <div className="pt-2 border-t border-base-200 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-base-content/80">
                                                Registered Payment Number (bKash & Nagad)
                                            </label>
                                            <span className="badge badge-xs badge-primary font-bold">Owner Only</span>
                                        </div>
                                        <input
                                            type="text"
                                            name="payment_number"
                                            value={formData.payment_number}
                                            onChange={handleChange}
                                            placeholder="e.g. 01712-345678"
                                            className="input input-bordered w-full rounded-2xl text-sm font-semibold"
                                            required
                                        />
                                        <p className="text-[11px] text-base-content/60">
                                            As an owner, you have <strong>one single number</strong> used for both bKash and Nagad. Tenants will send 50% advance payments directly to this number before you confirm reservations.
                                        </p>
                                    </div>
                                )}

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="btn btn-primary rounded-2xl px-8 font-bold shadow-md shadow-primary/25 cursor-pointer"
                                    >
                                        {saving ? (
                                            <span className="loading loading-spinner loading-sm"></span>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
