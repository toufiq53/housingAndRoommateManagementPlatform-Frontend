import React, { useContext, useEffect, useState } from 'react';
import { baseurl } from '../../services/BaseUrl';
import { AuthContext } from '../../context/AuthProvider';

const BrowseProfile = () => {

    const [profile, setProfile] = useState([]);
    const { accessToken,authUser } = useContext(AuthContext);

    useEffect(() => {
        fetch(`${baseurl}/profile/all`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProfile(data);
                } else {
                    setProfile([]);
                }
            });

    }, [accessToken]);

    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Browse Profiles
            </h1>

            {Array.isArray(profile) && profile.length > 0 ? (

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {profile.map(item => (

                        <div
                            key={item.id}
                            className="card bg-base-100 shadow-md"
                        >

                            <div className="card-body">

                                <div className="flex justify-center">
                                    <div className="avatar">
                                        <div className="w-24 rounded-full">
                                            <img
                                                src="https://images.unsplash.com/photo-1740252117044-2af197eea287?w=500&auto=format&fit=crop&q=60"
                                                alt="Profile"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <h2 className="card-title justify-center mt-2">
                                    {item.gender}
                                </h2>

                                <p>
                                    <span className="font-medium">
                                        Age:
                                    </span>{' '}
                                    {item.age}
                                </p>

                                <p>
                                    <span className="font-medium">
                                        Occupation:
                                    </span>{' '}
                                    {item.occupation}
                                </p>

                                <p>
                                    <span className="font-medium">
                                        Location:
                                    </span>{' '}
                                    {item.renting_location}
                                </p>

                                <p>
                                    <span className="font-medium">
                                        Budget:
                                    </span>{' '}
                                    ৳{item.budget}
                                </p>

                                <p className="text-gray-500">
                                    {item.description}
                                </p>

                                <div className="card-actions justify-end mt-4">
                                    <button className="btn btn-primary">
                                        Contact
                                    </button>
                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            ) : (

                <div className="text-center py-16">

                    <h2 className="text-2xl font-bold">
                       
                        Profile Not Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        No roommate profiles are available.
                    </p>

                </div>

            )}

        </div>
    );
};

export default BrowseProfile;