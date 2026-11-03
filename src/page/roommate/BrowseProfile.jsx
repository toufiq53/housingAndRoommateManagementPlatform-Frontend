import React, { useContext, useEffect, useState, useMemo } from 'react';
import { baseurl } from '../../services/BaseUrl';
import { AuthContext } from '../../context/AuthProvider';
import { VerifiedBadge } from '../../utils/verification';
import {
    HiMagnifyingGlass,
    HiOutlineMapPin,
    HiOutlineBriefcase,
    HiXMark,
    HiOutlineChatBubbleLeftRight
} from "react-icons/hi2";

const BrowseProfile = () => {
    const { accessToken, authUser } = useContext(AuthContext);
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchLocation, setSearchLocation] = useState('');
    const [genderFilter, setGenderFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [maxBudget, setMaxBudget] = useState('');

    // Contact modal
    const [contactProfile, setContactProfile] = useState(null);

    const fetchProfiles = () => {
        setLoading(true);
        fetch(`${baseurl}/profile/all`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProfiles(data);
                } else {
                    setProfiles([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching roommate profiles:", err);
                setProfiles([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (accessToken) {
            fetchProfiles();
        }
    }, [accessToken]);

    // Memory filter
    const filteredProfiles = useMemo(() => {
        return profiles.filter(p => {
            // Location / Search
            if (searchLocation.trim()) {
                const term = searchLocation.toLowerCase();
                const loc = (p.renting_location || '').toLowerCase();
                const desc = (p.description || '').toLowerCase();
                const name = (p.user_name || '').toLowerCase();
                if (!loc.includes(term) && !desc.includes(term) && !name.includes(term)) {
                    return false;
                }
            }

            // Gender
            if (genderFilter !== 'All' && p.gender?.toLowerCase() !== genderFilter.toLowerCase()) {
                return false;
            }

            // Status filter
            if (statusFilter !== 'All') {
                if (statusFilter === 'active' && p.status?.toLowerCase() !== 'active') return false;
                if (statusFilter === 'found' && p.status?.toLowerCase() !== 'found') return false;
            }

            // Budget
            if (maxBudget && Number(maxBudget) > 0) {
                if ((p.budget || 0) > Number(maxBudget)) {
                    return false;
                }
            }

            return true;
        });
    }, [profiles, searchLocation, genderFilter, statusFilter, maxBudget]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
                    Community Connections
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-base-content tracking-tight">
                    Find Compatible Roommates
                </h1>
                <p className="text-sm text-base-content/65">
                    Connect directly with students, professionals, and flatmate seekers looking for shared spaces in your target area.
                </p>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-base-100 p-4 sm:p-6 rounded-3xl border border-base-200 shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-center">
                    {/* Search */}
                    <div className="md:col-span-5 relative">
                        <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-base" />
                        <input
                            type="text"
                            placeholder="Filter by city, area, occupation, or name..."
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                            className="input input-bordered input-sm w-full rounded-2xl pl-10 text-xs bg-base-200/40 focus:bg-base-100"
                        />
                        {searchLocation && (
                            <button
                                onClick={() => setSearchLocation('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content cursor-pointer"
                            >
                                <HiXMark />
                            </button>
                        )}
                    </div>

                    {/* Gender */}
                    <div className="md:col-span-2">
                        <select
                            value={genderFilter}
                            onChange={(e) => setGenderFilter(e.target.value)}
                            className="select select-bordered select-sm w-full rounded-2xl text-xs bg-base-200/40"
                        >
                            <option value="All">All Genders</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    {/* Status filter */}
                    <div className="md:col-span-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="select select-bordered select-sm w-full rounded-2xl text-xs bg-base-200/40 font-medium"
                        >
                            <option value="All">All Status</option>
                            <option value="active">🟢 Looking for Roommate</option>
                            <option value="found">🔵 Found Roommate</option>
                        </select>
                    </div>

                    {/* Max Budget */}
                    <div className="md:col-span-3">
                        <input
                            type="number"
                            placeholder="Max Budget (e.g. 10000)"
                            value={maxBudget}
                            onChange={(e) => setMaxBudget(e.target.value)}
                            className="input input-bordered input-sm w-full rounded-2xl text-xs bg-base-200/40"
                        />
                    </div>
                </div>

                {/* Filter info */}
                <div className="flex items-center justify-between text-xs text-base-content/60 pt-2 border-t border-base-200">
                    <span>
                        Showing <strong className="text-base-content">{filteredProfiles.length}</strong> profiles
                    </span>
                    {(searchLocation || genderFilter !== 'All' || statusFilter !== 'All' || maxBudget) && (
                        <button
                            onClick={() => {
                                setSearchLocation('');
                                setGenderFilter('All');
                                setStatusFilter('All');
                                setMaxBudget('');
                            }}
                            className="text-primary font-bold hover:underline cursor-pointer"
                        >
                            Reset Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Roommate Cards */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : filteredProfiles.length === 0 ? (
                <div className="text-center py-20 bg-base-100 rounded-3xl border border-dashed border-base-200 p-8 space-y-3">
                    <div className="text-5xl">👥</div>
                    <h3 className="text-xl font-bold text-base-content">No Roommate Profiles Found</h3>
                    <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                        No profiles matched your filters. Try clearing your search or expanding your budget range.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProfiles.map(item => {
                        const isSelf = item.is_self;
                        const isFound = item.status === 'found';

                        return (
                            <div
                                key={item.id}
                                className="card bg-base-100 rounded-3xl border border-base-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-6 flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    {/* Top User Header */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            {/* Profile Image with fallback */}
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md bg-base-200 shrink-0 ring-2 ring-primary/20">
                                                <img
                                                    src={
                                                        item.profile_img ||
                                                        (item.gender?.toLowerCase() === "female"
                                                            ? "https://images.unsplash.com/photo-1624138194324-0606c2f33fda?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                                                            : "https://images.unsplash.com/vector-1740323916422-c5c953142910?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D")
                                                    }
                                                    alt={`${item.user_name || "User"} avatar`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = "https://media.istockphoto.com/id/1196083861/vector/simple-man-head-icon-set.webp?a=1&b=1&s=612x612&w=0&k=20&c=lr8HnbrFxGz8kP6yluTw8Be-fBMpBAQdPBqDGEKoFKc=";
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                {/* Profile Name with Blue Verified Badge */}
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <h3 className="font-extrabold text-base text-base-content">
                                                        {item.user_name}
                                                    </h3>
                                                    <VerifiedBadge email={item.email} />
                                                </div>

                                                <p className="text-xs text-primary font-semibold flex items-center gap-1 mt-0.5">
                                                    <HiOutlineBriefcase /> {item.occupation || "Professional"}
                                                </p>
                                                <p className="text-[11px] text-base-content/50">
                                                    {item.gender} • {item.age} years old
                                                </p>
                                            </div>
                                        </div>

                                        {isSelf && (
                                            <span className="badge badge-primary badge-xs font-bold py-2 shrink-0">
                                                Your Profile
                                            </span>
                                        )}
                                    </div>

                                    {/* Status Badge Visible on Card */}
                                    <div>
                                        <span
                                            className={`badge text-xs font-bold py-2.5 px-3 border-0 ${
                                                isFound
                                                    ? "bg-blue-500/15 text-blue-600"
                                                    : item.status === "inactive"
                                                    ? "bg-base-300 text-base-content/70"
                                                    : "bg-emerald-500/15 text-emerald-600"
                                            }`}
                                        >
                                            {isFound
                                                ? "🔵 Found Roommate"
                                                : item.status === "inactive"
                                                ? "⚪ Inactive"
                                                : "🟢 Looking for Roommate"}
                                        </span>
                                    </div>

                                    {/* Location & Budget Box */}
                                    <div className="bg-base-200/50 p-3.5 rounded-2xl space-y-2 text-xs border border-base-200">
                                        <div className="flex justify-between items-center">
                                            <span className="text-base-content/60 flex items-center gap-1 font-medium">
                                                <HiOutlineMapPin className="text-primary" /> Target Area:
                                            </span>
                                            <span className="font-bold text-base-content">{item.renting_location}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-base-content/60 font-medium">Max Monthly Budget:</span>
                                            <span className="font-black text-emerald-600 text-sm">৳{item.budget?.toLocaleString()}/mo</span>
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <p className="text-xs text-base-content/75 italic bg-base-100 p-3 rounded-2xl border border-base-200/60 line-clamp-3">
                                        "{item.description || "Looking for a clean, respectful roommate to share an apartment."}"
                                    </p>
                                </div>

                                {/* Action Bar: Verified member text removed, replaced with Connect button */}
                                <div className="pt-4 mt-2 border-t border-base-200 flex items-center justify-between">
                                    <span className="text-[11px] text-base-content/50 font-medium">
                                        {isFound ? "Position Filled" : "Open for matching"}
                                    </span>

                                    {isSelf ? (
                                        <button disabled className="btn btn-disabled btn-sm rounded-xl text-xs font-bold">
                                            This is You
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setContactProfile(item)}
                                            className="btn btn-primary btn-sm rounded-xl font-bold px-4 shadow-sm shadow-primary/25 cursor-pointer"
                                        >
                                            <HiOutlineChatBubbleLeftRight /> Connect
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Contact Modal */}
            {contactProfile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                    <div className="bg-base-100 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-base-200 space-y-6">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg mx-auto mb-3 bg-base-200">
                                <img
                                    src={
                                        contactProfile.profile_img ||
                                        (contactProfile.gender?.toLowerCase() === "female"
                                            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                                            : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80")
                                    }
                                    alt={contactProfile.user_name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex items-center justify-center gap-1.5">
                                <h3 className="text-2xl font-black text-base-content">{contactProfile.user_name}</h3>
                                <VerifiedBadge email={contactProfile.email} className="text-[#1877F2] text-xl" />
                            </div>
                            <p className="text-xs text-base-content/60 mt-0.5">
                                {contactProfile.occupation} • Seeking in {contactProfile.renting_location}
                            </p>
                        </div>

                        {/* Contact info box */}
                        <div className="bg-base-200/50 p-4 rounded-2xl space-y-3 text-xs border border-base-200">
                            <div>
                                <span className="text-base-content/50 uppercase font-bold text-[10px] block">Search Status</span>
                                <span className={`badge badge-sm font-bold mt-1 ${
                                    contactProfile.status === 'found' ? 'badge-info' : 'badge-success'
                                }`}>
                                    {contactProfile.status === 'found' ? '🔵 Found Roommate' : '🟢 Looking for Roommate'}
                                </span>
                            </div>

                            <div>
                                <span className="text-base-content/50 uppercase font-bold text-[10px] block">Email Address</span>
                                <a
                                    href={`mailto:${contactProfile.email}`}
                                    className="font-bold text-primary hover:underline text-sm break-all"
                                >
                                    {contactProfile.email}
                                </a>
                            </div>

                            <div>
                                <span className="text-base-content/50 uppercase font-bold text-[10px] block">Username</span>
                                <span className="font-semibold text-base-content">@{contactProfile.username}</span>
                            </div>

                            <div>
                                <span className="text-base-content/50 uppercase font-bold text-[10px] block">Budget</span>
                                <span className="font-black text-emerald-600">Up to ৳{contactProfile.budget?.toLocaleString()}/month</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setContactProfile(null)}
                                className="btn btn-ghost flex-1 rounded-2xl font-bold"
                            >
                                Close
                            </button>
                            <a
                                href={`mailto:${contactProfile.email}?subject=Interested in being roommates on Habita!`}
                                className="btn btn-primary flex-1 rounded-2xl font-bold shadow-md shadow-primary/25"
                            >
                                Send Email
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrowseProfile;
