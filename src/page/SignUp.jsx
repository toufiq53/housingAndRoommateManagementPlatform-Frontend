import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { baseurl } from '../services/BaseUrl';
import toast from 'react-hot-toast';
import { HiHomeModern, HiOutlineEnvelope, HiOutlineUser, HiOutlineLockClosed, HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { FaUserFriends } from "react-icons/fa";

const SignUp = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        if (e) e.preventDefault();

        if (!email.trim() || !username.trim() || !firstname.trim() || !password) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);
        try {
            const userData = {
                email: email.trim().toLowerCase(),
                username: username.trim().toLowerCase(),
                firstname: firstname.trim(),
                lastname: lastname.trim(),
                password,
                role
            };

            const res = await fetch(`${baseurl}/createuser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message || "Account created successfully! Please sign in.");
                navigate('/login');
            } else {
                toast.error(data.detail || "Signup failed. Please check inputs.");
            }
        } catch (error) {
            console.error("Signup error:", error);
            toast.error("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center p-4 py-12">
            <div className="max-w-lg w-full">
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-content shadow-lg shadow-primary/25">
                            <HiHomeModern className="text-2xl" />
                        </div>
                        <span className="font-black text-3xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Nestora
                        </span>
                    </Link>
                    <h1 className="text-3xl font-black text-base-content tracking-tight">
                        Create Your Account
                    </h1>
                    <p className="text-sm text-base-content/65 mt-1">
                        Join our community to discover verified accommodations and compatible roommates.
                    </p>
                </div>

                {/* Card */}
                <div className="card bg-base-100 shadow-2xl rounded-3xl border border-base-200 p-6 sm:p-8 space-y-6">
                    {/* Role Selector Cards */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-2">
                            Select Account Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <div
                                onClick={() => setRole('user')}
                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${
                                    role === 'user'
                                        ? 'border-primary bg-primary/10 shadow-sm'
                                        : 'border-base-200 hover:border-base-300 bg-base-200/30'
                                }`}
                            >
                                <FaUserFriends className={`text-2xl ${role === 'user' ? 'text-primary' : 'text-base-content/50'}`} />
                                <div>
                                    <h4 className="text-xs font-black text-base-content">Tenant / Roommate</h4>
                                    <p className="text-[11px] text-base-content/60 mt-0.5">Looking for a room</p>
                                </div>
                            </div>

                            <div
                                onClick={() => setRole('owner')}
                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${
                                    role === 'owner'
                                        ? 'border-secondary bg-secondary/10 shadow-sm'
                                        : 'border-base-200 hover:border-base-300 bg-base-200/30'
                                }`}
                            >
                                <HiOutlineBuildingOffice2 className={`text-2xl ${role === 'owner' ? 'text-secondary' : 'text-base-content/50'}`} />
                                <div>
                                    <h4 className="text-xs font-black text-base-content">Property Owner</h4>
                                    <p className="text-[11px] text-base-content/60 mt-0.5">Listing properties</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        {/* Name Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={firstname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                    className="input input-bordered w-full rounded-2xl text-sm bg-base-200/40 focus:bg-base-100"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                    className="input input-bordered w-full rounded-2xl text-sm bg-base-200/40 focus:bg-base-100"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <HiOutlineEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 text-lg" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="input input-bordered w-full rounded-2xl pl-11 text-sm bg-base-200/40 focus:bg-base-100"
                                    required
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
                                Username
                            </label>
                            <div className="relative">
                                <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 text-lg" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="username"
                                    className="input input-bordered w-full rounded-2xl pl-11 text-sm bg-base-200/40 focus:bg-base-100"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 text-lg" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    className="input input-bordered w-full rounded-2xl pl-11 text-sm bg-base-200/40 focus:bg-base-100"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full rounded-2xl font-black text-sm h-12 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all mt-4"
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                "Complete Registration"
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="text-center pt-2 border-t border-base-200 text-xs text-base-content/70">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-bold hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
