import React, { useContext, useEffect, useState } from 'react';
import { baseurl } from '../../services/BaseUrl';
import { AuthContext } from '../../context/AuthProvider';
import { VerifiedBadge } from '../../utils/verification';
import toast from 'react-hot-toast';
import {
    HiOutlineBriefcase,
    HiOutlineMapPin,
    HiOutlinePencilSquare,
    HiOutlineSparkles,
    HiOutlinePhoto,
    HiOutlineCheckCircle
} from "react-icons/hi2";

const MyProfile = () => {
    const { accessToken, authUser } = useContext(AuthContext);

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        gender: 'Male',
        age: 22,
        occupation: '',
        renting_location: '',
        budget: 8000,
        description: '',
        status: 'active',
        profile_img: ''
    });

    const fetchProfile = () => {
        setLoading(true);
        fetch(`${baseurl}/profile/my`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    setProfile(null);
                    return null;
                }
                return res.json();
            })
            .then(data => {
                if (data && data.id) {
                    setProfile(data);
                    setFormData({
                        gender: data.gender || 'Male',
                        age: data.age || 22,
                        occupation: data.occupation || '',
                        renting_location: data.renting_location || '',
                        budget: data.budget || 8000,
                        description: data.description || '',
                        status: data.status || 'active',
                        profile_img: data.profile_img || ''
                    });
                } else {
                    setProfile(null);
                }
                setLoading(false);
            })
            .catch(() => {
                setProfile(null);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (accessToken) {
            fetchProfile();
        }
    }, [accessToken]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'age' || name === 'budget' ? Number(value) : value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!formData.occupation.trim() || !formData.renting_location.trim()) {
            toast.error("Please enter occupation and preferred location");
            return;
        }

        setSaving(true);
        const endpoint = profile ? `${baseurl}/update/profile` : `${baseurl}/create/profile`;
        const method = profile ? 'PUT' : 'POST';

        try {
            const res = await fetch(endpoint, {
                method,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message || "Roommate profile saved successfully!");
                setIsEditing(false);
                fetchProfile();
            } else {
                toast.error(data.detail || "Failed to save profile");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error while saving profile");
        } finally {
            setSaving(false);
        }
    };

    // Quick toggle status directly
    const handleQuickStatusToggle = async (newStatus) => {
        try {
            const res = await fetch(`${baseurl}/update/profile`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                toast.success(`Status updated to ${newStatus === 'found' ? 'Found Roommate' : 'Looking for Roommate'}`);
                fetchProfile();
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    const currentEmail = profile?.email || authUser?.email;
    const isFound = profile?.status === 'found';

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span className="text-xs uppercase font-extrabold tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
                        Roommate Presence
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-base-content mt-2 tracking-tight">
                        My Roommate Profile
                    </h1>
                    <p className="text-xs sm:text-sm text-base-content/65 mt-0.5">
                        Manage your roommate bio, profile photo link, and active search status.
                    </p>
                </div>

                {!isEditing && profile && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-outline btn-primary btn-sm rounded-xl font-bold gap-2 self-start sm:self-auto cursor-pointer"
                    >
                        <HiOutlinePencilSquare /> Edit Profile
                    </button>
                )}
            </div>

            {/* Profile Content */}
            {!profile && !isEditing ? (
                <div className="text-center py-16 bg-base-100 rounded-3xl border border-dashed border-base-200 p-8 space-y-4 shadow-sm">
                    <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center text-3xl mx-auto">
                        <HiOutlineSparkles />
                    </div>
                    <h2 className="text-2xl font-black text-base-content">Create Your Roommate Profile</h2>
                    <p className="text-xs sm:text-sm text-base-content/65 max-w-md mx-auto">
                        Add a photo link, preferred locations, budget, and lifestyle description so others can discover and connect with you.
                    </p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-primary rounded-2xl px-8 font-bold shadow-md shadow-primary/25 cursor-pointer"
                    >
                        + Create Roommate Profile
                    </button>
                </div>
            ) : isEditing ? (
                /* Edit / Create Form */
                <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-xl p-6 sm:p-8 space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-base-content">
                            {profile ? "Edit Your Roommate Profile" : "Create Roommate Profile"}
                        </h3>
                        <p className="text-xs text-base-content/60 mt-0.5">
                            Update your photo link, search status, and preferences below.
                        </p>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4 text-xs">
                        {/* Profile Image URL */}
                        <div>
                            <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                Profile Image Link (URL)
                            </label>
                            <div className="relative">
                                <input
                                    type="url"
                                    name="profile_img"
                                    value={formData.profile_img}
                                    onChange={handleChange}
                                    placeholder="https://images.unsplash.com/... or any direct image link"
                                    className="input input-bordered input-sm w-full rounded-2xl text-xs"
                                />
                            </div>
                            {formData.profile_img && (
                                <div className="mt-2 flex items-center gap-3 p-2 bg-base-200/50 rounded-2xl border border-base-200 w-fit">
                                    <img
                                        src={formData.profile_img}
                                        alt="Preview"
                                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-primary/30"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                    <span className="text-[11px] text-base-content/70 font-semibold pr-2">
                                        Live Photo Link Preview
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Search Status & Gender */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                    Roommate Search Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="select select-bordered select-sm w-full rounded-2xl font-bold"
                                >
                                    <option value="active">🟢 Active (Looking for Roommate)</option>
                                    <option value="found">🔵 Found Roommate</option>
                                    <option value="inactive">⚪ Inactive / Paused</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="select select-bordered select-sm w-full rounded-2xl"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Age & Occupation */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                    Age (Years)
                                </label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    min="16"
                                    max="100"
                                    className="input input-bordered input-sm w-full rounded-2xl"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                    Occupation / Profession *
                                </label>
                                <input
                                    type="text"
                                    name="occupation"
                                    value={formData.occupation}
                                    onChange={handleChange}
                                    placeholder="e.g. Software Engineer / Student"
                                    className="input input-bordered input-sm w-full rounded-2xl"
                                    required
                                />
                            </div>
                        </div>

                        {/* Location & Budget */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                    Preferred Location(s) *
                                </label>
                                <input
                                    type="text"
                                    name="renting_location"
                                    value={formData.renting_location}
                                    onChange={handleChange}
                                    placeholder="e.g. Mirpur, Dhanmondi, Gulshan"
                                    className="input input-bordered input-sm w-full rounded-2xl"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                    Max Monthly Budget (৳) *
                                </label>
                                <input
                                    type="number"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    min="500"
                                    placeholder="e.g. 8000"
                                    className="input input-bordered input-sm w-full rounded-2xl"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                Lifestyle & Bio Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Describe daily habits, schedule, cleanliness preferences, and interests..."
                                className="textarea textarea-bordered w-full rounded-2xl text-xs"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="pt-4 flex justify-end gap-2 border-t border-base-200">
                            {profile && (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="btn btn-ghost btn-sm rounded-xl font-bold cursor-pointer"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn btn-primary btn-sm rounded-xl px-8 font-bold shadow-md shadow-primary/25 cursor-pointer"
                            >
                                {saving ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    "Save Profile"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                /* Live Card Preview */
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-7 space-y-4">
                        <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-md p-6 sm:p-8 space-y-6">
                            {/* User Top Row */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    {/* Photo or Avatar */}
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg bg-base-200 shrink-0 ring-2 ring-primary/25">
                                        <img
                                            src={
                                                profile.profile_img ||
                                                (profile.gender?.toLowerCase() === "female"
                                                    ?"https://images.unsplash.com/photo-1624138194324-0606c2f33fda?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                                                    : "https://images.unsplash.com/vector-1740323916422-c5c953142910?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D")
                                            }
                                            alt={profile.user_name || "Profile"}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80";
                                            }}
                                        />
                                    </div>

                                    <div>
                                        {/* Name with Verified Badge */}
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <h3 className="text-xl font-black text-base-content">
                                                {profile.user_name || `${authUser?.firstname} ${authUser?.lastname}`}
                                            </h3>
                                            <VerifiedBadge email={currentEmail} className="text-[#1877F2] text-xl" />
                                        </div>

                                        <p className="text-xs text-primary font-semibold flex items-center gap-1 mt-0.5">
                                            <HiOutlineBriefcase /> {profile.occupation}
                                        </p>
                                        <p className="text-xs text-base-content/50">
                                            {profile.gender} • {profile.age} years old
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Pill on Card */}
                            <div>
                                <span
                                    className={`badge text-xs font-bold py-2.5 px-3.5 border-0 ${
                                        isFound
                                            ? "bg-blue-500/15 text-blue-600"
                                            : profile.status === "inactive"
                                            ? "bg-base-300 text-base-content/70"
                                            : "bg-emerald-500/15 text-emerald-600"
                                    }`}
                                >
                                    {isFound
                                        ? "🔵 Found Roommate"
                                        : profile.status === "inactive"
                                        ? "⚪ Inactive / Paused"
                                        : "🟢 Looking for Roommate"}
                                </span>
                            </div>

                            {/* Details Box */}
                            <div className="bg-base-200/50 p-4 rounded-2xl space-y-2.5 text-xs border border-base-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-base-content/60 font-medium">Looking in:</span>
                                    <span className="font-bold text-base-content">{profile.renting_location}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-base-content/60 font-medium">Maximum Budget:</span>
                                    <span className="font-black text-emerald-600 text-sm">৳{profile.budget?.toLocaleString()}/mo</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-base-content/60 font-medium">Contact Email:</span>
                                    <span className="font-semibold text-base-content">{currentEmail}</span>
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <h4 className="text-xs font-bold text-base-content/70 uppercase tracking-wider mb-2">
                                    About Me & Lifestyle
                                </h4>
                                <p className="text-xs text-base-content/80 italic bg-base-200/30 p-4 rounded-2xl border border-base-200 leading-relaxed">
                                    "{profile.description || "Looking for a clean, respectful roommate to share an apartment."}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side Quick Controls & Status Manager */}
                    <div className="md:col-span-5 space-y-4">
                        {/* Status Switcher Card */}
                        <div className="card bg-base-100 rounded-3xl p-6 border border-base-200 shadow-sm space-y-4">
                            <h4 className="font-extrabold text-sm text-base-content">
                                Quick Status Toggle
                            </h4>
                            <p className="text-xs text-base-content/65">
                                Found a roommate? Update your status immediately so other seekers know you are no longer searching.
                            </p>

                            <div className="flex flex-col gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleQuickStatusToggle('found')}
                                    className={`btn btn-sm rounded-xl font-bold justify-start ${
                                        isFound
                                            ? 'btn-info text-white'
                                            : 'btn-outline border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white'
                                    }`}
                                >
                                    🔵 Mark as "Found Roommate"
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleQuickStatusToggle('active')}
                                    className={`btn btn-sm rounded-xl font-bold justify-start ${
                                        !isFound
                                            ? 'btn-success text-white'
                                            : 'btn-outline border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                                    }`}
                                >
                                    🟢 Mark as "Looking for Roommate"
                                </button>
                            </div>
                        </div>

                        {/* Photo Link Helper */}
                        <div className="card bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 rounded-3xl p-6 border border-base-200 space-y-3">
                            <h4 className="font-extrabold text-sm text-base-content flex items-center gap-1.5">
                                <HiOutlinePhoto className="text-primary" /> Profile Photo Link
                            </h4>
                            <p className="text-xs text-base-content/70 leading-relaxed">
                                You can link any image from Unsplash, Imgur, or your personal hosted photo to stand out in roommate searches.
                            </p>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn btn-primary btn-sm rounded-xl font-bold w-full shadow-sm"
                            >
                                Edit Photo Link & Info
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyProfile;
