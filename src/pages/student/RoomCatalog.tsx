import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import type { Room } from "../../types/room";
import { Users, MapPin, LayoutTemplate, Search, CalendarCheck, Info } from "lucide-react";
import BookingModal from "../../components/BookingModal";
import SuccessModal from "../../components/SuccessModal";
import RoomScheduleModal from "../../components/RoomScheduleModal";

const RoomCatalog = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/Rooms');
            setRooms(response.data);
        } catch (error) {
            console.error("Failed to fetch room data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper functions placed inside the component to avoid scope errors
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
            case "TowerA": return "Tower A";
            case "TowerB": return "Tower B";
            case "TowerC": return "Tower C";
            default: return building;
        }
    };

    const handleOpenBooking = (room: Room) => {
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    const handleOpenSchedule = (room: Room) => {
        setSelectedRoom(room);
        setIsScheduleOpen(true);
    };

    const handleBookingSucces = () => {
        setIsSuccessOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Room Catalog</h1>
                    <p className="text-gray-500 mt-1">Select a room that suits your activity needs.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search rooms..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none transition focus:border-blue-500"    
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : rooms.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-lg">No rooms available at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <div key={room.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group flex flex-col">
                            {/* Card Header/Image placeholder */}
                            <div className="h-40 bg-gradient-to-r from-blue-500 to-cyan-500 relative flex items-center justify-center">
                                <LayoutTemplate className="text-white/30 w-20 h-20" />
                                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                                    room.isAvailable ? 'bg-white text-green-600' : 'bg-white text-red-500'
                                }`}>
                                    {room.isAvailable ? 'Available' : 'Occupied'}
                                </span>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-blue-600 transition">
                                    {room.roomName}
                                </h3>
                                <div className="space-y-2 mb-6 mt-4">
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <MapPin size={16} className="text-gray-400" />
                                        <span>{getBuildingName(room.building)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <LayoutTemplate size={16} className="text-gray-400" />
                                        <span>{getRoomTypeName(room.type)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <Users size={16} className="text-gray-400" />
                                        <span>Capacity: {room.capacity} People</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-auto flex gap-3">
                                    <button
                                        onClick={() => handleOpenSchedule(room)}
                                        className="flex-1 py-2.5 rounded-lg font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition flex items-center justify-center gap-2 border border-blue-100"
                                    >
                                        <Info size={18} /> Schedule
                                    </button>

                                    <button
                                        disabled={!room.isAvailable}
                                        onClick={() => handleOpenBooking(room)}
                                        className={`flex-1 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
                                            room.isAvailable
                                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                        }`}
                                    >
                                        {room.isAvailable ? (
                                            <> <CalendarCheck size={18} /> Book Now</>
                                        ) : ( 
                                            'Occupied'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modals Container */}
            <RoomScheduleModal 
                isOpen={isScheduleOpen}
                onClose={() => {
                    setIsScheduleOpen(false);
                    setSelectedRoom(null);
                }}
                room={selectedRoom}
            />

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                room={selectedRoom}
                onSuccess={handleBookingSucces}
            />
            
            <SuccessModal
                isOpen={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
                title="Booking Successful!"
                message="Your request has been submitted. You can monitor the approval status in your dashboard."
            />
        </div>
    );
};

export default RoomCatalog;