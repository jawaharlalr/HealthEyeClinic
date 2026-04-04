import React from 'react';
import { FaTrash, FaPlus, FaGlasses, FaEye, FaMicroscope, FaCheckCircle, FaFilePrescription } from 'react-icons/fa';
import { TableSelectModal, TableInput, TableSNo } from '../common/TableComponents';

const VisualTable = ({ 
  rxRows = [], onRxChange, onRxAdd, onRxRemove,
  vaRows = [], onVaChange, onVaAdd, onVaRemove,
  refRows = [], onRefChange, onRefAdd, onRefRemove,
  accRows = [], onAccChange, onAccAdd, onAccRemove,
  gpRows = [], onGpChange, onGpAdd, onGpRemove,
  options = {} 
}) => {

  // Standard Eye Options
  const eyeOptions = ['OD', 'OS', 'OU'];

  // Distance Acuity / Dist Vision Options
  const distVisionOptions = [
    'NI Further','6/5', '6/6', '6/7.5', '6/9', '6/12', '6/15', '6/18', '6/24', '6/36', '6/60', 
    '3/60', '2/60', '1/60', 'CF@2m', 'CF@1m', 'CFCF', 'HM+', 'PLPR', 'No PL'
  ];

  // Near Vision Options
  const nearVisionOptions = [
    'N5', 'N6', 'N8', 'N10', 'N12', 'N18', 'N24', 'N36', 'N36 less than 10cm'
  ];

  return (
    <div className="p-4 mb-8 space-y-8 glass-panel md:p-6 rounded-2xl">
      
      {/* --- SECTION 1: PREVIOUS GLASS PRESCRIPTION --- */}
      <div>
        <h3 className="flex items-center gap-2 pb-2 mb-3 text-lg font-bold text-blue-300 border-b border-white/10">
          <FaGlasses /> Previous Glass Prescription
        </h3>
        <div className="hidden overflow-x-auto xl:block custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs text-blue-200 uppercase bg-blue-900/40">
              <tr>{['S.No', 'Date', 'Eye', 'Sph', 'Cyl', 'Axis', 'Add', 'Prism', 'Base', 'Lens', 'Status', 'Remove'].map(h => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rxRows.map((row, idx) => (
                <tr key={row.id} className="hover:bg-white/5">
                  <td className="p-2 align-top"><TableSNo index={idx} /></td>
                  <td className="p-2 align-top"><TableInput type="date" value={row.date} onChange={(e) => onRxChange(row.id, 'date', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableSelectModal placeholder="Eye" value={row.eye} options={eyeOptions} onChange={(e) => onRxChange(row.id, 'eye', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableInput value={row.sph} placeholder="Sph" onChange={(e) => onRxChange(row.id, 'sph', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableInput value={row.cyl} placeholder="Cyl" onChange={(e) => onRxChange(row.id, 'cyl', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableInput value={row.axis} placeholder="Axis" onChange={(e) => onRxChange(row.id, 'axis', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableInput value={row.add} placeholder="Add" onChange={(e) => onRxChange(row.id, 'add', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableInput value={row.prism} placeholder="Prism" onChange={(e) => onRxChange(row.id, 'prism', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableInput value={row.base} placeholder="Base" onChange={(e) => onRxChange(row.id, 'base', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableInput value={row.lens} placeholder="Lens" onChange={(e) => onRxChange(row.id, 'lens', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableInput value={row.status} placeholder="Status" onChange={(e) => onRxChange(row.id, 'status', e.target.value)} /></td>
                  <td className="p-2 pt-3 text-center align-top"><button onClick={() => onRxRemove(row.id)} className="p-2 text-red-400 hover:text-white"><FaTrash /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-3 xl:hidden">
          {rxRows.map((row, idx) => (
            <div key={row.id} className="relative grid grid-cols-2 gap-3 p-4 pt-10 border bg-white/5 border-white/10 rounded-xl">
              <div className="absolute top-0 left-0 px-3 py-1 text-xs font-bold text-blue-200 rounded-br-lg rounded-tl-xl bg-blue-900/50">S.No: {idx + 1}</div>
              <button onClick={() => onRxRemove(row.id)} className="absolute p-2 text-red-400 transition-colors rounded-lg top-2 right-2 hover:text-white hover:bg-red-500/20"><FaTrash size={14}/></button>
              <div className="col-span-2"><label className="text-[10px] text-blue-300 block mb-1">Date</label><TableInput type="date" value={row.date} onChange={(e) => onRxChange(row.id, 'date', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">Eye</label><TableSelectModal placeholder="Eye" value={row.eye} options={eyeOptions} onChange={(e) => onRxChange(row.id, 'eye', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">Sph</label><TableInput value={row.sph} placeholder="Sph" onChange={(e) => onRxChange(row.id, 'sph', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">Cyl</label><TableInput value={row.cyl} placeholder="Cyl" onChange={(e) => onRxChange(row.id, 'cyl', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">Axis</label><TableInput value={row.axis} placeholder="Axis" onChange={(e) => onRxChange(row.id, 'axis', e.target.value)} /></div>
            </div>
          ))}
        </div>
        <button onClick={onRxAdd} className="flex items-center gap-2 mt-3 text-xs text-blue-300 hover:text-white"><FaPlus className="p-1 text-lg rounded bg-blue-500/20"/> Add Previous Glass</button>
      </div>

      {/* --- SECTION 2: VISUAL ACUITY --- */}
      <div>
        <h3 className="flex items-center gap-2 pb-2 mb-3 text-lg font-bold text-blue-300 border-b border-white/10">
          <FaEye /> Visual Acuity
        </h3>
        <div className="hidden overflow-x-auto xl:block custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs text-blue-200 uppercase bg-blue-900/40">
              <tr>{['S.No', 'Eye', 'Without Glass', 'With Glass', 'With PH', 'Near Vision', 'Contact Lens', 'Remove'].map(h => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {vaRows.map((row, idx) => (
                <tr key={row.id} className="hover:bg-white/5">
                  <td className="p-2 align-top w-14"><TableSNo index={idx} /></td>
                  <td className="p-2 align-top"><TableSelectModal placeholder="Eye" value={row.eye} options={eyeOptions} onChange={(e) => onVaChange(row.id, 'eye', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableSelectModal placeholder="Select" value={row.withoutGlass} options={distVisionOptions} onChange={(e) => onVaChange(row.id, 'withoutGlass', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableSelectModal placeholder="Select" value={row.withGlass} options={distVisionOptions} onChange={(e) => onVaChange(row.id, 'withGlass', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableSelectModal placeholder="PH" value={row.withPh} options={distVisionOptions} onChange={(e) => onVaChange(row.id, 'withPh', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableSelectModal placeholder="Near Vision" value={row.nearVision} options={nearVisionOptions} onChange={(e) => onVaChange(row.id, 'nearVision', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableSelectModal placeholder="CL" value={row.contactLens} options={distVisionOptions} onChange={(e) => onVaChange(row.id, 'contactLens', e.target.value)} /></td>
                  <td className="w-20 p-2 pt-3 text-center align-top"><button onClick={() => onVaRemove(row.id)} className="p-2 text-red-400 hover:text-white"><FaTrash /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-3 xl:hidden">
          {vaRows.map((row, idx) => (
            <div key={row.id} className="relative grid grid-cols-2 gap-3 p-4 pt-10 border bg-white/5 border-white/10 rounded-xl">
              <div className="absolute top-0 left-0 px-3 py-1 text-xs font-bold text-blue-200 rounded-br-lg rounded-tl-xl bg-blue-900/50">S.No: {idx + 1}</div>
              <button onClick={() => onVaRemove(row.id)} className="absolute p-2 text-red-400 transition-colors rounded-lg top-2 right-2 hover:text-white hover:bg-red-500/20"><FaTrash size={14}/></button>
              <div><label className="text-[10px] text-blue-300 block mb-1">Eye</label><TableSelectModal placeholder="Eye" value={row.eye} options={eyeOptions} onChange={(e) => onVaChange(row.id, 'eye', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">Without Glass</label><TableSelectModal placeholder="Select" value={row.withoutGlass} options={distVisionOptions} onChange={(e) => onVaChange(row.id, 'withoutGlass', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">With Glass</label><TableSelectModal placeholder="Select" value={row.withGlass} options={distVisionOptions} onChange={(e) => onVaChange(row.id, 'withGlass', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">With PH</label><TableSelectModal placeholder="PH" value={row.withPh} options={distVisionOptions} onChange={(e) => onVaChange(row.id, 'withPh', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">Near Vision</label><TableSelectModal placeholder="Near Vision" value={row.nearVision} options={nearVisionOptions} onChange={(e) => onVaChange(row.id, 'nearVision', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">Contact Lens</label><TableSelectModal placeholder="CL" value={row.contactLens} options={distVisionOptions} onChange={(e) => onVaChange(row.id, 'contactLens', e.target.value)} /></div>
            </div>
          ))}
        </div>
        <button onClick={onVaAdd} className="flex items-center gap-2 mt-3 text-xs text-blue-300 hover:text-white"><FaPlus className="p-1 text-lg rounded bg-blue-500/20"/> Add VA Row</button>
      </div>

      {/* --- SECTION 3: REFRACTION --- */}
      <div>
        <h3 className="flex items-center gap-2 pb-2 mb-3 text-lg font-bold text-blue-300 border-b border-white/10">
          <FaMicroscope /> Refraction
        </h3>
        <div className="hidden overflow-x-auto xl:block custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs text-blue-200 uppercase bg-blue-900/40">
              <tr>{['S.No', 'Eye', 'Reflex', 'DSph', 'DCyl', 'Axis', 'Remove'].map(h => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {refRows.map((row, idx) => (
                <tr key={row.id} className="hover:bg-white/5">
                  <td className="p-2 align-top w-14"><TableSNo index={idx} /></td>
                  <td className="p-2 align-top"><TableSelectModal placeholder="Eye" value={row.eye} options={eyeOptions} onChange={(e) => onRefChange(row.id, 'eye', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableInput value={row.retinoscopy} placeholder="Reflex" onChange={(e) => onRefChange(row.id, 'retinoscopy', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableInput value={row.dsph} placeholder="Sph" onChange={(e) => onRefChange(row.id, 'dsph', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableInput value={row.dcyl} placeholder="Cyl" onChange={(e) => onRefChange(row.id, 'dcyl', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableInput value={row.axis} placeholder="Axis" onChange={(e) => onRefChange(row.id, 'axis', e.target.value)} /></td>
                  <td className="w-20 p-2 pt-3 text-center align-top"><button onClick={() => onRefRemove(row.id)} className="p-2 text-red-400 hover:text-white"><FaTrash /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-3 xl:hidden">
          {refRows.map((row, idx) => (
            <div key={row.id} className="relative grid grid-cols-2 gap-3 p-4 pt-10 border bg-white/5 border-white/10 rounded-xl">
              <div className="absolute top-0 left-0 px-3 py-1 text-xs font-bold text-blue-200 rounded-br-lg rounded-tl-xl bg-blue-900/50">S.No: {idx + 1}</div>
              <button onClick={() => onRefRemove(row.id)} className="absolute p-2 text-red-400 transition-colors rounded-lg top-2 right-2 hover:text-white hover:bg-red-500/20"><FaTrash size={14}/></button>
              <div><label className="text-[10px] text-blue-300 block mb-1">Eye</label><TableSelectModal placeholder="Eye" value={row.eye} options={eyeOptions} onChange={(e) => onRefChange(row.id, 'eye', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">Reflex</label><TableInput value={row.retinoscopy} onChange={(e) => onRefChange(row.id, 'retinoscopy', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">DSph</label><TableInput value={row.dsph} onChange={(e) => onRefChange(row.id, 'dsph', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">DCyl</label><TableInput value={row.dcyl} onChange={(e) => onRefChange(row.id, 'dcyl', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">Axis</label><TableInput value={row.axis} onChange={(e) => onRefChange(row.id, 'axis', e.target.value)} /></div>
            </div>
          ))}
        </div>
        <button onClick={onRefAdd} className="flex items-center gap-2 mt-3 text-xs text-blue-300 hover:text-white"><FaPlus className="p-1 text-lg rounded bg-blue-500/20"/> Add Refraction Row</button>
      </div>

      {/* --- SECTION 4: ACCEPTANCE --- */}
      <div>
        <h3 className="flex items-center gap-2 pb-2 mb-3 text-lg font-bold text-blue-300 border-b border-white/10">
          <FaCheckCircle /> ACCEPTANCE
        </h3>
        <div className="hidden overflow-x-auto xl:block custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs text-blue-200 uppercase bg-blue-900/40">
              <tr>{['S.No', 'Eye', 'Sph', 'Cyl', 'Axis', 'Dist Vision', 'Add', 'Near Vision', 'Comments', 'Remove'].map(h => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {accRows.map((row, idx) => (
                <tr key={row.id} className="hover:bg-white/5">
                  <td className="p-2 align-top w-14"><TableSNo index={idx} /></td>
                  <td className="p-2 align-top"><TableSelectModal placeholder="Eye" value={row.eye} options={eyeOptions} onChange={(e) => onAccChange(row.id, 'eye', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableInput value={row.sph} placeholder="Sph" onChange={(e) => onAccChange(row.id, 'sph', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableInput value={row.cyl} placeholder="Cyl" onChange={(e) => onAccChange(row.id, 'cyl', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableInput value={row.axis} placeholder="Axis" onChange={(e) => onAccChange(row.id, 'axis', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableSelectModal placeholder="Dist Vision" value={row.distVision} options={distVisionOptions} onChange={(e) => onAccChange(row.id, 'distVision', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableInput value={row.add} placeholder="Add" onChange={(e) => onAccChange(row.id, 'add', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableSelectModal placeholder="Near Vision" value={row.nearVision} options={nearVisionOptions} onChange={(e) => onAccChange(row.id, 'nearVision', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableInput value={row.comments} placeholder="Remarks" onChange={(e) => onAccChange(row.id, 'comments', e.target.value)} /></td>
                  <td className="w-20 p-2 pt-3 text-center align-top"><button onClick={() => onAccRemove(row.id)} className="p-2 text-red-400 hover:text-white"><FaTrash /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-3 xl:hidden">
          {accRows.map((row, idx) => (
            <div key={row.id} className="relative grid grid-cols-2 gap-3 p-4 pt-10 border bg-white/5 border-white/10 rounded-xl">
              <div className="absolute top-0 left-0 px-3 py-1 text-xs font-bold text-blue-200 rounded-br-lg rounded-tl-xl bg-blue-900/50">S.No: {idx + 1}</div>
              <button onClick={() => onAccRemove(row.id)} className="absolute p-2 text-red-400 transition-colors rounded-lg top-2 right-2 hover:text-white hover:bg-red-500/20"><FaTrash size={14}/></button>
              <div><label className="text-[10px] text-blue-300 block mb-1">Eye</label><TableSelectModal placeholder="Eye" value={row.eye} options={eyeOptions} onChange={(e) => onAccChange(row.id, 'eye', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">Sph</label><TableInput value={row.sph} placeholder="Sph" onChange={(e) => onAccChange(row.id, 'sph', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">Cyl</label><TableInput value={row.cyl} placeholder="Cyl" onChange={(e) => onAccChange(row.id, 'cyl', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">Axis</label><TableInput value={row.axis} placeholder="Axis" onChange={(e) => onAccChange(row.id, 'axis', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">Dist Vision</label><TableSelectModal placeholder="Dist Vision" value={row.distVision} options={distVisionOptions} onChange={(e) => onAccChange(row.id, 'distVision', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">Add</label><TableInput value={row.add} placeholder="Add" onChange={(e) => onAccChange(row.id, 'add', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">Near Vision</label><TableSelectModal placeholder="Near Vision" value={row.nearVision} options={nearVisionOptions} onChange={(e) => onAccChange(row.id, 'nearVision', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">Comments</label><TableInput value={row.comments} placeholder="Remarks" onChange={(e) => onAccChange(row.id, 'comments', e.target.value)} /></div>
            </div>
          ))}
        </div>
        <button onClick={onAccAdd} className="flex items-center gap-2 mt-3 text-xs text-blue-300 hover:text-white"><FaPlus className="p-1 text-lg rounded bg-blue-500/20"/> Add Acceptance Row</button>
      </div>

      {/* --- SECTION 5: GLASS PRESCRIPTION --- */}
      <div>
        <h3 className="flex items-center gap-2 pb-2 mb-3 text-lg font-bold text-blue-300 border-b border-white/10">
          <FaFilePrescription /> Glass Prescription
        </h3>
        <div className="hidden overflow-x-auto xl:block custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs text-blue-200 uppercase bg-blue-900/40">
              <tr>{['S.No', 'Eye', 'Sph', 'Cyl', 'Axis', 'Dist Vision', 'Add', 'Near Vision', 'Remove'].map(h => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {gpRows.map((row, idx) => (
                <tr key={row.id} className="hover:bg-white/5">
                  <td className="p-2 align-top w-14"><TableSNo index={idx} /></td>
                  <td className="p-2 align-top"><TableSelectModal placeholder="Eye" value={row.eye} options={eyeOptions} onChange={(e) => onGpChange(row.id, 'eye', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableInput value={row.sph} placeholder="Sph" onChange={(e) => onGpChange(row.id, 'sph', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableInput value={row.cyl} placeholder="Cyl" onChange={(e) => onGpChange(row.id, 'cyl', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableInput value={row.axis} placeholder="Axis" onChange={(e) => onGpChange(row.id, 'axis', e.target.value)} /></td>
                  {/* ADDED DIST VISION */}
                  <td className="p-2 align-top"><TableSelectModal placeholder="Dist Vision" value={row.distVision} options={distVisionOptions} onChange={(e) => onGpChange(row.id, 'distVision', e.target.value)} /></td>
                  <td className="p-2 align-top"><TableInput value={row.add} placeholder="Add" onChange={(e) => onGpChange(row.id, 'add', e.target.value)} /></td>
                  {/* ADDED NEAR VISION */}
                  <td className="p-2 align-top"><TableSelectModal placeholder="Near Vision" value={row.nearVision} options={nearVisionOptions} onChange={(e) => onGpChange(row.id, 'nearVision', e.target.value)} /></td>
                  <td className="w-20 p-2 pt-3 text-center align-top"><button onClick={() => onGpRemove(row.id)} className="p-2 text-red-400 hover:text-white"><FaTrash /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-3 xl:hidden">
          {gpRows.map((row, idx) => (
            <div key={row.id} className="relative grid grid-cols-2 gap-3 p-4 pt-10 border bg-white/5 border-white/10 rounded-xl">
              <div className="absolute top-0 left-0 px-3 py-1 text-xs font-bold text-blue-200 rounded-br-lg rounded-tl-xl bg-blue-900/50">S.No: {idx + 1}</div>
              <button onClick={() => onGpRemove(row.id)} className="absolute p-2 text-red-400 transition-colors rounded-lg top-2 right-2 hover:text-white hover:bg-red-500/20"><FaTrash size={14}/></button>
              <div><label className="text-[10px] text-blue-300 block mb-1">Eye</label><TableSelectModal placeholder="Eye" value={row.eye} options={eyeOptions} onChange={(e) => onGpChange(row.id, 'eye', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">Sph</label><TableInput value={row.sph} placeholder="Sph" onChange={(e) => onGpChange(row.id, 'sph', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">Cyl</label><TableInput value={row.cyl} placeholder="Cyl" onChange={(e) => onGpChange(row.id, 'cyl', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">Axis</label><TableInput value={row.axis} placeholder="Axis" onChange={(e) => onGpChange(row.id, 'axis', e.target.value)} /></div>
              {/* ADDED DIST VISION */}
              <div><label className="text-[10px] text-blue-300 block mb-1">Dist Vision</label><TableSelectModal placeholder="Dist Vision" value={row.distVision} options={distVisionOptions} onChange={(e) => onGpChange(row.id, 'distVision', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">Add</label><TableInput value={row.add} placeholder="Add" onChange={(e) => onGpChange(row.id, 'add', e.target.value)} /></div>
              {/* ADDED NEAR VISION */}
              <div className="col-span-2"><label className="text-[10px] text-blue-300 block mb-1">Near Vision</label><TableSelectModal placeholder="Near Vision" value={row.nearVision} options={nearVisionOptions} onChange={(e) => onGpChange(row.id, 'nearVision', e.target.value)} /></div>
            </div>
          ))}
        </div>
        <button onClick={onGpAdd} className="flex items-center gap-2 mt-3 text-xs text-blue-300 hover:text-white"><FaPlus className="p-1 text-lg rounded bg-blue-500/20"/> Add Glass Rx Row</button>
      </div>

    </div>
  );
};

export default VisualTable;