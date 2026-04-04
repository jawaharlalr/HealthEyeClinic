import React from 'react';
import { FaEye } from 'react-icons/fa';
import { TableSelect } from '../common/TableComponents';

const CorneaACTable = ({ data, onChange }) => {
  // Define Options
  const scleraOptions = ['Normal', 'Congestion', 'Scleritis', 'Episcleritis', 'Pterygium', 'Pinguecula'];
  const corneaOptions = ['Normal', 'Clear', 'Vascularised', 'Keratoconus', 'Corneal dystrophy', 'Scar', 'Arcus', 'Corneal edema'];
  const acDepthOptions = ['Normal', 'Shallow', 'Deep'];
  const vonHerickOptions = ['I', 'II', 'III', 'IV']; // No 'Normal' default here
  const tmPigmentOptions = ['Nil', '+', '++'];

  return (
    <div className="p-4 mb-8 space-y-8 glass-panel md:p-6 rounded-2xl">
      <div>
        <h3 className="flex items-center gap-2 pb-2 mb-3 text-lg font-bold text-blue-300 border-b border-white/10">
          <FaEye className="text-blue-400" /> Cornea / Anterior Chamber
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
              
              {/* Sclera */}
              <tr className="hover:bg-white/5">
                <td className="p-3 font-bold tracking-wide text-white">Sclera</td>
                <td className="p-2">
                  <TableSelect value={data.scleraOd} options={scleraOptions} onChange={(e) => onChange('scleraOd', e.target.value)} />
                </td>
                <td className="p-2">
                  <TableSelect value={data.scleraOs} options={scleraOptions} onChange={(e) => onChange('scleraOs', e.target.value)} />
                </td>
              </tr>

              {/* Cornea */}
              <tr className="hover:bg-white/5">
                <td className="p-3 font-bold tracking-wide text-white">Cornea</td>
                <td className="p-2">
                  <TableSelect value={data.corneaOd} options={corneaOptions} onChange={(e) => onChange('corneaOd', e.target.value)} />
                </td>
                <td className="p-2">
                  <TableSelect value={data.corneaOs} options={corneaOptions} onChange={(e) => onChange('corneaOs', e.target.value)} />
                </td>
              </tr>

              {/* AC Depth */}
              <tr className="hover:bg-white/5">
                <td className="p-3 font-bold tracking-wide text-white">AC Depth</td>
                <td className="p-2">
                  <TableSelect value={data.acDepthOd} options={acDepthOptions} onChange={(e) => onChange('acDepthOd', e.target.value)} />
                </td>
                <td className="p-2">
                  <TableSelect value={data.acDepthOs} options={acDepthOptions} onChange={(e) => onChange('acDepthOs', e.target.value)} />
                </td>
              </tr>

              {/* Von Herick's Grading */}
              <tr className="hover:bg-white/5">
                <td className="p-3 font-bold tracking-wide text-white">Von Herick's Grading</td>
                <td className="p-2">
                  <TableSelect value={data.vonHerickOd} options={vonHerickOptions} onChange={(e) => onChange('vonHerickOd', e.target.value)} />
                </td>
                <td className="p-2">
                  <TableSelect value={data.vonHerickOs} options={vonHerickOptions} onChange={(e) => onChange('vonHerickOs', e.target.value)} />
                </td>
              </tr>

              {/* TM Pigmentation */}
              <tr className="hover:bg-white/5">
                <td className="p-3 font-bold tracking-wide text-white">TM Pigmentation</td>
                <td className="p-2">
                  <TableSelect value={data.tmPigmentOd} options={tmPigmentOptions} onChange={(e) => onChange('tmPigmentOd', e.target.value)} />
                </td>
                <td className="p-2">
                  <TableSelect value={data.tmPigmentOs} options={tmPigmentOptions} onChange={(e) => onChange('tmPigmentOs', e.target.value)} />
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="space-y-4 md:hidden">
          {[
            { label: 'Sclera', dropOd: 'scleraOd', dropOs: 'scleraOs', opts: scleraOptions },
            { label: 'Cornea', dropOd: 'corneaOd', dropOs: 'corneaOs', opts: corneaOptions },
            { label: 'AC Depth', dropOd: 'acDepthOd', dropOs: 'acDepthOs', opts: acDepthOptions },
            { label: "Von Herick's", dropOd: 'vonHerickOd', dropOs: 'vonHerickOs', opts: vonHerickOptions },
            { label: 'TM Pigmentation', dropOd: 'tmPigmentOd', dropOs: 'tmPigmentOs', opts: tmPigmentOptions },
          ].map((item, idx) => (
            <div key={idx} className="relative p-4 border bg-white/5 border-white/10 rounded-xl">
              <div className="pb-2 mb-3 text-sm font-bold tracking-wide text-white border-b border-white/10">{item.label}</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-blue-300 block mb-1">OD (Right Eye)</label>
                  <TableSelect value={data[item.dropOd]} options={item.opts} onChange={(e) => onChange(item.dropOd, e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] text-blue-300 block mb-1">OS (Left Eye)</label>
                  <TableSelect value={data[item.dropOs]} options={item.opts} onChange={(e) => onChange(item.dropOs, e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CorneaACTable;