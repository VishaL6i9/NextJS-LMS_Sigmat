'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Role {
    id: number;
    name: string;
}

interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    roles?: Role[];
}

interface UserContextType {
    userProfile: UserProfile | null;
    setUserProfile: (profile: UserProfile | null) => void;
    userRoles: Role[];
    setUserRoles: (roles: Role[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [userRoles, setUserRoles] = useState<Role[]>([]);

    return (
        <UserContext.Provider value={{ userProfile, setUserProfile, userRoles, setUserRoles }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
} 