export interface User {
    unique_name: string;
    role: string;
    nameid: string;
    exp: number;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}