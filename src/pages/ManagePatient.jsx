import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc, query, where, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  MdSearch, MdDelete, MdVisibility, MdEdit, MdClose, 
  MdHistory, MdBadge, MdLocationOn, MdEventAvailable,
  MdPersonAdd, MdCalendarToday, MdPrint 
} from 'react-icons/md';
import { generatePrescriptionPDF } from '../utils/generatePrescriptionPDF';

const calculateAge = (dobString) => {
  if (!dobString) return '';
  const birthDate = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : 0;
};

// Component to handle individual row prescription actions
const PrescriptionActions = ({ patient, showToast }) => {
  const [hasRx, setHasRx] = useState(false);
  const [rxData, setRxData] = useState(null);

  useEffect(() => {
    const checkRx = async () => {
      const q = query(collection(db, "prescriptions"), where("mrNo", "==", patient.mrNo), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setHasRx(true);
        setRxData({ id: snap.docs[0].id, ...snap.docs[0].data() });
      }
    };
    checkRx();
  }, [patient.mrNo]);

  const handleCreateNew = async () => {
    try {
      const emptyPrescription = {
        patientId: patient.id,
        patientName: patient.name,
        mrNo: patient.mrNo,
        glassRx: {
          od: { distSph: '', distCyl: '', distAxis: '', distVis: '', nearAdd: '', nearVis: '', ipd: '' },
          os: { distSph: '', distCyl: '', distAxis: '', distVis: '', nearAdd: '', nearVis: '', ipd: '' }
        },
        frameDetails: { types: [], materials: [], colour: '', size: '', lensType: [], coating: [], usage: [] },
        notes: '',
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, "prescriptions"), emptyPrescription);
      showToast("New prescription record initialized");
    } catch (error) {
      showToast("Failed to initialize prescription", "error");
    }
  };

  return (
    <div className="flex justify-end gap-2">
      {/* Create New Rx Button */}
      <button 
        onClick={handleCreateNew}
        className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-medical-primary hover:border-medical-primary/30 transition-all"
        title="Quick Initialize Prescription"
      >
        <MdPersonAdd size={18} />
      </button>

      {/* Print Existing Rx Button */}
      <button 
        onClick={() => hasRx ? generatePrescriptionPDF(rxData) : showToast("No prescription found", "error")}
        className={`p-2.5 rounded-xl border transition-all ${hasRx ? 'bg-white/5 border-white/5 text-slate-400 hover:text-medical-primary hover:border-medical-primary/30' : 'bg-transparent border-transparent text-slate-700 cursor-not-allowed opacity-30'}`}
        title={hasRx ? "Print Prescription" : "No prescription available"}
      >
        <MdPrint size={18} />
      </button>
    </div>
  );
};

