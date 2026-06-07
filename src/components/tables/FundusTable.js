import React from 'react';
import { FaEye } from 'react-icons/fa';
import { TableSelect } from '../common/TableComponents';

const FundusTable = ({ data = {}, onChange }) => {
  // --- Dropdown Options ---
  const retinaOptions = ['Normal', 'Hemorrhage', 'Cotton wool spots'];
  const maculaOptions = ['Normal', 'Edema', 'Macular hole', 'Epiretinal membrane'];
  const discOptions = ['Normal', 'Glaucomatous', 'Abnormal'];

  // Configuration for the static rows
  const structureRows = [
    { label: 'Retina', keyOd: 'retinaOd', keyOs: 'retinaOs', options: retinaOptions },
    { label: 'Macula', keyOd: 'maculaOd', keyOs: 'maculaOs', options: maculaOptions },
    { label: 'Disc', keyOd: 'discOd', keyOs: 'discOs', options: discOptions },
  ];

  return (
    <div className="p-4 mb-8 space-y-8 glass-panel md:p-6 rounded-2xl">
      <div>
        <h3 className="flex items-center gap-2 pb-2 mb-3 text-lg font-black tracking-widest text-blue-300 uppercase border-b border-white/10">
          <FaEye /> Fundus Examination
        </h3>

        {/* Desktop Interface */}
        <div className="hidden overflow-x-auto md:block custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs text-blue-200 uppercase bg-blue-900/40">
              <tr>
                <th className="p-3 font-black tracking-wider text-[10px] uppercase w-1/3">Structure</th>
                <th className="p-3 font-black tracking-wider text-[10px] uppercase w-1/3">Right Eye (OD)</th>
                <th className="p-3 font-black tracking-wider text-[10px] uppercase w-1/3">Left Eye (OS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {structureRows.map((row, idx) => (
                <tr key={idx} className="transition-colors hover:bg-white/5">
                  <td className="p-3 text-xs font-bold tracking-widest text-blue-100 uppercase whitespace-nowrap">
                    {row.label}
                  </td>
                  <td className="p-2">
                    <TableSelect 
                      value={data[row.keyOd] || 'Normal'} 
                      options={row.options} 
                      onChange={(e) => onChange(row.keyOd, e.target.value)} 
                    />
                  </td>
                  <td className="p-2">
                    <TableSelect 
                      value={data[row.keyOs] || 'Normal'} 
                      options={row.options} 
                      onChange={(e) => onChange(row.keyOs, e.target.value)} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Interface */}
        <div className="space-y-4 md:hidden">
          {structureRows.map((row, idx) => (
            <div key={idx} className="p-5 space-y-4 border bg-white/5 border-white/10 rounded-2xl">
              <h4 className="pb-2 text-xs font-black tracking-widest text-blue-200 uppercase border-b border-white/10">
                {row.label}
              </h4>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-300 block mb-1">Right Eye (OD)</label>
                <TableSelect 
                  value={data[row.keyOd] || 'Normal'} 
                  options={row.options} 
                  onChange={(e) => onChange(row.keyOd, e.target.value)} 
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-300 block mb-1">Left Eye (OS)</label>
                <TableSelect 
                  value={data[row.keyOs] || 'Normal'} 
                  options={row.options} 
                  onChange={(e) => onChange(row.keyOs, e.target.value)} 
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FundusTable;