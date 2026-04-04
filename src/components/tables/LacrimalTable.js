import React from 'react';
import { FaTint } from 'react-icons/fa';
import { TableSelect } from '../common/TableComponents';

const LacrimalTable = ({ lacrimal, onLacrimalChange }) => {
  // Pre-defined options for Positive/Negative
  const options = ['Positive', 'Negative'];

  return (
    <div className="p-4 mb-8 space-y-8 glass-panel md:p-6 rounded-2xl">
      <div>
        <h3 className="flex items-center gap-2 pb-2 mb-3 text-lg font-bold text-blue-300 border-b border-white/10">
          <FaTint className="text-blue-400" /> Lacrimal Workup
        </h3>
        
        {/* Desktop View */}
        <div className="hidden overflow-x-auto md:block custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs text-blue-200 uppercase bg-blue-900/40">
              <tr>
                <th className="w-1/3 p-3">Test Name</th>
                <th className="w-1/3 p-3">OD (Right Eye)</th>
                <th className="w-1/3 p-3">OS (Left Eye)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5">
                {/* Non-editable text for ROPLAS */}
                <td className="p-3 font-bold tracking-wide text-white">ROPLAS</td>
                <td className="p-2">
                  <TableSelect 
                    value={lacrimal.roplasOd} 
                    options={options} 
                    onChange={(e) => onLacrimalChange('roplasOd', e.target.value)} 
                  />
                </td>
                <td className="p-2">
                  <TableSelect 
                    value={lacrimal.roplasOs} 
                    options={options} 
                    onChange={(e) => onLacrimalChange('roplasOs', e.target.value)} 
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          <div className="relative grid grid-cols-2 gap-4 p-4 border bg-white/5 border-white/10 rounded-xl">
            {/* Non-editable text for ROPLAS */}
            <div className="col-span-2 pb-2 mb-1 text-sm font-bold tracking-wide text-white border-b border-white/10">
              ROPLAS
            </div>
            
            <div>
              <label className="text-[10px] text-blue-300 block mb-1">OD (Right Eye)</label>
              <TableSelect 
                value={lacrimal.roplasOd} 
                options={options} 
                onChange={(e) => onLacrimalChange('roplasOd', e.target.value)} 
              />
            </div>
            <div>
              <label className="text-[10px] text-blue-300 block mb-1">OS (Left Eye)</label>
              <TableSelect 
                value={lacrimal.roplasOs} 
                options={options} 
                onChange={(e) => onLacrimalChange('roplasOs', e.target.value)} 
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LacrimalTable;