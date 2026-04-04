import React from 'react';
import { FaPalette, FaTint } from 'react-icons/fa';
import { TableInput } from '../common/TableComponents'; // Imported consistent input component

const ColourDryEyeTable = ({ data, onChange }) => {
  return (
    <div className="p-4 mb-8 space-y-8 glass-panel md:p-6 rounded-2xl">
      
      {/* --- COLOUR VISION SECTION --- */}
      <div>
        <h3 className="flex items-center gap-2 pb-2 mb-3 text-lg font-bold text-blue-300 border-b border-white/10">
          <FaPalette /> Colour Vision
        </h3>
        
        {/* Desktop View */}
        <div className="hidden overflow-x-auto xl:block custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs text-blue-200 uppercase bg-blue-900/40">
              <tr>
                <th className="w-40 p-3 whitespace-nowrap">Test</th>
                <th className="w-1/2 p-3 whitespace-nowrap">OD (Right Eye)</th>
                <th className="w-1/2 p-3 whitespace-nowrap">OS (Left Eye)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5">
                <td className="p-3 font-medium text-blue-100 whitespace-nowrap">With Ishihara Book</td>
                <td className="p-2"><TableInput value={data.ishiharaOd} placeholder="Enter value..." onChange={(e) => onChange('ishiharaOd', e.target.value)} /></td>
                <td className="p-2"><TableInput value={data.ishiharaOs} placeholder="Enter value..." onChange={(e) => onChange('ishiharaOs', e.target.value)} /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="space-y-3 xl:hidden">
          <div className="relative grid grid-cols-2 gap-3 p-4 pt-10 border bg-white/5 border-white/10 rounded-xl">
            <div className="absolute top-0 left-0 px-3 py-1 text-xs font-bold text-blue-200 rounded-br-lg rounded-tl-xl bg-blue-900/50">With Ishihara Book</div>
            <div>
              <label className="block mb-1 text-[10px] text-blue-300">OD (Right Eye)</label>
              <TableInput value={data.ishiharaOd} placeholder="Enter value..." onChange={(e) => onChange('ishiharaOd', e.target.value)} />
            </div>
            <div>
              <label className="block mb-1 text-[10px] text-blue-300">OS (Left Eye)</label>
              <TableInput value={data.ishiharaOs} placeholder="Enter value..." onChange={(e) => onChange('ishiharaOs', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* --- DRY EYE WORKUP SECTION --- */}
      <div>
        <h3 className="flex items-center gap-2 pb-2 mb-3 text-lg font-bold text-blue-300 border-b border-white/10">
          <FaTint /> Dry Eye Workup
        </h3>
        
        {/* Desktop View */}
        <div className="hidden overflow-x-auto xl:block custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs text-blue-200 uppercase bg-blue-900/40">
              <tr>
                <th className="w-40 p-3 whitespace-nowrap">Test</th>
                <th className="w-1/2 p-3 whitespace-nowrap">OD (Right Eye)</th>
                <th className="w-1/2 p-3 whitespace-nowrap">OS (Left Eye)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5">
                <td className="p-3 font-medium text-blue-100 whitespace-nowrap">TBUT</td>
                <td className="p-2"><TableInput value={data.tbutOd} placeholder="Enter value..." onChange={(e) => onChange('tbutOd', e.target.value)} /></td>
                <td className="p-2"><TableInput value={data.tbutOs} placeholder="Enter value..." onChange={(e) => onChange('tbutOs', e.target.value)} /></td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="p-3 font-medium text-blue-100 whitespace-nowrap">Schirmer's Test</td>
                <td className="p-2"><TableInput value={data.schirmerOd} placeholder="Enter value..." onChange={(e) => onChange('schirmerOd', e.target.value)} /></td>
                <td className="p-2"><TableInput value={data.schirmerOs} placeholder="Enter value..." onChange={(e) => onChange('schirmerOs', e.target.value)} /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="space-y-3 xl:hidden">
          {/* TBUT Box */}
          <div className="relative grid grid-cols-2 gap-3 p-4 pt-10 border bg-white/5 border-white/10 rounded-xl">
            <div className="absolute top-0 left-0 px-3 py-1 text-xs font-bold text-blue-200 rounded-br-lg rounded-tl-xl bg-blue-900/50">TBUT</div>
            <div>
              <label className="block mb-1 text-[10px] text-blue-300">OD (Right Eye)</label>
              <TableInput value={data.tbutOd} placeholder="Enter value..." onChange={(e) => onChange('tbutOd', e.target.value)} />
            </div>
            <div>
              <label className="block mb-1 text-[10px] text-blue-300">OS (Left Eye)</label>
              <TableInput value={data.tbutOs} placeholder="Enter value..." onChange={(e) => onChange('tbutOs', e.target.value)} />
            </div>
          </div>

          {/* Schirmer's Test Box */}
          <div className="relative grid grid-cols-2 gap-3 p-4 pt-10 border bg-white/5 border-white/10 rounded-xl">
            <div className="absolute top-0 left-0 px-3 py-1 text-xs font-bold text-blue-200 rounded-br-lg rounded-tl-xl bg-blue-900/50">Schirmer's Test</div>
            <div>
              <label className="block mb-1 text-[10px] text-blue-300">OD (Right Eye)</label>
              <TableInput value={data.schirmerOd} placeholder="Enter value..." onChange={(e) => onChange('schirmerOd', e.target.value)} />
            </div>
            <div>
              <label className="block mb-1 text-[10px] text-blue-300">OS (Left Eye)</label>
              <TableInput value={data.schirmerOs} placeholder="Enter value..." onChange={(e) => onChange('schirmerOs', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ColourDryEyeTable;