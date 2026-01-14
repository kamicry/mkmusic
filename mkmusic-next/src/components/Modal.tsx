import React, { useState, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content: React.ReactNode;
  type?: 'default' | 'loading' | 'success' | 'error';
  showCloseButton?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  type = 'default',
  showCloseButton = true,
  onConfirm,
  confirmText = '确定'
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'loading':
        return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>;
      case 'success':
        return <div className="text-green-500 text-2xl">✓</div>;
      case 'error':
        return <div className="text-red-500 text-2xl">✗</div>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 relative">
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        )}

        <div className="flex flex-col items-center">
          {getIcon()}
          {title && (
            <h3 className="text-xl font-bold mb-4 mt-2">{title}</h3>
          )}
          <div className="text-center mb-6">{content}</div>

          {onConfirm && (
            <button
              onClick={onConfirm}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition-colors"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;