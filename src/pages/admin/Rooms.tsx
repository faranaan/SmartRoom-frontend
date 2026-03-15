import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import type { Room } from "../../types/room";
import { Plus, Pencil, Trash2, Search, Users, Building2 } from "lucide-react";
import RoomModal from "../../components/RoomModal";
import RoomAuditModal from "../../components/RoomAuditModal";
import ConfirmModal from "../../components/ConfirmModal";
import toast from "react-hot-toast";

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [auditRoom, setAuditRoom] = useState<Room | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/Rooms");
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
    setSelectedRoom(room);
    setIsFormOpen(true);
  };

  const handleAudit = (room: Room) => {
    setAuditRoom(room);
    setIsAuditOpen(true);
  };

  const handleDeleteClick = (room: Room) => {
    setRoomToDelete(room);
    setIsDeleteOpen(true);
  };

  const displayValue = (field: any, fallbackFunc: (val: string) => string) => {
    if (typeof field === 'object' && field !== null) return field.name;
    return fallbackFunc(field as string);
  };

  const getRoomTypeName = (type: string) => {
    switch (type) {
      case "Classroom": return "Classroom";
      case "Laboratory": return "Laboratory";
      case "MeetingRoom": return "Meeting Room";
      case "Auditorium": return "Auditorium";
      default: return type || "Unknown";
    }
  };

  const getBuildingName = (building: string) => {
    switch (building) {
      case "TowerA": return "Tower A";
      case "TowerB": return "Tower B";
      case "TowerC": return "Tower C";
      default: return building || "Unknown";
    }
  };

  const confirmDelete = async () => {
    if (!roomToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/Rooms/${roomToDelete.id}`);
      setIsDeleteOpen(false);
      toast.success("Room deleted successfully");
      fetchRooms();
    } catch (error) {
      toast.error("Failed to delete room. Please ensure there are no active bookings");
    } finally {
      setIsDeleting(false);
      setRoomToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Room Management</h1>
          <p className="text-sm text-gray-500">Manage campus room list and availability</p>
        </div>
        <button
          onClick={handleAdd}
          className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 shadow-md shadow-blue-100 font-medium"
        >
          <Plus size={20} /> Add Room
        </button>
      </div>
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">Loading room data...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
          <Building2 className="mx-auto text-gray-200 mb-3" size={48} />
          <p className="text-gray-500 font-medium">No rooms found.</p>
        </div>
      ) : (
        <>
          <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Room Name</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Building & Type</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Capacity</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="p-4 font-bold text-gray-900">{room.roomName || "Unknown"}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-700">
                          {displayValue(room.building, getBuildingName)}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {displayValue((room as any).roomType || (room as any).type, getRoomTypeName)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 text-sm font-medium">{room.capacity} People</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                          room.isAvailable ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
                        }`}>
                        {room.isAvailable ? "Available" : "Occupied"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-1">
                        <button onClick={() => handleAudit(room)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Audit Logs"><Search size={18} /></button>
                        <button onClick={() => handleEdit(room)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit"><Pencil size={18} /></button>
                        <button onClick={() => handleDeleteClick(room)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{room.roomName}</h3>
                    <p className="text-xs text-gray-400 font-medium">
                        {displayValue((room as any).roomType || (room as any).type, getRoomTypeName)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                      room.isAvailable ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
                    }`}>
                    {room.isAvailable ? "Available" : "Occupied"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase">
                      <Building2 size={12} /> Building
                    </div>
                    <p className="text-sm font-bold text-gray-700">
                        {displayValue(room.building, getBuildingName)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase">
                      <Users size={12} /> Capacity
                    </div>
                    <p className="text-sm font-bold text-gray-700">{room.capacity} People</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button onClick={() => handleAudit(room)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-blue-600 rounded-xl text-xs font-bold active:bg-blue-50">
                    <Search size={16} /> Audit
                  </button>
                  <button onClick={() => handleEdit(room)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold active:bg-blue-100">
                    <Pencil size={16} /> Edit
                  </button>
                  <button onClick={() => handleDeleteClick(room)} className="p-2.5 bg-red-50 text-red-600 rounded-xl active:bg-red-100">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <RoomModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={fetchRooms} roomToEdit={selectedRoom} />
      <RoomAuditModal isOpen={isAuditOpen} onClose={() => setIsAuditOpen(false)} roomId={auditRoom?.id} roomName={auditRoom?.roomName} />
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        variant="danger"
        title="Delete Room?"
        message={
          <span className="text-sm">
            Are you sure you want to delete <strong className="text-red-600">{roomToDelete?.roomName}</strong>? 
            This action cannot be undone and will remove all associated data.
          </span>
        }
        confirmText="Delete Room"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Rooms;