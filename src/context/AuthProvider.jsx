import React, { createContext, useEffect, useState, useCallback } from 'react';
import { baseurl } from '../services/BaseUrl';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(() => localStorage.getItem('hrp_token') || null);
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async (token) => {
        const tokenToUse = token || accessToken;
        if (!tokenToUse || tokenToUse === 'undefined' || tokenToUse === 'null') {
            setAuthUser(null);
            setLoading(false);
            return;
        }

        try {
            const userRes = await fetch(`${baseurl}/user`, {
                headers: {
                    Authorization: `Bearer ${tokenToUse}`
                }
            });

            if (!userRes.ok) {
                localStorage.removeItem('hrp_token');
                setAccessToken(null);
                setAuthUser(null);
                setLoading(false);
                return;
            }

            const userData = await userRes.json();
            if (userData && userData.id) {
                setAuthUser(userData);
            } else {
                setAuthUser(null);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setAuthUser(null);
        } finally {
            setLoading(false);
        }
    }, [accessToken]);

    useEffect(() => {
        if (!accessToken) {
            setAuthUser(null);
            setLoading(false);
            return;
        }
        fetchUser(accessToken);
    }, [accessToken, fetchUser]);

    const login = (token, user) => {
        localStorage.setItem('hrp_token', token);
        setAccessToken(token);
        if (user && user.id) {
            setAuthUser(user);
            setLoading(false);
        } else {
            fetchUser(token);
        }
    };

    const logout = () => {
        localStorage.removeItem('hrp_token');
        setAccessToken(null);
        setAuthUser(null);
    };

    const refreshUser = async () => {
        if (accessToken) {
            await fetchUser(accessToken);
        }
    };

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser, login, logout, accessToken, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
