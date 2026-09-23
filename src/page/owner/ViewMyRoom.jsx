import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import { Link, useParams } from 'react-router'
import { baseurl } from '../../services/BaseUrl'
import toast from 'react-hot-toast'

const ViewMyRoom = () => {

    const { accessToken } = useContext(AuthContext)
    const [rooms, setRooms] = useState([])
    const { id } = useParams();

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [formData, setFormData] = useState({
        property_id: id,
        room_number: '',
        rent: '',
        type: '',
        is_availables: true,
        capacity: '',
        current_members: ''
    });

    const fetchRooms = () => {
        fetch(`${baseurl}/specific_properties/${id}/all_room`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => setRooms(data))
    };

    useEffect(() => {
        if (!id || !accessToken) return
        fetchRooms();
    }, [id, accessToken]);

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(`${baseurl}/owner/create_room`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await res.json()

        if (!res.ok) {
            toast.error(data.detail)
            return;
        }

        toast.success(data.message)
        setIsModalOpen(false);

        setFormData({
            property_id: id,
            room_number: '',
            rent: '',
            type: '',
            is_availables: true,
            capacity: '',
            current_members: ''
        });

        fetchRooms()
    };

    const deleteRoom = async (room_id) => {

        const confirmDelete = window.confirm(
            "Are you sure to delete this room?"
        )
        if (!confirmDelete) {
            return
        }

        const res = await fetch(
            `${baseurl}/owner/delete_room/${room_id}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }

        )
        fetchRooms()
        const data = await res.json()

        if (!res.ok) {
            toast.error(data.detail)
            return;
        }

        toast.success(data.message)
        fetchRooms()
    };

    return (
        <div className="p-6 px-15">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">

                <div>
                    <h1 className="text-3xl font-bold">
                        My Rooms
                    </h1>
                    <p className="text-gray-500">
                        Manage rooms of this property
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary"
                >
                    + Add Room
                </button>

            </div>


            {/* Rooms */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {rooms.map(room => (

                    <div
                        key={room.id}
                        className="card bg-base-100 shadow-md hover:shadow-xl transition"
                    >

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

                        <div className="card-body">

                            <div className="flex justify-between items-start">

                                <h2 className="card-title">
                                    Room {room.room_number}
                                </h2>

                                <div className={`badge ${room.is_availables
                                    ? "badge-success"
                                    : "badge-error"
                                    }`}>
                                    {room.is_availables
                                        ? "Available"
                                        : "Unavailable"}
                                </div>

                            </div>

                            <p className="text-sm text-gray-500">
                                🏠 {room.type} Room
                            </p>

                            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">

                                <div>
                                    👥 Capacity: {room.capacity}
                                </div>

                                <div>
                                    🧑‍🤝‍🧑 {room.current_members} Members
                                </div>

                            </div>

                            <div className="card-actions items-center justify-between mt-4">

                                <div>
                                    <span className="text-2xl font-bold">
                                        ৳{room.rent}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        /month
                                    </span>
                                </div>

                                <div className="flex gap-2">

                                    <Link
                                        to={`/owner/room-edit/${room.id}`}
                                        className="btn btn-sm btn-primary"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        onClick={() => deleteRoom(room.id)}
                                        className="btn btn-sm btn-error"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        </div>
                    </div>

                ))}

            </div>


            {/* Add Room Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

                    <div className="bg-base-100 rounded-xl p-6 w-full max-w-lg">

                        <h2 className="text-2xl font-bold mb-4">
                            Add Room
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-3">

                            <input
                                type="number"
                                name="room_number"
                                value={formData.room_number}
                                onChange={handleChange}
                                placeholder="Room Number"
                                className="input input-bordered w-full"
                                required
                            />

                            <input
                                type="number"
                                name="rent"
                                value={formData.rent}
                                onChange={handleChange}
                                placeholder="Rent"
                                className="input input-bordered w-full"
                                required
                            />

                            <input
                                type="text"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                placeholder="Room Type"
                                className="input input-bordered w-full"
                                required
                            />

                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                placeholder="Capacity"
                                className="input input-bordered w-full"
                                required
                            />

                            <input
                                type="number"
                                name="current_members"
                                value={formData.current_members}
                                onChange={handleChange}
                                placeholder="Current Members"
                                className="input input-bordered w-full"
                            />

                            <select
                                name="is_availables"
                                value={formData.is_availables}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        is_availables: e.target.value === 'true'
                                    })
                                }
                                className="select select-bordered w-full"
                            >
                                <option value="true">Available</option>
                                <option value="false">Unavailable</option>
                            </select>

                            <div className="flex justify-end gap-2 pt-3">

                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Add Room
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

        </div>
    );
};

export default ViewMyRoom;