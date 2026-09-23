import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { baseurl } from '../services/BaseUrl';
import { useParams } from 'react-router';
import toast from 'react-hot-toast';

const RoomDetails = () => {

    const { accessToken } = useContext(AuthContext);
    const [room, setRoom] = useState(null);
    const { id } = useParams();

    const handleBook= async()=>{
        const res=await fetch(`${baseurl}/booking_room/${id}`,{
            method:'POST',
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
        })
        const data=await res.json()
        toast.success(data.message||data.detail)
        console.log(data);
    }

    useEffect(() => {
        if (!id || !accessToken) return;

        fetch(`${baseurl}/specific_room/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => setRoom(data))
            .catch(err => console.log(err));

    }, [id, accessToken]);

    console.log(room);

    if (!room) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Room Image */}
                <div>
                    <img
                        src={
                            room.cover_img ||
                            "https://images.unsplash.com/photo-1560185008-b033106af5c3?q=80&w=1000"
                        }
                        alt={`Room ${room.room_no}`}
                        className="w-full h-[450px] object-cover rounded-xl shadow-md"
                    />
                </div>

                {/* Room Information */}
                <div className="flex flex-col justify-between">

                    <div>

                        {/* Room Number + Status */}
                        <div className="flex justify-between items-start gap-4">

                            <div>
                                <p className="text-sm text-gray-500">
                                    {room.type} Room
                                </p>

                                <h1 className="text-4xl font-bold mt-1">
                                    Room {room.room_no}
                                </h1>
                            </div>

                            <div
                                className={`badge badge-lg ${
                                    room.is_availables
                                        ? "badge-success"
                                        : "badge-error"
                                }`}
                            >
                                {room.is_availables
                                    ? "Available"
                                    : "Unavailable"}
                            </div>

                        </div>

                        {/* Rent */}
                        <div className="mt-6">

                            <span className="text-4xl font-bold">
                                ৳{room.rent}
                            </span>

                            <span className="text-gray-500 ml-2">
                                /month
                            </span>

                        </div>

                        {/* Room Information */}
                        <div className="grid grid-cols-2 gap-4 mt-8">

                            <div className="bg-base-200 rounded-lg p-4">
                                <p className="text-sm text-gray-500">
                                    Room Type
                                </p>

                                <p className="font-semibold text-lg">
                                    🏠 {room.type}
                                </p>
                            </div>

                            <div className="bg-base-200 rounded-lg p-4">
                                <p className="text-sm text-gray-500">
                                    Room Number
                                </p>

                                <p className="font-semibold text-lg">
                                    🚪 {room.room_no}
                                </p>
                            </div>

                            <div className="bg-base-200 rounded-lg p-4">
                                <p className="text-sm text-gray-500">
                                    Capacity
                                </p>

                                <p className="font-semibold text-lg">
                                    👥 {room.capacity} Person
                                </p>
                            </div>

                            <div className="bg-base-200 rounded-lg p-4">
                                <p className="text-sm text-gray-500">
                                    Current Members
                                </p>

                                <p className="font-semibold text-lg">
                                    🧑‍🤝‍🧑 {room.current_members}
                                </p>
                            </div>

                        </div>

                        {/* Availability Information */}
                        <div className="mt-8">

                            <h2 className="text-xl font-semibold mb-2">
                                Room Availability
                            </h2>

                            <p className="text-gray-600">
                                This room currently has{" "}
                                <span className="font-semibold">
                                    {room.current_members}
                                </span>{" "}
                                member
                                {room.current_members !== 1 && "s"} out of a
                                maximum capacity of{" "}
                                <span className="font-semibold">
                                    {room.capacity}
                                </span>.
                            </p>

                        </div>

                    </div>

                    {/* Book Now */}
                    <div className="mt-8">

                        <button
                        onClick={handleBook}
                            className="btn btn-primary btn-lg w-full"
                            disabled={!room.is_availables}
                        >
                            {room.is_availables
                                ? "Book Now"
                                : "Room Unavailable"}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default RoomDetails;

