import React, { useContext, useEffect, useState } from 'react';
import { baseurl } from '../services/BaseUrl';
import { AuthContext } from '../context/AuthProvider';
import toast from 'react-hot-toast';

const MyBooking = () => {

    const [myBooking, setMyBooking] = useState([]);
    const { accessToken } = useContext(AuthContext);

    // fetching Booking data
    const fetchBooking = () => {
        fetch(`${baseurl}/booking/my`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => setMyBooking(data))
            .catch(err => console.log(err));
    }

    const cancelBooking = async (id) => {
        const res = await fetch(`${baseurl}/booking_room/cancel/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
            

        })
        const data = await res.json()
        toast.success(data.message)
        fetchBooking()
    }
     const bookingPayment = async (id) => {
    const payRes = await fetch(`${baseurl}/booking/payment/${id}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    const payData = await payRes.json();

    if (!payRes.ok) {
        toast.error(payData.detail);
        return;
    }

    toast.success(payData.message);
    fetchBooking();
};

    useEffect(() => {

        if (!accessToken) return;

        fetchBooking()

    }, [accessToken]);

    console.log(myBooking);

    return (
        <div className="max-w-6xl mx-auto p-6">

            {/* Page Title */}
            <div className="mb-8">

                <h1 className="text-3xl font-bold">
                    My Bookings
                </h1>

                <p className="text-gray-500 mt-1">
                    View and manage your room booking requests.
                </p>

            </div>

            {/* No Booking */}
            {myBooking.length === 0 ? (

                <div className="text-center py-20">

                    <div className="text-6xl mb-4">
                        🏠
                    </div>

                    <h2 className="text-2xl font-semibold">
                        No Bookings Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        You haven't made any room booking yet.
                    </p>

                </div>

            ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {myBooking.map(booking => (

                        <div
                            key={booking.id}
                            className="card bg-base-100 shadow-md hover:shadow-xl transition"
                        >

                            {/* Card Header */}
                            <div className="card-body">

                                <div className="flex justify-between items-start">

                                    <div>
                                        <h2 className="card-title">
                                            Booking #{booking.id}
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            Room {booking.room_id}
                                        </p>
                                    </div>

                                    {/* Status */}
                                    <div
                                        className={`badge ${booking.status === "accepted"
                                                ? "badge-success"
                                                : booking.status === "rejected"
                                                    ? "badge-error"
                                                    : "badge-warning"
                                            }`}
                                    >
                                        {booking.status}
                                    </div>

                                </div>

                                {/* Booking Information */}
                                <div className="mt-5 space-y-3">

                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            Property
                                        </span>

                                        <span className="font-medium">
                                            #{booking.property_id}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            Room number
                                        </span>

                                        <span className="font-medium">
                                            {booking.room_number}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            Booking date
                                        </span>

                                        <span className="font-medium">
                                            {booking.created_date}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            Payment
                                        </span>

                                        <span
                                            className={
                                                booking.payment
                                                    ? "text-green-600 font-medium"
                                                    : "text-red-500 font-medium"
                                            }
                                        >
                                            {booking.payment
                                                ? "Paid"
                                                : "Unpaid"}
                                        </span>
                                    </div>

                                </div>

                                {/* Action */}
                                <div className='flex  justify justify-between'>
                                    <div className="card-actions  mt-5">

                                    <button onClick={() => cancelBooking(booking.id)} className="btn btn-outline btn-primary">
                                        Cancel
                                    </button>

                                </div>
                                 <div className="card-actions  mt-5">

                                    <button onClick={() => bookingPayment(booking.id)} className="btn btn-outline btn-primary">
                                        payment
                                    </button>

                                </div>
                                </div>
                                

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
};

export default MyBooking;

