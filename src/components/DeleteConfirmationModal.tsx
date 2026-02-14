import { AlertTriangle, X } from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    roomName: string;
    isLoading: boolean;
}

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, roomName, isLoading }: Props) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-100 rounded-full text-red-600">
                            <AlertTriangle size={24} />
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                            <X size={20} />
                        </button>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Room?</h3>
                    <p className="text-gray-600">
                        Are you sure you want to delete <span className="font-semibold text-gray-800">"{roomName}"</span>?
                        This action cannot be undone and may affect active bookings.
                    </p>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center"
                    >
                        {isLoading ? "Deleting..." : "Yes, Delete Room"}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;