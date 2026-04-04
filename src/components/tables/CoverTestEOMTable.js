import React from 'react';
import { FaTrash, FaPlus, FaArrowsAlt} from 'react-icons/fa';
import { TableInput, TableSNo } from '../common/TableComponents';

const CoverTestEOMTable = ({
  ctRows = [], onCtChange, onCtAdd, onCtRemove,
  eomRows = [], onEomChange, onEomAdd, onEomRemove
}) => {
  return (
    <div className="p-4 mb-8 space-y-8 glass-panel md:p-6 rounded-2xl">
      <h2 className="flex items-center gap-2 pb-2 mb-2 text-xl font-bold border-b border-white/10">
        <FaArrowsAlt className="text-blue-400"/> Cover Test / EOM
      </h2>

      {/* --- SUB-TABLE 1: COVER TEST --- */}
      <div>
        <h3 className="mb-3 text-sm font-bold tracking-wider text-blue-300 uppercase">
          Cover Test
        </h3>
        
        {/* Desktop */}
        <div className="hidden overflow-x-auto md:block custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs text-blue-200 uppercase bg-blue-900/40">
              <tr>{['S.No', 'Hirschberg', 'Cover Test Distance', 'Cover Test Near', 'Remove'].map(h => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ctRows.map((row, idx) => (
                <tr key={row.id} className="hover:bg-white/5">
                  <td className="p-2 align-top"><TableSNo index={idx} /></td>
                  <td className="p-2"><TableInput value={row.hirschberg} placeholder="Hirschberg Details" onChange={(e) => onCtChange(row.id, 'hirschberg', e.target.value)} /></td>
                  <td className="p-2"><TableInput value={row.ctDistance} placeholder="Distance Details" onChange={(e) => onCtChange(row.id, 'ctDistance', e.target.value)} /></td>
                  <td className="p-2"><TableInput value={row.ctNear} placeholder="Near Details" onChange={(e) => onCtChange(row.id, 'ctNear', e.target.value)} /></td>
                  <td className="p-2 pt-3 text-center align-top"><button onClick={() => onCtRemove(row.id)} className="p-2 text-red-400 hover:text-white"><FaTrash /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile */}
        <div className="space-y-3 md:hidden">
          {ctRows.map((row, idx) => (
            <div key={row.id} className="relative grid grid-cols-1 gap-3 p-4 pt-10 border bg-white/5 border-white/10 rounded-xl">
              <div className="absolute top-0 left-0 px-3 py-1 text-xs font-bold text-blue-200 rounded-br-lg rounded-tl-xl bg-blue-900/50">S.No: {idx + 1}</div>
              <button onClick={() => onCtRemove(row.id)} className="absolute p-2 text-red-400 transition-colors rounded-lg top-2 right-2 hover:text-white hover:bg-red-500/20"><FaTrash size={14}/></button>
              
              <div><label className="text-[10px] text-blue-300 block mb-1">Hirschberg</label><TableInput value={row.hirschberg} onChange={(e) => onCtChange(row.id, 'hirschberg', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">Cover Test Distance</label><TableInput value={row.ctDistance} onChange={(e) => onCtChange(row.id, 'ctDistance', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">Cover Test Near</label><TableInput value={row.ctNear} onChange={(e) => onCtChange(row.id, 'ctNear', e.target.value)} /></div>
            </div>
          ))}
        </div>
        <button onClick={onCtAdd} className="flex items-center gap-2 mt-3 text-xs text-blue-300 hover:text-white"><FaPlus className="p-1 text-lg rounded bg-blue-500/20"/> Add Cover Test Row</button>
      </div>

      <hr className="border-white/5" />

      {/* --- SUB-TABLE 2: OCULAR MOVEMENT --- */}
      <div>
        <h3 className="mb-3 text-sm font-bold tracking-wider text-blue-300 uppercase">
          Ocular Movement
        </h3>
        
        {/* Desktop */}
        <div className="hidden overflow-x-auto md:block custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs text-blue-200 uppercase bg-blue-900/40">
              <tr>{['S.No', 'OD (Right Eye)', 'OS (Left Eye)', 'Remove'].map(h => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {eomRows.map((row, idx) => (
                <tr key={row.id} className="hover:bg-white/5">
                  <td className="p-2 align-top w-14"><TableSNo index={idx} /></td>
                  <td className="p-2"><TableInput value={row.od} placeholder="OD Details" onChange={(e) => onEomChange(row.id, 'od', e.target.value)} /></td>
                  <td className="p-2"><TableInput value={row.os} placeholder="OS Details" onChange={(e) => onEomChange(row.id, 'os', e.target.value)} /></td>
                  <td className="w-20 p-2 pt-3 text-center align-top"><button onClick={() => onEomRemove(row.id)} className="p-2 text-red-400 hover:text-white"><FaTrash /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile */}
        <div className="space-y-3 md:hidden">
          {eomRows.map((row, idx) => (
            <div key={row.id} className="relative grid grid-cols-1 gap-3 p-4 pt-10 border bg-white/5 border-white/10 rounded-xl">
              <div className="absolute top-0 left-0 px-3 py-1 text-xs font-bold text-blue-200 rounded-br-lg rounded-tl-xl bg-blue-900/50">S.No: {idx + 1}</div>
              <button onClick={() => onEomRemove(row.id)} className="absolute p-2 text-red-400 transition-colors rounded-lg top-2 right-2 hover:text-white hover:bg-red-500/20"><FaTrash size={14}/></button>
              
              <div><label className="text-[10px] text-blue-300 block mb-1">OD (Right Eye)</label><TableInput value={row.od} onChange={(e) => onEomChange(row.id, 'od', e.target.value)} /></div>
              <div><label className="text-[10px] text-blue-300 block mb-1">OS (Left Eye)</label><TableInput value={row.os} onChange={(e) => onEomChange(row.id, 'os', e.target.value)} /></div>
            </div>
          ))}
        </div>
        <button onClick={onEomAdd} className="flex items-center gap-2 mt-3 text-xs text-blue-300 hover:text-white"><FaPlus className="p-1 text-lg rounded bg-blue-500/20"/> Add Ocular Movement Row</button>
      </div>

    </div>
  );
};

export default CoverTestEOMTable;