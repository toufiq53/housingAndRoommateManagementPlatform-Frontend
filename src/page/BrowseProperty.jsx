import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import PropertyCard from '../components/PropertyCard';
import { baseurl } from '../services/BaseUrl';
import { HiMagnifyingGlass, HiXMark, HiAdjustmentsHorizontal, HiOutlineBuildingOffice2 } from "react-icons/hi2";

const BrowseProperty = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('search') || '';
    const initialType = searchParams.get('type') || 'All';

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(initialQuery);
    const [selectedType, setSelectedType] = useState(initialType);
    const [availabilityFilter, setAvailabilityFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    // Fetch properties
    const fetchProperties = (queryTerm = '') => {
        setLoading(true);
        let url = `${baseurl}/property/all`;
        if (queryTerm.trim()) {
            url = `${baseurl}/properties/search?address=${encodeURIComponent(queryTerm.trim())}`;
        }

        fetch(url)
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
                console.error("Error fetching properties:", err);
                setProperties([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchProperties(initialQuery);
        if (initialType) setSelectedType(initialType);
    }, [initialQuery, initialType]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchProperties(search);
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (search.trim()) next.set('search', search.trim());
            else next.delete('search');
            return next;
        });
    };

    const handleClearSearch = () => {
        setSearch('');
        fetchProperties('');
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.delete('search');
            return next;
        });
    };

    // Filter and Sort in Memory
    const filteredProperties = useMemo(() => {
        return properties
            .filter(prop => {
                // Type Filter
                if (selectedType !== 'All' && prop.type?.toLowerCase() !== selectedType.toLowerCase()) {
                    return false;
                }
                // Availability Filter
                if (availabilityFilter === 'available') {
                    return prop.status?.toLowerCase() === 'available' && (prop.available_room === undefined || prop.available_room > 0);
                }
                if (availabilityFilter === 'full') {
                    return prop.status?.toLowerCase() !== 'available' || prop.available_room === 0;
                }
                return true;
            })
            .sort((a, b) => {
                if (sortBy === 'newest') return (b.id || 0) - (a.id || 0);
                if (sortBy === 'rooms-high') return (b.total_room || 0) - (a.total_room || 0);
                if (sortBy === 'rooms-low') return (a.total_room || 0) - (b.total_room || 0);
                return 0;
            });
    }, [properties, selectedType, availabilityFilter, sortBy]);

    const typesList = ['All', 'Apartment', 'Villa', 'Flat', 'House'];

    return (
        <div className="w-full min-h-screen bg-base-100 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-8">
                    <span className="text-xs uppercase font-extrabold tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
                        Explore Spaces
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black text-base-content mt-2 tracking-tight">
                        Browse Properties
                    </h1>
                    <p className="text-sm text-base-content/70 mt-1">
                        Find verified apartments, flats, and houses with rooms open for immediate move-in.
                    </p>
                </div>

                {/* Filter and Search Box */}
                <div className="bg-base-200/50 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-base-200 shadow-sm mb-10 space-y-4">
                    {/* Search row */}
                    <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-primary text-lg" />
                            <input
                                type="text"
                                placeholder="Search by district, upazila, title, or address (e.g. Mirpur, Gulshan)..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="input input-bordered w-full rounded-2xl pl-11 pr-10 bg-base-100 text-sm focus:border-primary shadow-xs"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content cursor-pointer"
                                >
                                    <HiXMark className="text-lg" />
                                </button>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary rounded-2xl px-8 font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all text-sm"
                        >
                            Search
                        </button>
                    </form>

                    {/* Secondary filters row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-base-300/60">
                        {/* Type chips */}
                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-bold text-base-content/60 mr-1 flex items-center gap-1">
                                <HiOutlineBuildingOffice2 /> Type:
                            </span>
                            {typesList.map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setSelectedType(type)}
                                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                        selectedType === type
                                            ? 'bg-primary text-primary-content shadow-xs'
                                            : 'bg-base-100 text-base-content/70 hover:bg-base-300'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        {/* Availability & Sorting Dropdowns */}
                        <div className="flex items-center gap-3">
                            {/* Availability */}
                            <select
                                value={availabilityFilter}
                                onChange={(e) => setAvailabilityFilter(e.target.value)}
                                className="select select-sm select-bordered rounded-xl text-xs bg-base-100 cursor-pointer"
                            >
                                <option value="all">All Availability</option>
                                <option value="available">Available Only</option>
                                <option value="full">Full / Unavailable</option>
                            </select>

                            {/* Sort By */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="select select-sm select-bordered rounded-xl text-xs bg-base-100 cursor-pointer"
                            >
                                <option value="newest">Newest First</option>
                                <option value="rooms-high">Rooms: High to Low</option>
                                <option value="rooms-low">Rooms: Low to High</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Count Strip */}
                <div className="flex items-center justify-between mb-6 px-1">
                    <p className="text-sm font-semibold text-base-content/70">
                        Showing <span className="text-base-content font-bold">{filteredProperties.length}</span> properties
                        {search && <span> for "<span className="text-primary">{search}</span>"</span>}
                        {selectedType !== 'All' && <span> in <span className="text-secondary">{selectedType}</span></span>}
                    </p>

                    {(search || selectedType !== 'All' || availabilityFilter !== 'all') && (
                        <button
                            onClick={() => {
                                handleClearSearch();
                                setSelectedType('All');
                                setAvailabilityFilter('all');
                            }}
                            className="text-xs text-primary font-bold hover:underline cursor-pointer"
                        >
                            Clear All Filters
                        </button>
                    )}
                </div>

                {/* Properties Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(idx => (
                            <div key={idx} className="card bg-base-100 border border-base-200 rounded-2xl overflow-hidden shadow-sm animate-pulse">
                                <div className="h-60 bg-base-300 w-full"></div>
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
                    <div className="text-center py-20 bg-base-200/30 rounded-3xl border border-dashed border-base-300 p-8">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-base-content">No properties found</h3>
                        <p className="text-sm text-base-content/60 mt-1 max-w-md mx-auto">
                            We couldn't find any properties matching your current search criteria. Try loosening your filters or searching a different district.
                        </p>
                        <button
                            onClick={() => {
                                handleClearSearch();
                                setSelectedType('All');
                                setAvailabilityFilter('all');
                            }}
                            className="btn btn-primary btn-sm rounded-xl mt-6 px-6 font-bold"
                        >
                            Reset All Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProperties.map(property => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseProperty;
