import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaFileInvoiceDollar,
  FaNotesMedical,
  FaUsersCog,
  FaCalendarCheck,
  FaHistory,
  FaArrowRight,
} from "react-icons/fa";

// --- Reusable UI Sub-Components ---

const StatCard = ({ title, value, subtext, icon, colorClass }) => (
  <div className="relative flex flex-col justify-between h-40 p-6 overflow-hidden transition-all duration-500 cursor-default glass-panel rounded-3xl hover:bg-white/10 group border-white/5">
    <div
      className={`absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity text-9xl ${colorClass}`}
    >
      {icon}
    </div>
    <div className="relative z-10">
      <h3 className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
        {title}
      </h3>
      <div className="mt-2 text-4xl font-black tracking-tighter text-white">
        {value}
      </div>
    </div>
    {subtext && (
      <div className="relative z-10 px-3 py-1 text-[10px] font-bold text-blue-300 rounded-full bg-blue-500/10 w-fit backdrop-blur-md border border-blue-500/20">
        {subtext}
      </div>
    )}
  </div>
);

const QuickAction = ({ label, icon, color, onClick }) => (
  <div
    onClick={onClick}
    className="glass-panel p-5 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white/10 hover:translate-y-[-4px] transition-all group border-white/5"
  >
    <div className="flex items-center gap-4">
      <div
        className={`p-3 rounded-xl ${color} text-white shadow-lg group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <span className="text-sm font-black tracking-widest uppercase text-slate-200 group-hover:text-white">
        {label}
      </span>
    </div>
    <FaArrowRight
      className="transition-colors text-slate-600 group-hover:text-white"
      size={12}
    />
  </div>
);

const ActivityRow = ({ type, title, subtitle, time }) => {
  const isPatient = type === "patient";
  return (
    <div className="flex items-center justify-between p-4 transition-all border border-transparent hover:bg-white/5 rounded-2xl group hover:border-white/5">
      <div className="flex items-center min-w-0 gap-4">
        <div
          className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center transition-all ${
            isPatient
              ? "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white"
              : "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white"
          }`}
        >
          {isPatient ? <FaUserPlus size={14} /> : <FaCalendarCheck size={14} />}
        </div>
        <div className="truncate">
          <p className="text-sm font-bold text-white truncate transition-colors group-hover:text-blue-400">
            {title}
          </p>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter opacity-70">
            {subtitle}
          </p>
        </div>
      </div>
      <span className="flex-shrink-0 ml-4 text-[9px] text-slate-400 font-mono font-bold bg-white/5 px-2 py-1 rounded-md">
        {time}
      </span>
    </div>
  );
};

