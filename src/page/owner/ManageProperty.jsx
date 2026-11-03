import React, { useContext, useEffect, useState } from 'react';
import { baseurl } from '../../services/BaseUrl';
import { AuthContext } from '../../context/AuthProvider';
import toast from 'react-hot-toast';
import { Link } from 'react-router';
import {
    HiOutlineBuildingOffice2,
    HiOutlinePlusCircle,
    HiOutlineMapPin,
    HiOutlineTrash,
    HiOutlinePencilSquare,
    HiXMark
} from "react-icons/hi2";
import { MdMeetingRoom } from "react-icons/md";

const ManageProperty = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { accessToken } = useContext(AuthContext);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'Apartment',
        total_room: 1,
        status: 'available',
        district: 'Dhaka',
        upazila: '',
        address: '',
        cover_img: ''
    });

    const fetchProperties = () => {
        setLoading(true);
        fetch(`${baseurl}/owner/my_property`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProperties(data);
                } else {
                    setProperties([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching properties:", err);
                setProperties([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (accessToken) {
            fetchProperties();
        }
    }, [accessToken]);

    const deleteProperty = async (id, title) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${title}"? All associated rooms and bookings will also be removed.`);
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${baseurl}/owner/delete_property/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "Property deleted successfully");
                fetchProperties();
            } else {
                toast.error(data.detail || "Failed to delete property");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete property");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'total_room' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.address.trim() || !formData.district.trim()) {
            toast.error("Please fill in required fields");
            return;
        }

        try {
            const res = await fetch(`${baseurl}/owner/create_property`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.detail || "Failed to create property");
                return;
            }

            toast.success(data.message || "Property added successfully!");
            setIsModalOpen(false);
            setFormData({
                title: '',
                description: '',
                type: 'Apartment',
                total_room: 1,
                status: 'available',
                district: 'Dhaka',
                upazila: '',
                address: '',
                cover_img: ''
            });
            fetchProperties();
        } catch (error) {
            console.error(error);
            toast.error("Network error while creating property");
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span className="text-xs uppercase font-extrabold tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
                        Property Portfolio
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-base-content mt-2 tracking-tight">
                        Manage Properties
                    </h1>
                    <p className="text-xs sm:text-sm text-base-content/65 mt-0.5">
                        Add, edit, and organize all your accommodations and individual rooms.
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary btn-sm rounded-xl font-bold flex items-center gap-2 shadow-md shadow-primary/25 cursor-pointer"
                >
                    <HiOutlinePlusCircle className="text-base" />
                    <span>Add New Property</span>
                </button>
            </div>

            {/* Properties Table / Cards */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : properties.length === 0 ? (
                <div className="text-center py-20 bg-base-100 rounded-3xl border border-dashed border-base-200 p-8 space-y-3">
                    <div className="text-5xl">🏢</div>
                    <h2 className="text-xl font-bold text-base-content">No Properties Found</h2>
                    <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                        You have not listed any properties yet. Click the button below to add your first listing!
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-primary btn-sm rounded-xl font-bold mt-2 px-6"
                    >
                        + Add Your First Property
                    </button>
                </div>
            ) : (
                <div className="bg-base-100 rounded-3xl border border-base-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full text-xs sm:text-sm">
                            <thead className="bg-base-200/60 text-base-content/70 uppercase text-[10px] tracking-wider font-extrabold">
                                <tr>
                                    <th>#</th>
                                    <th>Property</th>
                                    <th>Location</th>
                                    <th>Type</th>
                                    <th>Total Rooms</th>
                                    <th>Available</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-base-200/40 transition-colors">
                                        <th className="font-bold text-base-content/50">{index + 1}</th>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={
                                                        item.cover_img ||
                                                        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=200"
                                                    }
                                                    alt={item.title}
                                                    className="w-12 h-12 rounded-xl object-cover shrink-0 bg-base-300"
                                                />
                                                <div className="min-w-0">
                                                    <div className="font-extrabold text-base-content line-clamp-1">{item.title}</div>
                                                    <div className="text-[11px] text-base-content/50 font-normal">ID #{item.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="font-semibold text-base-content">{item.upazila || "City"}, {item.district}</div>
                                            <div className="text-[11px] text-base-content/50 truncate max-w-[150px]">{item.address}</div>
                                        </td>
                                        <td>
                                            <span className="badge badge-neutral badge-xs font-bold">{item.type}</span>
                                        </td>
                                        <td className="font-bold text-base-content">{item.total_room}</td>
                                        <td>
                                            <span className="font-extrabold text-emerald-600">{item.available_room}</span>
                                        </td>
                                        <td>
                                            <span
                                                className={`badge badge-xs font-bold ${
                                                    item.status?.toLowerCase() === 'available'
                                                        ? 'badge-success'
                                                        : 'badge-error'
                                                }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    to={`/owner/view/rooms/${item.id}`}
                                                    className="btn btn-primary btn-xs rounded-lg font-bold"
                                                    title="Manage Rooms"
                                                >
                                                    <MdMeetingRoom /> Rooms
                                                </Link>
                                                <Link
                                                    to={`/owner/edit/property/${item.id}`}
                                                    className="btn btn-outline btn-xs rounded-lg font-bold"
                                                    title="Edit Property"
                                                >
                                                    <HiOutlinePencilSquare /> Edit
                                                </Link>
                                                <button
                                                    onClick={() => deleteProperty(item.id, item.title)}
                                                    className="btn btn-ghost btn-xs text-error rounded-lg"
                                                    title="Delete Property"
                                                >
                                                    <HiOutlineTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add Property Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                    <div className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-base-200">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-base-200">
                            <div>
                                <h3 className="text-xl font-black text-base-content">Add New Property</h3>
                                <p className="text-xs text-base-content/60 mt-0.5">Fill out your accommodation details.</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="btn btn-ghost btn-circle btn-sm"
                            >
                                <HiXMark className="text-lg" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
                            {/* Title */}
                            <div>
                                <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                    Property Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Skyline Luxury Residence"
                                    className="input input-bordered input-sm w-full rounded-xl text-xs"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Highlight building features, security, lift, generator, terrace..."
                                    className="textarea textarea-bordered w-full rounded-xl text-xs"
                                    rows="2"
                                />
                            </div>

                            {/* Type & Total Rooms */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                        Property Type
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="select select-bordered select-sm w-full rounded-xl text-xs"
                                    >
                                        <option value="Apartment">Apartment</option>
                                        <option value="Villa">Villa</option>
                                        <option value="Flat">Flat</option>
                                        <option value="House">House</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                        Total Rooms *
                                    </label>
                                    <input
                                        type="number"
                                        name="total_room"
                                        value={formData.total_room}
                                        onChange={handleChange}
                                        min="1"
                                        className="input input-bordered input-sm w-full rounded-xl text-xs"
                                        required
                                    />
                                </div>
                            </div>

                            {/* District & Upazila */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                        District *
                                    </label>
                                    <input
                                        type="text"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        placeholder="e.g. Dhaka"
                                        className="input input-bordered input-sm w-full rounded-xl text-xs"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                        Upazila / Area *
                                    </label>
                                    <input
                                        type="text"
                                        name="upazila"
                                        value={formData.upazila}
                                        onChange={handleChange}
                                        placeholder="e.g. Mirpur"
                                        className="input input-bordered input-sm w-full rounded-xl text-xs"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                    Full Address *
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Sector 10, Road 4, House 12"
                                    className="input input-bordered input-sm w-full rounded-xl text-xs"
                                    required
                                />
                            </div>

                            {/* Cover Image URL */}
                            <div>
                                <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                    Cover Photo URL (optional)
                                </label>
                                <input
                                    type="url"
                                    name="cover_img"
                                    value={formData.cover_img}
                                    onChange={handleChange}
                                    placeholder="https://images.unsplash.com/..."
                                    className="input input-bordered input-sm w-full rounded-xl text-xs"
                                />
                                {formData.cover_img && (
                                    <img
                                        src={formData.cover_img}
                                        alt="Preview"
                                        className="h-28 w-full object-cover rounded-xl mt-2 border border-base-200"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 pt-4 border-t border-base-200">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn btn-ghost btn-sm rounded-xl font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-sm rounded-xl font-bold px-6 shadow-md shadow-primary/25"
                                >
                                    Create Property
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageProperty;
