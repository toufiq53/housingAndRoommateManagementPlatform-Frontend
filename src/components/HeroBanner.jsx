import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { HiMagnifyingGlass, HiOutlineBuildingOffice, HiOutlineShieldCheck, HiOutlineSparkles } from "react-icons/hi2";
import { FaUserCheck, FaStar } from "react-icons/fa";

const HeroBanner = () => {
    const navigate = useNavigate();
    const [searchLocation, setSearchLocation] = useState('');
    const [propertyType, setPropertyType] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchLocation.trim()) params.append('search', searchLocation.trim());
        if (propertyType.trim()) params.append('type', propertyType.trim());
        navigate(`/property?${params.toString()}`);
    };

    const handleQuickSearch = (loc) => {
        navigate(`/property?search=${encodeURIComponent(loc)}`);
    };

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-base-300 via-base-100 to-base-200 py-16 lg:py-24">
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1920&auto=format&fit=crop"
                    alt="Modern Living"
                    className="w-full h-full object-cover opacity-20 filter blur-xs scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/80 to-base-100/60"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto space-y-6">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold shadow-xs">
                       
                        <span>Trusted Housing & Roommate Matching Platform</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-base-content leading-tight">
                        Find Your Perfect <br />
                        <span className="bg-gradient-to-r from-primary via-indigo-500 to-secondary bg-clip-text text-transparent">
                            Home, Room & Roommate
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-base sm:text-lg text-base-content/75 max-w-2xl mx-auto leading-relaxed">
                        Discover verified apartments, rent affordable furnished rooms, and connect with compatible roommates with zero hassle and total peace of mind.
                    </p>

                    {/* Floating Search Container */}
                    <div className="pt-4 max-w-3xl mx-auto">
                        <form
                            onSubmit={handleSearch}
                            className="bg-base-100/95 backdrop-blur-xl p-3 sm:p-4 rounded-3xl shadow-2xl border border-base-200/80 flex flex-col md:flex-row items-center gap-3"
                        >
                            {/* Location input */}
                            <div className="flex-1 w-full flex items-center gap-2.5 px-3 py-2 bg-base-200/50 rounded-2xl border border-base-200 focus-within:border-primary/50 transition-colors">
                                <HiMagnifyingGlass className="text-primary text-lg shrink-0" />
                                <div className="text-left w-full">
                                    <label className="block text-[10px] uppercase font-bold text-base-content/50 tracking-wider">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Mirpur, Dhanmondi, Gulshan..."
                                        value={searchLocation}
                                        onChange={(e) => setSearchLocation(e.target.value)}
                                        className="bg-transparent border-0 outline-none w-full text-sm font-semibold text-base-content placeholder:text-base-content/40 p-0"
                                    />
                                </div>
                            </div>

                            {/* Property Type select */}
                            <div className="w-full md:w-52 flex items-center gap-2.5 px-3 py-2 bg-base-200/50 rounded-2xl border border-base-200 focus-within:border-primary/50 transition-colors">
                                <HiOutlineBuildingOffice className="text-secondary text-lg shrink-0" />
                                <div className="text-left w-full">
                                    <label className="block text-[10px] uppercase font-bold text-base-content/50 tracking-wider">
                                        Property Type
                                    </label>
                                    <select
                                        value={propertyType}
                                        onChange={(e) => setPropertyType(e.target.value)}
                                        className="bg-transparent border-0 outline-none w-full text-sm font-semibold text-base-content p-0 cursor-pointer"
                                    >
                                        <option value="">All Types</option>
                                        <option value="Apartment">Apartment</option>
                                        <option value="Villa">Villa</option>
                                        <option value="Flat">Flat</option>
                                        <option value="House">House</option>
                                    </select>
                                </div>
                            </div>

                            {/* Search Button */}
                            <button
                                type="submit"
                                className="btn btn-primary w-full md:w-auto px-8 rounded-2xl font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all text-sm h-12"
                            >
                                Search Spaces
                            </button>
                        </form>

                        {/* Quick Chips */}
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-base-content/65">
                            <span className="font-semibold text-base-content/80">Popular:</span>
                            {['Mirpur', 'Gulshan', 'Uttara', 'Dhanmondi'].map((area) => (
                                <button
                                    key={area}
                                    type="button"
                                    onClick={() => handleQuickSearch(area)}
                                    className="px-3 py-1 rounded-full bg-base-200/70 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer border border-base-300/50"
                                >
                                    📍 {area}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
                        <div className="flex items-center gap-3 p-3 bg-base-100/60 backdrop-blur-sm rounded-2xl border border-base-200">
                            <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center text-lg shrink-0">
                                <HiOutlineShieldCheck />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-base-content">100% Verified</h4>
                                <p className="text-[11px] text-base-content/60">Owners & properties</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-base-100/60 backdrop-blur-sm rounded-2xl border border-base-200">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg shrink-0">
                                <FaUserCheck />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-base-content">Roommate Match</h4>
                                <p className="text-[11px] text-base-content/60">Compatible profiles</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-base-100/60 backdrop-blur-sm rounded-2xl border border-base-200">
                            <div className="w-10 h-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center text-lg shrink-0">
                                <FaStar />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-base-content">Top Rated</h4>
                                <p className="text-[11px] text-base-content/60">4.9/5 satisfaction</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-base-100/60 backdrop-blur-sm rounded-2xl border border-base-200">
                            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center text-lg shrink-0">
                                <HiOutlineSparkles />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-base-content">Zero Brokerage</h4>
                                <p className="text-[11px] text-base-content/60">Direct booking</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;
