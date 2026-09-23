
import React, { useContext, useState } from 'react';
import { baseurl } from '../services/BaseUrl';
import { AuthContext } from '../context/AuthProvider';
import toast from 'react-hot-toast';

const ChangePassword = () => {

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const { accessToken } = useContext(AuthContext)

    const handleSubmit = async (e) => {
        e.preventDefault();

        const passwordData = {
            current_password: currentPassword,
            new_password: newPassword
        };

        const res = await fetch(`${baseurl}/passwordchange`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(passwordData)
        })
        const data = await res.json()
        if (!res.ok) {
            toast.error(data.detail)
            return
        }

        toast.success(data.message)


    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-base-200">
            <div className="card w-96 bg-base-100 shadow-xl p-6">

                <h2 className="text-2xl font-bold text-center mb-5">
                    Change Password
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="mb-4">
                        <label className="label">
                            <span className="label-text">Current Password</span>
                        </label>

                        <input
                            type="password"
                            placeholder="Enter current password"
                            className="input input-bordered w-full"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>

                    <div className="mb-5">
                        <label className="label">
                            <span className="label-text">New Password</span>
                        </label>

                        <input
                            type="password"
                            placeholder="Enter new password"
                            className="input input-bordered w-full"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                    >
                        Change Password
                    </button>

                </form>
            </div>
        </div>
    );
};

export default ChangePassword;

