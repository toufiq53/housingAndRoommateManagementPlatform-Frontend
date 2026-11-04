import { createBrowserRouter, Navigate } from "react-router";
import Root from "../layout/Root";
import Home from "../page/Home";
import Login from "../page/Login";
import SignUp from "../page/SignUp";
import BrowseProperty from "../page/BrowseProperty";
import ViewRoom from "../page/ViewRoom";
import RoomDetails from "../page/RoomDetails";
import MyBooking from "../page/MyBooking";
import PrivateRoutes from "./PrivateRoutes";
import UserProfile from "../page/UserProfile";
import ChangePassword from "../page/ChangePassword";
import OwnerLayout from "../layout/OwnerLayout";
import ManageProperty from "../page/owner/ManageProperty";
import EditProperty from "../page/owner/EditProperty";
import ViewMyRoom from "../page/owner/ViewMyRoom";
import EditRoom from "../page/owner/EditRoom";
import BookingDetails from "../page/owner/BookingDetails";
import OwnerProtected from "./OwnerProtected";
import RoommateLayout from "../layout/RoommateLayout";
import MyProfile from "../page/roommate/MyProfile";
import BrowseProfile from "../page/roommate/BrowseProfile";
import OwnerDashBoard from "../page/owner/OwnerDashBoard";
import AdminProtected from "./AdminProtected";
import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../page/admin/AdminDashboard";
import AdminOwnerRequests from "../page/admin/AdminOwnerRequests";
import AdminUsers from "../page/admin/AdminUsers";
import AdminProperties from "../page/admin/AdminProperties";
import AdminRooms from "../page/admin/AdminRooms";
import AdminBookings from "../page/admin/AdminBookings";
import AdminRoommates from "../page/admin/AdminRoommates";
import AdminNotifications from "../page/admin/AdminNotifications";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/signup',
                element: <SignUp />
            },
            {
                path: '/property',
                element: <BrowseProperty />
            },
            {
                path: '/properties-room/:id',
                element: <ViewRoom />
            },
            {
                path: '/room-details/:id',
                element: <RoomDetails />
            },
            {
                path: '/my-booking',
                element: <PrivateRoutes><MyBooking /></PrivateRoutes>
            },
            {
                path: 'user/profile',
                element: <PrivateRoutes><UserProfile /></PrivateRoutes>
            },
            {
                path: 'change/password',
                element: <PrivateRoutes><ChangePassword /></PrivateRoutes>
            }
        ]
    },
    {
        path: "/owner",
        element: <OwnerProtected><OwnerLayout /></OwnerProtected>,
        children: [
            {
                index: true,
                element: <OwnerDashBoard />
            },
            {
                path: 'manage-property',
                element: <ManageProperty />
            },
            {
                path: 'edit/property/:id',
                element: <EditProperty />
            },
            {
                path: 'view/rooms/:id',
                element: <ViewMyRoom />
            },
            {
                path: 'room-edit/:id',
                element: <EditRoom />
            },
            {
                path: 'manage-booking-details',
                element: <BookingDetails />
            }
        ]
    },
    {
        path: "/roommate",
        element: <PrivateRoutes><RoommateLayout /></PrivateRoutes>,
        children: [
            {
                index: true,
                element: <BrowseProfile />
            },
            {
                path: 'browse-profile',
                element: <BrowseProfile />
            },
            {
                path: 'profile',
                element: <MyProfile />
            }
        ]
    },
    {
        path: "/admin",
        element: <AdminProtected><AdminLayout /></AdminProtected>,
        children: [
            {
                index: true,
                element: <AdminDashboard />
            },
            {
                path: 'owner-requests',
                element: <AdminOwnerRequests />
            },
            {
                path: 'users',
                element: <AdminUsers />
            },
            {
                path: 'properties',
                element: <AdminProperties />
            },
            {
                path: 'rooms',
                element: <AdminRooms />
            },
            {
                path: 'bookings',
                element: <AdminBookings />
            },
            {
                path: 'roommates',
                element: <AdminRoommates />
            },
            {
                path: 'notifications',
                element: <AdminNotifications />
            }
        ]
    },
    {
        path: "*",
        element: (
            <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-6 text-center">
                <div className="text-7xl mb-4 font-black text-primary">404</div>
                <h2 className="text-2xl font-bold text-base-content">Page Not Found</h2>
                <p className="text-sm text-base-content/60 mt-2 max-w-sm">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <a href="/" className="btn btn-primary btn-sm rounded-xl mt-6 px-6 font-bold">
                    Return to Homepage
                </a>
            </div>
        )
    }
]);

export default router;
