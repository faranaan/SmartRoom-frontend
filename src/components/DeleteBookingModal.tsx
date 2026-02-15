import { AlertTriangle, X } from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userName: string;
    roomName: string;
    isLoading: boolean;
}

const DeleteBookingModal = ({ isOpen, onClose, onConfirm, userName, roomName, isLoading }: Props) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-100 rounded-full text-red-600">
                            <AlertTriangle size={24} />
                        </div>
                        <button 
                            onClick={onClose} 
                            disabled={isLoading}
                            className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-full"
                        >
                            <X size={20} />
                        </button>
                    </div>       
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Booking Record?</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Are you sure you want to delete the booking for <span className="font-semibold text-gray-800">"{roomName}"</span> requested by <span className="font-semibold text-gray-800">{userName}</span>?
                    </p>
                    <p className="mt-3 text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                        <strong>Warning:</strong> This data will be permanently removed from the database and audit logs. This action cannot be undone.
                    </p>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Yes, Delete Permanently"
                        )}
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

export default DeleteBookingModal;