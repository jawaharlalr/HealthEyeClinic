import React, { useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import { TableInput } from '../common/TableComponents';

const PupilTable = ({ rows = [], setRows }) => {

  useEffect(() => {
    // Only initialize if rows are empty; limited to OD and OS
    if (rows.length === 0) {
      setRows([
        { id: 1, eye: 'OD', size: 'Normal', shape: 'Normal', light: 'Normal', near: 'Normal', rapd: 'Absent' },
        { id: 2, eye: 'OS', size: 'Normal', shape: 'Normal', light: 'Normal', near: 'Normal', rapd: 'Absent' }
      ]);
    }
  }, [rows, setRows]);

  const handlePupilChange = (id, field, value) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
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
                {['Eye', 'Size (mm)', 'Shape', 'Reaction to Light', 'Reaction to Near', 'RAPD'].map(h => (
                  <th key={h} className="p-3 whitespace-nowrap font-black tracking-wider text-[10px] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-white/5">
                  <td className="p-3 font-black text-blue-400">{row.eye}</td>
                  <td className="p-2"><TableInput value={row.size} placeholder="Normal" onChange={(e) => handlePupilChange(row.id, 'size', e.target.value)} /></td>
                  <td className="p-2"><TableInput value={row.shape} placeholder="Normal" onChange={(e) => handlePupilChange(row.id, 'shape', e.target.value)} /></td>
                  <td className="p-2"><TableInput value={row.light} placeholder="Normal" onChange={(e) => handlePupilChange(row.id, 'light', e.target.value)} /></td>
                  <td className="p-2"><TableInput value={row.near} placeholder="Normal" onChange={(e) => handlePupilChange(row.id, 'near', e.target.value)} /></td>
                  <td className="p-2"><TableInput value={row.rapd} placeholder="Absent" onChange={(e) => handlePupilChange(row.id, 'rapd', e.target.value)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile Interface */}
        <div className="space-y-3 xl:hidden">
          {rows.map((row) => (
            <div key={row.id} className="grid grid-cols-2 gap-3 p-4 border bg-white/5 border-white/10 rounded-xl">
              <div className="col-span-2 pb-2 mb-2 font-black text-blue-400 border-b border-white/10">{row.eye}</div>
              <div><label className="text-[10px] text-blue-300 block">Size</label><TableInput value={row.size} placeholder="Normal" onChange={(e) => handlePupilChange(row.id, 'size', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block">Shape</label><TableInput value={row.shape} placeholder="Normal" onChange={(e) => handlePupilChange(row.id, 'shape', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block">Light</label><TableInput value={row.light} placeholder="Normal" onChange={(e) => handlePupilChange(row.id, 'light', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block">Near</label><TableInput value={row.near} placeholder="Normal" onChange={(e) => handlePupilChange(row.id, 'near', e.target.value)} /></div>
              <div className="col-span-2"><label className="text-[10px] text-blue-300 block">RAPD</label><TableInput value={row.rapd} placeholder="Absent" onChange={(e) => handlePupilChange(row.id, 'rapd', e.target.value)} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PupilTable;