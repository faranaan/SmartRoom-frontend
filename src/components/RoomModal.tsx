import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { X, Save, LayoutTemplate, Building } from "lucide-react";
import type { Room } from "../types/room";
import { getBuildings, getRoomTypes } from "../services/masterDataService";
import toast from "react-hot-toast";

interface RoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    roomToEdit?: Room | null;
}

const RoomModal = ({ isOpen, onClose, onSuccess, roomToEdit }: RoomModalProps) => {
    const [buildings, setBuildings] = useState<any[]>([]);
    const [roomTypes, setRoomTypes] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        roomName: '',
        capacity: 0,
        roomTypeId: '',
        buildingId: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const [bData, rtData] = await Promise.all([getBuildings(), getRoomTypes()]);
                setBuildings(bData);
                setRoomTypes(rtData);

                if (!roomToEdit && bData.length > 0 && rtData.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        buildingId: bData[0].id.toString(),
                        roomTypeId: rtData[0].id.toString()
                    }));
                }
            } catch (err) {
                toast.error("Failed to load options");
            }
        };

        if (isOpen) {
            fetchMasterData();
        }
    }, [isOpen, roomToEdit]);

    useEffect(() => {
        if (isOpen && roomToEdit) {
            setFormData({
                roomName: roomToEdit.roomName,
                capacity: roomToEdit.capacity,
                roomTypeId: (roomToEdit.roomType as any)?.id?.toString() || '',
                buildingId: (roomToEdit.building as any)?.id?.toString() || ''
            });
        } else if (isOpen && !roomToEdit) {
            setFormData({ roomName: '', capacity: 0, roomTypeId: '', buildingId: '' });
        }
    }, [isOpen, roomToEdit]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'capacity' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = {
                roomName: formData.roomName,
                capacity: formData.capacity,
                roomTypeId: parseInt(formData.roomTypeId),
                buildingId: parseInt(formData.buildingId)
            };

            if (roomToEdit) {
                await api.put(`/Rooms/${roomToEdit.id}`, { id: roomToEdit.id, ...payload });
                toast.success("Room updated successfully");
            } else {
                await api.post('/Rooms', payload);
                toast.success("Room created successfully");
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err.response?.data || "Failed to save room");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fade-in-up">
                <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                    <h2 className="font-bold text-lg">
                        {roomToEdit ? 'Edit Room' : 'Add New Room'}
                    </h2>
                    <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                            <input 
                                name="roomName"
                                type="text"
                                value={formData.roomName}
                                onChange={handleChange}
                                placeholder="e.g., Computer Lab 1"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                required 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                            <input 
                                name="capacity"
                                type="number"
                                value={formData.capacity}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                min="1"
                                required 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                    <LayoutTemplate size={14} /> Type
                                </label>
                                <select 
                                    name="roomTypeId" 
                                    value={formData.roomTypeId}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    required
                                >
                                    <option value="">Select Type</option>
                                    {roomTypes.map(rt => (
                                        <option key={rt.id} value={rt.id}>{rt.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                    <Building size={14} /> Building
                                </label>
                                <select 
                                    name="buildingId" 
                                    value={formData.buildingId}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    required
                                >
                                    <option value="">Select Building</option>
                                    {buildings.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-200 mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex justify-center items-center gap-2"
                            >
                                {isLoading ? 'Saving...' : <><Save size={18} /> {roomToEdit ? 'Update' : 'Save'}</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RoomModal;