import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from '../../context/AuthProvider';
import { baseurl } from '../../services/BaseUrl';
import toast from 'react-hot-toast';

const EditProperty = () => {

    const { id } = useParams(); // property.id
    const { accessToken } = useContext(AuthContext);

    const [property, setProperty] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: '',
        total_room: '',
        available_room: '',
        status: '',
        district: '',
        upazila: '',
        address: ''
    });

    useEffect(() => {
        if (!id || !accessToken) return;

        fetch(`${baseurl}/owner/specific_property/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setProperty(data);

                setFormData({
                    title: data.title || '',
                    description: data.description || '',
                    type: data.type || '',
                    total_room: data.total_room || '',
                    available_room: data.available_room || '',
                    status: data.status || '',
                    district: data.district || '',
                    upazila: data.upazila || '',
                    address: data.address || ''
                });
            })
            .catch(err => console.log(err));

    }, [id, accessToken]);


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData);
     const res = await fetch(`${baseurl}/owner/update_property/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (res.ok) {
            toast.success(data.message);
        } else {
            toast.error(data.detail);
        }
    };
    


    if (!property) {
        return (
            <div className="p-6">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }


    return (
        <div className="max-w-3xl mx-auto p-6">

            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    Edit Property
                </h1>

                <p className="text-gray-500 mt-1">
                    Update your property information.
                </p>
            </div>


            <div className="bg-base-100 rounded-xl shadow-md p-6">

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Title */}
                    <div>
                        <label className="label">
                            <span className="label-text font-medium">
                                Property Title
                            </span>
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                        />
                    </div>


                    {/* Description */}
                    <div>
                        <label className="label">
                            <span className="label-text font-medium">
                                Description
                            </span>
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="textarea textarea-bordered w-full"
                            rows="4"
                        />
                    </div>


                    {/* Type + Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                            <label className="label">
                                <span className="label-text font-medium">
                                    Property Type
                                </span>
                            </label>

                            <input
                                type="text"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                        </div>


                        <div>
                            <label className="label">
                                <span className="label-text font-medium">
                                    Status
                                </span>
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="select select-bordered w-full"
                            >
                                <option value="Available">
                                    Available
                                </option>

                                <option value="Unavailable">
                                    Unavailable
                                </option>
                            </select>
                        </div>

                    </div>


                    {/* Rooms */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                            <label className="label">
                                <span className="label-text font-medium">
                                    Total Rooms
                                </span>
                            </label>

                            <input
                                type="number"
                                name="total_room"
                                value={formData.total_room}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                        </div>


                        <div>
                            <label className="label">
                                <span className="label-text font-medium">
                                    Available Rooms
                                </span>
                            </label>

                            <input
                                type="number"
                                name="available_room"
                                value={formData.available_room}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                        </div>

                    </div>


                    {/* Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                            <label className="label">
                                <span className="label-text font-medium">
                                    District
                                </span>
                            </label>

                            <input
                                type="text"
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                        </div>


                        <div>
                            <label className="label">
                                <span className="label-text font-medium">
                                    Upazila
                                </span>
                            </label>

                            <input
                                type="text"
                                name="upazila"
                                value={formData.upazila}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                        </div>

                    </div>


                    {/* Address */}
                    <div>
                        <label className="label">
                            <span className="label-text font-medium">
                                Address
                            </span>
                        </label>

                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="textarea textarea-bordered w-full"
                            rows="3"
                        />
                    </div>


                    {/* Submit */}
                    <div className="flex justify-end">

                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Update Property
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default EditProperty;