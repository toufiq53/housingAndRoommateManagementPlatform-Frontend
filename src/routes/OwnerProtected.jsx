import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { Navigate } from 'react-router';


const OwnerProtected = ({children}) => {
    const {authUser,loading}=useContext(AuthContext)

    if (loading)
        return <p>Loading.......</p>

    if(!authUser){
        return <Navigate to={'/login'}></Navigate>
    }
    if(authUser?.role !== 'owner')
    {
        return <Navigate to={'/'}></Navigate>
    }
    return children
};

export default OwnerProtected;