import React from 'react';
import { FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import { TableSelect, TableInput, TableSNo } from '../common/TableComponents';

const OcularTable = ({ rows, onRowChange, onAdd, onRemove }) => {
  // Define specific options
  const eyeOptions = ['OD', 'OS', 'OU'];
  const conditionOptions = [
    'Wearing glasses',
    'S/p cataract surgery',
    'Contact lens',
    'S/p LASIK',
    'RGP',
    'S/p vitreo retinal Injection',
    'Vitreoretinal disorder',
    'Blunt trauma',
    'Penetrating trauma',
    'Squint eye',
    'S/p Squint surgery',
    'Nystagmus',
    'Amblyopia',
    'S/p PI',
    'S/p Laser photocoagulation',
    'Other ocular surgery'
  ];

  return (
    <div className="p-4 mb-8 glass-panel md:p-6 rounded-2xl">
      <h2 className="flex items-center gap-2 pb-2 mb-4 text-xl font-bold border-b border-white/10">
        <FaEye className="text-blue-400" /> Ocular History
      </h2>
      
      {/* Desktop */}
      <div className="hidden overflow-x-auto md:block custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="text-xs text-blue-200 uppercase bg-blue-900/40">
            <tr>{['S.No', 'Eye', 'Condition', 'Duration', 'Recent Investigation', 'Remove'].map(h => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row, index) => (
              <tr key={row.id} className="hover:bg-white/5">
                <td className="p-2 align-top w-14"><TableSNo index={index} /></td>
                <td className="p-2 align-top">
                  <TableSelect value={row.eye} options={eyeOptions} onChange={(e) => onRowChange(row.id, 'eye', e.target.value)} />
                </td>
                <td className="p-2 align-top">
                  <TableSelect value={row.condition} options={conditionOptions} onChange={(e) => onRowChange(row.id, 'condition', e.target.value)} />
                </td>
                <td className="p-2 align-top">
                  <TableInput value={row.duration} placeholder="Duration" onChange={(e) => onRowChange(row.id, 'duration', e.target.value)} />
                </td>
                <td className="p-2 align-top">
                  <TableInput value={row.investigation} placeholder="Investigation" onChange={(e) => onRowChange(row.id, 'investigation', e.target.value)} />
                </td>
                <td className="w-20 p-2 pt-3 text-center align-top">
                  <button onClick={() => onRemove(row.id)} className="p-2 text-red-400 hover:text-white"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="space-y-4 md:hidden">
         {rows.map((row, index) => (
           <div key={row.id} className="relative p-4 pt-10 space-y-3 border bg-white/5 rounded-xl border-white/10">
             <div className="absolute top-0 left-0 px-3 py-1 text-xs font-bold text-blue-200 rounded-br-lg rounded-tl-xl bg-blue-900/50">S.No: {index + 1}</div>
             <button onClick={() => onRemove(row.id)} className="absolute p-2 text-red-400 transition-colors rounded-lg top-2 right-2 hover:text-white hover:bg-red-500/20"><FaTrash size={14}/></button>
             
             <div>
               <label className="text-[10px] text-blue-300 block mb-1">Eye</label>
               <TableSelect value={row.eye} options={eyeOptions} onChange={(e) => onRowChange(row.id, 'eye', e.target.value)} />
             </div>
             <div>
               <label className="text-[10px] text-blue-300 block mb-1">Condition</label>
               <TableSelect value={row.condition} options={conditionOptions} onChange={(e) => onRowChange(row.id, 'condition', e.target.value)} />
             </div>
             <div>
               <label className="text-[10px] text-blue-300 block mb-1">Duration</label>
               <TableInput value={row.duration} placeholder="Duration" onChange={(e) => onRowChange(row.id, 'duration', e.target.value)} />
             </div>
             <div>
               <label className="text-[10px] text-blue-300 block mb-1">Recent Investigation</label>
               <TableInput value={row.investigation} placeholder="Investigation details" onChange={(e) => onRowChange(row.id, 'investigation', e.target.value)} />
             </div>
           </div>
         ))}
      </div>
      
      <button onClick={onAdd} className="flex items-center gap-2 mt-4 text-sm text-blue-300 hover:text-white"><FaPlus className="p-1 text-lg rounded bg-blue-500/20"/> Add Ocular History</button>
    </div>
  );
};

export default OcularTable;