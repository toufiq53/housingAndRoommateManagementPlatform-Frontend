
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { baseurl } from '../../services/BaseUrl';
import { AuthContext } from '../../context/AuthProvider';

const OwnerDashBoard = () => {

    const { accessToken } = useContext(AuthContext);

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!accessToken) return;

        fetch(`${baseurl}/owner/my_property`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setProperty(data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });

    }, [accessToken]);


    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }


    if (!property) {
        return (
            <div className="min-h-screen bg-base-200 flex justify-center items-center p-6">

                <div className="card bg-base-100 shadow-xl max-w-lg w-full">
                    <div className="card-body text-center">

                        <div className="text-6xl mb-4">
                            🏠
                        </div>

                        <h2 className="text-2xl font-bold">
                            No Property Found
                        </h2>

                        <p className="text-gray-500">
                            You haven't created your property yet.
                        </p>

                    </div>
                </div>

            </div>
        );
    }


    return (
        <div className="min-h-screen bg-base-200">

            {/* Header */}
            <div className="bg-base-100 border-b">

                <div className="max-w-7xl mx-auto px-6 py-6">

                    <h1 className="text-3xl font-bold">
                        Owner Dashboard
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage your property, rooms and bookings.
                    </p>

                </div>
                
            </div>

            {/* Main */}
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Quick Actions */}
                <div>
                    <h2 className="text-xl font-bold mb-4">
                        Quick Actions
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                        {/* Manage Property */}
                        <Link
                            to="/owner/manage-property"
                            className="card bg-base-100 shadow hover:shadow-lg transition"
                        >

                            <div className="card-body">

                                <div className="text-3xl">
                                    🏠
                                </div>

                                <h3 className="card-title">
                                    Manage Property
                                </h3>

                                <p className="text-gray-500">
                                    View, edit or delete your property.
                                </p>

                            </div>

                        </Link>

                        {/* Bookings */}
                        <Link
                            to="/owner/manage-booking-details"
                            className="card bg-base-100 shadow hover:shadow-lg transition"
                        >

                            <div className="card-body">

                                <div className="text-3xl">
                                    📋
                                </div>

                                <h3 className="card-title">
                                    See Bookings
                                </h3>

                                <p className="text-gray-500">
                                    Review and manage tenant bookings.
                                </p>

                            </div>

                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default OwnerDashBoard;

