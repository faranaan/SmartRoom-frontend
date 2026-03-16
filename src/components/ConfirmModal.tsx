import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    variant?: 'info' | 'danger' | 'warning' | 'success'; 
    title: string;
    message: React.ReactNode; 
    confirmText?: string;
    isLoading?: boolean;
}

const ConfirmModal = ({ 
    isOpen, onClose, onConfirm, variant = 'info', 
    title, message, confirmText = "Confirm", isLoading 
}: Props) => {
    if (!isOpen) return null;

    const theme = {
        info: { bg: 'bg-blue-50', text: 'text-blue-600', btn: 'bg-blue-600 hover:bg-blue-700', icon: AlertCircle },
        danger: { bg: 'bg-red-50', text: 'text-red-600', btn: 'bg-red-600 hover:bg-red-700', icon: AlertTriangle },
        warning: { bg: 'bg-amber-50', text: 'text-amber-600', btn: 'bg-amber-600 hover:bg-amber-700', icon: AlertTriangle },
        success: { bg: 'bg-green-50', text: 'text-green-600', btn: 'bg-green-600 hover:bg-green-700', icon: CheckCircle },
    }[variant];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                        <div className={`${theme.bg} ${theme.text} p-3 rounded-full`}>
                            <theme.icon size={32} />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <div className="text-gray-500 mb-6 text-sm">{message}</div>
                    <div className="flex gap-3">
                        {onConfirm && (
                            <button onClick={onClose} disabled={isLoading} className="flex-1 py-2.5 border rounded-lg hover:bg-gray-50 transition">
                                Cancel
                            </button>
                        )}
                        <button 
                            onClick={onConfirm || onClose} 
                            disabled={isLoading}
                            className={`flex-1 py-2.5 ${theme.btn} text-white rounded-lg font-semibold transition disabled:opacity-50`}
                        >
                            {isLoading ? "Wait..." : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;