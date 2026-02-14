import { CheckCircle } from "lucide-react";

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

const SuccessModal = ({ isOpen, onClose, title, message }: SuccessModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-green-100 rounded-full text-green-600">
                            <CheckCircle size={40} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-600 mb-6">
                        {message}
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg:green-700 transition shadow-lg shadow-green-600/20 active:scale-95"
                    >
                        Great, Thanks!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;