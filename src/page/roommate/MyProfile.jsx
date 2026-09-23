import React, { useContext, useEffect, useState } from 'react';
import { baseurl } from '../../services/BaseUrl';
import { AuthContext } from '../../context/AuthProvider';
import toast from 'react-hot-toast';

const MyProfile = () => {

    const { accessToken } = useContext(AuthContext);

    const [profile, setProfile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        gender: '',
        age: '',
        occupation: '',
        renting_location: '',
        budget: '',
        description: ''
    });


    const fetchProfile = () => {
        fetch(`${baseurl}/profile/my`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    setProfile(null);
                    return null;
                }

                return res.json();
            })
            .then(data => {
                if (data) {
                    setProfile(data);
                }
            });
    };


    useEffect(() => {
        if (!accessToken) return;

        fetchProfile();
    }, [accessToken]);


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };


    // Create modal open
    const handleCreate = () => {
        setFormData({
            gender: '',
            age: '',
            occupation: '',
            renting_location: '',
            budget: '',
            description: ''
        });

        setIsModalOpen(true);
    };


    // Edit modal open
    const handleEdit = () => {
        setFormData({
            gender: profile.gender || '',
            age: profile.age || '',
            occupation: profile.occupation || '',
            renting_location: profile.renting_location || '',
            budget: profile.budget || '',
            description: profile.description || ''
        });

        setIsModalOpen(true);
    };


    // Create
    const createProfile = async (e) => {
        e.preventDefault();

        const res = await fetch(`${baseurl}/create/profile`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (!res.ok) {
            toast.error(data.detail);
            return;
        }

        toast.success(data.message);

        setIsModalOpen(false);

        fetchProfile();
    };


    // Update
    const handleUpdate = async (e) => {
        e.preventDefault();

        const res = await fetch(`${baseurl}/update/profile`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (!res.ok) {
            toast.error(data.detail);
            return;
        }

        toast.success(data.message);

        setIsModalOpen(false);

        fetchProfile();
    };


    return (
        <div className="max-w-3xl mx-auto">

            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    My Profile
                </h1>

                <p className="text-gray-500 mt-1">
                    Manage your profile for find suitable roommate
                </p>
            </div>


            {/* Profile exists */}
            {profile ? (

                <div className="card bg-base-100 shadow-md">

                    <div className="card-body">

                        <div className="flex justify-between items-center mb-5">

                            <h2 className="text-2xl font-bold">
                                Profile Information
                            </h2>

                            <button
                                onClick={handleEdit}
                                className="btn btn-primary"
                            >
                                Edit
                            </button>

                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>
                                <p className="text-gray-500">
                                    Gender
                                </p>

                                <p className="font-semibold">
                                    {profile.gender}
                                </p>
                            </div>


                            <div>
                                <p className="text-gray-500">
                                    Age 
                                </p>

                                <p className="font-semibold">
                                    {profile.age} 
                                </p>
                            </div>


                            <div>
                                <p className="text-gray-500">
                                    Occupation
                                </p>

                                <p className="font-semibold">
                                    {profile.occupation}
                                </p>
                            </div>


                            <div>
                                <p className="text-gray-500">
                                    Renting Location
                                </p>

                                <p className="font-semibold">
                                    {profile.renting_location}
                                </p>
                            </div>


                            <div>
                                <p className="text-gray-500">
                                    Budget
                                </p>

                                <p className="font-semibold">
                                    ৳{profile.budget}
                                </p>
                            </div>

                        </div>


                        <div className="mt-5">

                            <p className="text-gray-500">
                                Description
                            </p>

                            <p className="mt-1">
                                {profile.description || 'No description'}
                            </p>

                        </div>

                    </div>

                </div>

            ) : (

                /* Profile doesn't exist */
                <div className="card bg-base-100 shadow-md">

                    <div className="card-body text-center py-12">

                        <h2 className="text-2xl font-bold">
                            Create Your Profile
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Create your roommate profile to find suitable roommates.
                        </p>

                        <button
                            onClick={handleCreate}
                            className="btn btn-primary mt-5"
                        >
                            Create Profile
                        </button>

                    </div>

                </div>

            )}


            {/* Modal */}
            {isModalOpen && (

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

                    <div className="bg-base-100 rounded-xl p-6 w-full max-w-lg">

                        <div className="flex justify-between items-center mb-5">

                            <h2 className="text-2xl font-bold">
                                {profile ? 'Edit Profile' : 'Create Profile'}
                            </h2>

                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="btn btn-sm btn-circle"
                            >
                                ✕
                            </button>

                        </div>


                        <form
                            onSubmit={profile ? handleUpdate : createProfile}
                            className="space-y-4"
                        >

                            <div>
                                <label className="block mb-1 font-medium">
                                    Gender
                                </label>

                                <input
                                    type="text"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>


                            <div className="grid grid-cols-2 gap-3">

                                <div>
                                    <label className="block mb-1 font-medium">
                                         Age
                                    </label>

                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                            </div>


                            <div>
                                <label className="block mb-1 font-medium">
                                    Occupation
                                </label>

                                <input
                                    type="text"
                                    name="occupation"
                                    value={formData.occupation}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>


                            <div>
                                <label className="block mb-1 font-medium">
                                   Renting Location
                                </label>

                                <input
                                    type="text"
                                    name="renting_location"
                                    value={formData.renting_location}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>


                            <div>
                                <label className="block mb-1 font-medium">
                                    Budget
                                </label>

                                <input
                                    type="number"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>


                            <div>
                                <label className="block mb-1 font-medium">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="textarea textarea-bordered w-full"
                                    rows="4"
                                />
                            </div>


                            <div className="flex justify-end gap-2 pt-2">

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
                                    {profile ? 'Update' : 'Create'}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};

export default MyProfile;