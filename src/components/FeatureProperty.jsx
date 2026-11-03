import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { baseurl } from '../services/BaseUrl';
import PropertyCard from './PropertyCard';
import { FaArrowRight } from "react-icons/fa6";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

const FeatureProperty = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('All');

    useEffect(() => {
        fetch(`${baseurl}/property/all`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProperties(data);
                } else {
                    setProperties([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching featured properties:", err);
                setProperties([]);
                setLoading(false);
            });
    }, []);

    const filterTypes = ['All', 'Apartment', 'Villa', 'Flat', 'House'];

    const filteredProperties = selectedType === 'All'
        ? properties
        : properties.filter(p => p.type?.toLowerCase() === selectedType.toLowerCase());

    return (
        <section className="w-full py-16 bg-base-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
                            <HiOutlineBuildingOffice2 className="text-base" />
                            <span>Featured Properties</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
                            Explore Top Living Spaces
                        </h2>
                        <p className="text-sm sm:text-base text-base-content/70 mt-1 max-w-xl">
                            Handpicked properties with verified owners, modern amenities, and flexible room booking options.
                        </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-base-200/80 rounded-2xl border border-base-200 self-start md:self-auto">
                        {filterTypes.map(type => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    selectedType === type
                                        ? 'bg-primary text-primary-content shadow-sm shadow-primary/30'
                                        : 'text-base-content/70 hover:text-base-content hover:bg-base-100'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cards Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(idx => (
                            <div key={idx} className="card bg-base-100 border border-base-200 rounded-2xl overflow-hidden shadow-sm animate-pulse">
                                <div className="h-56 bg-base-300 w-full"></div>
                                <div className="p-5 space-y-3">
                                    <div className="h-4 bg-base-300 rounded w-3/4"></div>
                                    <div className="h-3 bg-base-300 rounded w-full"></div>
                                    <div className="h-3 bg-base-300 rounded w-1/2"></div>
                                    <div className="h-8 bg-base-300 rounded-xl mt-4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredProperties.length === 0 ? (
                    <div className="text-center py-16 bg-base-200/40 rounded-3xl border border-dashed border-base-300 p-8">
                        <div className="text-5xl mb-3">🏡</div>
                        <h3 className="text-lg font-bold text-base-content">No properties in this category yet</h3>
                        <p className="text-xs text-base-content/60 mt-1">Check back soon or explore other property types.</p>
                        <button
                            onClick={() => setSelectedType('All')}
                            className="btn btn-outline btn-sm btn-primary mt-4 rounded-xl"
                        >
                            View All Categories
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProperties.slice(0, 8).map(property => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                )}

                {/* Bottom View All Link */}
                <div className="text-center mt-12">
                    <Link
                        to="/property"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-base-200 hover:bg-primary hover:text-primary-content font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <span>Browse All Available Properties</span>
                        <FaArrowRight className="text-xs" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeatureProperty;
