import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ViewInvoiceModal = ({ invoice, onClose }) => {
  if (!invoice) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-panel p-8 rounded-3xl border border-white/10 bg-slate-900 text-white">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <h2 className="text-xl font-black text-blue-300 uppercase">Invoice Details</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10"><FaTimes /></button>
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
          { key: 'frames', title: 'Frames' },
          { key: 'lenses', title: 'Lenses' },
          { key: 'coatings', title: 'Coatings' }
        ].map(cat => (
          <div key={cat.key} className="mb-6">
            <h3 className="pb-1 mb-3 text-xs font-black text-blue-400 uppercase border-b border-white/10">{cat.title}</h3>
            {invoice[cat.key]?.length > 0 ? (
              invoice[cat.key].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 mb-2 text-sm rounded-lg bg-white/5">
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
          <div className="flex justify-between text-sm text-slate-400">
            <span>Fitting Charges</span>
            <span>Rs. {invoice.fittingCharges?.toFixed(2) || '200.00'}</span>
          </div>
          
          {/* Discount details */}
          {(invoice.discountPercent > 0 || invoice.discountAmount > 0) && (
            <div className="flex justify-between text-sm text-red-400">
              <span>Discount {invoice.discountPercent ? `(${invoice.discountPercent}%)` : ''}</span>
              <span>- Rs. {invoice.discountAmount?.toFixed(2) || '0.00'}</span>
            </div>
          )}

          <div className="flex justify-between pt-2 mt-2 text-lg font-black border-t border-white/10">
            <span>Grand Total</span>
            <span className="text-emerald-400">Rs. {invoice.grandTotal?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoiceModal;