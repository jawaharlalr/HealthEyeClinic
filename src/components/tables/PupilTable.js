import React from 'react';
import { FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import { TableSelect, TableInput, TableSNo } from '../common/TableComponents';

const PupilTable = ({
  rows = [], // Maps directly to parent 'pupilRows' state via 'rows' prop
  setRows    // Maps directly to parent 'setRows' state hook
}) => {
  
  // Localized configuration options for the Eye selector dropdown
  const eyeOptions = ['OD', 'OS', 'OU'];

  // --- Change Handler ---
  const handlePupilChange = (id, field, value) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  // --- Add Row Handler ---
  const handlePupilAdd = () => {
    setRows(prev => [
      ...prev, 
      { id: Date.now(), eye: 'OD', size: '', shape: '', light: '', near: '', rapd: '' }
    ]);
  };

  // --- Remove Row Handler ---
  const handlePupilRemove = (id) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="p-4 mb-8 space-y-8 glass-panel md:p-6 rounded-2xl">
      <div>
        <h3 className="flex items-center gap-2 pb-2 mb-3 text-lg font-black tracking-widest text-blue-300 uppercase border-b border-white/10">
          <FaEye /> Pupil Examination
        </h3>
        
        {/* Desktop Interface */}
        <div className="hidden overflow-x-auto xl:block custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs text-blue-200 uppercase bg-blue-900/40">
              <tr>
                {['S.No', 'Eye', 'Size (mm)', 'Shape', 'Reaction to Light', 'Reaction to Near', 'RAPD', 'Remove'].map(h => (
                  <th key={h} className="p-3 whitespace-nowrap font-black tracking-wider text-[10px] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((row, idx) => (
                <tr key={row.id} className="hover:bg-white/5">
                  <td className="p-2 align-top"><TableSNo index={idx} /></td>
                  <td className="p-2"><TableSelect value={row.eye} options={eyeOptions} onChange={(e) => handlePupilChange(row.id, 'eye', e.target.value)} /></td>
                  <td className="p-2"><TableInput value={row.size} placeholder="Size" onChange={(e) => handlePupilChange(row.id, 'size', e.target.value)} /></td>
                  <td className="p-2"><TableInput value={row.shape} placeholder="Shape" onChange={(e) => handlePupilChange(row.id, 'shape', e.target.value)} /></td>
                  <td className="p-2"><TableInput value={row.light} placeholder="Light Rxn" onChange={(e) => handlePupilChange(row.id, 'light', e.target.value)} /></td>
                  <td className="p-2"><TableInput value={row.near} placeholder="Near Rxn" onChange={(e) => handlePupilChange(row.id, 'near', e.target.value)} /></td>
                  <td className="p-2"><TableInput value={row.rapd} placeholder="RAPD" onChange={(e) => handlePupilChange(row.id, 'rapd', e.target.value)} /></td>
                  <td className="p-2 pt-3 text-center align-top">
                    <button type="button" onClick={() => handlePupilRemove(row.id)} className="p-2 text-red-400 transition-colors hover:text-white">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile Interface */}
        <div className="space-y-3 xl:hidden">
          {rows.map((row, idx) => (
            <div key={row.id} className="relative grid grid-cols-2 gap-3 p-4 pt-10 border bg-white/5 border-white/10 rounded-xl">
              <div className="absolute top-0 left-0 px-3 py-1 text-xs font-black tracking-tighter text-blue-200 uppercase rounded-br-lg bg-blue-900/50">S.No: {idx + 1}</div>
              <button type="button" onClick={() => handlePupilRemove(row.id)} className="absolute p-2 text-red-400 transition-colors rounded-lg top-2 right-2 hover:text-white hover:bg-red-500/20">
                <FaTrash size={14}/>
              </button>
              
              <div className="col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-300 block mb-1">Eye</label>
                <TableSelect value={row.eye} options={eyeOptions} onChange={(e) => handlePupilChange(row.id, 'eye', e.target.value)} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-300 block mb-1">Size</label>
                <TableInput value={row.size} placeholder="Size" onChange={(e) => handlePupilChange(row.id, 'size', e.target.value)} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-300 block mb-1">Shape</label>
                <TableInput value={row.shape} placeholder="Shape" onChange={(e) => handlePupilChange(row.id, 'shape', e.target.value)} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-300 block mb-1">Reaction to Light</label>
                <TableInput value={row.light} placeholder="Light Rxn" onChange={(e) => handlePupilChange(row.id, 'light', e.target.value)} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-300 block mb-1">Reaction to Near</label>
                <TableInput value={row.near} placeholder="Near Rxn" onChange={(e) => handlePupilChange(row.id, 'near', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-300 block mb-1">RAPD</label>
                <TableInput value={row.rapd} placeholder="RAPD" onChange={(e) => handlePupilChange(row.id, 'rapd', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
        
        <button type="button" onClick={handlePupilAdd} className="flex items-center gap-2 mt-4 text-xs font-bold text-blue-300 transition-colors hover:text-white">
          <FaPlus className="p-1 text-lg rounded bg-blue-500/20"/> Add Pupil Examination Row
        </button>
      </div>
    </div>
  );
};

export default PupilTable;