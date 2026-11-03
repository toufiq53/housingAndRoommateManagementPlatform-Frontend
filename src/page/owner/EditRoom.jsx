import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { AuthContext } from '../../context/AuthProvider';
import { baseurl } from '../../services/BaseUrl';
import toast from 'react-hot-toast';
import { HiArrowLeft } from "react-icons/hi2";

const EditRoom = () => {
    const { id } = useParams(); // room_id
    const { accessToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [propertyId, setPropertyId] = useState(null);

    const [formData, setFormData] = useState({
        room_number: '',
        rent: '',
        type: 'Single',
        is_availables: true,
        capacity: 1,
        current_members: 0,
        cover_img: ''
    });

    useEffect(() => {
        if (!id || !accessToken) return;

        fetch(`${baseurl}/owner/my/specific_room/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data && data.id) {
                    setPropertyId(data.property_id);
                    setFormData({
                        room_number: data.room_number ?? '',
                        rent: data.rent ?? '',
                        type: data.type || 'Single',
                        is_availables: data.is_availables ?? true,
                        capacity: data.capacity ?? 1,
                        current_members: data.current_members ?? 0,
                        cover_img: data.cover_img || ''
                    });
                } else {
                    toast.error("Room not found");
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
            [name]: name === 'room_number' || name === 'rent' || name === 'capacity' || name === 'current_members'
                ? Number(value)
                : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`${baseurl}/owner/update_room/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message || "Room updated successfully!");
                if (propertyId) {
                    navigate(`/owner/view/rooms/${propertyId}`);
                } else {
                    navigate('/owner/manage-property');
                }
            } else {
                toast.error(data.detail || "Failed to update room");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error while updating room");
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
        <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-base-content/60">
                {propertyId ? (
                    <Link to={`/owner/view/rooms/${propertyId}`} className="hover:text-primary flex items-center gap-1">
                        <HiArrowLeft /> Back to Rooms
                    </Link>
                ) : (
                    <Link to="/owner/manage-property" className="hover:text-primary flex items-center gap-1">
                        <HiArrowLeft /> Back to Properties
                    </Link>
                )}
                <span>/</span>
                <span className="text-base-content font-bold">Edit Room #{formData.room_number}</span>
            </div>

            <div className="card bg-base-100 rounded-3xl border border-base-200 shadow-xl p-6 sm:p-8 space-y-6">
                <div>
                    <span className="text-xs uppercase font-extrabold tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
                        Room Settings
                    </span>
                    <h1 className="text-2xl font-black text-base-content mt-2">
                        Edit Room #{formData.room_number}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                Room Number
                            </label>
                            <input
                                type="number"
                                name="room_number"
                                value={formData.room_number}
                                onChange={handleChange}
                                className="input input-bordered w-full rounded-2xl"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                Monthly Rent (৳)
                            </label>
                            <input
                                type="number"
                                name="rent"
                                value={formData.rent}
                                onChange={handleChange}
                                className="input input-bordered w-full rounded-2xl"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                Room Type
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="select select-bordered w-full rounded-2xl"
                            >
                                <option value="Single">Single</option>
                                <option value="Shared">Shared</option>
                                <option value="Double">Double</option>
                                <option value="Master Bed">Master Bed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                Capacity (Persons)
                            </label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                min="1"
                                className="input input-bordered w-full rounded-2xl"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                Current Occupants
                            </label>
                            <input
                                type="number"
                                name="current_members"
                                value={formData.current_members}
                                onChange={handleChange}
                                min="0"
                                max={formData.capacity}
                                className="input input-bordered w-full rounded-2xl"
                            />
                        </div>

                        <div>
                            <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                                Availability
                            </label>
                            <select
                                name="is_availables"
                                value={formData.is_availables.toString()}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_availables: e.target.value === 'true' }))}
                                className="select select-bordered w-full rounded-2xl"
                            >
                                <option value="true">Available</option>
                                <option value="false">Unavailable</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block font-bold uppercase tracking-wider text-base-content/70 mb-1">
                            Cover Image URL
                        </label>
                        <input
                            type="url"
                            name="cover_img"
                            value={formData.cover_img}
                            onChange={handleChange}
                            className="input input-bordered w-full rounded-2xl"
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

                    <div className="pt-4 flex justify-end gap-2 border-t border-base-200">
                        {propertyId && (
                            <Link to={`/owner/view/rooms/${propertyId}`} className="btn btn-ghost rounded-2xl font-bold">
                                Cancel
                            </Link>
                        )}
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

export default EditRoom;
