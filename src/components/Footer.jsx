import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 mt-auto border-t border-medical-glassBorder bg-black/10 backdrop-blur-md">
      <div className="flex items-center justify-center">
        <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.3em]">
          &copy; {currentYear} Healthy Eye Clinic <span className="mx-3 text-slate-800">|</span> All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;