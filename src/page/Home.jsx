import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import HeroBanner from '../components/HeroBanner';
import FeatureProperty from '../components/FeatureProperty';
import { baseurl } from '../services/BaseUrl';
import { HiOutlineSparkles, HiOutlineShieldCheck, HiOutlineCheckBadge, HiOutlineKey, HiOutlineChatBubbleLeftRight, HiOutlineCurrencyBangladeshi } from "react-icons/hi2";
import { FaUserFriends, FaArrowRight, FaHome, FaQuoteLeft } from "react-icons/fa";

const Home = () => {
    const [stats, setStats] = useState({
        total_properties: 24,
        total_rooms: 85,
        active_roommates: 64,
        available_spaces: 32
    });
    const [featuredRoommates, setFeaturedRoommates] = useState([]);

    useEffect(() => {
        // Fetch platform statistics
        fetch(`${baseurl}/platform/stats`)
            .then(res => res.json())
            .then(data => {
                if (data && data.total_properties) {
                    setStats(data);
                }
            })
            .catch(() => {});

        // Fetch sample roommate profiles for spotlight (if logged in, or fallback)
        const token = localStorage.getItem('hrp_token');
        if (token) {
            fetch(`${baseurl}/profile/all`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setFeaturedRoommates(data.slice(0, 3));
                    }
                })
                .catch(() => {});
        }
    }, []);

    return (
        <div className="w-full space-y-4">
            {/* Hero Section */}
            <HeroBanner />

            {/* Live Stats Strip */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                <div className="bg-base-100 rounded-3xl p-6 sm:p-8 shadow-xl border border-base-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-base-200">
                    <div className="pt-2 md:pt-0">
                        <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                            {stats.total_properties}+
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-base-content/70 mt-1">Verified Properties</p>
                    </div>
                    <div className="pt-2 md:pt-0">
                        <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-secondary to-pink-600 bg-clip-text text-transparent">
                            {stats.total_rooms}+
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-base-content/70 mt-1">Furnished Rooms</p>
                    </div>
                    <div className="pt-2 md:pt-0">
                        <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                            {stats.active_roommates}+
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-base-content/70 mt-1">Active Roommates</p>
                    </div>
                    <div className="pt-2 md:pt-0">
                        <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                            100%
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-base-content/70 mt-1">Safe & Verified</p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="text-xs uppercase font-extrabold tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
                        Effortless Process
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-base-content mt-3 tracking-tight">
                        How Habita Works
                    </h2>
                    <p className="text-sm sm:text-base text-base-content/70 mt-2">
                        Three simple steps to settle into your dream room or find your compatible flatmate.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Step 1 */}
                    <div className="card bg-base-100 rounded-3xl p-8 border border-base-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mb-6 group-hover:bg-primary group-hover:text-primary-content transition-colors">
                            1
                        </div>
                        <h3 className="text-xl font-bold text-base-content mb-2">Explore & Filter</h3>
                        <p className="text-sm text-base-content/70 leading-relaxed">
                            Filter properties by district, room type, rent budget, and amenities. Browse high-res photos and verified room details.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="card bg-base-100 rounded-3xl p-8 border border-base-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group">
                        <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-2xl font-bold mb-6 group-hover:bg-secondary group-hover:text-secondary-content transition-colors">
                            2
                        </div>
                        <h3 className="text-xl font-bold text-base-content mb-2">Book & Pay Online</h3>
                        <p className="text-sm text-base-content/70 leading-relaxed">
                            Submit a booking request with a single click and pay securely online. The property owner reviews and accepts instantly.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="card bg-base-100 rounded-3xl p-8 border border-base-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-2xl font-bold mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            3
                        </div>
                        <h3 className="text-xl font-bold text-base-content mb-2">Connect & Move In</h3>
                        <p className="text-sm text-base-content/70 leading-relaxed">
                            Connect with friendly roommates or landlords, schedule move-in day, and enjoy your comfortable new accommodation.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Properties */}
            <FeatureProperty />

            {/* Roommate Spotlight Banner */}
            <section className="py-16 bg-gradient-to-br from-base-200/50 via-base-100 to-base-200/80 border-y border-base-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                        <div>
                            <span className="text-xs uppercase font-extrabold tracking-widest text-secondary px-3 py-1 rounded-full bg-secondary/10">
                                Compatibility First
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-black text-base-content mt-2 tracking-tight">
                                Find Like-Minded Roommates
                            </h2>
                            <p className="text-sm text-base-content/70 mt-1 max-w-xl">
                                Connect with students, developers, and working professionals looking for flatmates in your preferred area.
                            </p>
                        </div>

                        <Link
                            to="/roommate"
                            className="btn btn-secondary rounded-2xl font-bold shadow-md shadow-secondary/20 hover:shadow-lg hover:shadow-secondary/30 transition-all text-sm px-6"
                        >
                            <FaUserFriends />
                            <span>Browse Roommates</span>
                        </Link>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                name: "Toufiq Hassan",
                                role: "Student",
                                age: 20,
                                location: "Sirajganj",
                                budget: 8500,
                                img: "https://images.unsplash.com/photo-1715615685666-882710b534f9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
                                desc: "Clean, non-smoker, works from home 3 days a week. Looking for a quiet flatmate who values hygiene."
                            },
                            {
                                name: "Tabassum Riya",
                                role: "UI/UX Designer",
                                age: 23,
                                location: "Dhanmondi, Dhaka",
                                budget: 10000,
                                img: "https://images.unsplash.com/photo-1778667525698-0fb92b5f4673?q=80&w=1192&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
                                desc: "Creative professional looking for a friendly female flatmate. Enjoys cooking, reading, and coffee."
                            },
                            {
                                name: "Sifat Sabbir",
                                role: "CS Student @ DU",
                                age: 22,
                                location: "Nilkhet / Lalbagh",
                                budget: 6000,
                                img: "https://images.unsplash.com/photo-1712153483492-cab99d90ca71?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
                                desc: "Focused university student. Spends day at campus, quiet at night. Looking for shared double room."
                            }
                        ].map((rm, i) => (
                            <div key={i} className="card bg-base-100 rounded-3xl p-6 border border-base-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-4">
                                        <img src={rm.img} alt={rm.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary/20" />
                                        <div>
                                            <h4 className="font-bold text-base text-base-content">{rm.name}</h4>
                                            <p className="text-xs text-primary font-medium">{rm.role} • {rm.age} yrs</p>
                                            <p className="text-[11px] text-base-content/60">📍 {rm.location}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-base-content/75 mt-4 italic bg-base-200/40 p-3 rounded-2xl">
                                        "{rm.desc}"
                                    </p>
                                </div>
                                <div className="mt-5 pt-3 border-t border-base-200 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] text-base-content/50 uppercase font-bold">Budget</span>
                                        <div className="text-sm font-extrabold text-base-content">৳{rm.budget}/mo</div>
                                    </div>
                                    <Link to="/roommate" className="btn btn-outline btn-primary btn-xs rounded-xl font-bold">
                                        Connect
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Landlord Call to Action */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-br from-primary via-indigo-600 to-secondary rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
                        <FaHome className="text-[350px]" />
                    </div>

                    <div className="relative z-10 max-w-2xl space-y-4">
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                            For Property Owners & Landlords
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                            List Your Property & Fill Vacancies In Days
                        </h2>
                        <p className="text-white/85 text-sm sm:text-base leading-relaxed">
                            Join thousands of verified owners managing tenants, collecting rent, and tracking room occupancy from our dedicated landlord portal.
                        </p>
                        <div className="pt-4 flex flex-wrap gap-4">
                            <Link
                                to="/owner"
                                className="btn bg-white text-primary hover:bg-white/90 border-0 rounded-2xl font-bold px-8 shadow-lg text-sm"
                            >
                                Open Owner Dashboard
                            </Link>
                            <Link
                                to="/signup"
                                className="btn btn-outline border-white text-white hover:bg-white/20 rounded-2xl font-bold text-sm px-6"
                            >
                                Register as Owner
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
