import React, { useEffect, useState } from 'react';
import { baseurl } from '../services/BaseUrl';
import PropertyCard from './PropertyCard';

const FeatureProperty = () => {
    const [featureProperty, setFeatureProperty] = useState([]);
    const [loading,setloading]=useState(true)

    useEffect(() => {
        fetch(`${baseurl}/property/all`)
            .then(res => res.json())
            .then(data => {
               setFeatureProperty(data); 
               setloading(false)
            })
    }, []);

    return (
        <div className="w-full">

            {/* Heading */}
            <div className="text-center py-10 sm:py-12 md:py-16 px-4">
                <h1 className="text-3xl sm:text-4xl font-bold">
                    Feature Property
                </h1>

                <p className="text-sm sm:text-base">
                    Let's find your Room
                </p>
            </div>


            {/* Property Cards */}
            <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 pb-10 lg:gap-20">
 {
                loading ? (
                    <div className="col-span-full flex justify-center">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) :(featureProperty
                        .slice(0, 4)
                        .map(property => (
                            <PropertyCard
                                property={property}
                                key={property.id}
                            />
                        ))
                    )
                
                    
                }

            </div>

        </div>
    );
};

export default FeatureProperty;