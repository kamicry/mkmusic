import React, { useState } from 'react';

interface ModalOptions {
  title?: string;
  content: React.ReactNode;
  type?: 'default' | 'loading' | 'success' | 'error';
  showCloseButton?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
  autoClose?: number; // Auto close after X milliseconds
}

export const useModal = () => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    options?: ModalOptions;
  }>({ isOpen: false });

  const showModal = (options: ModalOptions) => {
    setModalState({ isOpen: true, options });
    
    if (options.autoClose) {
      setTimeout(() => {
        closeModal();
      }, options.autoClose);
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false });
  };

  const msg = (content: string, options: Partial<ModalOptions> = {}) => {
    showModal({
      content,
      type: 'default',
      autoClose: 2000,
      ...options
    });
  };

  const loading = (content: string = '加载中...') => {
    showModal({
      content,
      type: 'loading'
    });
  };

  const success = (content: string, autoClose: number = 2000) => {
    showModal({
      content,
      type: 'success',
      autoClose
    });
  };

  const error = (content: string, autoClose: number = 3000) => {
    showModal({
      content,
      type: 'error',
      autoClose
    });
  };

  const confirm = (content: string, onConfirm: () => void, options: Partial<ModalOptions> = {}) => {
    showModal({
      content,
      type: 'default',
      onConfirm: () => {
        closeModal();
        onConfirm();
      },
      confirmText: '确定',
      ...options
    });
  };

  const prompt = (options: {
    title: string;
    content?: string;
    defaultValue?: string;
    placeholder?: string;
    onConfirm: (value: string) => void;
    onCancel?: () => void;
  }) => {
    // This would be a more complex implementation with input field
    // For now, we'll use a simple confirm with input
    const inputId = `modal-prompt-${Date.now()}`;
    
    showModal({
      title: options.title,
      content: (
        <div className="space-y-4">
          {options.content && <p>{options.content}</p>}
          <input
            id={inputId}
            type="text"
            defaultValue={options.defaultValue}
            placeholder={options.placeholder}
            className="w-full p-2 bg-gray-700 rounded text-white"
          />
        </div>
      ),
      onConfirm: () => {
        const input = document.getElementById(inputId) as HTMLInputElement;
        if (input) {
          options.onConfirm(input.value);
        }
      },
      confirmText: '确定'
    });
  };

  return {
    modalState,
    showModal,
    closeModal,
    msg,
    loading,
    success,
    error,
    confirm,
    prompt
  };
};