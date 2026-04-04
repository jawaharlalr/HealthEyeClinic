import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  FaTrash, FaEye, FaSearch, FaFileInvoiceDollar, FaTimes,
  FaNotesMedical, FaEdit, FaCheckCircle, 
  FaGlasses, FaInfoCircle, FaHistory, FaClipboardList,
  FaUserCircle,FaVenusMars, FaFingerprint
} from 'react-icons/fa';

import { generateBillPDF } from '../utils/generatePDF'; 

const BillModal = ({ bill, onClose }) => {
  if (!bill) return null;

  const pDetails = bill.patient || {};
  const pName = bill.patientName || pDetails.name || 'Unknown';
  const pMR = bill.mrNo || pDetails.mrNo || 'N/A';
  
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const SectionTable = ({ title, icon, columns, data, rowRenderer }) => {
    const list = Array.isArray(data) ? data : (bill[data] || []);
    
    return (
      <div className="mb-10">
        <h4 className="flex items-center gap-3 pb-3 mb-5 text-sm font-black tracking-[0.2em] text-blue-400 uppercase border-b border-white/5">
          {icon} {title}
        </h4>
        <div className="overflow-hidden border shadow-2xl bg-white/2 rounded-3xl border-white/5">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="text-blue-200 bg-blue-900/20">
                <th className="w-16 p-4 text-center text-[10px] font-black uppercase border-r border-white/5">S.No</th>
                {columns.map((col, idx) => (
                  <th key={idx} className="p-4 font-black text-[10px] uppercase tracking-widest border-r border-white/5 last:border-0">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {list.length > 0 ? list.map((row, idx) => (
                <tr key={idx} className="transition-colors hover:bg-blue-500/5">
                  <td className="p-4 font-black text-center text-white border-r bg-white/5 border-white/5">{idx + 1}</td>
                  {rowRenderer(row)}
                </tr>
              )) : (
                <tr>
                  <td colSpan={columns.length + 1} className="p-10 text-[10px] font-bold uppercase tracking-widest text-center text-white/10 italic">
                    No clinical observations recorded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-7xl h-[94vh] overflow-hidden rounded-[2.5rem] flex flex-col border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)]">
        
        {/* Header Section */}
        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/2">
          <div className="flex items-center gap-6">
            <div className="p-4 text-white bg-blue-600 shadow-2xl rounded-3xl shadow-blue-500/20">
                <FaUserCircle size={40} />
            </div>
            <div>
                <div className="flex items-center gap-3">
                    <h3 className="text-3xl font-black tracking-tight text-white uppercase">{pName}</h3>
                    <span className="px-3 py-1 font-mono text-sm font-bold text-blue-400 border rounded-full bg-blue-500/10 border-blue-500/20">MR: {pMR}</span>
                </div>
                <p className="mt-1 text-[10px] font-black tracking-[0.3em] uppercase text-slate-500 italic">Exam Sequence Dated: {formatDate(bill.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
              <button onClick={() => generateBillPDF(bill)} className="flex items-center gap-3 px-8 py-4 text-xs font-black tracking-widest text-white uppercase transition-all bg-blue-600 shadow-xl rounded-2xl hover:scale-105 active:scale-95 shadow-blue-500/20">
                <FaFileInvoiceDollar size={16}/> Export Clinical PDF
              </button>
              <button onClick={onClose} className="p-4 transition-all border rounded-2xl bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 border-white/5">
                <FaTimes size={24}/>
              </button>
          </div>
        </div>

        <div className="flex-1 p-10 space-y-16 overflow-y-auto custom-scrollbar bg-gradient-to-b from-transparent to-blue-950/10">
          
          {/* Summary Intelligence Box */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <DiagnosticInfo label="Demographics" value={`${pDetails.age || 'N/A'}Y / ${pDetails.gender || 'N/A'}`} icon={<FaVenusMars/>} color="blue"/>
            <DiagnosticInfo label="Registry ID" value={pMR} icon={<FaFingerprint/>} color="purple"/>
            <DiagnosticInfo label="Clinical Protocol" value={bill.purposeOfVisit || 'Routine'} icon={<FaClipboardList/>} color="emerald"/>
            <DiagnosticInfo label="Refractive Status" value={bill.acceptance?.[0]?.distVision || 'Pending'} icon={<FaGlasses/>} color="amber"/>
          </div>

          {/* Table Modules */}
          <div className="space-y-20">
            <SectionTable 
                title="Symptomatic Presentation" icon={<FaInfoCircle />} 
                columns={['Eye', 'Complaint', 'Duration', 'Progression', 'Association']} 
                data="generalData"
                rowRenderer={(r) => (
                <>
                    <td className="p-4 font-black text-blue-400 border-r border-white/5">{r.eye || '-'}</td>
                    <td className="p-4 font-bold border-r border-white/5">{r.complaint || '-'}</td>
                    <td className="p-4 border-r border-white/5">{r.duration || '-'}</td>
                    <td className="p-4 border-r border-white/5">{r.progression || '-'}</td>
                    <td className="p-4">{r.association || '-'}</td>
                </>
                )}
            />

            <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
                <SectionTable title="Archival Ocular History" icon={<FaHistory />} columns={['Eye', 'Condition', 'History']} data="ocularHistory" rowRenderer={(r) => (
                    <>
                        <td className="p-4 font-black text-blue-400 border-r border-white/5">{r.eye || '-'}</td>
                        <td className="p-4 font-bold border-r border-white/5">{r.condition || '-'}</td>
                        <td className="p-4 text-xs italic opacity-60">{r.investigation || '-'}</td>
                    </>
                )} />
                <SectionTable title="Systemic Health Status" icon={<FaNotesMedical />} columns={['Condition', 'Duration', 'Notes']} data="healthConditions" rowRenderer={(r) => (
                    <>
                        <td className="p-4 font-bold text-white border-r border-white/5">{r.condition || '-'}</td>
                        <td className="p-4 border-r border-white/5">{r.duration || '-'}</td>
                        <td className="p-4 text-xs italic opacity-60">{r.investigation || '-'}</td>
                    </>
                )} />
            </div>

            <SectionTable 
                title="Visual Acuity Metrics" icon={<FaEye />} 
                columns={['Eye', 'W/O Glass', 'With Glass', 'With PH', 'Near', 'CL']} 
                data="visualAcuity"
                rowRenderer={(r) => (
                <>
                    <td className="p-4 font-black text-blue-300 border-r border-white/5">{r.eye}</td>
                    <td className="p-4 font-mono border-r border-white/5">{r.withoutGlass || '-'}</td>
                    <td className="p-4 font-mono border-r border-white/5">{r.withGlass || '-'}</td>
                    <td className="p-4 font-mono border-r border-white/5">{r.withPh || '-'}</td>
                    <td className="p-4 font-bold border-r border-white/5">{r.nearVision || '-'}</td>
                    <td className="p-4 font-mono">{r.contactLens || '-'}</td>
                </>
                )}
            />

            <SectionTable 
                title="Subjective Acceptance Result" icon={<FaCheckCircle />} 
                columns={['Eye', 'Sph', 'Cyl', 'Axis', 'Dist Vision', 'Add', 'Near']} 
                data="acceptance"
                rowRenderer={(r) => (
                <>
                    <td className="p-4 font-black text-blue-400 border-r border-white/5">{r.eye}</td>
                    <td className="p-4 font-mono border-r border-white/5">{r.sph || '-'}</td>
                    <td className="p-4 font-mono border-r border-white/5">{r.cyl || '-'}</td>
                    <td className="p-4 font-mono border-r border-white/5">{r.axis || '-'}</td>
                    <td className="p-4 font-black text-blue-200 border-r border-white/5">{r.distVision || '-'}</td>
                    <td className="p-4 font-mono border-r border-white/5">{r.add || '-'}</td>
                    <td className="p-4 font-black text-blue-200">{r.nearVision || '-'}</td>
                </>
                )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ManageBill = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 30000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "bills"), (snapshot) => {
      const billList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        normalizedName: doc.data().patientName || doc.data().patient?.name || '',
        normalizedMR: doc.data().mrNo || doc.data().patient?.mrNo || ''
      }));
      billList.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setBills(billList);
      setFilteredBills(billList);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const results = bills.filter(b => 
      b.normalizedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.normalizedMR.toString().includes(searchTerm.toLowerCase())
    );
    setFilteredBills(results);
  }, [searchTerm, bills]);

  const handleDelete = async (id) => {
    if(window.confirm("Permanently delete this clinical record?")) {
      await deleteDoc(doc(db, "bills", id));
    }
  };

  return (
    <div className="w-full h-full p-8 overflow-y-auto text-white custom-scrollbar">
      <div className="flex flex-col gap-6 mb-12 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 text-white bg-blue-600 shadow-2xl rounded-3xl"><FaFileInvoiceDollar size={32} /></div>
          <div>
              <h2 className="text-3xl font-black tracking-tight text-white">Record Archive</h2>
              <p className="text-sm font-bold tracking-widest text-blue-300 uppercase opacity-60">Clinical Data Management</p>
          </div>
        </div>
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute text-blue-400 left-4 top-4" />
          <input type="text" placeholder="Search by Patient Name or MRN..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-4 pl-12 font-bold text-white transition-all border shadow-inner outline-none bg-white/5 border-white/10 rounded-2xl focus:border-blue-500" />
        </div>
      </div>

      <div className="overflow-hidden border glass-panel rounded-[2rem] border-white/5">
        {loading ? (
            <div className="flex flex-col items-center gap-4 p-40 text-center animate-pulse">
                <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                <p className="text-xs font-black tracking-[0.4em] uppercase text-blue-400">Fetching Secure Records</p>
            </div>
        ) : filteredBills.length === 0 ? (
            <div className="p-40 text-xs font-black tracking-widest text-center uppercase opacity-20">No records identified in current sequence</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase bg-white/2 border-b border-white/5">
                <th className="p-6">S.No</th>
                <th className="p-6">Visit Date</th>
                <th className="p-6">Registry ID</th>
                <th className="p-6">Patient Name</th>
                <th className="p-6 text-center">Protocol Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBills.map((bill, index) => {
                const billTime = bill.createdAt?.toDate ? bill.createdAt.toDate().getTime() : 0;
                const isEditable = billTime > 0 && (currentTime - billTime) <= 1000000;
                return (
                  <tr key={bill.id} className="transition-all hover:bg-white/5 group">
                    <td className="p-6 text-xs font-black text-slate-600">{index + 1}</td>
                    <td className="p-6 text-sm font-bold text-white/70">{bill.createdAt?.toDate ? bill.createdAt.toDate().toLocaleDateString('en-GB') : 'N/A'}</td>
                    <td className="p-6"><span className="px-3 py-1 font-mono text-xs font-bold text-blue-300 rounded-lg bg-blue-500/10">{bill.normalizedMR}</span></td>
                    <td className="p-6 text-sm font-black text-white uppercase transition-colors group-hover:text-blue-400">{bill.normalizedName}</td>
                    <td className="p-6">
                      <div className="flex items-center justify-center gap-3">
                        <ActionButton icon={<FaEye/>} onClick={() => setSelectedBill(bill)} color="blue" label="View"/>
                        {isEditable && <ActionButton icon={<FaEdit/>} onClick={() => navigate('/add-bill', { state: { editBillData: bill } })} color="green" label="Edit"/>}
                        <ActionButton icon={<FaTrash/>} onClick={() => handleDelete(bill.id)} color="red" label="Delete"/>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {selectedBill && <BillModal bill={selectedBill} onClose={() => setSelectedBill(null)} />}
    </div>
  );
};

const ActionButton = ({ icon, onClick, color, label }) => {
    const colors = {
        blue: "bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white",
        green: "bg-green-500/10 text-green-400 hover:bg-green-600 hover:text-white",
        red: "bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white"
    };
    return (
        <button onClick={onClick} className={`p-3 rounded-2xl transition-all shadow-sm flex items-center gap-2 text-xs font-bold uppercase ${colors[color]}`}>
            {icon} <span className="hidden xl:inline">{label}</span>
        </button>
    );
};

const DiagnosticInfo = ({ label, value, icon, color }) => {
    const colors = {
        blue: "text-blue-400 bg-blue-500/10",
        purple: "text-purple-400 bg-purple-500/10",
        emerald: "text-emerald-400 bg-emerald-500/10",
        amber: "text-amber-400 bg-amber-500/10"
    };
    return (
        <div className={`p-6 rounded-[2rem] border border-white/5 flex items-center gap-5 ${colors[color]}`}>
            <div className="text-2xl opacity-60">{icon}</div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">{label}</p>
                <p className="text-lg font-black text-white">{value}</p>
            </div>
        </div>
    );
};

export default ManageBill;