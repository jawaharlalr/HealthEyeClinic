import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, getDocs, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FaFileInvoiceDollar, FaGlasses, FaEye, FaMagic, FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';

const NewInvoice = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [saving, setSaving] = useState(false);

  const [frames, setFrames] = useState([{ id: Date.now(), material: '', type: '', size: '', price: '' }]);
  const [lenses, setLenses] = useState([{ id: Date.now() + 1, material: '', type: '', price: '' }]);
  const [coatings, setCoatings] = useState([{ id: Date.now() + 2, type: '', price: '' }]);
  
  const [discountPercent, setDiscountPercent] = useState('');

  const frameMaterials = ['Plastic', 'Metal', 'Rubber'];
  const frameTypes = ['RimLess', 'Supra', 'Full Frame', 'Shell'];
  const lensMaterials = ['Glass', 'Plastic', 'Fiber'];
  const lensTypes = ['Single Vision', 'KT Bifocal', 'Progressive', 'Myopia Control Lens'];
  const coatingTypes = ['AR', 'Hard Multicoat', 'Hard Coat', 'Blue light Filters', 'Photochromic', 'Hydrophobic', 'UV Block'];

  useEffect(() => {
    const fetchPatients = async () => {
      if (searchTerm.length >= 2 && !selectedPatient) {
        try {
          const q = query(collection(db, "patients"), orderBy("name"));
          const snap = await getDocs(q);
          const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setSearchResults(data.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.mrNo?.toString().includes(searchTerm)));
          setShowDropdown(true);
        } catch (e) { console.error(e); }
      } else { setShowDropdown(false); }
    };
    fetchPatients();
  }, [searchTerm, selectedPatient]);

  const subTotal = frames.reduce((s, i) => s + (Number(i.price) || 0), 0) + 
                   lenses.reduce((s, i) => s + (Number(i.price) || 0), 0) + 
                   coatings.reduce((s, i) => s + (Number(i.price) || 0), 0);
  
  const discountAmount = (subTotal * (Number(discountPercent) || 0)) / 100;
  const grandTotal = subTotal - discountAmount;

  const handleRowChange = (setter, id, field, value) => {
    setter(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addRow = (setter, defaultObj) => setter(prev => [...prev, { id: Date.now(), ...defaultObj }]);
  const removeRow = (setter, id) => setter(prev => prev.filter(item => item.id !== id));

  const handleSaveInvoice = async () => {
    if (!selectedPatient) return toast.error("Select a patient first.");
    setSaving(true);
    try {
      await addDoc(collection(db, "invoices"), { 
        ...selectedPatient, 
        frames, lenses, coatings, 
        subTotal, 
        discountPercent: Number(discountPercent) || 0,
        discountAmount: discountAmount,
        grandTotal: Math.max(0, grandTotal), 
        createdAt: serverTimestamp() 
      });
      toast.success("Invoice Generated");
      setTimeout(() => navigate('/invoices'), 1500);
    } catch (e) { toast.error("Save failed"); } finally { setSaving(false); }
  };

  return (
    <div className="w-full h-full p-4 overflow-y-auto text-white md:p-8">
      <ToastContainer position="top-right" theme="dark" />
      <h1 className="flex items-center gap-3 mb-8 text-3xl font-black">
        <FaFileInvoiceDollar className="text-blue-500" /> Generate Invoice
      </h1>

      {!selectedPatient ? (
        <div className="max-w-xl">
           <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4 text-blue-400 hover:text-white"><FaArrowLeft /> Back</button>
           <div className="relative p-8 glass-panel rounded-2xl bg-white/5">
             <input className="w-full p-3 border rounded-xl bg-white/5 border-white/10" placeholder="Search by Name or MR No..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
             {showDropdown && (
               <div className="absolute z-10 w-[calc(100%-4rem)] mt-2 bg-gray-900 border shadow-2xl rounded-xl border-white/20">
                 {searchResults.map(p => (
                   <div key={p.id} onClick={() => { setSelectedPatient(p); setShowDropdown(false); }} className="p-4 font-medium text-white border-b cursor-pointer border-white/10 hover:bg-blue-600">{p.name} <span className="text-sm text-blue-300">({p.mrNo})</span></div>
                 ))}
               </div>
             )}
           </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-6 border bg-blue-900/20 border-blue-500/30 rounded-2xl">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-black uppercase">{selectedPatient.name}</h2>
              <button onClick={() => setSelectedPatient(null)} className="text-xs text-blue-400">Change Patient</button>
            </div>
            <div className="grid grid-cols-2 mt-4 text-xs font-bold text-blue-200 gap-y-4">
              <p>MR: <span className="text-white">{selectedPatient.mrNo}</span></p>
              <p>Age: <span className="text-white">{selectedPatient.age}</span></p>
              <p>Gender: <span className="text-white">{selectedPatient.gender}</span></p>
              <p>Phone: <span className="text-white">{selectedPatient.phone}</span></p>
              <p className="col-span-2">Address: <span className="text-white">{selectedPatient.address || 'N/A'}</span></p>
            </div>
          </div>

          <BillingSection title="Frames & Fitting" icon={<FaGlasses />} data={frames} setter={setFrames} opts={{ material: frameMaterials, type: frameTypes }} textInputs={['size', 'price']} onChange={handleRowChange} onAdd={() => addRow(setFrames, { material: '', type: '', size: '', price: '' })} onRemove={removeRow} />
          <BillingSection title="Lenses" icon={<FaEye />} data={lenses} setter={setLenses} opts={{ material: lensMaterials, type: lensTypes }} textInputs={['price']} onChange={handleRowChange} onAdd={() => addRow(setLenses, { material: '', type: '', price: '' })} onRemove={removeRow} />
          <BillingSection title="Coatings" icon={<FaMagic />} data={coatings} setter={setCoatings} opts={{ type: coatingTypes }} textInputs={['price']} onChange={handleRowChange} onAdd={() => addRow(setCoatings, { type: '', price: '' })} onRemove={removeRow} />

          <div className="p-6 space-y-3 bg-black/20 rounded-2xl">
             <div className="flex justify-between text-sm"><span>Subtotal:</span><span>₹{subTotal.toFixed(2)}</span></div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm">Discount:</span>
                    <input type="number" placeholder="0" className="w-16 p-1 text-center bg-transparent border-b border-white/40" onChange={e => setDiscountPercent(e.target.value)} />
                    <span className="text-xs">%</span>
                </div>
                <span className="text-sm italic text-red-400">-₹{discountAmount.toFixed(2)}</span>
             </div>
             <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <p className="text-lg font-bold">Total: ₹{grandTotal.toFixed(2)}</p>
                <button onClick={handleSaveInvoice} className="px-8 py-3 font-bold bg-blue-600 rounded-xl hover:bg-blue-500">{saving ? 'Saving...' : 'Save Invoice'}</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BillingSection = ({ title, icon, data, setter, opts, textInputs, onChange, onAdd, onRemove }) => (
  <div className="p-6 border glass-panel rounded-2xl bg-white/5 border-white/5">
    <div className="flex justify-between mb-4">
        <h3 className="flex items-center gap-2 text-sm font-bold text-blue-400 uppercase">{icon} {title}</h3>
        <button onClick={onAdd} className="p-2 bg-blue-600 rounded-lg"><FaPlus size={10} /></button>
    </div>
    {data.map(item => (
      <div key={item.id} className="flex items-center gap-2 mb-2">
        {Object.keys(opts).map(key => (
          <select key={key} className="flex-1 p-2 text-xs text-white bg-gray-900 border rounded-lg border-white/10" value={item[key]} onChange={e => onChange(setter, item.id, key, e.target.value)}>
            <option value="">{key.toUpperCase()}</option>
            {opts[key].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
        {textInputs.map(f => (
          <input key={f} className="w-20 p-2 text-xs text-white bg-gray-900 border rounded-lg border-white/10" placeholder={f} value={item[f] || ''} onChange={e => onChange(setter, item.id, f, e.target.value)} />
        ))}
        <button onClick={() => onRemove(setter, item.id)} className="p-2 text-red-500"><FaTrash /></button>
      </div>
    ))}
  </div>
);

export default NewInvoice;