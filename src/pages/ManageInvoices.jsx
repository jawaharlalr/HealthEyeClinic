import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore'; 
import { FaSearch, FaFileInvoiceDollar, FaDownload, FaTrash, FaEye } from 'react-icons/fa';
import { generateInvoicePDF } from '../utils/generateInvoicePDF1';
import { toast } from 'react-toastify';
import ViewInvoiceModal from '../components/ViewInvoiceModal';

const ManageInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const q = query(collection(db, "invoices"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInvoices(data);
      setFilteredInvoices(data);
    } catch (e) {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
  console.log("Attempting to delete document with ID:", id); // Check this in your browser console (F12)
  
  if (!id) {
    toast.error("Error: Invoice ID is missing");
    return;
  }

  if (window.confirm("Are you sure you want to delete this invoice?")) {
    try {
      await deleteDoc(doc(db, "invoices", id));
      setInvoices(prev => prev.filter(inv => inv.id !== id));
      setFilteredInvoices(prev => prev.filter(inv => inv.id !== id));
      toast.success("Invoice deleted");
    } catch (e) {
      console.error("Firestore Delete Error:", e);
      toast.error(`Delete failed: ${e.message}`);
    }
  }
};
  useEffect(() => {
    const filtered = invoices.filter(inv => 
      inv.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      inv.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      inv.mrNo?.includes(searchTerm)
    );
    setFilteredInvoices(filtered);
  }, [searchTerm, invoices]);

  return (
    <div className="w-full p-4 text-white md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 text-white bg-blue-500 shadow-lg rounded-xl">
           <FaFileInvoiceDollar size={24} />
        </div>
        <h1 className="text-2xl font-bold md:text-3xl">Manage Invoices</h1>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 p-4 mb-8 border glass-panel rounded-2xl border-white/5">
        <FaSearch className="ml-2 text-blue-400" />
        <input 
          type="text"
          placeholder="Search by Patient Name or MR No..."
          className="w-full font-bold bg-transparent outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden border glass-panel rounded-2xl border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs font-black tracking-widest text-blue-200 uppercase bg-blue-900/40">
              <tr>
                <th className="p-4">S.No</th>
                <th className="p-4">Date</th>
                <th className="p-4">MR No</th>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Total (₹)</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center">Loading...</td></tr>
              ) : filteredInvoices.map((inv, idx) => (
                <tr key={inv.id} className="transition-colors hover:bg-white/5">
                  <td className="p-4 text-sm font-bold">{idx + 1}</td>
                  <td className="p-4 text-sm font-bold">{inv.createdAt?.toDate().toLocaleDateString()}</td>
                  <td className="p-4 text-sm font-bold text-blue-400">{inv.mrNo}</td>
                  <td className="p-4 text-sm font-bold">{inv.patientName || inv.name || 'N/A'}</td>
                  <td className="p-4 text-sm font-black text-emerald-400">₹ {inv.grandTotal?.toFixed(2) || '0.00'}</td>
                  <td className="flex justify-center gap-2 p-4">
                    {/* View Button */}
                    <button onClick={() => setSelectedInvoice(inv)} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600"><FaEye size={14}/></button>
                    
                    {/* Download Button */}
                    <button onClick={() => generateInvoicePDF(inv)} className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500"><FaDownload size={14}/></button>
                    
                    {/* Delete Button */}
                    <button onClick={() => handleDelete(inv.id)} className="p-2 bg-red-600 rounded-lg hover:bg-red-500"><FaTrash size={14}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal for Viewing */}
      {selectedInvoice && (
        <ViewInvoiceModal 
          invoice={selectedInvoice} 
          onClose={() => setSelectedInvoice(null)} 
        />
      )}
    </div>
  );
};

export default ManageInvoices;