import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { baseurl } from '../services/BaseUrl';
import toast from 'react-hot-toast';

const SignUp = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const handleSignup = async () => {
        const userData = {
            email,
            username,
            firstname,
            lastname,
            password,
            role
        };
        const res = await fetch(`${baseurl}/createuser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
        
        const data = await res.json();
        console.log(data);
        if (res.ok) {
            toast.success(data.message);
            navigate('/login');
         } 
        else {
            toast.error(data.detail || "Signup failed");
        }

    }

    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col">

                <div className="text-center">
                    <h1 className="text-5xl font-bold">
                        Sign Up now!
                    </h1>

                    <p className="py-6 w-96">
                        Please Fill the input Correctly
                    </p>
                </div>

                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <div className="card-body">

                        <fieldset className="fieldset">

                            {/* Email */}
                            <label className="label">
                                Email
                            </label>

                            <input
                                type="email"
                                className="input"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />


                            {/* Username */}
                            <label className="label">
                                Username
                            </label>

                            <input
                                type="text"
                                className="input"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />


                            {/* First Name */}
                            <label className="label">
                                First Name
                            </label>

                            <input
                                type="text"
                                className="input"
                                placeholder="First Name"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                            />


                            {/* Last Name */}
                            <label className="label">
                                Last Name
                            </label>

                            <input
                                type="text"
                                className="input"
                                placeholder="Last Name"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                            />

                           



                            {/* Password */}
                            <label className="label">
                                Password
                            </label>

                            <input
                                type="password"
                                className="input"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />


                            {/* Role */}
                            <label className="label">
                                Role
                            </label>

                            <select
                                className="select"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="">
                                    Select Role
                                </option>

                                <option value="user">
                                    User
                                </option>
           
                                <option value="owner">
                                    owner
                                </option>
                            </select>


                            {/* Login Link */}
                            <div className='mt-2'>
                                <Link
                                    to="/login"
                                    className="link link-hover"
                                >
                                    Already Have an account?
                                </Link>
                            </div>


                            {/* Sign Up Button */}
                            <button onClick={handleSignup} className="btn btn-neutral mt-4">
                                Sign Up

                            </button>

                        </fieldset>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default SignUp;