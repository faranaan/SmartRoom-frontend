import { AlertCircle } from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText: string;
    isLoading?: boolean;
}

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, isLoading }: Props) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up">
                <div className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                            <AlertCircle size={32} />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-500 mb-6">{message}</p>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition">
                            Cancel
                        </button>
                        <button 
                            onClick={onConfirm} 
                            disabled={isLoading}
                            className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {isLoading ? "Processing..." : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;