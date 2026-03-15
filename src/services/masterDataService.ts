import { api } from "../api/axios";

export const getBuildings = async () => {
    const response = await api.get('/Buildings');
    return response.data;
};

export const createBuilding = async (name: string) => {
    const response = await api.post('/Buildings', { name });
    return response.data;
};

export const getRoomTypes = async () => {
    const response = await api.get('/RoomTypes');
    return response.data;
};

export const createRoomType = async (name: string) => {
    const response = await api.post('/RoomTypes', { name });
    return response.data;
};