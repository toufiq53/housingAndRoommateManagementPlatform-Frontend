
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { baseurl } from '../services/BaseUrl';
import { Link, useParams } from 'react-router';

const ViewRoom = () => {
    const { accessToken } = useContext(AuthContext);
    const [rooms, setRooms] = useState([]);
    const { id } = useParams();  //property.id
    const [order, setOrder] = useState('asc')

    //fetching all room
    const fetchRooms = () => {
    fetch(`${baseurl}/specific_properties/${id}/all_room`, {
        
    })
        .then(res => res.json())
        .then(data => setRooms(data))
        .catch(err => console.log(err));
};

    //useeffect
    useEffect(() => {
       

        fetchRooms()

    }, [id]);

//    sorting
    const sortRooms = () => {

        fetch(`${baseurl}/rooms/sort?property_id=${id}&order=${order}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => setRooms(data))
            .catch(err => console.log(err));

    }
    //filter
    const filterRooms = async (type) => {
    const res = await fetch(
        `${baseurl}/specific_properties/${id}/all_room?type=${type}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );

    const data = await res.json();
    setRooms(data);
};


    return (
        <div>

            <div className=''>
                <div className="flex justify-end px-15 pt-6 gap-2">

                    <select
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        className="select select-bordered"
                    >
                        <option value="asc">
                            Price: Low to High
                        </option>

                        <option value="desc">
                            Price: High to Low
                        </option>
                    </select>

                    <button
                        onClick={sortRooms}
                        className="btn btn-primary"
                    >
                        Sort
                    </button>
                </div>

                <div className='flex pt-5 justify-end px-15'>
                    <span className="mr-2">Filter by</span>

                    <form className="filter">
                        <input
                            className="btn"
                            type="checkbox"
                            aria-label="single"
                            onChange={() => filterRooms('Single')}
                        />

                        <input
                            className="btn"
                            type="checkbox"
                            aria-label="shared"
                            onChange={() => filterRooms('Shared')}
                        />

                        <input
                            className="btn"
                            type="checkbox"
                            aria-label="Double"
                            onChange={() => filterRooms('Double')}
                        />

                        <input
                            className="btn btn-square"
                            type="reset"
                            value="×"
                            onClick={fetchRooms}
                        />
                    </form>
                </div>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 px-15">

                {rooms.map(room => (

                    <div
                        key={room.id}
                        className="card bg-base-100 shadow-md hover:shadow-xl transition"
                    >

                        {/* Room Image */}
                        <figure>
                            <img
                                src={
                                    room.cover_img ||
                                    "https://images.unsplash.com/photo-1560185008-b033106af5c3?q=80&w=800"
                                }
                                alt={`Room ${room.room_number}`}
                                className="h-52 w-full object-cover"
                            />
                        </figure>

                        {/* Card Body */}
                        <div className="card-body">

                            {/* Room Number + Status */}
                            <div className="flex justify-between items-start gap-2">

                                <h2 className="card-title">
                                    Room {room.id}
                                </h2>

                                <div
                                    className={`badge ${room.is_availables
                                        ? "badge-success"
                                        : "badge-error"
                                        }`}
                                >
                                    {room.is_availables
                                        ? "Available"
                                        : "Unavailable"}
                                </div>

                            </div>

                            {/* Room Type */}
                            <p className="text-sm text-gray-500">
                                🏠 {room.type} Room
                            </p>

                            {/* Room Information */}
                            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">

                                <div>
                                    👥{" "}
                                    <span className="font-medium">
                                        Capacity: {room.capacity}
                                    </span>
                                </div>

                                <div>
                                    🧑‍🤝‍🧑{" "}
                                    <span className="font-medium">
                                        {room.current_members} Members
                                    </span>
                                </div>

                                <div>
                                    🚪{" "}
                                    <span className="font-medium">
                                        Room {room.room_number}
                                    </span>
                                </div>

                                <div>
                                    🏠{" "}
                                    <span className="font-medium">
                                        {room.type}
                                    </span>
                                </div>

                            </div>

                            {/* Rent + Button */}
                            <div className="card-actions items-center justify-between mt-4">

                                <div>
                                    <span className="text-2xl font-bold">
                                        ৳{room.rent}
                                    </span>

                                    <span className="text-sm text-gray-500">
                                        /month
                                    </span>
                                </div>

                                <Link to={`/room-details/${room.id}`}>
                                    <button className="btn btn-primary">
                                        View Details
                                    </button>
                                </Link>

                            </div>

                        </div>
                    </div>

                ))}

            </div>
        </div>
    );
};

export default ViewRoom;

