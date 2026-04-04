import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { 
  MdPeople, MdHistory, MdReceipt, MdAnalytics, 
  MdStorage, MdShield, MdCloudQueue 
} from 'react-icons/md';

const Settings = () => {
  const [data, setData] = useState({
    patientCount: 0,
    billCount: 0,
    recentPatients: [],
    recentBills: [],
    loading: true
  });

  useEffect(() => {
    // 1. Sync Patient Data
    const unsubPatients = onSnapshot(query(collection(db, "patients"), orderBy("createdAt", "desc"), limit(10)), (snap) => {
      setData(prev => ({ 
        ...prev, 
        patientCount: snap.size,
        recentPatients: snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      }));
    });

    // 2. Sync Billing Data
    const unsubBills = onSnapshot(query(collection(db, "bills"), orderBy("createdAt", "desc"), limit(10)), (snap) => {
      setData(prev => ({ 
        ...prev, 
        billCount: snap.size,
        recentBills: snap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        loading: false
      }));
    });

    return () => {
      unsubPatients();
      unsubBills();
    };
  }, []);

  return (
    <div className="p-8 mx-auto space-y-10 duration-700 max-w-7xl animate-in fade-in">
      
      {/* 1. Big Branding Section */}
      <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
        <img src="/logo.png" alt="Healthy Eye Clinic" className="object-contain w-32 h-32" />
        <div>
          <h2 className="text-5xl font-bold tracking-tighter text-white">
            Healthy Eye <span className="text-medical-primary">Clinic</span>
          </h2>
          <p className="text-slate-500 uppercase tracking-[0.4em] font-bold text-xs mt-2">
            Central Data Repository
          </p>
        </div>
      </div>

      {/* 2. High-Level Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <MetricCard label="Total Patient Records" value={data.patientCount} icon={<MdPeople />} color="blue" />
        <MetricCard label="Total Visit Logs" value={data.recentBills.length} icon={<MdHistory />} color="purple" />
        <MetricCard label="Financial Invoices" value={data.billCount} icon={<MdReceipt />} color="emerald" />
      </div>

      {/* 3. Data Tables Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        
        {/* Patient Data Preview */}
        <div className="glass-panel flex flex-col h-[500px]">
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
            <h3 className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-medical-primary">
              <MdStorage /> Patient Master Data
            </h3>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar">
            {data.recentPatients.map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 border rounded-2xl bg-white/5 border-white/5">
                <div>
                  <p className="text-sm font-bold text-white">{p.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{p.mrNo}</p>
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-3 py-1 rounded-full italic">Registered</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bill/Visit Logs Preview */}
        <div className="glass-panel flex flex-col h-[500px]">
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
            <h3 className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-emerald-400">
              <MdAnalytics /> Transactional Visit Logs
            </h3>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar">
            {data.recentBills.map(b => (
              <div key={b.id} className="flex items-center justify-between p-4 transition-colors border rounded-2xl bg-white/5 border-white/5 hover:border-emerald-500/30">
                <div>
                  <p className="text-sm font-bold text-white">{b.patientName || 'Unknown Patient'}</p>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Amount: ₹{b.totalAmount || '0'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-mono">
                    {b.createdAt?.toDate().toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. System Integrity Footer */}
      <div className="flex flex-col items-center justify-between gap-6 p-6 glass-panel md:flex-row border-medical-primary/20 bg-medical-primary/5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-medical-primary/20 rounded-xl text-medical-primary">
            <MdShield size={24} />
          </div>
          <div>
            <p className="text-sm font-bold tracking-wide text-white uppercase">Secure Terminal Connection</p>
            <p className="text-xs text-slate-500">End-to-end encryption active for all clinical records.</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Cloud Sync</p>
              <div className="flex items-center gap-2 text-xs font-bold text-green-400">
                <MdCloudQueue /> 100%
              </div>
            </div>
            <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-white transition-all">
              Export Archive
            </button>
        </div>
      </div>

    </div>
  );
};

// --- Sub-Component ---
const MetricCard = ({ label, value, icon, color }) => (
  <div className="relative flex items-center gap-6 p-6 overflow-hidden glass-panel group">
    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 blur-2xl 
      ${color === 'blue' ? 'bg-blue-500' : color === 'purple' ? 'bg-purple-500' : 'bg-emerald-500'}`}>
    </div>
    <div className={`p-4 rounded-2xl text-2xl 
      ${color === 'blue' ? 'bg-blue-500/20 text-blue-400' : color === 'purple' ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
      {icon}
    </div>
    <div>
      <p className="text-3xl font-bold leading-tight text-white">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
    </div>
  </div>
);

export default Settings;