// --- Main Dashboard ---

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalBills: 0,
    revenue: 0,
  });
  const [recentPatients, setRecentPatients] = useState([]);
  const [recentBills, setRecentBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate();
    const now = new Date();
    if (date.toLocaleDateString() === now.toLocaleDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  };

  useEffect(() => {
    // 1. Live Stats Listeners
    const unsubPCount = onSnapshot(collection(db, "patients"), (snap) => {
      setStats((prev) => ({ ...prev, totalPatients: snap.size }));
    });

    const unsubBCount = onSnapshot(collection(db, "bills"), (snap) => {
      let totalRev = 0;
      snap.docs.forEach(
        (doc) => (totalRev += Number(doc.data().totalAmount || 0)),
      );
      setStats((prev) => ({
        ...prev,
        totalBills: snap.size,
        revenue: totalRev,
      }));
    });

    // 2. Recent Activity Listeners
    const qPatients = query(
      collection(db, "patients"),
      orderBy("createdAt", "desc"),
      limit(6),
    );
    const unsubRecentP = onSnapshot(qPatients, (snap) => {
      setRecentPatients(
        snap.docs.map((d) => ({
          id: d.id,
          name: d.data().name,
          mr: d.data().mrNo,
          time: formatTime(d.data().createdAt),
        })),
      );
      setLoading(false);
    });

    const qBills = query(
      collection(db, "bills"),
      orderBy("createdAt", "desc"),
      limit(6),
    );
    const unsubRecentB = onSnapshot(qBills, (snap) => {
      setRecentBills(
        snap.docs.map((d) => ({
          id: d.id,
          name: d.data().patientName || d.data().patient?.name || "Unknown",
          purpose: d.data().purposeOfVisit || "Checkup",
          time: formatTime(d.data().createdAt),
        })),
      );
    });

    return () => {
      unsubPCount();
      unsubBCount();
      unsubRecentP();
      unsubRecentB();
    };
  }, []);

  return (
    <div className="w-full h-full p-4 overflow-y-auto text-white md:p-10 custom-scrollbar">
      {/* Clinic Identity Header */}
      <header className="flex flex-col gap-6 mb-12 duration-700 md:flex-row md:justify-between md:items-center animate-in fade-in slide-in-from-top-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase">
            Terminal Dashboard
          </h2>
          <p className="text-sm font-bold tracking-[0.4em] text-blue-400 uppercase opacity-70">
            Healthy Eye Clinic • Nandhini K
          </p>
        </div>

        <div className="flex items-center gap-4 p-3 pr-6 border rounded-3xl glass-panel border-white/5 bg-white/2">
          <div className="relative">
            <div className="flex items-center justify-center w-12 h-12 text-sm font-black text-white bg-blue-600 shadow-lg rounded-2xl">
              NK
            </div>
            <span className="absolute w-4 h-4 border-2 rounded-full -bottom-1 -right-1 bg-emerald-500 border-slate-900 animate-pulse"></span>
          </div>
          <div>
            <p className="text-sm font-black tracking-wider text-white uppercase">
              Nandhini K
            </p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Optometrist
            </p>
          </div>
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          subtext="Registry Database"
          icon={<FaUserPlus />}
          colorClass="text-blue-500"
        />
        <StatCard
          title="Clinical Invoices"
          value={stats.totalBills}
          subtext="Financial Records"
          icon={<FaFileInvoiceDollar />}
          colorClass="text-emerald-500"
        />
        <StatCard
          title="Revenue Stream"
          value={`₹${stats.revenue.toLocaleString("en-IN")}`}
          subtext="Total Collections"
          icon={<FaNotesMedical />}
          colorClass="text-purple-500"
        />
      </div>

      {/* Quick Access Grid */}
      <div className="mb-12">
        <h3 className="px-1 mb-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
          Quick Links
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Points to /patients/add */}
          <QuickAction
            label="Register Patient"
            icon={<FaUserPlus />}
            color="bg-blue-600"
            onClick={() => navigate("/patients/add")}
          />

          {/* Points to /patients */}
          <QuickAction
            label="Manage Patients"
            icon={<FaUsersCog />}
            color="bg-orange-600"
            onClick={() => navigate("/patients")}
          />

          {/* Points to /billing/new */}
          <QuickAction
            label="New Clinical Bill"
            icon={<FaFileInvoiceDollar />}
            color="bg-emerald-600"
            onClick={() => navigate("/billing/new")}
          />

          {/* Points to /billing */}
          <QuickAction
            label="Billing Archive"
            icon={<FaHistory />}
            color="bg-purple-600"
            onClick={() => navigate("/billing")}
          />
        </div>
      </div>

      {/* Activity Monitor */}
      <div className="grid grid-cols-1 gap-8 pb-20 lg:grid-cols-2">
        {/* Recent Patient Logs */}
        <div className="p-8 border glass-panel rounded-[2.5rem] border-white/5 bg-white/2">
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/5">
            <h3 className="flex items-center gap-3 text-sm font-black tracking-widest text-white uppercase">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>{" "}
              Recent Registrations
            </h3>
            <button
              onClick={() => navigate("/patients")}
              className="text-[10px] font-black text-blue-400 hover:text-white uppercase tracking-widest transition-colors"
            >
              History Log
            </button>
          </div>
          <div className="space-y-2">
            {loading ? (
              <div className="py-12 text-center animate-pulse text-slate-600 font-bold uppercase text-[10px] tracking-widest">
                Initialising...
              </div>
            ) : recentPatients.length > 0 ? (
              recentPatients.map((p) => (
                <ActivityRow
                  key={p.id}
                  type="patient"
                  title={p.name}
                  subtitle={`MR No: ${p.mr}`}
                  time={p.time}
                />
              ))
            ) : (
              <div className="py-12 text-[10px] font-black uppercase tracking-widest text-center text-slate-700">
                Empty Registry
              </div>
            )}
          </div>
        </div>

        {/* Recent Billing Logs */}
        <div className="p-8 border glass-panel rounded-[2.5rem] border-white/5 bg-white/2">
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/5">
            <h3 className="flex items-center gap-3 text-sm font-black tracking-widest text-white uppercase">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>{" "}
              Recent Invoices
            </h3>
            <button
              onClick={() => navigate("/manage-bill")}
              className="text-[10px] font-black text-emerald-400 hover:text-white uppercase tracking-widest transition-colors"
            >
              Billing Desk
            </button>
          </div>
          <div className="space-y-2">
            {loading ? (
              <div className="py-12 text-center animate-pulse text-slate-600 font-bold uppercase text-[10px] tracking-widest">
                Initialising...
              </div>
            ) : recentBills.length > 0 ? (
              recentBills.map((b) => (
                <ActivityRow
                  key={b.id}
                  type="bill"
                  title={b.name}
                  subtitle={`Protocol: ${b.purpose}`}
                  time={b.time}
                />
              ))
            ) : (
              <div className="py-12 text-[10px] font-black uppercase tracking-widest text-center text-slate-700">
                No Transactions
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
