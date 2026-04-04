import React from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { TableSelect, TableInput, TableSNo } from '../common/TableComponents';

const GeneralTable = ({ rows, onRowChange, onAdd, onRemove }) => {
  // Define standard options
  const eyeOptions = ['OD', 'OS', 'OU'];
  const complaintOptions = [
    'Blurred vision', 'Decreased vision', 'Difficulty in reading for near', 
    'Headache', 'Watering', 'Itching', 'Light sensitivity', 'Irritation', 
    'Pain', 'Redness', 'Black spots', 'Swelling of lids', 'Nystagmus', 
    'Chemical injury', 'Head injury'
  ];
  const unitOptions = ['Hours', 'Days', 'Weeks', 'Months', 'Years'];

  return (
    <div className="p-4 mb-8 glass-panel md:p-6 rounded-2xl">
      <h2 className="pb-2 mb-4 text-xl font-bold border-b border-white/10">General Data</h2>
      
      {/* Desktop */}
      <div className="hidden overflow-x-auto xl:block custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="text-xs text-blue-200 uppercase bg-blue-900/40">
            <tr>
              {['S.No', 'Eye', 'Chief Complaint', 'Duration', 'Unit', 'Association Symptoms', 'Remarks', 'Remove'].map(h => (
                <th key={h} className="p-3 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row, index) => (
              <tr key={row.id} className="hover:bg-white/5">
                <td className="p-2 align-top"><TableSNo index={index} /></td>
                <td className="p-2 align-top">
                  <TableSelect value={row.eye} options={eyeOptions} onChange={(e) => onRowChange(row.id, 'eye', e.target.value)} />
                </td>
                <td className="p-2 align-top">
                  <TableSelect value={row.complaint} options={complaintOptions} onChange={(e) => onRowChange(row.id, 'complaint', e.target.value)} />
                </td>
                <td className="p-2 align-top">
                  <TableInput value={row.duration} placeholder="Duration" onChange={(e) => onRowChange(row.id, 'duration', e.target.value)} />
                </td>
                <td className="p-2 align-top">
                  <TableSelect value={row.unit} options={unitOptions} onChange={(e) => onRowChange(row.id, 'unit', e.target.value)} />
                </td>
                <td className="p-2 align-top">
                  <TableInput value={row.association} placeholder="Symptoms" onChange={(e) => onRowChange(row.id, 'association', e.target.value)} />
                </td>
                <td className="p-2 align-top">
                  <TableInput value={row.remarks} placeholder="Remarks" onChange={(e) => onRowChange(row.id, 'remarks', e.target.value)} />
                </td>
                <td className="p-2 pt-3 text-center align-top">
                  <button onClick={() => onRemove(row.id)} className="p-2 text-red-400 hover:text-white"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="space-y-3 xl:hidden">
         {rows.map((row, index) => (
           <div key={row.id} className="relative grid grid-cols-2 gap-3 p-4 pt-10 border bg-white/5 border-white/10 rounded-xl">
             <div className="absolute top-0 left-0 px-3 py-1 text-xs font-bold text-blue-200 rounded-br-lg rounded-tl-xl bg-blue-900/50">S.No: {index + 1}</div>
             <button onClick={() => onRemove(row.id)} className="absolute p-2 text-red-400 transition-colors rounded-lg top-2 right-2 hover:text-white hover:bg-red-500/20"><FaTrash size={14}/></button>
             
             <div>
               <label className="text-[10px] text-blue-300 block mb-1">Eye</label>
               <TableSelect value={row.eye} options={eyeOptions} onChange={(e) => onRowChange(row.id, 'eye', e.target.value)} />
             </div>
             <div>
               <label className="text-[10px] text-blue-300 block mb-1">Duration</label>
               <TableInput value={row.duration} placeholder="Number" onChange={(e) => onRowChange(row.id, 'duration', e.target.value)} />
             </div>
             <div className="col-span-2">
               <label className="text-[10px] text-blue-300 block mb-1">Chief Complaint</label>
               <TableSelect value={row.complaint} options={complaintOptions} onChange={(e) => onRowChange(row.id, 'complaint', e.target.value)} />
             </div>
             <div>
               <label className="text-[10px] text-blue-300 block mb-1">Unit</label>
               <TableSelect value={row.unit} options={unitOptions} onChange={(e) => onRowChange(row.id, 'unit', e.target.value)} />
             </div>
             <div className="col-span-2">
               <label className="text-[10px] text-blue-300 block mb-1">Association Symptoms</label>
               <TableInput value={row.association} placeholder="Symptoms" onChange={(e) => onRowChange(row.id, 'association', e.target.value)} />
             </div>
             <div className="col-span-2">
               <label className="text-[10px] text-blue-300 block mb-1">Remarks</label>
               <TableInput value={row.remarks} placeholder="Remarks" onChange={(e) => onRowChange(row.id, 'remarks', e.target.value)} />
             </div>
           </div>
         ))}
      </div>
      
      <button onClick={onAdd} className="flex items-center gap-2 mt-3 text-xs text-blue-300 hover:text-white"><FaPlus className="p-1 text-lg rounded bg-blue-500/20"/> Add General Row</button>
    </div>
  );
};

export default GeneralTable;