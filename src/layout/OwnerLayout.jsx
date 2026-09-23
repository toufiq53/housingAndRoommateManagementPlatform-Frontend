import React from 'react';
import { Link, Outlet } from 'react-router';
import { GiFamilyHouse } from "react-icons/gi";
import { SiBookingdotcom } from "react-icons/si";
import { RxDashboard } from "react-icons/rx";

const OwnerLayout = () => {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle inline" />
            <div className="drawer-content">
                {/* Navbar */}
                
                    <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost drawer-button">
                        {/* Sidebar toggle icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
                    </label>
                
                
                {/* Page content here */}
                <div className="p-4"><Outlet/></div>
            </div>

            <div className="drawer-side is-drawer-close:overflow-visible">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                    {/* Sidebar content here */}
                    <ul className="menu w-full grow">
                        {/* List item */}
                        <li>
                            <Link to={'/'} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Homepage">
                                {/* Home icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                                <span className="is-drawer-close:hidden">Homepage</span>
                            </Link>
                        </li>
                           {/* List item */}
                        <li>
                            <Link to={'/owner'} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="DashBoard">
                                {/* Home icon */}
                                <RxDashboard/>
                                <span className="is-drawer-close:hidden">DashBoard</span>
                            </Link>
                        </li>

                        {/* List item */}
                        <li>
                            <Link to={'manage-property'} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Manage Property">
                                {/* Settings icon */}
                                <GiFamilyHouse />
                            </Link>
                        </li>

                        {/* List item */}
                        <li>
                            <Link to={'manage-booking-details'} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Manage Booking">
                                {/* Settings icon */}
                              <SiBookingdotcom/>
                                <span className="is-drawer-close:hidden">Manage Booking</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default OwnerLayout;