import React, { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import { baseurl } from '../services/BaseUrl';

const BrowseProperty = () => {

    const [property, setProperty] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch(`${baseurl}/property/all`)
            .then(res => res.json())
            .then(data => setProperty(data));
    }, []);

    const handleSearch = () => {
        fetch(`${baseurl}/properties/search?address=${search}`)
            .then(res => res.json())
            .then(data => setProperty(data));
    };

    return (
        <div className="w-full">

            {/* Search Section */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 py-6 px-4 ">

                <input
                    type="text"
                    placeholder="Search by location"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input input-bordered w-full sm:w-80"
                />

                <button
                    onClick={handleSearch}
                    className="btn btn-primary w-full sm:w-auto"
                >
                    Search
                </button>

            </div>


            {/* Property Cards */}
            <div className=" w-full max-w-7xl mx-auto px-4  sm:px-6 lg:px-8 py-6 sm:py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">

                {
                    property.map(property => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                        />
                    ))
                }

            </div>

        </div>
    );
};

export default BrowseProperty;