import React, { useState, useEffect, useRef, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, NavLink, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { 
  UserCircle, 
  Settings, 
  Bell, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  LogOut, 
  ShieldCheck, 
  Search, 
  ChevronLeft,
  LayoutDashboard,
  PieChart,
  Users,
  Wrench,
  TrendingUp,
  MessageSquare,
  FileText,
  HelpCircle,
  Activity,
  DollarSign,
  UserCheck,
  UserMinus,
  Coffee,
  BadgeCheck,
  ClipboardList,
  Briefcase,
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Clock,
  Fingerprint,
  Globe
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { adminDashboard } from '../../features/ADMIN/adminSlice';


const ErrorBanner = ({ message, onRetry }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl border border-red-200 shadow-lg overflow-hidden">
          {/* Error Icon */}
          <div className="bg-red-50 p-6 text-center border-b border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Something went wrong</h3>
          </div>

          {/* Error Message */}
          <div className="p-6">
            <p className="text-sm text-slate-600 text-center mb-6">
              {message || "We couldn't load the dashboard data. Please try again."}
            </p>

            {/* Retry Button */}
            <button
              onClick={onRetry}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 ease-in-out active:scale-95 hover:shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



const AdminDashboard = () => {

    const {dashboardData: data, loading, isError, error} = useSelector((state)=>state.admin);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        dispatch(adminDashboard())
    },[dispatch]);

     

//   const [data] = useState(dashboardData);
//   const [breakTimers, setBreakTimers] = useState({ "Ram": 320, "sham": 0 });

  // 1. Data Processing
//   const stats = useMemo(() => {
//   if (!data?.cases) return { todaySales: 0 };

//   const today = new Date();

//   const todaySales = data.cases
//     .filter(c => new Date(c.createdAt).toDateString() === today.toDateString())
//     .reduce((acc, curr) => acc + (curr.saleAmount || 0), 0);

//   return { todaySales };
// }, [data]);


  // 2. Simulated Break Timers
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setBreakTimers(prev => ({
//         ...prev,
//         "Ram": prev["Ram"] + 1
//       }));
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

    const handleRetry = () => {
    dispatch(adminDashboard());
  };

   if (isError) {
    return <ErrorBanner message={error} onRetry={handleRetry} />;
  }


const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-md transition-opacity duration-300">
      <div className="relative w-14 h-14" style={{
        animation: 'spin 2s linear infinite'
      }}>
        <div 
          className="absolute top-0 left-0 w-3 h-3 bg-emerald-600 rounded-full" 
          style={{
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: '0s'
          }}
        ></div>
        <div 
          className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full" 
          style={{
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: '0.2s'
          }}
        ></div>
        <div 
          className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full" 
          style={{
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: '0.4s'
          }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 w-3 h-3 bg-emerald-300 rounded-full" 
          style={{
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: '0.6s'
          }}
        ></div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div> */}
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* SECTION: ENHANCED ADMIN PROFILE DETAILS CARD */}
        <section>
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative group">
          {/* Subtle Background Accent */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-emerald-500 to-emerald-600 opacity-10"></div>
          
          <div className="relative p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {/* Left: Avatar & Identity */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-emerald-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-emerald-200 ring-4 ring-white">
                  {data.user.name.charAt(0)}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 border-4 border-white rounded-full ${data.user.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-slate-800 tracking-tight">{data?.user?.name || "Name"}</h1>
                  <BadgeCheck className="text-emerald-500" size={20} />
                </div>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md border border-emerald-100">{data.user.role || "role"}</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5"><Mail size={14} className="text-slate-300" /> {data?.user?.email || "email"}</span>
                  <span className="flex items-center gap-1.5"><Phone size={14} className="text-slate-300" /> {data?.user?.phone || "999999999"}</span>
                </div>
              </div>
            </div>

            {/* Right: Location & Metadata */}
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-6 lg:gap-4 xl:gap-8 w-full lg:w-auto">
              <div className="flex-1 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-4">
                <div className="bg-white p-2.5 rounded-xl shadow-sm">
                  <MapPin size={18} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Location</p>
                  <p className="text-xs font-bold text-slate-700">{data?.user?.city}, {data?.user?.state || "state"}</p>
                  <p className="text-[10px] text-slate-400">{data?.user?.country || "country"}</p>
                </div>
              </div>

              <div className="flex-1 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-4">
                <div className="bg-white p-2.5 rounded-xl shadow-sm">
                  <Calendar size={18} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Joined Date</p>
                  <p className="text-xs font-bold text-slate-700">{formatDate(data.user.createdAt) || "Date"}</p>
                  <p className="text-[10px] text-slate-400">ID: #{data.user.id || "id"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: PERFORMANCE METRICS */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-emerald-500 p-6 rounded-[2.5rem] text-white shadow-xl shadow-emerald-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
              <TrendingUp size={80} />
            </div>
            <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mb-1">Total Overall Sales</p>
            <h4 className="text-2xl text-gray-50 font-black">{formatCurrency(data?.totalSales) || "999999"}</h4>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-emerald-100 font-medium">
                <span className="bg-emerald-500/50 px-2 py-0.5 rounded-full">Global Metric</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 text-slate-50 group-hover:scale-125 transition-transform duration-500">
              <Briefcase size={80} />
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Cases</p>
            <h4 className="text-2xl font-black text-slate-800">{data?.totalCases.toLocaleString() || "999"}</h4>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                <span className="bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">All Time</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Monthly Sales</p>
            <h4 className="text-2xl font-black text-slate-800">{formatCurrency(data?.monthlySales) || "9999"}</h4>
            {/* <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: '45%' }}></div>
            </div> */}
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Today's Sales</p>
            <h4 className="text-2xl font-black text-emerald-600">{formatCurrency(data?.todaySales || 0)}</h4>
            <p className="mt-4 text-[10px] text-slate-400 font-medium italic">Current session progress</p>
          </div>
        </div>
      </section>

      {/* SECTION: AGENT STATUS SUMMARY */}
       {/* <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Activity className="text-emerald-600" size={24} />
            Agent Status Summary
          </h2>
          <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-100 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            LIVE TRACKING
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Online', value: '12', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'On Break', value: '2', icon: Coffee, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Offline', value: '4', icon: UserMinus, color: 'text-slate-400', bg: 'bg-slate-50' },
            { label: 'Total Cases', value: data.totalCases, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center gap-4 shadow-sm">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{stat.label}</p>
                <p className="text-xl font-black text-slate-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
                  <th className="px-8 py-5">Agent</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5">Current Status</th>
                  <th className="px-8 py-5">Activity Timer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {[
                  { name: "Ram", role: "Sales", status: "Break", type: "amber" },
                  { name: "sham", role: "Tech", status: "Online", type: "emerald" },
                  { name: "Admin", role: "Management", status: "Offline", type: "slate" },
                ].map((agent, i) => (
                  <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold bg-slate-100 text-slate-600 uppercase`}>
                           {agent.name.charAt(0)}
                         </div>
                         <span className="font-bold text-slate-700">{agent.name}</span>
                       </div>
                    </td>
                    <td className="px-8 py-5 text-slate-400 font-medium">{agent.role}</td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase
                        ${agent.type === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 
                          agent.type === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${agent.type === 'emerald' ? 'bg-emerald-500' : agent.type === 'amber' ? 'bg-amber-500' : 'bg-slate-400'}`}></span>
                        {agent.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-slate-500 font-mono text-xs">
                      {agent.status === "Break" ? formatTime(breakTimers[agent.name]) : agent.status === "Online" ? "Active" : "--:--"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section> */}

      {/* SECTION: CASES TABLE */}
      <section>
        <div className="bg-[#fcfcfc] rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
              <h3 className="text-xl font-black text-slate-800">Recent Cases Breakdown</h3>
            </div>
            <button
            onClick={()=> navigate("/search")}
            className="text-xs cursor-pointer font-bold text-emerald-600 hover:text-emerald-700 hover:scale-[1.10] active:scale-95 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg transition-all duration-300 ease-in-out"
            >
              <ClipboardList size={14} /> View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
                  <th className="px-8 py-5">Case ID</th>
                  <th className="px-8 py-5">Customer</th>
                  <th className="px-8 py-5">Sale Amount</th>
                  <th className="px-8 py-5">Sales/Tech User</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {data.cases.slice(0,15).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">#{c.id || "id"}</span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-slate-800 truncate max-w-[150px]">{c.customerName || "Name"}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-black text-slate-800">{formatCurrency(c.saleAmount) || "999"}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-300 uppercase w-8">Sale:</span>
                          <span className="text-xs font-bold text-slate-600">{c.saleUser.name || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-300 uppercase w-8">Tech:</span>
                          <span className="text-xs font-bold text-slate-600">{c.techUser?.name || "N/A"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider
                        ${c.status === 'Open' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {c.status || "N/A"}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-bold text-slate-500">{formatDateTime(c.createdAt) || "date"}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;