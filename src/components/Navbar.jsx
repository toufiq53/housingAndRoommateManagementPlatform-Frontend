import React, { useContext } from 'react';
import { Link } from 'react-router';
import { AuthContext } from '../context/AuthProvider';

const Navbar = () => {
    const { authUser, logout } = useContext(AuthContext)
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg aria-label="Menu" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex={-1}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><Link to={'/'}>Home</Link></li>
                        <li><Link to={'/property'}>Browse Property</Link></li>
                        {
                            authUser && <li><Link to={'/my-booking'}>My Booking</Link></li>
                        }
                        <li><Link to={'/roommate'}>Roommate</Link></li>

                    </ul>
                </div>
                <a className="btn btn-ghost text-xl">Housing Platform</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link to={'/'}>Home</Link></li>
                    <li><Link to={'/property'}>Browse Property</Link></li>
                    {
                        authUser && <li><Link to={'/my-booking'}>My Booking</Link></li>
                    }
                    <li><Link to={'/roommate'}> Find Roommate</Link></li>
                    
                </ul>
            </div>
            <div className="navbar-end">
                {
                    authUser ? <div className="flex gap-2">
                        <input type="text" placeholder="Search" className="input w-24 md:w-auto" />
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS Navbar component"
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                </div>
                            </div>
                            <ul
                                tabIndex={-1}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                <li>
                                    <Link to={'/user/profile'} className="justify-between">
                                        Profile
                                        <span className="badge">{authUser.role}</span>
                                    </Link>
                                </li>

                                
                                    {
                                        authUser?.role=='owner' &&<li> <Link to={'/owner'} className="justify-between">
                                        Manage
                                        
                                    </Link></li>
                                    }
                                
                                <li><Link to={'/change/password'}>Change Password</Link></li>
                                <li>
                                    <Link onClick={logout} >Logout</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                        : <div>
                            <button className='btn'><Link to={'/login'}>Login</Link></button>

                        </div>
                }
            </div>

        </div>
    );
};

export default Navbar;