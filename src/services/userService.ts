import { api } from "../api/axios";

export const getUserProfile = async () => {
    const response = await api.get('/Users/profile');
    return response.data;
};

export const updateUserProfile = async (email: string) => {
    const response = await api.put('/Users/profile', { email });
    return response.data;
}