import React, { useState } from 'react';
import { Link, Outlet } from 'react-router';

const RoommateLayout = () => {

    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-base-200 flex">

            {/* Sidebar */}
            {sidebarOpen && (
                <aside className="w-64 bg-base-100 shadow-lg min-h-screen p-5">

                    <h1 className="text-2xl font-bold text-primary mb-8">
                        RoomMate
                    </h1>

                    <div className="space-y-2">

                        <Link
                            to="/roommate"
                            className="btn btn-ghost w-full justify-start"
                        >
                            🏠 Dashboard
                        </Link>

                        <Link
                            to="/roommate/browse-profile"
                            className="btn btn-ghost w-full justify-start"
                        >
                            🔍 Browse Profile
                        </Link>

                        <Link
                            to="/roommate/profile"
                            className="btn btn-ghost w-full justify-start"
                        >
                            👤 Profile
                        </Link>

                    </div>

                </aside>
            )}

            {/* Main Content */}
            <main className="flex-1">

                {/* Top Navbar */}
                <div className="navbar bg-base-100 shadow-sm px-6">

                    {/* Sidebar Toggle */}
                    <div className="flex-1">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="btn btn-square btn-ghost"
                        >
                            ☰
                        </button>
                    </div>

                    <Link
                        to="/"
                        className="btn btn-sm btn-outline"
                    >
                        Home
                    </Link>

                </div>

                {/* Page Content */}
                <div className="p-6">
                    <Outlet />
                </div>

            </main>

        </div>
    );
};

export default RoommateLayout;