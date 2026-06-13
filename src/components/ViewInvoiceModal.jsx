import React from 'react';
import { FaTimes, FaDownload, FaPrint } from 'react-icons/fa';
// Ensure this path matches the actual file location of generateInvoicePDF1.js
import { generateInvoicePDF } from '../utils/generateInvoicePDF1'; 

const ViewInvoiceModal = ({ invoice, onClose }) => {
  if (!invoice) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-panel p-8 rounded-3xl border border-white/10 bg-slate-900 text-white shadow-2xl">
        
        {/* Header with Actions */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <h2 className="text-xl font-black text-blue-300 uppercase">Invoice Details</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => generateInvoicePDF(invoice, true)} 
              className="p-3 transition-colors rounded-full text-emerald-400 hover:bg-white/10" 
              title="Print Professional Report"
            >
              <FaPrint size={18} />
            </button>
            <button 
              onClick={() => generateInvoicePDF(invoice, false)} 
              className="p-3 text-blue-400 transition-colors rounded-full hover:bg-white/10" 
              title="Download PDF"
            >
              <FaDownload size={18} />
            </button>
            <button onClick={onClose} className="p-3 transition-colors rounded-full hover:bg-white/10">
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* Patient Details */}
        <div className="grid grid-cols-2 mb-8 gap-x-8 gap-y-4">
          <div>
            <p className="text-slate-500 font-bold uppercase text-[10px]">Patient Name</p>
            <p className="font-bold text-white/80">{invoice.patientName || invoice.name || 'N/A'}</p>
          </div>
          {['mrNo', 'gender', 'age', 'phone', 'address'].map(field => (
            <div key={field} className={field === 'address' ? 'col-span-2' : ''}>
              <p className="text-slate-500 font-bold uppercase text-[10px]">{field.replace(/([A-Z])/g, ' $1')}</p>
              <p className="font-bold text-white/80">{invoice[field] || 'N/A'}</p>
            </div>
          ))}
        </div>

        {/* Detailed Tables */}
        {[
          { key: 'frames', title: 'Frames & Fitting' },
          { key: 'lenses', title: 'Lenses' },
          { key: 'coatings', title: 'Coatings' }
        ].map(cat => (
          <div key={cat.key} className="mb-6">
            <h3 className="pb-1 mb-3 text-xs font-black text-blue-400 uppercase border-b border-white/10">{cat.title}</h3>
            {invoice[cat.key]?.length > 0 ? (
              invoice[cat.key].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 mb-2 text-sm border rounded-lg bg-white/5 border-white/5">
                  <div className="flex flex-col">
                    <span className="font-bold">{item.type || item.material || 'N/A'}</span>
                    <div className="flex gap-3 text-[10px] text-slate-400">
                      {item.material && <span>Material: <span className="text-white">{item.material}</span></span>}
                      {item.size && <span>Size: <span className="text-white">{item.size}</span></span>}
                    </div>
                  </div>
                  <span className="font-black text-emerald-400">Rs. {item.price || '0'}</span>
                </div>
              ))
            ) : (
              <p className="text-xs italic text-slate-500">No {cat.title.toLowerCase()} added.</p>
            )}
          </div>
        ))}
        
        {/* Discount & Totals Summary */}
        <div className="pt-4 mt-6 space-y-2 border-t border-white/10">
          <div className="flex justify-between text-sm text-slate-400">
            <span>Subtotal</span>
            <span>Rs. {invoice.subTotal?.toFixed(2) || '0.00'}</span>
          </div>

          {/* New Fitting Charges Line */}
          <div className="flex justify-between text-sm text-slate-400">
            <span>Fitting Charges</span>
            <span>Rs. 180.00</span>
          </div>
          
          {(invoice.discountPercent > 0 || invoice.discountAmount > 0) && (
            <div className="flex justify-between text-sm text-red-400">
              <span>Discount {invoice.discountPercent ? `(${invoice.discountPercent}%)` : ''}</span>
              <span>- Rs. {invoice.discountAmount?.toFixed(2) || '0.00'}</span>
            </div>
          )}

          <div className="flex justify-between pt-2 mt-2 text-lg font-black border-t border-white/10">
            <span>Grand Total</span>
            <span className="text-emerald-400">
              {/* Calculation: Subtotal + 180 - Discount */}
              Rs. {((Number(invoice.subTotal || 0) + 180) - Number(invoice.discountAmount || 0)).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoiceModal;