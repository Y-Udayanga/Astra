import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                const userObj = {
                    ...session.user,
                    role: session.user.email === 'admin@astra.com' ? 'admin' : 'user',
                    name: session.user.user_metadata?.name || 'User',
                    avatar: `https://ui-avatars.com/api/?name=${(session.user.user_metadata?.name || 'User').replace(' ', '+')}&background=random`
                };
                setCurrentUser(userObj);
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                const userObj = {
                    ...session.user,
                    role: session.user.email === 'admin@astra.com' ? 'admin' : 'user',
                    name: session.user.user_metadata?.name || 'User',
                    avatar: `https://ui-avatars.com/api/?name=${(session.user.user_metadata?.name || 'User').replace(' ', '+')}&background=random`
                };
                setCurrentUser(userObj);
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        
        const userObj = {
            ...data.user,
            role: data.user.email === 'admin@astra.com' ? 'admin' : 'user',
            name: data.user.user_metadata?.name || 'User',
            avatar: `https://ui-avatars.com/api/?name=${(data.user.user_metadata?.name || 'User').replace(' ', '+')}&background=random`
        };
        setCurrentUser(userObj);
        return userObj;
    };

    const register = async (name, email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                }
            }
        });
        if (error) throw error;

        if (data.user) {
             const userObj = {
                ...data.user,
                role: data.user.email === 'admin@astra.com' ? 'admin' : 'user',
                name: name,
                avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random`
            };
            setCurrentUser(userObj);
            return userObj;
        }
        return null;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <div style={{ display: 'flex', height: '100vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>Loading App...</div> : children}
        </AuthContext.Provider>
    );
};
