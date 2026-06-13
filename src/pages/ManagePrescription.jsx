import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { MdPrint, MdVisibility, MdClose } from 'react-icons/md';
import { generatePrescriptionPDF } from '../utils/generatePrescriptionPDF';

const ManagePrescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedRx, setSelectedRx] = useState(null);

  useEffect(() => {
    const fetchRx = async () => {
      const snap = await getDocs(query(collection(db, "prescriptions"), orderBy("createdAt", "desc")));
      setPrescriptions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchRx();
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <h2 className="mb-8 text-3xl font-bold text-white">Manage Prescriptions</h2>
      <div className="overflow-hidden glass-panel">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-[10px] uppercase text-slate-500 font-bold tracking-widest">
              <th className="px-8 py-5">Patient Name</th>
              <th className="px-8 py-5">MRN</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {prescriptions.map((rx) => (
              <tr key={rx.id}>
                <td className="px-8 py-5 font-bold text-white">{rx.patientName}</td>
                <td className="px-8 py-5 font-mono text-medical-primary">{rx.mrNo}</td>
                <td className="px-8 py-5 text-right">
                  <button onClick={() => setSelectedRx(rx)} className="p-2 mr-2 transition-all rounded-lg bg-white/5 hover:bg-medical-primary">
                    <MdVisibility size={18}/>
                  </button>
                  <button onClick={() => generatePrescriptionPDF(rx)} className="p-2 transition-all rounded-lg bg-white/5 hover:bg-medical-primary">
                    <MdPrint size={18}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedRx && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl p-8 text-white border shadow-2xl bg-slate-900 rounded-3xl border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Prescription Details: {selectedRx.patientName}</h2>
              <button onClick={() => setSelectedRx(null)}><MdClose size={24}/></button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-slate-400">MRN: <span className="font-mono text-white">{selectedRx.mrNo}</span></p>
              <div className="p-4 border bg-white/5 rounded-xl border-white/10">
                <h4 className="mb-2 text-xs font-bold text-medical-primary">Glass Rx</h4>
                <pre className="font-mono text-xs text-slate-300">{JSON.stringify(selectedRx.glassRx, null, 2)}</pre>
              </div>
              <div className="p-4 border bg-white/5 rounded-xl border-white/10">
                <h4 className="mb-2 text-xs font-bold text-medical-primary">Selected Options</h4>
                <p className="text-sm">{JSON.stringify(selectedRx.frameDetails)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePrescription;