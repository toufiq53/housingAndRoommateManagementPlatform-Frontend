import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from '../../context/AuthProvider';
import { baseurl } from '../../services/BaseUrl';
import toast from 'react-hot-toast';

const EditRoom = () => {

    const { id } = useParams();
    const { accessToken } = useContext(AuthContext);

    const [room, setRoom] = useState({
        room_no: '',
        rent: '',
        type: '',
        is_availables: true,
        capacity: '',
        current_members: ''
    });

    useEffect(() => {

        fetch(`${baseurl}/owner/my/specific_room/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => setRoom(data));

    }, [id, accessToken]);


    const handleChange = (e) => {

        const { name, value } = e.target;

        setRoom({
            ...room,
            [name]: value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        const res = await fetch(
            `${baseurl}/owner/update_room/${id}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(room)
            }
        );

        const data = await res.json();

        if (res.ok) {
            toast.success(data.message);
        } else {
            toast.error(data.detail);
        }
    };


    return (
        <div className="max-w-3xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-6">
                Edit Room
            </h1>
            <div className="bg-base-100 rounded-xl shadow-md p-6">


                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <div>
                        <label className="block mb-1 font-medium">Room Number</label>
                        <input
                            type="number"
                            name="room_no"
                            value={room.room_no}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Rent</label>
                        <input
                            type="number"
                            name="rent"
                            value={room.rent}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Room Type</label>
                        <input
                            type="text"
                            name="type"
                            value={room.type}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Capacity</label>
                        <input
                            type="number"
                            name="capacity"
                            value={room.capacity}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Current Members</label>
                        <input
                            type="number"
                            name="current_members"
                            value={room.current_members}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                        />
                    </div>

                    <select
                        name="is_availables"
                        value={room.is_availables}
                        onChange={(e) =>
                            setRoom({
                                ...room,
                                is_availables: e.target.value === 'true'
                            })
                        }
                        className="select select-bordered w-full"
                    >
                        <option value="true">Available</option>
                        <option value="false">Unavailable</option>
                    </select>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                    >
                        Update Room
                    </button>

                </form>
            </div>
        </div>
    );
};

export default EditRoom;