import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { type User, type AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapUser = (decoded: any): User => {
    return {
        ...decoded,
        role: decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        unique_name: decoded.unique_name || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
    };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decoded: User = jwtDecode(storedToken);
                
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setToken(storedToken);
                    setUser(mapUser(decoded));
                }
            } catch (error) {
                logout();
            }
        }
        setIsLoading(false);
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken);
        const decoded: User = jwtDecode(newToken);
        setToken(newToken);
        setUser(mapUser(decoded));   
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};