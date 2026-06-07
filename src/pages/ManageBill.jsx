import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { FaTrash, FaEye, FaUserCircle, FaTimes, FaSearch, FaDownload, FaPrint } from 'react-icons/fa';
import { generateBillPDF } from '../utils/generatePDF'; 

const BillModal = ({ bill, onClose }) => {
  if (!bill) return null;

  const isSystemField = (key) => [
    'id', 'patient', 'patientName', 'mrNo', 'createdAt', 'normalizedName', 
    'normalizedMR', 'purposeOfVisit', 'age', 'gender', 'phone', 'address'
  ].includes(key);

  // Helper to render value based on type
  const renderValue = (value) => {
    // 1. Handle Arrays (Clinical Tables)
    if (Array.isArray(value)) {
      if (value.length === 0) return <p className="text-xs italic text-white/30">No data</p>;
      
      return (
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                {Object.keys(value[0]).map(k => (
                  <th key={k} className="p-1 font-bold uppercase text-slate-500">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {value.map((row, i) => (
                <tr key={i} className="border-b border-white/5">
                  {Object.values(row).map((v, j) => (
                    <td key={j} className="p-1 font-bold">{String(v || '-')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // 2. Handle Nested Objects (e.g., iop, fundus)
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="grid grid-cols-2 gap-2 mt-2">
          {Object.entries(value).map(([subKey, subVal]) => (
            <div key={subKey} className="text-[10px] bg-white/5 p-2 rounded">
              <span className="font-bold uppercase text-slate-500">{subKey}: </span>
              <span className="font-bold">{String(subVal)}</span>
            </div>
          ))}
        </div>
      );
    }

    // 3. Handle Primitive Values (Strings, Numbers)
    return <p className="text-sm font-bold">{String(value)}</p>;
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
      <div className="glass-panel w-full max-w-7xl h-[94vh] overflow-hidden rounded-[2.5rem] flex flex-col border border-white/10 bg-slate-900 text-white">
        
        {/* Header Section */}
        <div className="flex items-center justify-between p-8 border-b border-white/5">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-blue-600 rounded-3xl"><FaUserCircle size={40} /></div>
            <div>
              <h3 className="text-3xl font-black uppercase">{bill.patientName || 'Unknown Patient'}</h3>
              <p className="text-xs font-black text-blue-400 uppercase">MRN: {bill.mrNo}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => window.print()} className="p-4 bg-white/5 rounded-2xl hover:bg-emerald-500/20"><FaPrint size={20}/></button>
            <button onClick={() => generateBillPDF(bill)} className="p-4 bg-white/5 rounded-2xl hover:bg-blue-500/20"><FaDownload size={20}/></button>
            <button onClick={onClose} className="p-4 bg-white/5 rounded-2xl hover:bg-red-500/20"><FaTimes size={20}/></button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-6 p-6 mb-10 border md:grid-cols-4 bg-white/5 rounded-3xl border-white/5">
            <div><p className="text-[10px] font-black text-slate-500 uppercase">Age</p><p className="font-bold">{bill.age || 'N/A'}</p></div>
            <div><p className="text-[10px] font-black text-slate-500 uppercase">Gender</p><p className="font-bold">{bill.gender || 'N/A'}</p></div>
            <div><p className="text-[10px] font-black text-slate-500 uppercase">Phone</p><p className="font-bold">{bill.phone || 'N/A'}</p></div>
            <div className="col-span-2 md:col-span-1"><p className="text-[10px] font-black text-slate-500 uppercase">Address</p><p className="text-sm font-bold">{bill.address || 'N/A'}</p></div>
          </div>

          {/* Dynamic Data Rendering */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(bill).map(([key, value]) => {
              if (isSystemField(key)) return null;
              
              return (
                <div key={key} className="p-4 border border-white/5 rounded-xl bg-white/5">
                  <p className="text-[10px] font-black uppercase text-blue-400 mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
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
      const billList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        normalizedName: doc.data().patientName || '',
        normalizedMR: doc.data().mrNo || ''
      }));
      setBills(billList.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      setFilteredBills(billList);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setFilteredBills(bills.filter(b => 
      b.normalizedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.normalizedMR.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }, [searchTerm, bills]);

  return (
    <div className="w-full h-full p-8 overflow-y-auto text-white custom-scrollbar">
      <div className="flex justify-between mb-8">
        <h2 className="text-3xl font-black">Record Archive</h2>
        <div className="relative w-80">
          <FaSearch className="absolute text-blue-400 left-4 top-4" />
          <input className="w-full p-4 pl-12 border outline-none bg-white/5 border-white/10 rounded-2xl" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="border glass-panel rounded-[2rem] border-white/5">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] text-slate-500 uppercase bg-white/2 border-b border-white/5">
              <th className="p-6">S.No</th><th className="p-6">Date</th><th className="p-6">Registry ID</th><th className="p-6">Patient</th><th className="p-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill, index) => (
              <tr key={bill.id} className="hover:bg-white/5">
                <td className="p-6">{index + 1}</td>
                <td className="p-6">{bill.createdAt?.toDate().toLocaleDateString()}</td>
                <td className="p-6 text-blue-300">{bill.normalizedMR}</td>
                <td className="p-6 font-bold">{bill.normalizedName}</td>
                <td className="flex justify-center gap-3 p-6">
                  <button onClick={() => setSelectedBill(bill)} className="p-3 text-blue-400 bg-blue-500/10 rounded-2xl"><FaEye/></button>
                  <button onClick={() => deleteDoc(doc(db, "bills", bill.id))} className="p-3 text-red-400 bg-red-500/10 rounded-2xl"><FaTrash/></button>
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