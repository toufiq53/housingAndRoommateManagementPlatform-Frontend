import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { baseurl } from '../services/BaseUrl';
import { AuthContext } from '../context/AuthProvider';
import toast from 'react-hot-toast';
import { HiHomeModern, HiOutlineLockClosed, HiOutlineUser } from "react-icons/hi2";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        if (!username.trim() || !password) {
            toast.error("Please enter both username and password");
            return;
        }

        setLoading(true);
        try {
            const formData = new URLSearchParams();
            formData.append('username', username.trim());
            formData.append('password', password);

            const res = await fetch(`${baseurl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            });

            const data = await res.json();

            if (!res.ok || !data.access_token) {
                toast.error(data.detail || "Invalid username or password");
                setLoading(false);
                return;
            }

            const accessToken = data.access_token;
            const userData = data.user;

            login(accessToken, userData);
            toast.success(`Welcome back, ${userData?.firstname || username}!`);
            setLoading(false);

            if (userData?.role === 'owner') {
                navigate('/owner');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Network error. Please try again.");
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center p-4 py-12">
            <div className="max-w-md w-full">
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
                        Welcome Back
                    </h1>
                    <p className="text-sm text-base-content/65 mt-1">
                        Sign in to manage your bookings, properties, or roommate connections.
                    </p>
                </div>

                {/* Login Card */}
                <div className="card bg-base-100 shadow-2xl rounded-3xl border border-base-200 p-6 sm:p-8 space-y-6">
                    <form onSubmit={handleLogin} className="space-y-4">
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
                                    placeholder="Enter your username"
                                    className="input input-bordered w-full rounded-2xl pl-11 text-sm bg-base-200/40 focus:bg-base-100"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70">
                                    Password
                                </label>
                                <span className="text-xs text-primary font-semibold cursor-pointer hover:underline">
                                    Forgot?
                                </span>
                            </div>
                            <div className="relative">
                                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 text-lg" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input input-bordered w-full rounded-2xl pl-11 text-sm bg-base-200/40 focus:bg-base-100"
                                    required
                                />
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full rounded-2xl font-black text-sm h-12 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all mt-2"
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Sign Up Redirect */}
                    <div className="text-center pt-2 border-t border-base-200 text-xs text-base-content/70">
                        Don't have an account yet?{' '}
                        <Link to="/signup" className="text-primary font-bold hover:underline">
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
