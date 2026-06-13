import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  getDocs,
  addDoc,
  serverTimestamp,
  orderBy,
  where,
  limit,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  FaSave,
  FaSearch,
  FaFileInvoiceDollar,
  FaUserCircle,
  FaTimes,
  FaClipboardList,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaHistory,
  FaFingerprint,
  FaVenusMars,
  FaArrowLeft,
} from "react-icons/fa";

// Table Module Imports
import GeneralTable from "../components/tables/GeneralTable";
import HealthTable from "../components/tables/HealthTable";
import OcularTable from "../components/tables/OcularTable";
import VisualTable from "../components/tables/VisualTable";
import CoverTestEOMTable from "../components/tables/CoverTestEOMTable";
import PupilTable from "../components/tables/PupilTable";
import LacrimalTable from "../components/tables/LacrimalTable";
import LidLashConjunctivaTable from "../components/tables/LidLashConjunctivaTable";
import CorneaACTable from "../components/tables/CorneaACTable";
import IrisLensTable from "../components/tables/IrisLensTable";
import ColourDryEyeTable from "../components/tables/ColourDryEyeTable";
import IOPTable from "../components/tables/IOPTable";

import { generateBillPDF } from "../utils/generatePDF";
import { toast, ToastContainer } from "react-toastify";

