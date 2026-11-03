import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { AuthContext } from '../../context/AuthProvider';
import { baseurl } from '../../services/BaseUrl';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiOutlineBuildingOffice2 } from "react-icons/hi2";

const EditProperty = () => {
    const { id } = useParams();
    const { accessToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'Apartment',
        total_room: 1,
        available_room: 1,
        status: 'available',
        district: '',
        upazila: '',
        address: '',
        cover_img: ''
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
                if (data && data.id) {
                    setFormData({
                        title: data.title || '',
                        description: data.description || '',
                        type: data.type || 'Apartment',
                        total_room: data.total_room || 1,
                        available_room: data.available_room ?? 1,
                        status: data.status || 'available',
                        district: data.district || '',
                        upazila: data.upazila || '',
                        address: data.address || '',
                        cover_img: data.cover_img || ''
                    });
                } else {
                    toast.error("Property not found");
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id, accessToken]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'total_room' || name === 'available_room' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
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
                toast.success(data.message || "Property updated successfully!");
                navigate('/owner/manage-property');
            } else {
                toast.error(data.detail || "Failed to update property");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error while updating property");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-base-content/60">
                <Link to="/owner/manage-property" className="hover:text-primary flex items-center gap-1">
                    <HiArrowLeft /> Back to Properties
                </Link>
                <span>/</span>
                <span className="text-base-content font-bold">Edit #{id}</span>
            </div>

            <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-xl p-6 sm:p-8 space-y-6">
                <div>
                    <span className="text-xs uppercase font-extrabold tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
                        Property Editor
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-base-content mt-2">
                        Edit Property Details
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
                            className="input input-bordered w-full rounded-2xl text-xs sm:text-sm"
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
                            rows="3"
                            className="textarea textarea-bordered w-full rounded-2xl text-xs sm:text-sm"
                        />
                    </div>

                    {/* Type & Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                Property Type
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="select select-bordered w-full rounded-2xl text-xs sm:text-sm"
                            >
                                <option value="Apartment">Apartment</option>
                                <option value="Villa">Villa</option>
                                <option value="Flat">Flat</option>
                                <option value="House">House</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="select select-bordered w-full rounded-2xl text-xs sm:text-sm"
                            >
                                <option value="available">Available</option>
                                <option value="unavailable">Unavailable</option>
                            </select>
                        </div>
                    </div>

                    {/* Rooms */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                Total Rooms
                            </label>
                            <input
                                type="number"
                                name="total_room"
                                value={formData.total_room}
                                onChange={handleChange}
                                min="1"
                                className="input input-bordered w-full rounded-2xl text-xs sm:text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                Available Rooms
                            </label>
                            <input
                                type="number"
                                name="available_room"
                                value={formData.available_room}
                                onChange={handleChange}
                                min="0"
                                max={formData.total_room}
                                className="input input-bordered w-full rounded-2xl text-xs sm:text-sm"
                                required
                            />
                        </div>
                    </div>

                    {/* District & Upazila */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                District
                            </label>
                            <input
                                type="text"
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                className="input input-bordered w-full rounded-2xl text-xs sm:text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                Upazila / Area
                            </label>
                            <input
                                type="text"
                                name="upazila"
                                value={formData.upazila}
                                onChange={handleChange}
                                className="input input-bordered w-full rounded-2xl text-xs sm:text-sm"
                                required
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="input input-bordered w-full rounded-2xl text-xs sm:text-sm"
                            required
                        />
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                            Cover Image URL
                        </label>
                        <input
                            type="url"
                            name="cover_img"
                            value={formData.cover_img}
                            onChange={handleChange}
                            className="input input-bordered w-full rounded-2xl text-xs sm:text-sm"
                        />
                        {formData.cover_img && (
                            <img
                                src={formData.cover_img}
                                alt="Preview"
                                className="h-32 w-full object-cover rounded-2xl mt-2 border border-base-200"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="pt-4 flex justify-end gap-3 border-t border-base-200">
                        <Link to="/owner/manage-property" className="btn btn-ghost rounded-2xl font-bold">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn btn-primary rounded-2xl px-8 font-bold shadow-md shadow-primary/25"
                        >
                            {saving ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                "Save Updates"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProperty;
