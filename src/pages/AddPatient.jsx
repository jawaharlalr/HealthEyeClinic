import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { 
  MdPersonAdd, MdSave, MdEvent, MdWc, 
  MdPlace, MdPhone, MdRestartAlt, MdCheckCircle, MdErrorOutline 
} from 'react-icons/md';

const AddPatient = () => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const [formData, setFormData] = useState({
    mrNo: '',
    name: '',
    phone: '',
    dob: '',
    gender: '',
    age: '',
    address: ''
  });

  // --- Logic: MR Number Generation ---
  const generateNextMR = async () => {
    try {
      const currentYear = new Date().getFullYear().toString();
      const q = query(collection(db, "patients"), orderBy("mrNo", "desc"), limit(1));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const lastMR = snapshot.docs[0].data().mrNo;
        if (lastMR && lastMR.startsWith(currentYear)) {
          const lastSequence = parseInt(lastMR.split('-')[1], 10);
          const nextSequence = (lastSequence + 1).toString().padStart(4, '0');
          setFormData(prev => ({ ...prev, mrNo: `${currentYear}-${nextSequence}` }));
        } else {
          setFormData(prev => ({ ...prev, mrNo: `${currentYear}-0001` }));
        }
      } else {
        setFormData(prev => ({ ...prev, mrNo: `${currentYear}-0001` }));
      }
    } catch (err) {
      console.error("MR Generation Error:", err);
      setFormData(prev => ({ ...prev, mrNo: `${new Date().getFullYear()}-0001` }));
    }
  };

  useEffect(() => { generateNextMR(); }, []);

  // --- Logic: Age Calculation from DOB ---
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, age: age >= 0 ? age : 0 }));
    }
  }, [formData.dob]);

  // --- Logic: Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, phone: numericValue }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const clearForm = () => {
    setFormData({ mrNo: '', name: '', phone: '', dob: '', gender: '', age: '', address: '' });
    generateNextMR();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      setModal({ isOpen: true, title: 'Validation Error', message: 'The contact number must be exactly 10 digits.' });
      return;
    }

    setLoading(true);
    try {
      // Duplicate Check
      const q = query(collection(db, "patients"), where("phone", "==", formData.phone));
      const snap = await getDocs(q);
      const isDuplicate = snap.docs.some(doc => doc.data().name.toLowerCase().trim() === formData.name.toLowerCase().trim());

      if (isDuplicate) {
        setModal({ isOpen: true, title: 'Duplicate Found', message: 'A patient with this name and phone number is already in the registry.' });
        setLoading(false);
        return;
      }

      // Add to Registry
      await addDoc(collection(db, "patients"), {
        ...formData,
        age: Number(formData.age),
        createdAt: serverTimestamp()
      });

      // Log Activity
      await addDoc(collection(db, "activity"), {
        action: `Registered: ${formData.name}`,
        type: 'patient',
        timestamp: serverTimestamp()
      });

      showToast('Registry Entry Created Successfully');
      clearForm();
    } catch (err) {
      console.error(err);
      showToast('System Error: Transaction Failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl p-8 mx-auto space-y-8 duration-700 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Dynamic Toast */}
      <div className={`fixed top-24 right-8 z-[100] transition-all duration-500 transform ${toast.show ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
        <div className={`glass-panel px-6 py-4 flex items-center gap-3 border-l-4 shadow-2xl ${toast.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
          <MdCheckCircle className={toast.type === 'success' ? 'text-green-500' : 'text-red-500'} size={24} />
          <span className="text-sm font-black tracking-wider uppercase">{toast.message}</span>
        </div>
      </div>

      {/* Header UI */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase">New Patient Entry</h2>
          <p className="text-slate-500 mt-1 uppercase text-[10px] font-black tracking-[0.3em]">Healthy Eye Admin Registry</p>
        </div>
        <div className="p-4 text-right glass-panel border-medical-primary/20 bg-medical-primary/5 rounded-2xl">
          <p className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-1">MR No.</p>
          <p className="font-mono text-2xl font-black tracking-tighter text-medical-primary">{formData.mrNo || "GENERATING..."}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left Form: Identification Data */}
        <div className="space-y-6 lg:col-span-2">
          <div className="p-8 space-y-8 glass-panel border-white/5 bg-white/2 backdrop-blur-xl rounded-[2rem]">
            <h3 className="flex items-center gap-3 text-xs font-black tracking-[0.2em] uppercase text-slate-400">
              <MdPersonAdd className="text-medical-primary" size={20} /> Identity Profiles
            </h3>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <Field label="Full Legal Name" name="name" value={formData.name} onChange={handleChange} icon={<MdPersonAdd />} placeholder="E.g. John Doe" />
              <Field label="Mobile Contact" name="phone" value={formData.phone} onChange={handleChange} icon={<MdPhone />} placeholder="10 Digit Number" maxLength="10" />
              <Field label="Birth Date" name="dob" type="date" value={formData.dob} onChange={handleChange} icon={<MdEvent />} />
              
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Gender</label>
                <div className="relative group">
                  <MdWc className="absolute transition-colors -translate-y-1/2 left-4 top-1/2 text-medical-primary group-focus-within:text-white" size={20} />
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange}
                    className="w-full py-4 pl-12 pr-4 text-sm font-bold text-white transition-all border outline-none appearance-none cursor-pointer bg-white/5 border-white/10 rounded-2xl focus:border-medical-primary focus:bg-white/10"
                    required
                  >
                    <option value="" className="bg-slate-900 text-white/50">Select Gender</option>
                    <option value="Male" className="bg-slate-900">Male</option>
                    <option value="Female" className="bg-slate-900">Female</option>
                    <option value="Other" className="bg-slate-900">Transgender</option>
                    <option value="Other" className="bg-slate-900">Others</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Postal Address</label>
              <div className="relative group">
                <MdPlace className="absolute transition-colors left-4 top-4 text-medical-primary group-focus-within:text-white" size={20} />
                <textarea 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange}
                  rows="3" 
                  placeholder="Apartment, Street, Landmark..."
                  className="w-full py-4 pl-12 pr-4 text-sm font-medium text-white transition-all border outline-none resize-none bg-white/5 border-white/10 rounded-2xl focus:border-medical-primary focus:bg-white/10 placeholder-white/50"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Logic Meta & Submission */}
        <div className="space-y-6">
          <div className="p-8 glass-panel bg-medical-primary/5 border-medical-primary/20 rounded-[2rem] sticky top-8">
            <h3 className="mb-8 text-xs font-black tracking-widest uppercase text-slate-500">Registry Snapshot</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 border bg-black/40 rounded-3xl border-white/5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Age</span>
                <span className="text-3xl font-black text-white">{formData.age || "0"} <span className="text-xs font-bold uppercase text-medical-primary">Yrs</span></span>
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <button 
                type="submit" 
                disabled={loading}
                className="flex items-center justify-center w-full gap-3 py-5 text-sm font-black uppercase tracking-widest transition-all shadow-2xl bg-medical-primary text-white rounded-2xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-medical-primary/30"
              >
                {loading ? <span className="w-5 h-5 border-4 rounded-full border-white/30 border-t-white animate-spin"></span> : <><MdSave size={22}/> Save Record</>}
              </button>
              
              <button 
                type="button"
                onClick={clearForm}
                className="flex items-center justify-center w-full gap-2 py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:bg-white/10 hover:text-white"
              >
                <MdRestartAlt size={18} /> Reset Fields
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Logic Modals */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm p-10 text-center glass-panel border-red-500/20 rounded-[2.5rem]">
            <MdErrorOutline className="mx-auto mb-4 text-red-500" size={48} />
            <h3 className="mb-2 text-xl font-black tracking-tight text-white uppercase">{modal.title}</h3>
            <p className="mb-8 text-sm font-medium leading-relaxed text-slate-400">{modal.message}</p>
            <button 
              onClick={() => setModal({ ...modal, isOpen: false })}
              className="w-full py-4 font-black tracking-widest text-white uppercase transition-all bg-red-600 shadow-xl rounded-2xl hover:bg-red-500 shadow-red-900/20"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, icon, ...props }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute transition-colors -translate-y-1/2 left-4 top-1/2 text-medical-primary group-focus-within:text-white">
        {icon}
      </div>
      <input 
        {...props}
        className="w-full py-4 pl-12 pr-4 text-sm font-bold text-white transition-all border bg-white/5 border-white/10 rounded-2xl focus:outline-none focus:border-medical-primary focus:bg-white/10 placeholder-white/50"
        required
      />
    </div>
  </div>
);

export default AddPatient;