const AddBill = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // --- UI & SEARCH STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [visitLogs, setVisitLogs] = useState([]);
  const addRow = (setter, defaultObj) =>
    setter((prev) => [...prev, { id: Date.now(), ...defaultObj }]);
  const removeRow = (setter, id) =>
    setter((prev) => prev.filter((r) => r.id !== id));

  const [purposeOfVisit, setPurposeOfVisit] = useState("");
  const purposeOptions = [
    "Regular checkup",
    "Glasses",
    "Decreased vision",
    "IOP checkup",
    "Vision therapy",
    "Contact lens consultation",
  ];

  // --- CLINICAL ROW STATES ---
  const [generalRows, setGeneralRows] = useState([
    {
      id: Date.now(),
      eye: "OU",
      complaint: "",
      duration: "",
      unit: "Days",
      association: "",
      remarks: "",
    },
  ]);
  const [healthRows, setHealthRows] = useState([
    { id: Date.now() + 1, condition: "", duration: "", investigation: "" },
  ]);
  const [ocularRows, setOcularRows] = useState([
    {
      id: Date.now() + 2,
      eye: "OU",
      condition: "",
      duration: "",
      investigation: "",
    },
  ]);
  const [medications, setMedications] = useState("");

  const [rxRows, setRxRows] = useState([
    {
      id: 1,
      date: "",
      eye: "OU",
      sph: "",
      cyl: "",
      axis: "",
      add: "",
      prism: "",
      base: "",
      lens: "",
      status: "",
    },
  ]);
  const [vaRows, setVaRows] = useState([
    {
      id: 1,
      eye: "OU",
      withoutGlass: "",
      withGlass: "",
      withPh: "",
      contactLens: "",
    },
  ]);
  const [refRows, setRefRows] = useState([
    { id: 1, eye: "OU", retinoscopy: "", dsph: "", dcyl: "", axis: "" },
  ]);
  const [accRows, setAccRows] = useState([
    {
      id: 1,
      eye: "OU",
      sph: "",
      cyl: "",
      axis: "",
      distVision: "",
      add: "",
      nearVision: "",
      comments: "",
    },
  ]);
  const [gpRows, setGpRows] = useState([
    {
      id: 1,
      eye: "OU",
      sph: "",
      cyl: "",
      axis: "",
      add: "",
      distVision: "",
      nearVision: "",
    },
  ]);

  const [ctRows, setCtRows] = useState([
    { id: 1, hirschberg: "", ctDistance: "", ctNear: "" },
  ]);
  const [eomRows, setEomRows] = useState([{ id: 1, od: "Full", os: "Full" }]);
  const [pupilRows, setPupilRows] = useState([
    { id: 1, eye: "OD", size: "", shape: "", light: "", near: "", rapd: "" },
    { id: 2, eye: "OS", size: "", shape: "", light: "", near: "", rapd: "" },
  ]);

  // Object Initializations
  const [lacrimal, setLacrimal] = useState({ roplasOd: "", roplasOs: "" });
  const [lidLash, setLidLash] = useState({
    lidsOd: "Normal",
    lidsOs: "Normal",
    lashOd: "Normal",
    lashOs: "Normal",
    conjunctivaOd: "Normal",
    conjunctivaOs: "Normal",
  });
  const [corneaAC, setCorneaAC] = useState({
    scleraOd: "Normal",
    scleraOdText: "",
    scleraOs: "Normal",
    scleraOsText: "",
    corneaOd: "Normal",
    corneaOdText: "",
    corneaOs: "Normal",
    corneaOsText: "",
    acDepthOd: "Normal",
    acDepthOdText: "",
    acDepthOs: "Normal",
    acDepthOsText: "",
    vonHerickOd: "",
    vonHerickOdText: "",
    vonHerickOs: "",
    vonHerickOsText: "",
    tmPigmentOd: "Normal",
    tmPigmentOdText: "",
    tmPigmentOs: "Normal",
    tmPigmentOsText: "",
  });
  const [irisLens, setIrisLens] = useState({
    irisOd: "Normal",
    irisOdText: "",
    irisOs: "Normal",
    irisOsText: "",
    lensOd: "Clear",
    lensOdText: "",
    lensOs: "Clear",
    lensOsText: "",
  });
  const [colourDryEye, setColourDryEye] = useState({
    ishiharaOd: "",
    ishiharaOs: "",
    tbutOd: "",
    tbutOs: "",
    schirmerOd: "",
    schirmerOs: "",
  });
  const [iopData, setIopData] = useState({ iopOd: "", iopOs: "", iopTime: "" });


  // Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length >= 2 && !selectedPatient) {
        setLoading(true);
        try {
          const q = query(collection(db, "patients"), orderBy("name"));
          const snap = await getDocs(q);
          const filtered = snap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .filter(
              (p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.mrNo.includes(searchTerm),
            );
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

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient);
    setSearchTerm("");
    setSearchResults([]);
    setShowDropdown(false);

    // Fetch Visit Logs
    const q = query(
      collection(db, "bills"),
      where("mrNo", "==", patient.mrNo),
      orderBy("createdAt", "desc"),
      limit(5),
    );
    const snap = await getDocs(q);
    setVisitLogs(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleClearPatient = () => {
    setSelectedPatient(null);
    setVisitLogs([]);
    setPurposeOfVisit("");
  };

  const handleRowChange = (setter, id, field, value) => {
    setter((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  };

  const handleSave = async () => {
    if (!selectedPatient) return toast.error("Select a patient first.");

    setSaving(true);
    try {
      const payload = {
        patient: {
          name: selectedPatient.name,
          mrNo: selectedPatient.mrNo,
          age: selectedPatient.age,
          gender: selectedPatient.gender,
          phone: selectedPatient.phone,
          address: selectedPatient.address,
        },
        patientName: selectedPatient.name,
        mrNo: selectedPatient.mrNo,
        purposeOfVisit,
        generalData: generalRows,
        healthConditions: healthRows,
        ocularHistory: ocularRows,
        currentMedications: medications,
        previousGlass: rxRows,
        visualAcuity: vaRows,
        refraction: refRows,
        acceptance: accRows,
        glassPrescription: gpRows,
        coverTest: ctRows,
        ocularMovement: eomRows,
        pupil: pupilRows,
        lacrimalWorkup: lacrimal,
        lidLashConjunctiva: lidLash,
        corneaAnteriorChamber: corneaAC,
        irisLens,
        colourDryEye,
        iop: iopData,
        age: selectedPatient.age,
        gender: selectedPatient.gender,
        phone: selectedPatient.phone,
        address: selectedPatient.address,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "bills"), payload);

      toast.success("Clinical Record Saved");
      if (window.confirm("Generate PDF?"))
        generateBillPDF({ ...payload, id: "new-record" });

      handleClearPatient();
      navigate("/billing");
    } catch (e) {
      toast.error("Failed to save clinical record");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full h-full p-4 overflow-y-auto text-white md:p-8 custom-scrollbar">
      <ToastContainer position="top-right" theme="dark" />

      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 text-white bg-blue-500 shadow-lg rounded-xl">
          <FaFileInvoiceDollar size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Patient Details</h1>
        </div>
      </div>

      {!selectedPatient ? (
        <div
          className="max-w-3xl mx-auto mb-8 relative z-[100]"
          ref={dropdownRef}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4 text-blue-400 transition-colors hover:text-white"
          >
            <FaArrowLeft /> Back
          </button>

          <div className="relative p-8 border glass-panel rounded-2xl bg-white/5 border-white/10">
            <h2 className="flex items-center gap-3 mb-6 text-xl font-bold">
              <FaSearch className="text-blue-400" /> Search Patient
            </h2>

            <div className="relative flex items-center px-6 py-4 bg-black/40 border border-white/10 rounded-2xl z-[110]">
              <input
                className="flex-1 text-lg font-bold text-white bg-transparent outline-none placeholder-blue-300/30"
                placeholder="Search by Name or MR Number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
              />
              {loading && (
                <div className="w-5 h-5 border-2 border-blue-400 rounded-full animate-spin border-t-transparent"></div>
              )}
            </div>

            {showDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-3 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl max-h-72 overflow-y-auto z-[120]">
                {searchResults.map((p) => (
                  <div
                    key={p.id}
                    onMouseDown={() => handleSelectPatient(p)}
                    className="flex justify-between p-5 text-white border-b cursor-pointer border-white/5 hover:bg-blue-600/30"
                  >
                    <div>
                      <p className="font-black">{p.name}</p>
                      <p className="text-xs text-blue-300">
                        {p.gender} • {p.age} Yrs
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="px-2 py-1 text-xs font-black text-blue-300 rounded bg-blue-500/20">
                        {p.mrNo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
            <div className="space-y-6 xl:col-span-4">
              <div className="p-8 border-l-4 border-blue-500 glass-panel rounded-3xl bg-blue-500/5">
                <div className="flex items-start justify-between mb-6">
                  <FaUserCircle size={60} className="text-blue-400" />
                  <button
                    onClick={handleClearPatient}
                    className="p-2 transition-colors text-white/30 hover:text-red-400"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-3xl font-black text-white uppercase">
                      {selectedPatient.name}
                    </h3>
                    <p className="flex items-center gap-2 mt-1 font-mono text-sm font-bold tracking-widest text-blue-400">
                      <FaFingerprint /> MR: {selectedPatient.mrNo}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <InfoBox
                      icon={<FaCalendarAlt />}
                      label="Age"
                      value={`${selectedPatient.age} Years`}
                    />
                    <InfoBox
                      icon={<FaVenusMars />}
                      label="Gender"
                      value={selectedPatient.gender}
                    />
                    <InfoBox
                      icon={<FaPhone />}
                      label="Phone"
                      value={selectedPatient.phone}
                    />
                    <InfoBox
                      icon={<FaMapMarkerAlt />}
                      label="Address"
                      value={selectedPatient.address || "N/A"}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 xl:col-span-8 glass-panel rounded-3xl border-white/5 bg-white/2">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-3">
                <FaHistory className="text-blue-400" /> Past Visits
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {visitLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 border rounded-2xl bg-white/5 border-white/5"
                  >
                    <p className="text-[10px] font-bold text-blue-400 mb-1">
                      {log.createdAt?.toDate().toLocaleDateString("en-GB")}
                    </p>
                    <p className="text-sm italic font-semibold text-white/80 line-clamp-1">
                      "{log.purposeOfVisit}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-xl p-8 glass-panel rounded-3xl border-medical-primary/20 bg-blue-500/5">
            <h2 className="flex items-center gap-3 pb-3 mb-4 text-sm font-black tracking-widest text-blue-400 uppercase border-b border-white/10">
              Purpose of Visit
            </h2>
            <div className="relative group">
              <FaClipboardList className="absolute text-blue-400 transition-colors -translate-y-1/2 left-4 top-1/2 group-focus-within:text-white" />
              <select
                className="w-full py-4 pl-12 font-bold border outline-none appearance-none cursor-pointer bg-white/5 border-white/10 rounded-2xl"
                value={purposeOfVisit}
                onChange={(e) => setPurposeOfVisit(e.target.value)}
              >
                <option value="" className="bg-slate-900 text-white/50">
                  Select Visit Reason...
                </option>
                {purposeOptions.map((opt) => (
                  <option
                    key={opt}
                    value={opt}
                    className="text-white bg-slate-900"
                  >
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-8 space-y-20 border-t border-white/5">
            <GeneralTable
              rows={generalRows}
              // Ensure the arrow function parameters (id, field, value) are clearly defined
              onRowChange={(id, field, value) =>
                handleRowChange(setGeneralRows, id, field, value)
              }
              onAdd={() =>
                addRow(setGeneralRows, {
                  eye: "OU",
                  complaint: "",
                  duration: "",
                  unit: "Days",
                  association: "",
                  remarks: "",
                })
              }
              onRemove={(id) => removeRow(setGeneralRows, id)}
            />

            <HealthTable
              rows={healthRows}
              onRowChange={(id, field, value) =>
                handleRowChange(setHealthRows, id, field, value)
              }
              onAdd={() =>
                addRow(setHealthRows, {
                  condition: "",
                  duration: "",
                  investigation: "",
                })
              }
              onRemove={(id) => removeRow(setHealthRows, id)}
            />

            <OcularTable
              rows={ocularRows}
              onRowChange={(id, f, v) =>
                handleRowChange(setOcularRows, id, f, v)
              }
              onAdd={() =>
                addRow(setOcularRows, {
                  eye: "OU",
                  condition: "",
                  duration: "",
                  investigation: "",
                })
              }
              onRemove={(id) => removeRow(setOcularRows, id)}
              medications={medications}
              setMedications={setMedications}
            />

            <VisualTable
              rxRows={rxRows}
              onRxChange={(id, f, v) => handleRowChange(setRxRows, id, f, v)}
              onRxAdd={() =>
                addRow(setRxRows, {
                  date: "",
                  eye: "OU",
                  sph: "",
                  cyl: "",
                  axis: "",
                  add: "",
                  prism: "",
                  base: "",
                  lens: "",
                  status: "",
                })
              }
              onRxRemove={(id) => removeRow(setRxRows, id)}
              vaRows={vaRows}
              onVaChange={(id, f, v) => handleRowChange(setVaRows, id, f, v)}
              onVaAdd={() =>
                addRow(setVaRows, {
                  eye: "OU",
                  withoutGlass: "",
                  withGlass: "",
                  withPh: "",
                  contactLens: "",
                })
              }
              onVaRemove={(id) => removeRow(setVaRows, id)}
              refRows={refRows}
              onRefChange={(id, f, v) => handleRowChange(setRefRows, id, f, v)}
              onRefAdd={() =>
                addRow(setRefRows, {
                  eye: "OU",
                  retinoscopy: "",
                  dsph: "",
                  dcyl: "",
                  axis: "",
                })
              }
              onRefRemove={(id) => removeRow(setRefRows, id)}
              accRows={accRows}
              onAccChange={(id, f, v) => handleRowChange(setAccRows, id, f, v)}
              onAccAdd={() =>
                addRow(setAccRows, {
                  eye: "OU",
                  sph: "",
                  cyl: "",
                  axis: "",
                  distVision: "",
                  add: "",
                  nearVision: "",
                  comments: "",
                })
              }
              onAccRemove={(id) => removeRow(setAccRows, id)}
              gpRows={gpRows}
              onGpChange={(id, f, v) => handleRowChange(setGpRows, id, f, v)}
              onGpAdd={() =>
                addRow(setGpRows, {
                  eye: "OU",
                  sph: "",
                  cyl: "",
                  axis: "",
                  add: "",
                  distVision: "",
                  nearVision: "",
                })
              }
              onGpRemove={(id) => removeRow(setGpRows, id)}
            />

            <CoverTestEOMTable
  ctRows={ctRows}
  onCtChange={(id, f, v) => handleRowChange(setCtRows, id, f, v)}
  onCtAdd={() =>
    addRow(setCtRows, {
      hirschberg: "",
      ctDistance: "",
      ctNear: "",
    })
  }
  onCtRemove={(id) => removeRow(setCtRows, id)}
  eomRows={eomRows}
  onEomChange={(id, f, v) => handleRowChange(setEomRows, id, f, v)}
  onEomAdd={() => 
    addRow(setEomRows, { 
      od: "Full & Free", 
      os: "Full & Free" 
    })
  }
  onEomRemove={(id) => removeRow(setEomRows, id)}
/>

            <PupilTable 
  rows={pupilRows} 
  setRows={setPupilRows} 
/>

            {/* Rest of components remain as you had them, ensuring consistent onChange prop naming */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <LacrimalTable
                lacrimal={lacrimal}
                onLacrimalChange={(f, v) =>
                  setLacrimal((prev) => ({ ...prev, [f]: v }))
                }
              />
              <ColourDryEyeTable
                data={colourDryEye}
                onChange={(f, v) =>
                  setColourDryEye((prev) => ({ ...prev, [f]: v }))
                }
              />
            </div>

            <LidLashConjunctivaTable
              data={lidLash}
              onChange={(f, v) => setLidLash((prev) => ({ ...prev, [f]: v }))}
            />
            <CorneaACTable
              data={corneaAC}
              onChange={(f, v) => setCorneaAC((prev) => ({ ...prev, [f]: v }))}
            />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <IrisLensTable
                data={irisLens}
                onChange={(f, v) =>
                  setIrisLens((prev) => ({ ...prev, [f]: v }))
                }
              />
              <IOPTable
                data={iopData}
                onChange={(f, v) => setIopData((prev) => ({ ...prev, [f]: v }))}
              />
            </div>


            <div className="flex justify-end pt-10 pb-32 border-t border-white/5">
              <button
                onClick={handleSave}
                disabled={saving}
                className="group relative flex items-center gap-4 px-16 py-6 bg-blue-600 text-white font-black rounded-3xl shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:scale-[1.03] active:scale-95 transition-all uppercase tracking-[0.2em] text-sm"
              >
                {saving ? (
                  "Saving..."
                ) : (
                  <>
                    <FaSave size={20} /> Save Bill
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoBox = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 text-blue-400">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
        {label}
      </p>
      <p className="text-sm font-bold leading-tight text-white/90">{value}</p>
    </div>
  </div>
);

export default AddBill;
