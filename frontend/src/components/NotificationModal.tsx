import React from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'warning';
  title: string;
  message: string;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  type,
  title,
  message,
  onClose,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'error':
        return <XCircle className="h-12 w-12 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-12 w-12 text-yellow-500" />;
      default:
        return <CheckCircle className="h-12 w-12 text-green-500" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          text: 'text-green-800',
          button: 'bg-green-600 hover:bg-green-700',
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          text: 'text-red-800',
          button: 'bg-red-600 hover:bg-red-700',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-800',
          button: 'bg-yellow-600 hover:bg-yellow-700',
        };
      default:
        return {
          bg: 'bg-green-50',
          text: 'text-green-800',
          button: 'bg-green-600 hover:bg-green-700',
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        <div className={`p-6 ${colors.bg} rounded-t-lg border-b`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="animate-bounce">
                {getIcon()}
              </div>
              <h3 className={`text-xl font-bold ${colors.text}`}>
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 bg-white">
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </div>
        
        <div className="p-6 bg-gray-50 rounded-b-lg border-t">
          <button
            onClick={onClose}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${colors.button} shadow-md hover:shadow-lg transform hover:scale-105 transition-transform`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;