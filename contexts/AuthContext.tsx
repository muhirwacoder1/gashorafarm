import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

interface User {
    userId: Id<"users">;
    email: string;
    name: string;
    phone?: string;
    profileImageUrl?: string;
    role: "user" | "farmer" | "admin";
    farmerId?: Id<"farmers">;
    farmer?: any;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isFarmer: boolean;
    isAdmin: boolean;
}

interface RegisterData {
    email: string;
    password: string;
    name: string;
    role: "user" | "farmer";
    farmerData?: {
        location: string;
        imageUrl?: string;
        phone?: string;
        idNumber?: string;
    };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loginMutation = useMutation(api.auth.login);
    const registerMutation = useMutation(api.auth.register);

    // Check for stored session on mount
    useEffect(() => {
        const stored = localStorage.getItem('farmconnect_user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch (e) {
                localStorage.removeItem('farmconnect_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const result = await loginMutation({ email, password });
        const userData: User = {
            userId: result.userId,
            email: result.email,
            name: result.name,
            role: result.role as "user" | "farmer" | "admin",
            farmerId: result.farmerId ?? undefined,
            farmer: result.farmer,
        };
        setUser(userData);
        localStorage.setItem('farmconnect_user', JSON.stringify(userData));
    };

    const register = async (data: RegisterData) => {
        const result = await registerMutation({
            email: data.email,
            password: data.password,
            name: data.name,
            role: data.role,
            farmerData: data.farmerData,
        });

        // Auto-login after registration
        await login(data.email, data.password);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('farmconnect_user');
    };

    const value: AuthContextType = {
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isFarmer: user?.role === 'farmer',
        isAdmin: user?.role === 'admin',
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
