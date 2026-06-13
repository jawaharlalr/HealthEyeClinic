import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { FaTrash, FaEye, FaUserCircle, FaTimes, FaSearch, FaDownload, FaPrint } from 'react-icons/fa';
import { generateBillPDF } from '../utils/generatePDF'; 
import { toast } from 'react-toastify';

const BillModal = ({ bill, onClose }) => {
  if (!bill) return null;

  const isSystemField = (key) => [
    'id', 'patient', 'patientName', 'mrNo', 'createdAt', 'normalizedName', 
    'normalizedMR', 'purposeOfVisit', 'age', 'gender', 'phone', 'address', '_id'
  ].includes(key);

  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  const renderValue = (value) => {
    if (Array.isArray(value)) {
      if (value.length === 0) return <p className="text-xs italic text-white/30">No data</p>;
      return (
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="text-blue-400 border-b border-white/10">
                {Object.keys(value[0]).map(k => (
                  <th key={k} className="p-2 font-bold uppercase">{formatLabel(k)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {value.map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                  {Object.values(row).map((v, j) => (
                    <td key={j} className="p-2 font-medium">{String(v || '-')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (typeof value === 'object' && value !== null) {
      return (
        <div className="grid grid-cols-2 gap-2 mt-2">
          {Object.entries(value).map(([subKey, subVal]) => (
            <div key={subKey} className="text-[11px] bg-white/5 p-2 rounded border border-white/5">
              <span className="font-bold uppercase text-slate-500">{formatLabel(subKey)}: </span>
              <span className="font-bold text-white">{String(subVal || '-')}</span>
            </div>
          ))}
        </div>
      );
    }
    return <p className="text-sm font-bold text-white">{String(value)}</p>;
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md">
      <div className="glass-panel w-full max-w-7xl h-[90vh] flex flex-col border border-white/10 bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 text-blue-400 bg-blue-500/20 rounded-2xl"><FaUserCircle size={32} /></div>
            <div>
              <h3 className="text-xl font-black uppercase">{bill.patientName}</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">MRN: {bill.mrNo}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => generateBillPDF(bill, true)} className="p-3 bg-white/5 rounded-xl hover:bg-emerald-500/20 text-emerald-400" title="Print Professional PDF"><FaPrint size={18}/></button>
            <button onClick={() => generateBillPDF(bill, false)} className="p-3 text-blue-400 bg-white/5 rounded-xl hover:bg-blue-500/20" title="Download PDF"><FaDownload size={18}/></button>
            <button onClick={onClose} className="p-3 text-red-400 bg-white/5 rounded-xl hover:bg-red-500/20"><FaTimes size={18}/></button>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
            {[{l:'Age', v:bill.age}, {l:'Gender', v:bill.gender}, {l:'Phone', v:bill.phone}, {l:'Address', v:bill.address}].map(item => (
              <div key={item.l} className="p-4 border bg-white/5 rounded-2xl border-white/5">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">{item.l}</p>
                <p className="text-sm font-bold">{item.v || 'N/A'}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(bill).map(([key, value]) => {
              if (isSystemField(key)) return null;
              return (
                <div key={key} className="p-4 border border-white/10 rounded-2xl bg-slate-800/50">
                  <p className="text-[10px] font-black uppercase text-blue-400 mb-2 tracking-widest">{formatLabel(key)}</p>
                  {renderValue(value)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const ManageBill = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "bills"), (snapshot) => {
      const billList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBills(billList.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      setFilteredBills(billList);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setFilteredBills(bills.filter(b => 
      (b.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.mrNo || '').toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }, [searchTerm, bills]);

  const handleDelete = async (id) => {
    if(window.confirm("Delete this record permanently?")) {
      try {
        await deleteDoc(doc(db, "bills", id));
        toast.success("Record deleted");
      } catch (e) { toast.error("Delete failed"); }
    }
  };

  return (
    <div className="w-full h-full p-6 text-white">
      <div className="flex flex-col items-center justify-between gap-4 mb-6 md:flex-row">
        <h2 className="text-2xl font-black tracking-tight uppercase">Record Archive</h2>
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute text-blue-400 left-4 top-4" />
          <input className="w-full p-3 pl-12 border outline-none bg-white/5 border-white/10 rounded-xl focus:border-blue-500/50" placeholder="Search by name or MRN..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="overflow-hidden border border-white/10 rounded-2xl bg-slate-900/50">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] text-slate-500 uppercase bg-white/5 border-b border-white/10">
              <th className="p-4">Date</th><th className="p-4">MRN</th><th className="p-4">Patient Name</th><th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill) => (
              <tr key={bill.id} className="transition-colors border-b border-white/5 hover:bg-white/5">
                <td className="p-4 text-xs">{bill.createdAt?.toDate().toLocaleDateString()}</td>
                <td className="p-4 font-bold text-blue-400">{bill.mrNo}</td>
                <td className="p-4 font-bold">{bill.patientName}</td>
                <td className="flex justify-center gap-2 p-4">
                  <button onClick={() => setSelectedBill(bill)} className="p-2 text-blue-400 rounded-lg bg-blue-500/10 hover:bg-blue-500/20"><FaEye/></button>
                  <button onClick={() => handleDelete(bill.id)} className="p-2 text-red-400 rounded-lg bg-red-500/10 hover:bg-red-500/20"><FaTrash/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedBill && <BillModal bill={selectedBill} onClose={() => setSelectedBill(null)} />}
    </div>
  );
};

export default ManageBill;