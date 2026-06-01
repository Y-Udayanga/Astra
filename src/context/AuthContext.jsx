/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

const buildUserProfile = (user) => {
    if (!user) {
        return null;
    }

    const name = user.user_metadata?.name || user.email?.split('@')[0] || 'User';

    return {
        ...user,
        role: user.email === 'admin@astra.com' ? 'admin' : 'user',
        name,
        avatar: `https://ui-avatars.com/api/?name=${name.replaceAll(' ', '+')}&background=random`,
    };
};

const loadUserProfile = async (user) => {
    if (!user) {
        return null;
    }

    const fallback = buildUserProfile(user);
    const { data, error } = await supabase
        .from('profiles')
        .select('name, role, avatar_url')
        .eq('id', user.id)
        .maybeSingle();

    if (error) {
        console.error('Failed to load profile row', error);
        return fallback;
    }

    if (!data) {
        return fallback;
    }

    return {
        ...user,
        role: data.role ?? fallback.role,
        name: data.name ?? fallback.name,
        avatar: data.avatar_url ?? fallback.avatar,
    };
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const loadSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Failed to load Supabase session', error);
            }

            if (!active) {
                return;
            }

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCurrentUser(await loadUserProfile(session?.user ?? null));
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoading(false);
        };

        void loadSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!active) {
                return;
            }

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCurrentUser(await loadUserProfile(session?.user ?? null));
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoading(false);
        });

        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;

        const userObj = await loadUserProfile(data.user);
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
            const userObj = await loadUserProfile({
                ...data.user,
                user_metadata: { ...data.user.user_metadata, name },
            });
            setCurrentUser(userObj);
            return userObj;
        }
        return null;
    };

    const signInWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
                queryParams: { access_type: 'offline', prompt: 'consent' },
            },
        });
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setCurrentUser(null);
    };

    const updateProfile = async ({ name, avatar }) => {
        if (!currentUser) {
            throw new Error('You must be signed in to update your profile.');
        }

        const profileUpdates = {};
        if (name !== undefined) profileUpdates.name = name;
        if (avatar !== undefined) profileUpdates.avatar_url = avatar;

        const { error } = await supabase
            .from('profiles')
            .update(profileUpdates)
            .eq('id', currentUser.id);

        if (error) {
            throw new Error(error.message);
        }

        // Keep auth user metadata in sync (best-effort).
        if (name !== undefined) {
            await supabase.auth.updateUser({ data: { name } }).catch((err) => {
                console.error('Failed to sync auth metadata', err);
            });
        }

        const updated = {
            ...currentUser,
            name: name ?? currentUser.name,
            avatar: avatar ?? currentUser.avatar,
        };
        setCurrentUser(updated);
        return updated;
    };

    const value = {
        currentUser,
        login,
        register,
        signInWithGoogle,
        logout,
        updateProfile,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <div style={{ display: 'flex', height: '100vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>Loading App...</div> : children}
        </AuthContext.Provider>
    );
};
