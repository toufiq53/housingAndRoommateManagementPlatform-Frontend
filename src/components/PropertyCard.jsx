
import React from 'react';
import { Link } from 'react-router';

const PropertyCard = ({ property }) => {
    return (

        <div className="card w-full min-w-0 bg-base-100 shadow-md hover:shadow-xl transition">

            {/* Property Image */}
            <figure>
                <img
                    src={
                        property.cover_img ||
                        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800"
                    }
                    alt={property.title}
                    className="h-44 sm:h-48 md:h-52 lg:h-56 w-full object-cover"
                />
            </figure>

            {/* Card Body */}
            <div className="card-body p-4 sm:p-5">

                {/* Title + Status */}
                <div className="flex justify-between items-start gap-2">

                    <h2 className="card-title text-base sm:text-lg md:text-xl line-clamp-1">
                        {property.title}
                    </h2>

                    <div
                        className={`badge badge-sm sm:badge-md shrink-0 ${
                            property.status?.toLowerCase() === "available"
                                ? "badge-success"
                                : "badge-error"
                        }`}
                    >
                        {property.status}
                    </div>

                </div>

                {/* Location */}
                <p className="text-xs sm:text-sm text-gray-500">
                    📍 {property.upazila}, {property.district}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm line-clamp-2">
                    {property.description}
                </p>

                {/* Property Information */}
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs sm:text-sm">

                    <div>
                        🏠 <span className="font-medium">
                            {property.type}
                        </span>
                    </div>

                    <div>
                        🚪 <span className="font-medium">
                            {property.total_room} Rooms
                        </span>
                    </div>

                    <div>
                        🛏️ <span className="font-medium">
                            {property.available_room} Available
                        </span>
                    </div>

                </div>

                {/* Address */}
                <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                    📌 Location: {property.address}
                </p>

                {/* Button */}
                <div className="card-actions mt-3">

                    <Link
                        to={`/properties-room/${property.id}`}
                        className="w-full"
                    >
                        <button className="btn btn-primary btn-sm sm:btn-md w-full">
                            View Room
                        </button>
                    </Link>

                </div>

            </div>
        </div>

    );
};

export default PropertyCard;

