import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Room } from "../types/room";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import RoomModal from "../components/RoomModal";
import RoomDetailModal from "../components/RoomDetailModal";

const Rooms = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [detailRoom, setDetailRoom] = useState<Room | null>(null);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/Rooms');
            setRooms(response.data);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = () => {
        setSelectedRoom(null);
        setIsFormOpen(true);
    };

    const handleEdit = (room: Room) => {
        setSelectedRoom(room)
        setIsFormOpen(true);
    };

    const handleDetail = (room: Room) => {
        setDetailRoom(room);
        setIsDetailOpen(true);
    }

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure ypu want to delete this room? This action cannot be undone.')){
            try {
                await api.delete(`/Rooms/${id}`)
                fetchRooms();
            } catch (error) {
                alert('Failed to delete room. Please ensure there are no active bookings')
            }
        }
    };

    const getRoomTypeName = (type: string) => {
        switch (type) {
            case "Classroom": return "Classroom";
            case "Laboratory": return "Laboratory";
            case "MeetingRoom": return "Meeting Room";
            case "Auditorium": return "Auditorium";
            default: return type;
        }
    };

    const getBuildingName = (building: string) => {
        switch (building) {
            case "TowerA" : return "Tower A";
            case "TowerB" : return "Tower B";
            case "TowerC" : return "Tower C";
            default: return building;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Room Management</h1>
                    <p className="text-gray-500">Manage campus room list and availability</p>
                </div>
                <button 
                    onClick={handleAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
                >
                    <Plus size={18} /> Add Room
                </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Room Name</th>
                            <th className="p-4 font-semibold text-gray-600">Building & Type</th>
                            <th className="p-4 font-semibold text-gray-600">Capacity</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500 animate-pulse">Loading data...</td>
                            </tr>
                        ) :  rooms.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">Room not found.</td>
                            </tr>
                        ) : (
                            rooms.map((room) => (
                                <tr key={room.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-medium text-gray-800">{room.roomName || "Unknown"}</td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-700">
                                                {getBuildingName(room.building)}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {getRoomTypeName(room.type)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">{room.capacity} People</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            room.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {room.isAvailable ? 'Available' : 'Occupied'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center space-x-2">
                                        <button 
                                            onClick={() => handleDetail(room)}
                                            className="text-blue-600 hover:text-blue-800 p-1 transition" 
                                            title="Details"
                                        >
                                            <Search size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleEdit(room)}
                                            className="text-blue-600 hover:text-blue-800 p-1 transition" 
                                            title="Edit"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button 
                                        onClick={() => handleDelete(room.id)}
                                            className="text-red-500 hover:text-red-700 p-1 transition" 
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <RoomModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={fetchRooms}
                roomToEdit={selectedRoom}
            />
            <RoomDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                room={detailRoom}
            />
        </div>
    );
};

export default Rooms;