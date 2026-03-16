import { api } from "../api/axios";

export interface RegisterData {
    username: string;
    password: string;
    role: number | string;
    registrationToken?: string;
}

export interface LoginData {
    username: string;
    password: string;
}

export const register = async (userData: RegisterData) => {
    const response = await api.post('/Auth/register', userData);
    return response.data;
}

export const login = async (credentials: LoginData) => {
    const response = await api.post('/Auth/login', credentials);
    return response.data;
}