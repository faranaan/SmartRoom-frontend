import { api } from "../api/axios";

export const getCampuses = async () => {
    const response = await api.get('/Campuses');
    return response.data;
};

export const createCampus = async (name: string) => {
    const response = await api.post('/Campuses', { name });
    return response.data;
};

export const generateAdminToken = async (campusId: number) => {
    const response = await api.post(`/Campuses/${campusId}/generate-admin-token`);
    return response.data;
};

export const generateMemberToken = async () => {
    const response = await api.post('/Campuses/my-campus/generate-member-token');
    return response.data;
}