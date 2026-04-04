import React from 'react';
import { FaEye } from 'react-icons/fa';
import { TableInput } from '../common/TableComponents';

const LidLashConjunctivaTable = ({ data, onChange }) => {
  return (
    <div className="p-4 mb-8 space-y-8 glass-panel md:p-6 rounded-2xl">
      <div>
        <h3 className="flex items-center gap-2 pb-2 mb-3 text-lg font-bold text-blue-300 border-b border-white/10">
          <FaEye className="text-blue-400" /> Lid / Lash and Conjunctiva
        </h3>
        
        {/* Desktop View */}
        <div className="hidden overflow-x-auto md:block custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs text-blue-200 uppercase bg-blue-900/40">
              <tr>
                <th className="w-1/3 p-3">Structure</th>
                <th className="w-1/3 p-3">OD (Right Eye)</th>
                <th className="w-1/3 p-3">OS (Left Eye)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* Lids Row */}
              <tr className="hover:bg-white/5">
                <td className="p-3 font-bold tracking-wide text-white">Lids</td>
                <td className="p-2"><TableInput value={data.lidsOd} placeholder="OD Details" onChange={(e) => onChange('lidsOd', e.target.value)} /></td>
                <td className="p-2"><TableInput value={data.lidsOs} placeholder="OS Details" onChange={(e) => onChange('lidsOs', e.target.value)} /></td>
              </tr>
              {/* Lash Row */}
              <tr className="hover:bg-white/5">
                <td className="p-3 font-bold tracking-wide text-white">Lash</td>
                <td className="p-2"><TableInput value={data.lashOd} placeholder="OD Details" onChange={(e) => onChange('lashOd', e.target.value)} /></td>
                <td className="p-2"><TableInput value={data.lashOs} placeholder="OS Details" onChange={(e) => onChange('lashOs', e.target.value)} /></td>
              </tr>
              {/* Conjunctiva Row */}
              <tr className="hover:bg-white/5">
                <td className="p-3 font-bold tracking-wide text-white">Conjunctiva</td>
                <td className="p-2"><TableInput value={data.conjunctivaOd} placeholder="OD Details" onChange={(e) => onChange('conjunctivaOd', e.target.value)} /></td>
                <td className="p-2"><TableInput value={data.conjunctivaOs} placeholder="OS Details" onChange={(e) => onChange('conjunctivaOs', e.target.value)} /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="space-y-4 md:hidden">
          
          {/* Lids */}
          <div className="relative grid grid-cols-2 gap-4 p-4 border bg-white/5 border-white/10 rounded-xl">
            <div className="col-span-2 pb-2 mb-1 text-sm font-bold tracking-wide text-white border-b border-white/10">Lids</div>
            <div><label className="text-[10px] text-blue-300 block mb-1">OD (Right Eye)</label><TableInput value={data.lidsOd} onChange={(e) => onChange('lidsOd', e.target.value)} /></div>
            <div><label className="text-[10px] text-blue-300 block mb-1">OS (Left Eye)</label><TableInput value={data.lidsOs} onChange={(e) => onChange('lidsOs', e.target.value)} /></div>
          </div>

          {/* Lash */}
          <div className="relative grid grid-cols-2 gap-4 p-4 border bg-white/5 border-white/10 rounded-xl">
            <div className="col-span-2 pb-2 mb-1 text-sm font-bold tracking-wide text-white border-b border-white/10">Lash</div>
            <div><label className="text-[10px] text-blue-300 block mb-1">OD (Right Eye)</label><TableInput value={data.lashOd} onChange={(e) => onChange('lashOd', e.target.value)} /></div>
            <div><label className="text-[10px] text-blue-300 block mb-1">OS (Left Eye)</label><TableInput value={data.lashOs} onChange={(e) => onChange('lashOs', e.target.value)} /></div>
          </div>

          {/* Conjunctiva */}
          <div className="relative grid grid-cols-2 gap-4 p-4 border bg-white/5 border-white/10 rounded-xl">
            <div className="col-span-2 pb-2 mb-1 text-sm font-bold tracking-wide text-white border-b border-white/10">Conjunctiva</div>
            <div><label className="text-[10px] text-blue-300 block mb-1">OD (Right Eye)</label><TableInput value={data.conjunctivaOd} onChange={(e) => onChange('conjunctivaOd', e.target.value)} /></div>
            <div><label className="text-[10px] text-blue-300 block mb-1">OS (Left Eye)</label><TableInput value={data.conjunctivaOs} onChange={(e) => onChange('conjunctivaOs', e.target.value)} /></div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LidLashConjunctivaTable;