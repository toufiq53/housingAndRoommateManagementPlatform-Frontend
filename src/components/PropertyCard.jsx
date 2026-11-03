import React from 'react';
import { Link } from 'react-router';
import { HiOutlineMapPin, HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { MdMeetingRoom, MdBed } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa6";

const PropertyCard = ({ property }) => {
    if (!property) return null;

    const isAvailable = property.status?.toLowerCase() === 'available' && (property.available_room === undefined || property.available_room > 0);

    return (
        <div className="card bg-base-100 rounded-2xl overflow-hidden border border-base-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
            {/* Image & Overlays */}
            <figure className="relative h-56 sm:h-60 w-full overflow-hidden bg-base-300">
                <img
                    src={
                        property.cover_img ||
                        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800"
                    }
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

                {/* Top badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className="badge badge-neutral text-xs font-semibold backdrop-blur-md bg-black/60 text-white border-0 py-2.5 px-3">
                        {property.type || "Apartment"}
                    </span>
                </div>

                <div className="absolute top-3 right-3">
                    <span
                        className={`badge text-xs font-semibold border-0 py-2.5 px-3 shadow-md ${
                            isAvailable
                                ? "bg-emerald-500/90 text-white backdrop-blur-md"
                                : "bg-rose-500/90 text-white backdrop-blur-md"
                        }`}
                    >
                        {isAvailable ? "Available" : "Full"}
                    </span>
                </div>

                {/* Bottom image overlay information */}
                <div className="absolute bottom-3 left-3 right-3 text-white flex justify-between items-end">
                    <div className="flex items-center gap-1.5 text-xs font-medium drop-shadow-md">
                        <HiOutlineMapPin className="text-secondary text-sm shrink-0" />
                        <span className="line-clamp-1">{property.upazila || "City"}, {property.district || "Dhaka"}</span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-semibold">
                        {property.available_room ?? property.total_room} / {property.total_room} Rooms Open
                    </span>
                </div>
            </figure>

            {/* Card Content */}
            <div className="card-body p-5 flex flex-col justify-between flex-1">
                <div>
                    <h3 className="card-title text-lg font-bold text-base-content group-hover:text-primary transition-colors line-clamp-1">
                        {property.title}
                    </h3>

                    <p className="text-xs text-base-content/65 line-clamp-2 mt-2 leading-relaxed">
                        {property.description || "Well-maintained property with spacious rooms, modern amenities, and prime connectivity."}
                    </p>

                    {/* Features Strip */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-base-200 text-xs text-base-content/75 font-medium">
                        <div className="flex items-center gap-1.5">
                            <MdMeetingRoom className="text-primary text-sm shrink-0" />
                            <span>{property.total_room} Total Rooms</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MdBed className="text-secondary text-sm shrink-0" />
                            <span>{property.available_room ?? property.total_room} Vacant</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-base-content/55 mt-2 line-clamp-1">
                        <HiOutlineBuildingOffice2 className="shrink-0 text-xs" />
                        <span>{property.address}</span>
                    </div>
                </div>

                {/* Action CTA */}
                <div className="pt-4 mt-2">
                    <Link
                        to={`/properties-room/${property.id}`}
                        className="btn btn-primary btn-sm w-full rounded-xl font-semibold flex items-center justify-center gap-2 group-hover:shadow-md group-hover:shadow-primary/20 transition-all"
                    >
                        <span>View Available Rooms</span>
                        <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;
