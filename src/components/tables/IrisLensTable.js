import React from 'react';
import { FaEye } from 'react-icons/fa';

const IrisLensTable = ({ data, onChange }) => {
  const irisOptions = [
    'Normal',
    'PI-patent',
    'Coloboma',
    'Aniridia',
    'PPM',
    'Atrophy',
    'Nodules',
    'Heterochromia',
    'Peripheral iridotomy',
    'Peripheral iridectomy'
  ];

  const lensOptions = [
    'Clear',
    'Mild cataract',
    'Moderate cataract',
    'Severe cataract',
    'IOL',
    'PCO',
    'PSC opacities',
    'Dislocated',
    'Aphakia',
    'Lenticonus',
    'Microspherophakia'
  ];

  const CellInput = ({ valueSelect, nameSelect, options, onChange }) => (
    <div className="p-2">
      <select
        value={valueSelect}
        onChange={(e) => onChange(nameSelect, e.target.value)}
        className="w-full p-2 text-sm text-white transition-colors border rounded-lg outline-none bg-black/20 border-white/10 focus:border-blue-400"
      >
        {options.map(opt => (
          <option key={opt} value={opt} className="text-white bg-slate-800">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="p-6 mb-8 glass-panel rounded-2xl">
      <h2 className="flex items-center gap-2 pb-2 mb-4 text-xl font-bold text-white border-b border-white/10">
        <FaEye className="text-blue-400" /> Iris / Lens
      </h2>
      
      <div className="overflow-x-auto border bg-white/5 rounded-xl border-white/10">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="text-sm text-blue-200 bg-black/20">
            <tr>
              <th className="w-40 p-4 font-semibold border-r border-white/5">Structure</th>
              <th className="w-1/2 p-4 font-semibold border-r border-white/5">OD (Right Eye)</th>
              <th className="w-1/2 p-4 font-semibold">OS (Left Eye)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white/90">
            
            {/* --- IRIS ROW --- */}
            <tr className="transition-colors hover:bg-white/5">
              <td className="p-4 font-medium text-blue-100 border-r border-white/5">Iris</td>
              <td className="p-2 border-r border-white/5">
                <CellInput 
                  valueSelect={data.irisOd} nameSelect="irisOd" 
                  options={irisOptions} onChange={onChange} 
                />
              </td>
              <td className="p-2">
                <CellInput 
                  valueSelect={data.irisOs} nameSelect="irisOs" 
                  options={irisOptions} onChange={onChange} 
                />
              </td>
            </tr>

            {/* --- LENS ROW --- */}
            <tr className="transition-colors hover:bg-white/5">
              <td className="p-4 font-medium text-blue-100 border-r border-white/5">Lens</td>
              <td className="p-2 border-r border-white/5">
                <CellInput 
                  valueSelect={data.lensOd} nameSelect="lensOd" 
                  options={lensOptions} onChange={onChange} 
                />
              </td>
              <td className="p-2">
                <CellInput 
                  valueSelect={data.lensOs} nameSelect="lensOs" 
                  options={lensOptions} onChange={onChange} 
                />
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IrisLensTable;