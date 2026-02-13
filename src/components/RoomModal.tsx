import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { X, Save, LayoutTemplate, Building } from "lucide-react";
import type { Room } from "../types/room";

interface RoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    roomToEdit?: Room | null;
}

const RoomModal = ({ isOpen, onClose, onSuccess, roomToEdit }: RoomModalProps) => {
    const [formData, setFormData] = useState({
        roomName: '',
        capacity: 0,
        type: 'Classroom',
        building: 'TowerA'
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if(roomToEdit){
                setFormData({
                    roomName: roomToEdit.roomName,
                    capacity: roomToEdit.capacity,
                    type: roomToEdit.type as string,
                    building: roomToEdit.building as string
                });
            } else {
                setFormData({ roomName: '', capacity: 0, type: 'Classroom', building: 'TowerA' });
            }
            setError('');
        }
    }, [isOpen, roomToEdit])

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'capacity' ? Number(value) : value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if(roomToEdit){
                await api.put(`/Rooms/${roomToEdit.id}`, {
                    id: roomToEdit.id,
                    ...formData
                });
            } else {
                await api.post('/Rooms', formData);
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data || 'Failed to save room details.');
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
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
                            {error}
                        </div>
                    )}
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
                                    name="type" 
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="Classroom">Classroom</option>
                                    <option value="Laboratory">Laboratory</option>
                                    <option value="MeetingRoom">Meeting Room</option>
                                    <option value="Auditorium">Auditorium</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                    <Building size={14} /> Building
                                </label>
                                <select 
                                    name="building" 
                                    value={formData.building}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="TowerA">Tower A</option>
                                    <option value="TowerB">Tower B</option>
                                    <option value="TowerC">Tower C</option>
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
                                {isLoading ? 'Saving...' : <><Save size={18} /> {roomToEdit ? 'Update Room' : 'Save Room'}</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RoomModal;