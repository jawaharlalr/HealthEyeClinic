import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, serverTimestamp, query } from 'firebase/firestore';
import { MdSearch, MdPerson } from 'react-icons/md';

const AddPrescription = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // Clinical State
  const [rx, setRx] = useState({
    od: { distSph: '', distCyl: '', distAxis: '', distVis: '', nearAdd: '', nearVis: '', ipd: '' },
    os: { distSph: '', distCyl: '', distAxis: '', distVis: '', nearAdd: '', nearVis: '', ipd: '' }
  });
  const [selections, setSelections] = useState({ lensType: '', coating: '', usage: '' });

  // Search logic
  useEffect(() => {
    const fetchPatients = async () => {
      if (searchTerm.length < 2) {
        setResults([]);
        return;
      }
      try {
        const q = query(collection(db, "patients"));
        const snap = await getDocs(q);
        const filtered = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.mrNo?.includes(searchTerm));
        setResults(filtered);
      } catch (err) { console.error(err); }
    };
    fetchPatients();
  }, [searchTerm]);

  const toggleOption = (category, opt) => {
    setSelections(prev => ({ ...prev, [category]: prev[category] === opt ? null : opt }));
  };

  const handleCreate = async () => {
    if (!selectedPatient) return alert("Select patient");
    try {
      await addDoc(collection(db, "prescriptions"), {
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        mrNo: selectedPatient.mrNo,
        glassRx: rx,
        frameDetails: selections,
        createdAt: serverTimestamp(),
        status: 'active'
      });
      alert('Prescription saved for ' + selectedPatient.name);
      setSelectedPatient(null);
      setSearchTerm('');
    } catch (error) { console.error(error); }
  };

  return (
    <div className="max-w-4xl p-8 mx-auto mt-10 glass-panel">
      <h2 className="mb-6 text-2xl font-bold text-white">Initialize New Rx</h2>
      
      {!selectedPatient ? (
        <div className="relative">
          <div className="relative">
            <MdSearch className="absolute text-slate-500 left-3 top-3.5" size={20} />
            <input 
              className="w-full p-3 pl-10 text-white border outline-none bg-white/5 border-white/10 rounded-xl focus:border-medical-primary" 
              placeholder="Search Patient by Name or MRN..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <div className="mt-2 space-y-2">
            {results.map(p => (
              <button 
                key={p.id} 
                onClick={() => setSelectedPatient(p)}
                className="flex items-center w-full gap-3 p-3 transition border rounded-lg bg-white/5 border-white/10 hover:border-medical-primary"
              >
                <MdPerson className="text-medical-primary" />
                <span className="text-white">{p.name}</span>
                <span className="ml-auto font-mono text-xs text-medical-primary">{p.mrNo}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in">
          <div className="flex items-center justify-between p-4 border rounded-xl bg-medical-primary/10 border-medical-primary/30">
            <h3 className="text-lg font-bold text-white">Patient: {selectedPatient.name} <span className="font-mono text-xs text-medical-primary">({selectedPatient.mrNo})</span></h3>
            <button onClick={() => setSelectedPatient(null)} className="text-xs text-red-400 uppercase hover:text-white">Change</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="text-[10px] text-slate-500 uppercase"><th className="p-2">Eye</th><th>Sph</th><th>Cyl</th><th>Axis</th><th>Dist Vision</th><th>Add</th><th>Near Vision</th></tr>
              </thead>
              <tbody className="text-sm">
                {['od', 'os'].map(eye => (
                  <tr key={eye} className="border-t border-white/10">
                    <td className="font-bold text-white uppercase">{eye}</td>
                    {['distSph','distCyl','distAxis','distVis','nearAdd','nearVis'].map(f => (
                      <td key={f} className="p-1">
                        <input className="w-full p-2 text-center border rounded outline-none bg-white/5 border-white/10 focus:border-medical-primary" 
                          value={rx[eye][f]} onChange={(e) => setRx({...rx, [eye]: {...rx[eye], [f]: e.target.value}})} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <input placeholder="IPD OD (mm)" className="p-2 text-center border rounded outline-none bg-white/5 border-white/10 focus:border-medical-primary" value={rx.od.ipd} onChange={(e) => setRx({...rx, od: {...rx.od, ipd: e.target.value}})} />
             <input placeholder="IPD OS (mm)" className="p-2 text-center border rounded outline-none bg-white/5 border-white/10 focus:border-medical-primary" value={rx.os.ipd} onChange={(e) => setRx({...rx, os: {...rx.os, ipd: e.target.value}})} />
          </div>

          <TickBox 
  title="Lens Type" 
  options={['Single Vision', 'Progressive', 'KT Bifocal', 'Coolens']} 
  category="lensType" 
  selected={selections} 
  onToggle={toggleOption} 
/>
<TickBox 
  title="Coating" 
  options={['AR', 'Hard Multicoat', 'Blue light Filters', 'Photochromic', 'Hydrophobic', 'UV Block', 'Anti Scratch']} 
  category="coating" 
  selected={selections} 
  onToggle={toggleOption} 
/>
<TickBox 
  title="Glass Usage" 
  options={['Regular Use', 'Near Work Only', 'Outdoor Activity', 'Occasional Wear', 'Aesthetic Wear']} 
  category="usage" /* FIXED: Changed from 'coating' to 'usage' */
  selected={selections} 
  onToggle={toggleOption} 
/>

          <button onClick={handleCreate} className="w-full py-4 font-bold transition-all bg-medical-primary rounded-xl hover:brightness-110">Save & Finalize Rx</button>
        </div>
      )}
    </div>
  );
};

const TickBox = ({ title, options, category, selected, onToggle }) => (
  <div>
    <h4 className="mb-2 text-xs font-bold uppercase text-medical-primary">{title}</h4>
    <div className="flex flex-wrap gap-4">
      {options.map(opt => (
        <button key={opt} onClick={() => onToggle(category, opt)} className={`px-4 py-2 rounded-lg border transition-all ${selected[category] === opt ? 'bg-medical-primary border-medical-primary text-white' : 'border-white/10 text-slate-400 hover:border-white/30'}`}>
          {opt}
        </button>
      ))}
    </div>
  </div>
);

export default AddPrescription;