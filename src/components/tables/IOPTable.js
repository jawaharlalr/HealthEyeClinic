import React from 'react';
import { FaTachometerAlt } from 'react-icons/fa';
import { TableInput } from '../common/TableComponents';

const IOPTable = ({ data, onChange }) => {
  return (
    <div className="p-4 mb-8 space-y-8 glass-panel md:p-6 rounded-2xl">
      <div>
        <h3 className="flex items-center gap-2 pb-2 mb-3 text-lg font-bold text-blue-300 border-b border-white/10">
          <FaTachometerAlt /> Intraocular Pressure (IOP)
        </h3>
        
        {/* Desktop View */}
        <div className="hidden overflow-x-auto xl:block custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs text-blue-200 uppercase bg-blue-900/40">
              <tr>
                <th className="w-40 p-3 whitespace-nowrap">Test</th>
                <th className="w-1/3 p-3 whitespace-nowrap">OD (Right Eye) <span className="text-[10px] normal-case tracking-normal">(mmHg)</span></th>
                <th className="w-1/3 p-3 whitespace-nowrap">OS (Left Eye) <span className="text-[10px] normal-case tracking-normal">(mmHg)</span></th>
                <th className="w-1/3 p-3 whitespace-nowrap">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5">
                <td className="p-3 font-medium text-blue-100 whitespace-nowrap">Applanation Tonometry</td>
                <td className="p-2">
                  <TableInput value={data.iopOd} placeholder="Value" onChange={(e) => onChange('iopOd', e.target.value)} />
                </td>
                <td className="p-2">
                  <TableInput value={data.iopOs} placeholder="Value" onChange={(e) => onChange('iopOs', e.target.value)} />
                </td>
                <td className="p-2">
                  <TableInput type="time" value={data.iopTime} placeholder="Time" onChange={(e) => onChange('iopTime', e.target.value)} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="space-y-3 xl:hidden">
          <div className="relative grid grid-cols-2 gap-3 p-4 pt-10 border bg-white/5 border-white/10 rounded-xl">
            <div className="absolute top-0 left-0 px-3 py-1 text-xs font-bold text-blue-200 rounded-br-lg rounded-tl-xl bg-blue-900/50">
              Applanation Tonometry
            </div>
            
            <div>
              <label className="block mb-1 text-[10px] text-blue-300">OD (Right Eye) <span className="lowercase">(mmHg)</span></label>
              <TableInput value={data.iopOd} placeholder="Value" onChange={(e) => onChange('iopOd', e.target.value)} />
            </div>
            <div>
              <label className="block mb-1 text-[10px] text-blue-300">OS (Left Eye) <span className="lowercase">(mmHg)</span></label>
              <TableInput value={data.iopOs} placeholder="Value" onChange={(e) => onChange('iopOs', e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="block mb-1 text-[10px] text-blue-300">Time</label>
              <TableInput type="time" value={data.iopTime} placeholder="Time" onChange={(e) => onChange('iopTime', e.target.value)} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default IOPTable;