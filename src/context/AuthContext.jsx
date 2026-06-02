/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { SITE_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

const buildUserProfile = (user) => {
    if (!user) {
        return null;
    }

    const meta = user.user_metadata || {};
    const name = meta.name || meta.full_name || user.email?.split('@')[0] || 'User';
    const avatar = meta.avatar_url || meta.picture
        || `https://ui-avatars.com/api/?name=${name.replaceAll(' ', '+')}&background=6366f1&color=fff&bold=true`;

    return {
        ...user,
        role: user.email === 'admin@astra.com' ? 'admin' : 'user',
        name,
        avatar,
        phone: '',
        address: '',
        city: '',
        country: '',
        bio: '',
    };
};

const loadUserProfile = async (user) => {
    if (!user) {
        return null;
    }

    const fallback = buildUserProfile(user);
    // select('*') is forward-compatible: it won't error if optional columns
    // (phone/address/city/country/bio) haven't been added to the table yet.
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
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
        phone: data.phone ?? '',
        address: data.address ?? '',
        city: data.city ?? '',
        country: data.country ?? '',
        bio: data.bio ?? '',
    };
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        // IMPORTANT: never `await` a Supabase query directly inside the
        // onAuthStateChange callback — the auth client holds a lock during the
        // callback and awaiting another Supabase call there deadlocks (which
        // left the app stuck on "Loading App..."). Instead we set a fast user
        // synchronously and enrich from the DB on a deferred microtask.
        const applySession = (session) => {
            if (!active) return;
            const sessionUser = session?.user ?? null;

            setCurrentUser((prev) => {
                if (!sessionUser) return null;
                const base = buildUserProfile(sessionUser);
                // Preserve already-enriched fields for the same user to avoid flicker.
                if (prev && prev.id === sessionUser.id) {
                    return { ...base, avatar: prev.avatar, role: prev.role, phone: prev.phone, address: prev.address, city: prev.city, country: prev.country, bio: prev.bio };
                }
                return base;
            });
            setLoading(false);

            if (sessionUser) {
                setTimeout(() => {
                    loadUserProfile(sessionUser)
                        .then((full) => { if (active && full) setCurrentUser(full); })
                        .catch((err) => console.error('Profile enrich failed', err));
                }, 0);
            }
        };

        supabase.auth.getSession()
            .then(({ data: { session }, error }) => {
                if (error) console.error('Failed to load Supabase session', error);
                applySession(session);
            })
            .catch((err) => {
                console.error('getSession failed', err);
                if (active) setLoading(false);
            });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            applySession(session);
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

        // When "Confirm email" is enabled in Supabase, signUp returns a user
        // but NO session until the email is verified. Only treat the user as
        // logged-in when an active session exists.
        if (data.session && data.user) {
            const userObj = await loadUserProfile({
                ...data.user,
                user_metadata: { ...data.user.user_metadata, name },
            });
            setCurrentUser(userObj);
            return { user: userObj, needsConfirmation: false };
        }

        return { user: null, needsConfirmation: true };
    };

    const signInWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: SITE_URL,
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

    const updateProfile = async (fields) => {
        if (!currentUser) {
            throw new Error('You must be signed in to update your profile.');
        }

        const { name, avatar, phone, address, city, country, bio } = fields;
        const profileUpdates = {};
        if (name !== undefined) profileUpdates.name = name;
        if (avatar !== undefined) profileUpdates.avatar_url = avatar;
        if (phone !== undefined) profileUpdates.phone = phone;
        if (address !== undefined) profileUpdates.address = address;
        if (city !== undefined) profileUpdates.city = city;
        if (country !== undefined) profileUpdates.country = country;
        if (bio !== undefined) profileUpdates.bio = bio;

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

        const updated = { ...currentUser };
        Object.entries({ name, phone, address, city, country, bio }).forEach(([k, v]) => {
            if (v !== undefined) updated[k] = v;
        });
        if (avatar !== undefined) updated.avatar = avatar;

        setCurrentUser(updated);
        return updated;
    };

    const uploadAvatar = async (file) => {
        if (!currentUser) throw new Error('You must be signed in.');
        const ext = (file.name.split('.').pop() || 'png').toLowerCase();
        const path = `${currentUser.id}/avatar-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
            .from('avatars')
            .upload(path, file, { upsert: true, cacheControl: '3600' });
        if (upErr) {
            throw new Error(upErr.message.includes('Bucket not found')
                ? 'Avatar storage is not set up yet. Create a public "avatars" bucket in Supabase Storage (see schema.sql).'
                : upErr.message);
        }
        const { data } = supabase.storage.from('avatars').getPublicUrl(path);
        return data.publicUrl;
    };

    const value = {
        currentUser,
        login,
        register,
        signInWithGoogle,
        logout,
        updateProfile,
        uploadAvatar,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <div style={{ display: 'flex', height: '100vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>Loading App...</div> : children}
        </AuthContext.Provider>
    );
};
