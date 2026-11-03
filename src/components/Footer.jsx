import React from 'react';
import { Link } from 'react-router';
import { HiHomeModern, HiOutlineEnvelope, HiOutlinePhone, HiOutlineMapPin } from "react-icons/hi2";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-base-200/90 text-base-content border-t border-base-300 mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link to="/" className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-content shadow-md shadow-primary/20">
                                <HiHomeModern className="text-2xl" />
                            </div>
                            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Nestora
                            </span>
                        </Link>
                        <p className="text-base-content/70 text-sm max-w-sm leading-relaxed">
                            The smartest, most reliable platform to find verified homes, furnished rooms, and compatible roommates with zero hassle and verified owners.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <a href="#twitter" className="w-9 h-9 rounded-full bg-base-100 flex items-center justify-center text-base-content/70 hover:text-primary hover:shadow-md transition-all">
                                <FaTwitter className="text-sm" />
                            </a>
                            <a href="#facebook" className="w-9 h-9 rounded-full bg-base-100 flex items-center justify-center text-base-content/70 hover:text-primary hover:shadow-md transition-all">
                                <FaFacebookF className="text-sm" />
                            </a>
                            <a href="#instagram" className="w-9 h-9 rounded-full bg-base-100 flex items-center justify-center text-base-content/70 hover:text-primary hover:shadow-md transition-all">
                                <FaInstagram className="text-sm" />
                            </a>
                            <a href="#linkedin" className="w-9 h-9 rounded-full bg-base-100 flex items-center justify-center text-base-content/70 hover:text-primary hover:shadow-md transition-all">
                                <FaLinkedinIn className="text-sm" />
                            </a>
                        </div>
                    </div>

                    {/* Explore */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-sm uppercase tracking-wider text-base-content/90">
                            Explore
                        </h4>
                        <ul className="space-y-2 text-sm text-base-content/70">
                            <li><Link to="/property" className="hover:text-primary transition-colors">Browse Properties</Link></li>
                            <li><Link to="/roommate" className="hover:text-primary transition-colors">Find Roommates</Link></li>
                            <li><Link to="/property" className="hover:text-primary transition-colors">Single & Shared Rooms</Link></li>
                            <li><Link to="/property" className="hover:text-primary transition-colors">Executive Studios</Link></li>
                            <li><Link to="/property" className="hover:text-primary transition-colors">Top Locations</Link></li>
                        </ul>
                    </div>

                    {/* For Landlords & Tenants */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-sm uppercase tracking-wider text-base-content/90">
                            Portals
                        </h4>
                        <ul className="space-y-2 text-sm text-base-content/70">
                            <li><Link to="/owner" className="hover:text-primary transition-colors">Landlord Dashboard</Link></li>
                            <li><Link to="/owner/manage-property" className="hover:text-primary transition-colors">List New Property</Link></li>
                            <li><Link to="/my-booking" className="hover:text-primary transition-colors">Tenant Bookings</Link></li>
                            <li><Link to="/roommate/profile" className="hover:text-primary transition-colors">Roommate Profile</Link></li>
                            <li><Link to="/signup" className="hover:text-primary transition-colors">Create Account</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-sm uppercase tracking-wider text-base-content/90">
                            Contact Us
                        </h4>
                        <ul className="space-y-2.5 text-sm text-base-content/70">
                            <li className="flex items-start gap-2">
                                <HiOutlineMapPin className="text-base text-primary shrink-0 mt-0.5" />
                                <span>Sirajganj Sadar, Bangladesh</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <HiOutlineEnvelope className="text-base text-primary shrink-0" />
                                <span>toufiq822553@gmail.com</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <HiOutlinePhone className="text-base text-primary shrink-0" />
                                <span>+880 1320798059</span>
                            </li>
                            <li className="pt-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-success/15 text-success">
                                    <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                                    Support Available 24/7
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-base-300 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-base-content/60">
                    <p>© {new Date().getFullYear()} Nestora Housing Platform. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#terms" className="hover:text-primary transition-colors">Terms of Service</a>
                        <a href="#security" className="hover:text-primary transition-colors">Trust & Security</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;