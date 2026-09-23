
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { baseurl } from '../services/BaseUrl';
import toast from 'react-hot-toast';

const UserProfile = () => {

    const { authUser, accessToken } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        firstname: '',
        lastname: ''
    });

    useEffect(() => {
        if (authUser) {
            setFormData({
                email: authUser.email || '',
                username: authUser.username || '',
                firstname: authUser.firstname || '',
                lastname: authUser.lastname || ''
            });
        }
    }, [authUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(`${baseurl}/edituser`, {
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

    if (!authUser) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }


return (
    <div className="min-h-screen bg-base-200 py-10 px-4">

        <div className="max-w-4xl mx-auto">

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    My Profile
                </h1>

                <p className="text-gray-500 mt-1">
                    Manage your account information.
                </p>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Profile Card */}
                <div className="card bg-base-100 shadow-md h-fit">

                    <div className="card-body items-center text-center">

                        {/* Profile Photo */}
                        <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content w-28 rounded-full pt-6 ">
                                <span className="text-5xl font-semibold">
                                    {authUser.firstname?.charAt(0)?.toUpperCase()}
                                </span>
                            </div>
                        </div>


                        {/* Name */}
                        <h2 className="text-2xl font-bold mt-3">
                            {authUser.firstname} {authUser.lastname}
                        </h2>


                        {/* Username */}
                        <p className="text-gray-500">
                            @{authUser.username}
                        </p>


                        {/* Role Badge */}
                        <div className="badge badge-primary mt-2 capitalize">
                            {authUser.role}
                        </div>


                        {/* Email */}
                        <div className="w-full mt-6 text-left">

                            <p className="text-sm text-gray-500">
                                Email
                            </p>

                            <p className="font-medium break-all">
                                {authUser.email}
                            </p>

                        </div>

                    </div>

                </div>


                {/* Edit Profile */}
                <div className="lg:col-span-2">

                    <div className="card bg-base-100 shadow-md">

                        <div className="card-body">

                            <h2 className="text-2xl font-bold">
                                Personal Information
                            </h2>

                            <p className="text-sm text-gray-500 mb-4">
                                Update your account information below.
                            </p>


                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >

                                {/* First Name + Last Name */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div>

                                        <label className="label">
                                            <span className="label-text font-medium">
                                                First Name
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="firstname"
                                            value={formData.firstname}
                                            onChange={handleChange}
                                            className="input input-bordered w-full"
                                            placeholder="First name"
                                        />

                                    </div>


                                    <div>

                                        <label className="label">
                                            <span className="label-text font-medium">
                                                Last Name
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="lastname"
                                            value={formData.lastname}
                                            onChange={handleChange}
                                            className="input input-bordered w-full"
                                            placeholder="Last name"
                                        />

                                    </div>

                                </div>


                                {/* Email + Username */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div>

                                        <label className="label">
                                            <span className="label-text font-medium">
                                                Email
                                            </span>
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="input input-bordered w-full"
                                            placeholder="Email"
                                        />

                                    </div>


                                    <div>

                                        <label className="label">
                                            <span className="label-text font-medium">
                                                Username
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="input input-bordered w-full"
                                            placeholder="Username"
                                        />

                                    </div>

                                </div>


                                {/* Save Button */}
                                <div className="flex justify-end pt-4">

                                    <button
                                        type="submit"
                                        className="btn btn-primary px-8"
                                    >
                                        Save Changes
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>
);


};

export default UserProfile;
