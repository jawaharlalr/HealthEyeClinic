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
          <div><p className="text-slate-500 font-bold uppercase text-[10px]">Patient Name</p><p className="font-bold">{invoice.patientName || 'N/A'}</p></div>
          <div><p className="text-slate-500 font-bold uppercase text-[10px]">MR No</p><p className="font-bold">{invoice.mrNo || 'N/A'}</p></div>
          <div><p className="text-slate-500 font-bold uppercase text-[10px]">Gender</p><p className="font-bold">{invoice.gender || 'N/A'}</p></div>
          <div><p className="text-slate-500 font-bold uppercase text-[10px]">DOB</p><p className="font-bold">{invoice.dob || 'N/A'}</p></div>
          <div><p className="text-slate-500 font-bold uppercase text-[10px]">Phone</p><p className="font-bold">{invoice.phone || 'N/A'}</p></div>
          <div className="col-span-2"><p className="text-slate-500 font-bold uppercase text-[10px]">Address</p><p className="text-sm font-bold">{invoice.address || 'N/A'}</p></div>
        </div>

        {/* Frames Table */}
        {invoice.frames?.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-2 text-xs font-black text-blue-400 uppercase">Frames</h3>
            <table className="w-full text-xs">
              <thead><tr className="text-left border-b border-white/10"><th className="pb-1">S.No</th><th className="pb-1">Material</th><th className="pb-1">Type</th><th className="pb-1">Size</th><th className="pb-1 text-right">Price</th></tr></thead>
              <tbody>{invoice.frames.map((item, i) => (
                <tr key={i} className="border-b border-white/5"><td className="py-2">{i+1}</td><td className="py-2">{item.material}</td><td className="py-2">{item.type}</td><td className="py-2">{item.size}</td><td className="py-2 text-right">Rs. {item.price}</td></tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {/* Lenses Table */}
        {invoice.lenses?.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-2 text-xs font-black uppercase text-emerald-400">Lenses</h3>
            <table className="w-full text-xs">
              <thead><tr className="text-left border-b border-white/10"><th className="pb-1">S.No</th><th className="pb-1">Material</th><th className="pb-1">Type</th><th className="pb-1 text-right">Price</th></tr></thead>
              <tbody>{invoice.lenses.map((item, i) => (
                <tr key={i} className="border-b border-white/5"><td className="py-2">{i+1}</td><td className="py-2">{item.material}</td><td className="py-2">{item.type}</td><td className="py-2 text-right">Rs. {item.price}</td></tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {/* Coatings Table */}
        {invoice.coatings?.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-2 text-xs font-black text-purple-400 uppercase">Lens Coatings</h3>
            <table className="w-full text-xs">
              <thead><tr className="text-left border-b border-white/10"><th className="pb-1">S.No</th><th className="pb-1">Type</th><th className="pb-1 text-right">Price</th></tr></thead>
              <tbody>{invoice.coatings.map((item, i) => (
                <tr key={i} className="border-b border-white/5"><td className="py-2">{i+1}</td><td className="py-2">{item.type}</td><td className="py-2 text-right">Rs. {item.price}</td></tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {/* Totals */}
        <div className="pt-4 mt-6 space-y-2 text-right border-t border-white/10">
          <p className="text-sm">Subtotal: Rs. {invoice.subTotal?.toFixed(2)}</p>
          <p className="text-sm">Fitting: Rs. 200.00</p>
          {invoice.discount > 0 && <p className="text-sm text-red-400">Discount: Rs. {invoice.discount.toFixed(2)}</p>}
          <p className="text-xl font-black text-emerald-400">Grand Total: Rs. {invoice.grandTotal?.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoiceModal;