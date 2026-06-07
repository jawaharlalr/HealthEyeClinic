import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, getDocs, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  FaSearch, 
  FaFileInvoiceDollar, 
  FaUserCircle, 
  FaTimes,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaFingerprint,
  FaVenusMars,
  FaPlus,
  FaTrash,
  FaSave,
  FaGlasses,
  FaEye,
  FaMagic
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';

const NewInvoice = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // --- UI & SEARCH STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // --- INVOICE STATE (Empty strings to avoid showing '0') ---
  const [frames, setFrames] = useState([{ id: Date.now(), material: '', type: '', size: '', price: '' }]);
  const [lenses, setLenses] = useState([{ id: Date.now() + 1, material: '', type: '', price: '' }]);
  const [coatings, setCoatings] = useState([{ id: Date.now() + 2, type: '', price: '' }]);
  
  const [discount, setDiscount] = useState('');

  // Fixed Charges
  const FITTING_CHARGES = 200;

  // --- DROPDOWN OPTIONS ---
  const frameMaterials = ['Plastic', 'Metal', 'Rubber'];
  const frameTypes = ['RimLess', 'Supra', 'Full Frame', 'Shell'];
  const lensMaterials = ['Glass', 'Plastic', 'Fiber'];
  const lensTypes = ['Single Vision', 'KT Bifocal', 'Progressive', 'Myopia Control Lens'];
  const coatingTypes = ['AR', 'Hard Multicoat', 'Hard Coat', 'Blue light Filters', 'Photochromic', 'Hydrophobic', 'UV Block'];

  // --- SEARCH LOGIC ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length >= 2 && !selectedPatient) {
        setLoading(true);
        try {
          const q = query(collection(db, "patients"), orderBy("name"));
          const snap = await getDocs(q);
          const filtered = snap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.mrNo.includes(searchTerm));
          setSearchResults(filtered);
          setShowDropdown(true);
        } catch (e) { 
          console.error(e); 
        } finally { 
          setLoading(false); 
        }
      } else {
        setShowDropdown(false);
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedPatient]);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setSearchTerm('');
    setSearchResults([]); 
    setShowDropdown(false);
  };

  const handleClearPatient = () => {
    setSelectedPatient(null);
    setFrames([{ id: Date.now(), material: '', type: '', size: '', price: '' }]);
    setLenses([{ id: Date.now() + 1, material: '', type: '', price: '' }]);
    setCoatings([{ id: Date.now() + 2, type: '', price: '' }]);
    setDiscount('');
  };

  // --- GENERIC HANDLERS ---
  const handleRowChange = (setter, id, field, value) => {
    setter(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleAddRow = (setter, emptyObj) => {
    setter(prev => [...prev, { id: Date.now(), ...emptyObj }]);
  };

  const handleRemoveRow = (setter, stateArray, id) => {
    if (stateArray.length > 1) setter(prev => prev.filter(item => item.id !== id));
  };

  // --- CALCULATIONS ---
  const sumPrices = (arr) => arr.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  
  const subTotal = sumPrices(frames) + sumPrices(lenses) + sumPrices(coatings);
  // Grand total adds subtotal and fitting charges, then subtracts discount
  const grandTotal = subTotal + FITTING_CHARGES - (Number(discount) || 0);

  // --- SAVE HANDLER ---
  const handleSaveInvoice = async () => {
    if (!selectedPatient) return toast.error("Select a patient first.");
    
    setSaving(true);
    try {
      // Create a payload that includes all patient details retrieved from Firestore
      const payload = {
        // Patient Details
        mrNo: selectedPatient.mrNo,
        patientName: selectedPatient.name,
        gender: selectedPatient.gender || 'N/A',
        phone: selectedPatient.phone || 'N/A',
        dob: selectedPatient.dob || 'N/A',
        address: selectedPatient.address || 'N/A',
        
        // Billing Data
        frames,
        lenses,
        coatings,
        subTotal,
        fittingCharges: FITTING_CHARGES,
        discount: Number(discount) || 0,
        grandTotal: Math.max(0, grandTotal),
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "invoices"), payload);
      
      toast.success("Invoice Generated Successfully");
      setTimeout(() => navigate('/invoices'), 1500);
    } catch (e) { 
      toast.error("Failed to generate invoice"); 
      console.error(e);
    } finally { 
      setSaving(false); 
    }
  };

  return (
    <div className="w-full h-full p-4 overflow-y-auto text-white md:p-8 custom-scrollbar">
      <ToastContainer position="top-right" theme="dark" />
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 text-white bg-blue-500 shadow-lg rounded-xl">
           <FaFileInvoiceDollar size={24} />
        </div>
        <div>
           <h1 className="text-2xl font-bold md:text-3xl">Generate Invoice</h1>
           <p className="text-sm font-semibold tracking-widest text-blue-200 uppercase">Billing & Dispensing</p>
        </div>
      </div>

      {!selectedPatient ? (
        // --- SEARCH MODULE ---
        <div className="relative z-[60] mb-8 glass-panel rounded-2xl p-10 max-w-3xl mx-auto border-medical-primary/20 bg-medical-primary/5" ref={dropdownRef}>
            <h2 className="flex items-center gap-3 mb-6 text-xl font-bold">
                <FaSearch className="text-blue-400" /> Patient Identification
            </h2>
            <div className="flex items-center px-6 py-4 transition-all border bg-white/5 border-white/10 rounded-2xl focus-within:border-blue-400">
              <input 
                className="flex-1 text-lg font-bold bg-transparent outline-none placeholder-blue-300/30" 
                placeholder="Search by Name or MR Number..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
              {loading && <div className="w-5 h-5 border-blue-400 rounded-full border-3 animate-spin border-t-transparent"></div>}
            </div>
            
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute z-[70] left-10 right-10 mt-3 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl max-h-72 overflow-y-auto">
                {searchResults.map(p => (
                  <div key={p.id} onClick={() => handleSelectPatient(p)} className="flex justify-between p-5 transition-colors border-b cursor-pointer border-white/5 hover:bg-blue-600/30">
                    <div>
                        <p className="font-black text-white">{p.name}</p>
                        <p className="text-xs text-blue-300 uppercase">{p.gender} • {p.age} Yrs</p>
                    </div>
                    <div className="text-right">
                        <p className="px-2 py-1 text-xs font-black text-blue-300 rounded bg-blue-500/20">{p.mrNo}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      ) : (
        // --- INVOICE CREATION MODULE ---
        <div className="space-y-8 animate-in fade-in">
          
          {/* Patient Details Card */}
          <div className="grid grid-cols-1">
            <div className="p-8 border-l-4 border-blue-500 glass-panel rounded-3xl bg-blue-500/5">
                <div className="flex items-start justify-between mb-6">
                    <FaUserCircle size={60} className="text-blue-400" />
                    <button onClick={handleClearPatient} className="p-2 transition-colors text-white/30 hover:text-red-400">
                        <FaTimes size={20}/>
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-3xl font-black text-white uppercase">{selectedPatient.name}</h3>
                        <p className="flex items-center gap-2 mt-1 font-mono text-sm font-bold tracking-widest text-blue-400">
                            <FaFingerprint /> MR: {selectedPatient.mrNo}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t md:grid-cols-4 border-white/10">
                        <InfoBox icon={<FaCalendarAlt />} label="Age" value={`${selectedPatient.age} Years`} />
                        <InfoBox icon={<FaVenusMars />} label="Gender" value={selectedPatient.gender} />
                        <InfoBox icon={<FaPhone />} label="Phone" value={selectedPatient.phone} />
                        <InfoBox icon={<FaMapMarkerAlt />} label="Address" value={selectedPatient.address || 'N/A'} />
                    </div>
                </div>
            </div>
          </div>

          <div className="space-y-8">
            
            {/* 1. FRAME TABLE */}
            <div className="p-8 glass-panel rounded-3xl border-white/5 bg-white/2">
              <h3 className="flex items-center gap-3 pb-4 mb-6 text-lg font-black tracking-widest text-blue-300 uppercase border-b border-white/10">
                <FaGlasses className="text-blue-500"/> Frame Specifications
              </h3>
              <div className="space-y-4">
                <div className="hidden grid-cols-12 gap-4 px-4 text-xs font-black tracking-widest uppercase text-slate-500 md:grid">
                  <div className="col-span-3">Material</div>
                  <div className="col-span-3">Type</div>
                  <div className="col-span-2">Size</div>
                  <div className="col-span-3">Price (₹)</div>
                  <div className="col-span-1 text-center">Action</div>
                </div>
                {frames.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 gap-4 p-4 border md:grid-cols-12 bg-white/5 border-white/10 rounded-2xl md:p-0 md:bg-transparent md:border-none">
                    <div className="md:col-span-3">
                      <label className="text-[10px] text-blue-300 font-black uppercase md:hidden block mb-1">Material</label>
                      <select className="w-full px-4 py-3 text-sm font-bold text-white transition-colors border outline-none appearance-none cursor-pointer bg-white/5 border-white/10 rounded-xl focus:border-blue-500"
                        value={item.material} onChange={(e) => handleRowChange(setFrames, item.id, 'material', e.target.value)}>
                        <option value="" className="text-slate-500 bg-slate-900">Select Material...</option>
                        {frameMaterials.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-[10px] text-blue-300 font-black uppercase md:hidden block mb-1">Type</label>
                      <select className="w-full px-4 py-3 text-sm font-bold text-white transition-colors border outline-none appearance-none cursor-pointer bg-white/5 border-white/10 rounded-xl focus:border-blue-500"
                        value={item.type} onChange={(e) => handleRowChange(setFrames, item.id, 'type', e.target.value)}>
                        <option value="" className="text-slate-500 bg-slate-900">Select Type...</option>
                        {frameTypes.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] text-blue-300 font-black uppercase md:hidden block mb-1">Size</label>
                      <input type="text" placeholder="E.g. 52-18" className="w-full px-4 py-3 text-sm font-bold text-white transition-colors border outline-none bg-white/5 border-white/10 rounded-xl focus:border-blue-500"
                        value={item.size} onChange={(e) => handleRowChange(setFrames, item.id, 'size', e.target.value)} />
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-[10px] text-blue-300 font-black uppercase md:hidden block mb-1">Price</label>
                      <input type="number" min="0" className="w-full px-4 py-3 text-sm font-bold text-white transition-colors border outline-none bg-white/5 border-white/10 rounded-xl focus:border-blue-500"
                        value={item.price} onChange={(e) => handleRowChange(setFrames, item.id, 'price', e.target.value)} />
                    </div>
                    <div className="flex items-center justify-center md:col-span-1">
                      <button onClick={() => handleRemoveRow(setFrames, frames, item.id)} className="p-3 text-red-400 transition-colors rounded-xl hover:bg-red-500/20 hover:text-white"><FaTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => handleAddRow(setFrames, { material: '', type: '', size: '', price: '' })} className="flex items-center gap-2 mt-6 text-xs font-bold text-blue-400 transition-colors hover:text-white">
                <FaPlus className="p-1.5 text-xl rounded bg-blue-500/20"/> Add Frame
              </button>
            </div>

            {/* 2. LENS TABLE */}
            <div className="p-8 glass-panel rounded-3xl border-white/5 bg-white/2">
              <h3 className="flex items-center gap-3 pb-4 mb-6 text-lg font-black tracking-widest text-blue-300 uppercase border-b border-white/10">
                <FaEye className="text-emerald-500"/> Lens Specifications
              </h3>
              <div className="space-y-4">
                <div className="hidden grid-cols-12 gap-4 px-4 text-xs font-black tracking-widest uppercase text-slate-500 md:grid">
                  <div className="col-span-4">Material</div>
                  <div className="col-span-4">Type</div>
                  <div className="col-span-3">Price (₹)</div>
                  <div className="col-span-1 text-center">Action</div>
                </div>
                {lenses.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 gap-4 p-4 border md:grid-cols-12 bg-white/5 border-white/10 rounded-2xl md:p-0 md:bg-transparent md:border-none">
                    <div className="md:col-span-4">
                      <label className="text-[10px] text-blue-300 font-black uppercase md:hidden block mb-1">Material</label>
                      <select className="w-full px-4 py-3 text-sm font-bold text-white transition-colors border outline-none appearance-none cursor-pointer bg-white/5 border-white/10 rounded-xl focus:border-blue-500"
                        value={item.material} onChange={(e) => handleRowChange(setLenses, item.id, 'material', e.target.value)}>
                        <option value="" className="text-slate-500 bg-slate-900">Select Material...</option>
                        {lensMaterials.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-4">
                      <label className="text-[10px] text-blue-300 font-black uppercase md:hidden block mb-1">Type</label>
                      <select className="w-full px-4 py-3 text-sm font-bold text-white transition-colors border outline-none appearance-none cursor-pointer bg-white/5 border-white/10 rounded-xl focus:border-blue-500"
                        value={item.type} onChange={(e) => handleRowChange(setLenses, item.id, 'type', e.target.value)}>
                        <option value="" className="text-slate-500 bg-slate-900">Select Type...</option>
                        {lensTypes.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-[10px] text-blue-300 font-black uppercase md:hidden block mb-1">Price</label>
                      <input type="number" min="0" className="w-full px-4 py-3 text-sm font-bold text-white transition-colors border outline-none bg-white/5 border-white/10 rounded-xl focus:border-blue-500"
                        value={item.price} onChange={(e) => handleRowChange(setLenses, item.id, 'price', e.target.value)} />
                    </div>
                    <div className="flex items-center justify-center md:col-span-1">
                      <button onClick={() => handleRemoveRow(setLenses, lenses, item.id)} className="p-3 text-red-400 transition-colors rounded-xl hover:bg-red-500/20 hover:text-white"><FaTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => handleAddRow(setLenses, { material: '', type: '', price: '' })} className="flex items-center gap-2 mt-6 text-xs font-bold transition-colors text-emerald-400 hover:text-white">
                <FaPlus className="p-1.5 text-xl rounded bg-emerald-500/20"/> Add Lens
              </button>
            </div>

            {/* 3. LENS COATING TABLE */}
            <div className="p-8 glass-panel rounded-3xl border-white/5 bg-white/2">
              <h3 className="flex items-center gap-3 pb-4 mb-6 text-lg font-black tracking-widest text-blue-300 uppercase border-b border-white/10">
                <FaMagic className="text-purple-500"/> Lens Coatings & Add-ons
              </h3>
              <div className="space-y-4">
                <div className="hidden grid-cols-12 gap-4 px-4 text-xs font-black tracking-widest uppercase text-slate-500 md:grid">
                  <div className="col-span-8">Coating Type</div>
                  <div className="col-span-3">Price (₹)</div>
                  <div className="col-span-1 text-center">Action</div>
                </div>
                {coatings.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 gap-4 p-4 border md:grid-cols-12 bg-white/5 border-white/10 rounded-2xl md:p-0 md:bg-transparent md:border-none">
                    <div className="md:col-span-8">
                      <label className="text-[10px] text-blue-300 font-black uppercase md:hidden block mb-1">Coating Type</label>
                      <select className="w-full px-4 py-3 text-sm font-bold text-white transition-colors border outline-none appearance-none cursor-pointer bg-white/5 border-white/10 rounded-xl focus:border-blue-500"
                        value={item.type} onChange={(e) => handleRowChange(setCoatings, item.id, 'type', e.target.value)}>
                        <option value="" className="text-slate-500 bg-slate-900">Select Coating...</option>
                        {coatingTypes.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-[10px] text-blue-300 font-black uppercase md:hidden block mb-1">Price</label>
                      <input type="number" min="0" className="w-full px-4 py-3 text-sm font-bold text-white transition-colors border outline-none bg-white/5 border-white/10 rounded-xl focus:border-blue-500"
                        value={item.price} onChange={(e) => handleRowChange(setCoatings, item.id, 'price', e.target.value)} />
                    </div>
                    <div className="flex items-center justify-center md:col-span-1">
                      <button onClick={() => handleRemoveRow(setCoatings, coatings, item.id)} className="p-3 text-red-400 transition-colors rounded-xl hover:bg-red-500/20 hover:text-white"><FaTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => handleAddRow(setCoatings, { type: '', price: '' })} className="flex items-center gap-2 mt-6 text-xs font-bold text-purple-400 transition-colors hover:text-white">
                <FaPlus className="p-1.5 text-xl rounded bg-purple-500/20"/> Add Coating
              </button>
            </div>

          </div>

          {/* Totals & Save */}
          <div className="flex flex-col items-end gap-6 pt-6">
            <div className="w-full max-w-sm p-6 space-y-4 border glass-panel rounded-3xl border-white/5 bg-slate-900/50">
              <div className="flex justify-between text-sm font-bold text-slate-300">
                <span>Subtotal:</span>
                <span>₹ {subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-300">
                <span>Fitting Charges:</span>
                <span>₹ {FITTING_CHARGES.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-slate-300">
                <span>Discount (₹):</span>
                <input 
                  type="number" 
                  min="0"
                  className="w-24 px-3 py-1 text-right text-white border rounded-lg outline-none bg-white/5 border-white/10 focus:border-blue-500"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>
              <div className="flex justify-between pt-4 text-xl font-black text-white border-t border-white/10">
                <span>Grand Total:</span>
                <span className="text-emerald-400">₹ {Math.max(0, grandTotal).toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleSaveInvoice} 
              disabled={saving} 
              className="group relative flex items-center gap-4 px-12 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-sm"
            >
              {saving ? 'Processing...' : <><FaSave size={18}/> Generate Invoice</>}
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

// Reusable InfoBox
const InfoBox = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
      <div className="mt-1 text-blue-400">{icon}</div>
      <div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{label}</p>
          <p className="text-sm font-bold leading-tight text-white/90">{value}</p>
      </div>
  </div>
);

export default NewInvoice;