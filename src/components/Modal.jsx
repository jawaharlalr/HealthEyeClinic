import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md p-8 glass-panel border-medical-primary/20">
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <p className="mb-6 text-slate-400">{message}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 transition hover:text-white">Cancel</button>
          <button onClick={onConfirm} className="px-6 py-2 transition rounded-lg bg-red-500/80 hover:bg-red-600">Confirm Delete</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;