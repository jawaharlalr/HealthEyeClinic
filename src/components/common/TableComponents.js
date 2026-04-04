import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaChevronDown, FaCheck, FaTimes } from 'react-icons/fa';

// --- STANDARD HTML SELECT ---
export const TableSelect = ({ value, onChange, options = [] }) => (
  <select 
    className="w-full bg-black/20 border border-white/10 text-white text-sm rounded p-2.5 outline-none focus:border-blue-400 appearance-none cursor-pointer min-h-[42px] min-w-[80px]" 
    value={value} 
    onChange={onChange}
  >
    <option value="" className="text-gray-400 bg-slate-800">Select</option>
    {options && options.map((opt, i) => <option key={i} value={opt} className="bg-slate-800">{opt}</option>)}
  </select>
);

// --- INPUT & TEXTAREA ---
export const TableInput = ({ value, onChange, placeholder = '', type = "text" }) => {
  if (type === "date") {
    return (
      <input 
        type="date"
        className="w-full bg-black/20 border border-white/10 text-white text-sm rounded p-2.5 outline-none focus:border-blue-400 placeholder-white/30 min-h-[42px]"
        value={value}
        onChange={onChange}
      />
    );
  }
  return (
    <textarea 
      className="w-full bg-black/20 border border-white/10 text-white text-sm rounded p-2.5 outline-none focus:border-blue-400 placeholder-white/30 resize-y min-h-[42px] overflow-hidden align-top whitespace-nowrap" 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder}
      rows={1}
      onInput={(e) => {
        e.target.style.height = 'auto'; 
        e.target.style.height = e.target.scrollHeight + 'px'; 
      }}
    />
  );
};

// --- REUSABLE SERIAL NUMBER ---
export const TableSNo = ({ index }) => (
  <div className="flex items-center justify-center w-full min-h-[42px] text-blue-300 font-medium">
    {index + 1}
  </div>
);

// --- ATTRACTIVE CUSTOM MODAL SELECT ---
export const TableSelectModal = ({ value, onChange, options = [], placeholder = "Select..." }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling on the body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleSelect = (opt) => {
    // Mimic the event object structure so existing onChange handlers work seamlessly
    onChange({ target: { value: opt } });
    setIsOpen(false);
  };

  return (
    <>
      {/* TRIGGER BUTTON (Looks like the input field) */}
      <div 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between w-full p-2.5 text-sm transition-colors border rounded cursor-pointer min-h-[42px] min-w-[80px] bg-black/20 border-white/10 hover:border-blue-400/50 group"
      >
        <span className={value ? "text-white" : "text-white/30"}>
          {value || placeholder}
        </span>
        <FaChevronDown className="text-white/30 group-hover:text-blue-400 transition-colors text-[10px]" />
      </div>

      {/* THE MODAL (Rendered outside the DOM hierarchy via Portal to avoid clipping) */}
      {isOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          
          {/* Clickaway overlay */}
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsOpen(false)} />
          
          {/* Modal Content Box */}
          <div className="relative w-full max-w-md bg-[#0F172A] border border-white/10 shadow-2xl md:rounded-2xl rounded-t-2xl flex flex-col max-h-[80vh] md:max-h-[60vh] animate-slide-up md:animate-scale-in">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-white/5 border-white/10 md:rounded-t-2xl rounded-t-2xl">
              <h3 className="font-bold tracking-wide text-blue-200 uppercase text-md">
                {placeholder}
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 transition-colors rounded-full text-white/50 hover:text-white hover:bg-white/10"
              >
                <FaTimes />
              </button>
            </div>

            {/* Options List */}
            <div className="p-2 overflow-y-auto custom-scrollbar">
              {/* Option to clear selection */}
              <div 
                onClick={() => handleSelect('')}
                className={`flex justify-between items-center p-3 mb-1 cursor-pointer rounded-xl transition-all ${!value ? 'bg-blue-600/20 text-blue-300 font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
              >
                <span>None / Clear</span>
                {!value && <FaCheck className="text-blue-400" />}
              </div>

              {options.map((opt, i) => {
                const isSelected = value === opt;
                return (
                  <div 
                    key={i}
                    onClick={() => handleSelect(opt)}
                    className={`
                      flex justify-between items-center p-3 mb-1 cursor-pointer rounded-xl transition-all
                      ${isSelected 
                        ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-900/50' 
                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                      }
                    `}
                  >
                    <span>{opt}</span>
                    {isSelected && <FaCheck className="text-white" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};