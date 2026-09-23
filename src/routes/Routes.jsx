import { createBrowserRouter } from "react-router";
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

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root></Root>,
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
                element:<ViewRoom />
            },
            {
                path: '/room-details/:id',
                element: <PrivateRoutes><RoomDetails /></PrivateRoutes>
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
                path:'/owner',
                element:<OwnerDashBoard/>
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
        element:<PrivateRoutes><RoommateLayout/></PrivateRoutes>,
        children: [
            {
                path: '/roommate'
                
            },
            {
                path:'profile',
                element:<MyProfile/>
            },
            {
                path:'browse-profile',
                element:<BrowseProfile/>
            }
        ]
    }

]);
export default router