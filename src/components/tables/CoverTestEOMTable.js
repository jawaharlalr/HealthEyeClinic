import React from 'react';
import { FaTrash, FaPlus, FaArrowsAlt } from 'react-icons/fa';
import { TableInput, TableSelect, TableSNo } from '../common/TableComponents';

const CoverTestEOMTable = ({
  ctRows = [], 
  onCtChange, 
  onCtAdd, 
  onCtRemove,
  eomRows = [], 
  onEomChange, 
  onEomAdd, 
  onEomRemove
}) => {

  const eomOptions = ['Full & Free', 'Nil (Specify)'];
  const isCustom = (val) => val !== '' && val !== 'Full & Free';

  const renderEomCell = (rowId, field, value) => {
    if (isCustom(value)) {
      return (
        <div className="flex gap-2">
          <TableInput value={value} placeholder="Specify limitation..." onChange={(e) => onEomChange(rowId, field, e.target.value)} />
          <button className="text-[10px] text-blue-400 hover:text-white px-2" onClick={() => onEomChange(rowId, field, 'Full & Free')}>Reset</button>
        </div>
      );
    }
    return (
      <TableSelect value={value} options={eomOptions} onChange={(e) => {
          const selected = e.target.value;
          onEomChange(rowId, field, selected === 'Nil (Specify)' ? ' ' : selected);
        }} 
      />
    );
  };

  return (
    <div className="p-4 mb-8 space-y-8 glass-panel md:p-6 rounded-2xl">
      <h2 className="flex items-center gap-2 pb-2 mb-2 text-xl font-bold border-b border-white/10">
        <FaArrowsAlt className="text-blue-400"/> Cover Test / EOM
      </h2>

      {/* --- SUB-TABLE: HIRSCHBERG --- */}
      <div>
        <h3 className="mb-3 text-sm font-black tracking-widest text-blue-300 uppercase">Hirschberg Test</h3>
        <div className="overflow-x-auto md:block custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs text-blue-200 uppercase bg-blue-900/40">
              <tr>{['S.No', 'Hirschberg Details', 'Remove'].map(h => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ctRows.map((row, idx) => (
                <tr key={row.id} className="hover:bg-white/5">
                  <td className="p-2"><TableSNo index={idx} /></td>
                  <td className="p-2"><TableInput value={row.hirschberg} onChange={(e) => onCtChange(row.id, 'hirschberg', e.target.value)} /></td>
                  <td className="p-2 text-center"><button onClick={() => onCtRemove(row.id)} className="text-red-400"><FaTrash /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={onCtAdd} className="flex items-center gap-2 mt-3 text-xs text-blue-300 hover:text-white"><FaPlus className="p-1 rounded bg-blue-500/20"/> Add Hirschberg Row</button>
      </div>

      {/* --- SUB-TABLE: COVER TEST --- */}
      <div>
        <h3 className="mb-3 text-sm font-black tracking-widest text-blue-300 uppercase">Cover Test</h3>
        <div className="overflow-x-auto md:block custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs text-blue-200 uppercase bg-blue-900/40">
              <tr>{['S.No', 'Cover Test Distance', 'Cover Test Near', 'Remove'].map(h => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ctRows.map((row, idx) => (
                <tr key={row.id} className="hover:bg-white/5">
                  <td className="p-2"><TableSNo index={idx} /></td>
                  <td className="p-2"><TableInput value={row.ctDistance} onChange={(e) => onCtChange(row.id, 'ctDistance', e.target.value)} /></td>
                  <td className="p-2"><TableInput value={row.ctNear} onChange={(e) => onCtChange(row.id, 'ctNear', e.target.value)} /></td>
                  <td className="p-2 text-center"><button onClick={() => onCtRemove(row.id)} className="text-red-400"><FaTrash /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <hr className="border-white/5" />

      {/* --- OCULAR MOVEMENT --- */}
      <div>
        <h3 className="mb-3 text-sm font-black tracking-widest text-blue-300 uppercase">Ocular Movement</h3>
        <div className="overflow-x-auto md:block custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs text-blue-200 uppercase bg-blue-900/40">
              <tr>{['S.No', 'OD (Right Eye)', 'OS (Left Eye)', 'Remove'].map(h => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {eomRows.map((row, idx) => (
                <tr key={row.id} className="hover:bg-white/5">
                  <td className="p-2"><TableSNo index={idx} /></td>
                  <td className="p-2">{renderEomCell(row.id, 'od', row.od)}</td>
                  <td className="p-2">{renderEomCell(row.id, 'os', row.os)}</td>
                  <td className="p-2 text-center"><button onClick={() => onEomRemove(row.id)} className="text-red-400"><FaTrash /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={onEomAdd} className="flex items-center gap-2 mt-3 text-xs text-blue-300 hover:text-white"><FaPlus className="p-1 rounded bg-blue-500/20"/> Add Ocular Movement Row</button>
      </div>
    </div>
  );
};

export default CoverTestEOMTable;