import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Dashboard from './pages/Dashboard';
import AddPatient from './pages/AddPatient';
import ManagePatient from './pages/ManagePatient';
import Settings from './pages/Settings';
import AddBill from './pages/AddBill';
import ManageBill from './pages/ManageBill';

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen overflow-hidden bg-medical-secondary">
        <ToastContainer theme="dark" position="bottom-right" />

        <Navbar />

        <main className="flex flex-col flex-1 overflow-y-auto">
          <div className="flex-1 p-6 md:p-10 w-full max-w-[1600px] mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patients/add" element={<AddPatient />} />
              <Route path="/patients" element={<ManagePatient />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/billing/new" element={<AddBill />} />
              <Route path="/billing" element={<ManageBill />} />

              <Route path="*" element={
                <div className="flex items-center justify-center h-96 text-slate-500">
                  <h2 className="text-xl font-bold tracking-widest uppercase">404 | Page Not Found</h2>
                </div>
              } />
            </Routes>
          </div>

          <Footer />
        </main>
      </div>
    </Router>
  );
}

export default App;