const ManagePatient = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    try {
      const snap = await getDocs(collection(db, "patients"));
      const list = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        age: doc.data().dob ? calculateAge(doc.data().dob) : doc.data().age 
      }));
      setPatients(list);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => {
    const results = patients.filter(p => 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mrNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone?.includes(searchTerm)
    );
    setFilteredPatients(results);
  }, [searchTerm, patients]);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "patients", confirmModal.id));
      setPatients(prev => prev.filter(p => p.id !== confirmModal.id));
      showToast('Patient record purged successfully');
      setConfirmModal({ isOpen: false, id: null });
    } catch (error) { showToast('Execution failed', 'error'); }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      <div className={`fixed top-24 right-8 z-[300] transition-all duration-500 transform ${toast.show ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
        <div className={`glass-panel px-6 py-4 flex items-center gap-3 border-l-4 ${toast.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
          <span className="text-sm font-bold tracking-wider text-white uppercase">{toast.message}</span>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Patient Registry</h2>
          <p className="text-slate-400 mt-1 uppercase text-[10px] font-bold tracking-[0.2em] text-medical-primary">Clinical Database Management</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-full group md:w-96">
            <MdSearch className="absolute transition-colors -translate-y-1/2 left-4 top-1/2 text-slate-500 group-focus-within:text-medical-primary" size={20} />
            <input 
              type="text" 
              placeholder="Search by UID, Name, or Contact..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-medical-primary transition-all backdrop-blur-md"
            />
          </div>
          <div className="hidden px-6 py-3 glass-panel sm:block">
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5 tracking-tighter">Total Registered</p>
            <p className="text-xl font-bold leading-none text-white">{filteredPatients.length}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden glass-panel border-medical-primary/10">
        {loading ? (
          <div className="p-32 text-xs italic tracking-widest text-center uppercase text-slate-500 animate-pulse">Synchronizing Clinical Data...</div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-32 italic text-center text-slate-500">No matching records identified.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  <th className="px-8 py-5 text-center">S.No</th>
                  <th className="px-8 py-5">Clinical Identity</th>
                  <th className="px-8 py-5">Registry ID (MRN)</th>
                  <th className="px-8 py-5">Primary Contact</th>
                  <th className="px-8 py-5 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPatients.map((p, index) => (
                  <tr key={p.id} className="transition-all hover:bg-medical-primary/5 group">
                    <td className="px-8 py-5 text-sm font-bold text-center text-white">{index + 1}</td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-white transition-colors group-hover:text-medical-primary">{p.name}</p>
                      <p className="text-[10px] uppercase font-bold text-slate-500">{p.gender} • {p.age} Yrs</p>
                    </td>
                    <td className="px-8 py-5 font-mono text-sm font-bold text-medical-primary">{p.mrNo}</td>
                    <td className="px-8 py-5 font-medium text-slate-300">{p.phone}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setSelectedPatient(p)} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-medical-primary transition-all">
                          <MdVisibility size={18} />
                        </button>
                        <PrescriptionActions patient={p} showToast={showToast} />
                        <button onClick={() => setConfirmModal({ isOpen: true, id: p.id })} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/20 transition-all">
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedPatient && (
        <PatientDetailModal 
          patient={selectedPatient} 
          onClose={() => setSelectedPatient(null)} 
          onUpdate={fetchPatients}
          showToast={showToast}
        />
      )}

      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm p-8 text-center glass-panel border-red-500/20">
            <h3 className="mb-2 text-xl font-bold text-red-400">Purge Record?</h3>
            <p className="mb-8 text-sm font-medium text-slate-400">This action will permanently delete this profile from the central clinical directory.</p>
            <div className="flex gap-4">
              <button onClick={() => setConfirmModal({ isOpen: false, id: null })} className="flex-1 py-3 text-xs font-bold tracking-widest uppercase transition-all bg-white/5 rounded-xl hover:bg-white/10">Abort</button>
              <button onClick={handleDelete} className="flex-1 py-3 text-xs font-bold tracking-widest uppercase transition-all bg-red-600 rounded-xl hover:bg-red-500">Execute</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PatientDetailModal = ({ patient, onClose, onUpdate, showToast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...patient });
  const [visits, setVisits] = useState([]);
  const [loadingVisits, setLoadingVisits] = useState(true);

  useEffect(() => {
    const fetchVisits = async () => {
      const q = query(collection(db, "bills"), where("mrNo", "==", patient.mrNo), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setVisits(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingVisits(false);
    };
    fetchVisits();
  }, [patient.mrNo]);

  const handleUpdate = async () => {
    try {
      const patientRef = doc(db, "patients", patient.id);
      const updatedData = { ...formData, age: calculateAge(formData.dob) };
      await updateDoc(patientRef, updatedData);
      onUpdate();
      showToast('Profile Updated Successfully');
      setIsEditing(false);
    } catch (e) { showToast('Update Failed', 'error'); }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border-white/5">
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="p-3 border bg-medical-primary/10 rounded-2xl border-medical-primary/20 text-medical-primary">
              <MdBadge size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white">{isEditing ? 'Modify Clinical Profile' : patient.name}</h3>
              <p className="font-mono text-xs font-bold tracking-widest uppercase text-medical-primary">MRN: {patient.mrNo}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 transition-all rounded-full hover:bg-white/10 text-slate-500 hover:text-white">
            <MdClose size={24} />
          </button>
        </div>

        <div className="flex flex-col flex-1 overflow-hidden lg:flex-row">
          <div className="flex-1 p-8 space-y-8 overflow-y-auto border-r border-white/5 custom-scrollbar">
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <MdPersonAdd className="text-medical-primary" /> Core Patient Demographics
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <DataField label="Patient Name" name="name" value={formData.name} isEditing={isEditing} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <DataField label="Primary Contact" name="phone" value={formData.phone} isEditing={isEditing} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                <DataField label="Date of Birth" name="dob" value={formData.dob} type="date" isEditing={isEditing} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
                <DataField label="Computed Age" name="age" value={calculateAge(formData.dob)} isEditing={false} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Residential Address</label>
                {isEditing ? (
                  <textarea 
                    value={formData.address} 
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full p-4 text-sm text-white border outline-none bg-white/5 border-white/10 rounded-xl focus:border-medical-primary"
                    rows="3"
                  />
                ) : (
                  <p className="p-4 text-sm font-medium leading-relaxed border bg-black/20 rounded-xl border-white/5 text-slate-300">
                    <MdLocationOn className="inline mr-2 text-medical-primary" /> {formData.address || 'Address information missing.'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              {isEditing ? (
                <>
                  <button onClick={() => setIsEditing(false)} className="flex-1 py-3 text-xs font-bold tracking-widest uppercase transition-all bg-white/5 rounded-xl hover:bg-white/10">Cancel</button>
                  <button onClick={handleUpdate} className="flex-1 py-3 text-xs font-bold tracking-widest uppercase transition-all bg-medical-primary rounded-xl hover:brightness-110">Commit Changes</button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="flex items-center justify-center flex-1 gap-2 py-3 text-xs font-bold tracking-widest uppercase transition-all border bg-white/5 border-white/5 rounded-xl hover:bg-white/10">
                  <MdEdit size={16} /> Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="w-full lg:w-[400px] bg-black/20 p-8 overflow-y-auto custom-scrollbar border-t lg:border-t-0 border-white/5">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-8">
              <MdHistory className="text-medical-primary" /> Clinical Visit Timeline
            </h4>
            {loadingVisits ? (
              <p className="text-sm text-slate-500 animate-pulse tracking-wide font-medium uppercase text-[10px]">Retrieving Clinical Logs...</p>
            ) : visits.length === 0 ? (
              <p className="text-sm italic font-medium text-slate-600">No documented medical visits identified.</p>
            ) : (
              <div className="space-y-4">
                {visits.map((v) => (
                  <div key={v.id} className="p-4 transition-all border bg-white/5 rounded-2xl border-white/5 hover:border-medical-primary/30">
                    <p className="flex items-center gap-2 mb-1 text-xs font-bold text-medical-primary">
                      <MdEventAvailable size={14} /> {v.createdAt?.toDate().toLocaleDateString('en-GB')}
                    </p>
                    <p className="text-sm italic font-medium leading-relaxed text-slate-200 line-clamp-2">{v.purposeOfVisit || 'Purpose not specified.'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DataField = ({ label, value, isEditing, onChange, name, type = "text" }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">{label}</label>
    {isEditing ? (
      <div className="relative group">
        {type === "date" && <MdCalendarToday className="absolute -translate-y-1/2 pointer-events-none left-3 top-1/2 text-medical-primary" size={16} />}
        <input 
          type={type}
          name={name}
          value={value} 
          onChange={onChange}
          className={`w-full ${type === 'date' ? 'pl-10' : 'pl-3'} p-3 text-sm text-white border outline-none bg-white/5 border-white/10 rounded-xl focus:border-medical-primary transition-all`}
        />
      </div>
    ) : (
      <p className="px-1 text-sm font-bold text-slate-100">{value || '-'}</p>
    )}
  </div>
);

export default ManagePatient;