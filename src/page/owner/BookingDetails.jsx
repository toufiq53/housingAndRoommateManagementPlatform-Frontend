import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { baseurl } from '../../services/BaseUrl';
import toast from 'react-hot-toast';

const BookingDetails = () => {
    const { accessToken } = useContext(AuthContext);

    const [bookings, setBookings] = useState([]);

    const fetchBookings = () => {
        fetch(`${baseurl}/owner/bookings`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log('Booking data:', data);
                setBookings(data);
            });
    };

    useEffect(() => {
        if (!accessToken) return;

        fetchBookings();
    }, [accessToken]);

    const handleAccept = async (booking_id) => {

        const res = await fetch(`${baseurl}/owner/create_Records`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                booking_id: booking_id
            })
        });

        const data = await res.json();

        if (!res.ok) {
            toast.error(data.detail);
            return;
        }

        toast.success(data.message);

        fetchBookings();
    };

    return (
        <div className="p-6 w-auto  px-10">

            <h1 className="text-3xl font-bold mb-6">
                Booking Details
            </h1>

            {bookings.length === 0 ? (
                <p className="text-gray-500">
                    No booking found.
                </p>
            ) : (
                <div className="space-y-4">

                    {bookings.map(booking => (

                        <div
                            key={booking.id}
                            className="card bg-base-100 shadow-md p-5"
                        >

                            <h2 className="text-xl font-bold">
                                Booking #{booking.id}
                            </h2>

                            <p>
                                Room: {booking.room_id}
                            </p>

                            <p>
                                User: {booking.user_id}
                            </p>

                            <p>
                                Property: {booking.property_id}
                            </p>

                            <p>
                                Status:{' '}
                                <span
                                    className={`badge ${booking.status === 'accepted'
                                            ? 'badge-success'
                                            : 'badge-warning'
                                        }`}
                                >
                                    {booking.status}
                                </span>
                            </p>

                            <p>
                                Payment:{' '}
                                {booking.payment
                                    ? 'Paid'
                                    : 'Not Paid'}
                            </p>

                            {booking.status === 'pending' && (
                                <button
                                    onClick={() =>
                                        handleAccept(booking.id)
                                    }
                                    className="btn btn-primary mt-3 w-50"
                                >
                                    Accept Booking
                                </button>
                            )}

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
};

export default BookingDetails;