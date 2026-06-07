import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MdKeyboardArrowDown, 
  MdHome, 
  MdPeople, 
  MdReceipt,
  MdDescription 
} from 'react-icons/md';

const Navbar = () => {
  return (
    <nav className="z-50 flex items-center justify-between w-full h-16 px-12 border-b bg-white/5 backdrop-blur-lg border-medical-glassBorder">
      
      {/* Left: Branding (Text Only) */}
      <div className="flex items-center min-w-max">
        <h1 className="text-xl font-bold tracking-tight text-white">
          Healthy Eye <span className="text-medical-primary">Clinic</span>
        </h1>
      </div>

      {/* Center: Navigation Links (Absolute Centering) */}
      <div className="absolute flex items-center gap-4 transform -translate-x-1/2 left-1/2">
        
        {/* Home */}
        <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 transition rounded-xl text-slate-300 hover:bg-white/10 hover:text-white">
          <MdHome size={20} />
          <span className="text-sm font-semibold tracking-wide">Home</span>
        </Link>

        {/* Patients Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2 transition rounded-xl text-slate-300 group-hover:bg-white/10 group-hover:text-white">
            <MdPeople size={20} />
            <span className="text-sm font-semibold tracking-wide">Patients</span>
            <MdKeyboardArrowDown className="transition-transform group-hover:rotate-180" />
          </button>
          
          {/* Dropdown - Pushed down with pt-5 to align with shorter navbar */}
          <div className="absolute left-0 z-50 invisible w-48 pt-5 transition-all duration-300 opacity-0 top-full group-hover:visible group-hover:opacity-100">
            <div className="p-1.5 border shadow-2xl glass-panel bg-slate-900/95 border-medical-glassBorder backdrop-blur-xl rounded-2xl">
              <Link to="/patients/add" className="block px-4 py-2.5 text-xs font-medium transition-colors rounded-lg text-slate-300 hover:bg-medical-primary/20 hover:text-white">Add Patient</Link>
              <div className="h-[1px] bg-white/5 my-1 mx-2"></div>
              <Link to="/patients" className="block px-4 py-2.5 text-xs font-medium transition-colors rounded-lg text-slate-300 hover:bg-medical-primary/20 hover:text-white">Manage Patients</Link>
            </div>
          </div>
        </div>

        {/* Billing Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2 transition rounded-xl text-slate-300 group-hover:bg-white/10 group-hover:text-white">
            <MdReceipt size={20} />
            <span className="text-sm font-semibold tracking-wide">Bill</span>
            <MdKeyboardArrowDown className="transition-transform group-hover:rotate-180" />
          </button>
          
          <div className="absolute left-0 z-50 invisible w-48 pt-5 transition-all duration-300 opacity-0 top-full group-hover:visible group-hover:opacity-100">
            <div className="p-1.5 border shadow-2xl glass-panel bg-slate-900/95 border-medical-glassBorder backdrop-blur-xl rounded-2xl">
              <Link to="/billing/new" className="block px-4 py-2.5 text-xs font-medium transition-colors rounded-lg text-slate-300 hover:bg-medical-primary/20 hover:text-white">Add Bill</Link>
              <div className="h-[1px] bg-white/5 my-1 mx-2"></div>
              <Link to="/billing" className="block px-4 py-2.5 text-xs font-medium transition-colors rounded-lg text-slate-300 hover:bg-medical-primary/20 hover:text-white">Manage Bills</Link>
            </div>
          </div>
        </div>

        {/* Invoices Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2 transition rounded-xl text-slate-300 group-hover:bg-white/10 group-hover:text-white">
            <MdDescription size={20} />
            <span className="text-sm font-semibold tracking-wide">Invoices</span>
            <MdKeyboardArrowDown className="transition-transform group-hover:rotate-180" />
          </button>
          
          <div className="absolute left-0 z-50 invisible w-48 pt-5 transition-all duration-300 opacity-0 top-full group-hover:visible group-hover:opacity-100">
            <div className="p-1.5 border shadow-2xl glass-panel bg-slate-900/95 border-medical-glassBorder backdrop-blur-xl rounded-2xl">
              <Link to="/invoices/new" className="block px-4 py-2.5 text-xs font-medium transition-colors rounded-lg text-slate-300 hover:bg-medical-primary/20 hover:text-white">New</Link>
              <div className="h-[1px] bg-white/5 my-1 mx-2"></div>
              <Link to="/invoices" className="block px-4 py-2.5 text-xs font-medium transition-colors rounded-lg text-slate-300 hover:bg-medical-primary/20 hover:text-white">Manage</Link>
            </div>
          </div>
        </div>

      </div>

      {/* Right: Empty Placeholder to maintain flex-between balance */}
      <div className="flex items-center min-w-max">
        {/* Intentionally left blank */}
      </div>
      
    </nav>
  );
};

export default Navbar;