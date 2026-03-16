import { useState, useEffect } from "react";
import { getBuildings, createBuilding, getRoomTypes, createRoomType } from "../../services/masterDataService";
import toast from "react-hot-toast";
import { Building2, Plus, Layers, Loader2 } from "lucide-react";

const MasterData = () => {
    const [buildings, setBuildings] = useState<any[]>([]);
    const [roomTypes, setRoomTypes] = useState<any[]>([]);
    const [newBuilding, setNewBuilding] = useState('');
    const [newRoomType, setNewRoomType] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [buildingsData, roomTypesData] = await Promise.all([
                getBuildings(),
                getRoomTypes()
            ]);
            setBuildings(buildingsData);
            setRoomTypes(roomTypesData);
        } catch (error) {
            toast.error("Failed to load Master Data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddBuilding = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBuilding.trim()) return;
        setIsSubmitting(true);
        try {
            await createBuilding(newBuilding);
            toast.success("Building added successfully!");
            setNewBuilding('');
            fetchData();
        } catch (error) {
            toast.error("Failed to add building");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddRoomType = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRoomType.trim()) return;
        setIsSubmitting(true);
        try {
            await createRoomType(newRoomType);
            toast.success("Room type added successfully!");
            setNewRoomType('');
            fetchData();
        } catch (error) {
            toast.error("Failed to add room type");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="text-gray-500 font-medium">Loading data...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Campus Master Data</h1>
                <p className="text-sm md:text-base text-gray-500">Manage the list of Buildings and Room Types for your campus.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                        <Building2 className="text-blue-600" size={20} /> Building List
                    </h2>
                    <form onSubmit={handleAddBuilding} className="flex flex-col sm:flex-row gap-3 mb-6">
                        <input 
                            type="text"
                            placeholder="e.g., Tower 1"
                            className="flex-1 px-4 py-3 sm:py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm"
                            value={newBuilding}
                            onChange={(e) => setNewBuilding(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            disabled={isSubmitting || !newBuilding.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-3 sm:py-2 rounded-xl flex items-center justify-center gap-2 transition-all font-semibold text-sm active:scale-95"
                        >
                            <Plus size={18} /> Add
                        </button>
                    </form>
                    <div className="max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                        <ul className="grid grid-cols-1 gap-2">
                            {buildings.length > 0 ? (
                                buildings.map((b) => (
                                    <li key={b.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-700 text-sm font-medium hover:border-blue-200 transition-colors">
                                        {b.name}
                                    </li>
                                ))
                            ) : (
                                <li className="p-8 text-center text-gray-400 italic text-sm">No buildings added yet.</li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                        <Layers className="text-blue-600" size={20} /> Room Types
                    </h2>
                    <form onSubmit={handleAddRoomType} className="flex flex-col sm:flex-row gap-3 mb-6">
                        <input 
                            type="text"
                            placeholder="e.g., Laboratory"
                            className="flex-1 px-4 py-3 sm:py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm"
                            value={newRoomType}
                            onChange={(e) => setNewRoomType(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            disabled={isSubmitting || !newRoomType.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-3 sm:py-2 rounded-xl flex items-center justify-center gap-2 transition-all font-semibold text-sm active:scale-95"
                        >
                            <Plus size={18} /> Add
                        </button>
                    </form>
                    <div className="max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                        <ul className="grid grid-cols-1 gap-2">
                            {roomTypes.length > 0 ? (
                                roomTypes.map((rt) => (
                                    <li key={rt.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-700 text-sm font-medium hover:border-blue-200 transition-colors">
                                        {rt.name}
                                    </li>
                                ))
                            ) : (
                                <li className="p-8 text-center text-gray-400 italic text-sm">No room types added yet.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MasterData;