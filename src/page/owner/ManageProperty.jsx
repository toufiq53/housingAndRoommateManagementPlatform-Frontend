import React, { useContext, useEffect, useState } from 'react';
import { baseurl } from '../../services/BaseUrl';
import { AuthContext } from '../../context/AuthProvider';
import toast from 'react-hot-toast';
import { Link } from 'react-router';

const ManageProperty = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { accessToken } = useContext(AuthContext)

    const [property, setProperty] = useState([])

    const fetchProperty = () => {
        fetch(`${baseurl}/owner/my_property`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => setProperty(data))
    }

    useEffect(() => {
        fetchProperty()
    }, [])

    const deleteProperty = async (id) => {

            const confirmDelete = window.confirm(
            "Are you sure to delete this property?"
    )

    if (!confirmDelete) {
        return
    }
        const res = await fetch(`${baseurl}/owner/delete_property/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }


        })
        const data = await res.json()
        toast.success(data.message)
        fetchProperty()
    }

    console.log(property);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: '',
        total_room: 0,
        status: '',
        district: '',
        upazila: '',
        address: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === 'total_room' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData);

        // API call will go here
        const res = await fetch(`${baseurl}/owner/create_property`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        const data = await res.json()
        toast.success(data.message)
        fetchProperty()
        setIsModalOpen(false);
    };
    

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            <div className='max-w-6xl mx-auto'>


                {/* Header */}
                <div className="flex  justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold"> Manage Properties </h1>
                        <p className="text-gray-500 mt-1"> Add and manage your properties. </p>
                    </div>
                    {/* Add Property Button */}
                    <button
                        onClick={() => setIsModalOpen(true)} className="btn btn-primary" >
                        + Add Property
                    </button>
                </div>



                <div className="overflow-x-auto bg-base-100 rounded-xl shadow-md  ">

                    <table className="table ">

                        {/* Table Header */}
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Property</th>
                                <th>Location</th>
                                <th>Type</th>
                                <th>Rooms</th>
                                <th>Available</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>

                            {property.map((item, index) => (

                                <tr key={item.id}>

                                    {/* Serial */}
                                    <th>
                                        {index + 1}
                                    </th>

                                    {/* Property */}
                                    <td>
                                        <div className="flex items-center gap-3">

                                            <div className="avatar">

                                                <div className="mask mask-squircle w-12 h-12">

                                                    <img
                                                        src={
                                                            item.cover_img ||
                                                            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=200"
                                                        }
                                                        alt={item.title}
                                                    />

                                                </div>

                                            </div>

                                            <div>
                                                <div className="font-bold">
                                                    {item.title}
                                                </div>

                                                <div className="text-sm text-gray-500">
                                                    ID: {item.id}
                                                </div>
                                            </div>

                                        </div>
                                    </td>

                                    {/* Location */}
                                    <td>
                                        <div>
                                            {item.upazila}, {item.district}
                                        </div>

                                        <div className="text-xs text-gray-500">
                                            {item.address}
                                        </div>
                                    </td>

                                    {/* Type */}
                                    <td>
                                        {item.type}
                                    </td>

                                    {/* Total Rooms */}
                                    <td>
                                        {item.total_room}
                                    </td>

                                    {/* Available Rooms */}
                                    <td>
                                        <span className="font-medium">
                                            {item.available_room}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td>
                                        <div
                                            className={`badge ${item.status?.toLowerCase() === "available"
                                                ? "badge-success"
                                                : "badge-error"
                                                }`}
                                        >
                                            {item.status}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td>

                                        <div className="flex gap-2">
                                            <Link to={`/owner/edit/property/${item.id}`} >
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="btn btn-sm btn-outline btn-primary"
                                                >
                                                    Edit
                                                </button>
                                            </Link>



                                            <button
                                                onClick={() => deleteProperty(item.id)}
                                                className="btn btn-sm btn-outline btn-error"
                                            >
                                                Delete
                                            </button>

                                            <Link to={`/owner/view/rooms/${item.id}`} >
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="btn btn-sm btn-outline btn-primary"
                                                >
                                                    Manage Room
                                                </button>
                                            </Link>


                                         


                                        </div>

                                    </td>


                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>


                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                        <div className="bg-base-100 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-6 border-b">

                                <div>
                                    <h2 className="text-2xl font-bold">
                                        Add Property
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Enter your property information.
                                    </p>
                                </div>

                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn btn-sm btn-circle btn-ghost"
                                >
                                    ✕
                                </button>

                            </div>


                            {/* Form */}
                            <form
                                onSubmit={handleSubmit}
                                className="p-6 space-y-4"
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
                                        placeholder="Enter property title"
                                        className="input input-bordered w-full"
                                        required
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
                                        placeholder="Describe your property"
                                        className="textarea textarea-bordered w-full"
                                        rows="3"
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
                                            placeholder="Apartment / House"
                                            className="input input-bordered w-full"
                                            required
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
                                            required
                                        >
                                            <option value="">
                                                Select status
                                            </option>

                                            <option value="available">
                                                Available
                                            </option>

                                            <option value="unavailable">
                                                Unavailable
                                            </option>
                                        </select>
                                    </div>

                                </div>


                                {/* Total Room */}
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
                                        min='1'
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>


                                {/* District + Upazila */}
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
                                            placeholder="Enter district"
                                            className="input input-bordered w-full"
                                            required
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
                                            placeholder="Enter upazila"
                                            className="input input-bordered w-full"
                                            required
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
                                        placeholder="Enter full address"
                                        className="textarea textarea-bordered w-full"
                                        rows="2"
                                        required
                                    />
                                </div>


                                {/* Buttons */}
                                <div className="flex justify-end gap-3 pt-4 border-t">

                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="btn btn-ghost"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        Add Property
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>
                )}
            </div>

        </div>

    );
};

export default ManageProperty;
