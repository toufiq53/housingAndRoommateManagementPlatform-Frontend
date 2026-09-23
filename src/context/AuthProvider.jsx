import React, { createContext, useEffect, useState } from 'react';
import { baseurl } from '../services/BaseUrl';
import { Navigate } from 'react-router';


export const AuthContext = createContext();
const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser]= useState(null)
    const accessToken = localStorage.getItem('hrp_token')
    const [loading,setLoading]=useState(true)
    console.log(accessToken);

    const fetchUser = async () => {
        const userRes = await fetch(`${baseurl}/user`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        const userData = await userRes.json()
        //    console.log(userData);
        setAuthUser(userData)
        setLoading(false)
    }

    useEffect( () => {
        if (!accessToken) {
            setAuthUser(null)
            setLoading(false)
            return
        }

        fetchUser()
    }, [accessToken])

    const logout=()=>{
        localStorage.removeItem('hrp_token')
        setAuthUser(null)
        
    }

    console.log(authUser);
  

    return (
        <div>
            <AuthContext.Provider value={{ authUser,setAuthUser,logout,accessToken,loading}}>{children}</AuthContext.Provider>
        </div>
    );
};

export default AuthProvider;