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
  Globe,
  Eye,
  UserPlus,
  RefreshCw,
  User,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { adminDashboard, adminViewCase, fetchAllCasesAdmin, searchTechUser, setAdminCurrentPage, setAdminPageSize, updateCaseDetailsByAdmin, } from '../../features/ADMIN/adminSlice';
import { useToast } from '../../ToastContext/ToastContext';


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

    const {dashboardData: data, dbLoading, isError, error, searchLoading, isLoading ,searchTechusers, cases, pagination,} = useSelector((state)=>state.admin);
    const { currentPage, pageSize, totalPages, totalCount } = pagination;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {showToast} = useToast();
    const [techSearch, setTechSearch] = useState({});
    const [showTechDropdown, setShowTechDropdown] = useState(false);
    const [activeCaseId, setActiveCaseId] = useState(null);
    const [selectedCaseData, setSelectedCaseData] = useState({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingTechUser, setPendingTechUser] = useState(null);
    const [currentCaseForAssignment, setCurrentCaseForAssignment] = useState(null);

    const dropdownRef = useRef(null);

    const searchKeyword = techSearch[activeCaseId] || "";

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShowTechDropdown(false);
          setTechSearch({});
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(()=>{
        dispatch(adminDashboard());
        dispatch(fetchAllCasesAdmin({currentPage, pageSize}));
    },[dispatch]);

      useEffect(() => {
      if (!activeCaseId || techSearch[activeCaseId] === undefined) {
        return;
      }

      const searchTerm = techSearch[activeCaseId];
      
      const timer = setTimeout(() => {
        dispatch(searchTechUser(searchTerm));
        setShowTechDropdown(true);
      }, 400);

      return () => clearTimeout(timer);
    }, [techSearch, dispatch]);


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

  const fetchCaseDetails = async(caseId, editMode = false)=>{
    try {
      await dispatch(adminViewCase(caseId)).unwrap();
      navigate(`/case/${caseId}`, { 
      state: { editing: editMode, fromPage: currentPage } 
    });
    } catch (error) {
      console.error("Failed to fetch case:", error);
      showToast("Failed to load case details", "error");
    }      
  }

    const handlePageChange = (newPage) => {
          dispatch(setAdminCurrentPage(newPage));
          dispatch(fetchAllCasesAdmin({page: newPage, limit: pageSize}));
      };
  
       const handlePageSizeChange = (newPageSize) => {
            dispatch(setAdminPageSize(newPageSize));
            dispatch(setAdminCurrentPage(1));
            dispatch(fetchAllCasesAdmin({limit: newPageSize}));
        };

       const handleSelectUser = (user, caseData) => {
        setSelectedCaseData({
          ...caseData,
          techUserId: user.id,
          techUser: { name: user.name }
        });
        setPendingTechUser(user);
        setCurrentCaseForAssignment(caseData);
        setShowConfirmModal(true);
        setShowTechDropdown(false);
      };

 const handleConfirmTechAssign = async () => {
  try {
    const normalizedData = {
      caseId: currentCaseForAssignment.caseId,
      techUserId: pendingTechUser.id,
      techUser: {
        id: pendingTechUser.id,
        name: pendingTechUser.name,
      },
    };

    await dispatch(
      updateCaseDetailsByAdmin({
        caseId: normalizedData.caseId,
        caseData: normalizedData,
      })
    ).unwrap();

    showToast("Tech user assigned successfully", "success");
    
    // Refresh the cases list
    dispatch(fetchAllCasesAdmin({currentPage, pageSize}));
    
    setShowConfirmModal(false);
    setPendingTechUser(null);
    setCurrentCaseForAssignment(null);
    setActiveCaseId(null);
    
    // Clear the search for this case
    setTechSearch(prev => {
      const newState = { ...prev };
      delete newState[currentCaseForAssignment.id];
      return newState;
    });
  } catch (error) {
    console.error("Failed to assign tech user:", error);
    showToast("Failed to assign tech user", "error");
  }
};

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

if (dbLoading || !data) {
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
            onClick={()=> navigate("/search-cases")}
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
                  <th className="px-8 py-5">Sales User/Status</th>
                  <th className="px-8 py-5">Tech User</th>
                  <th className="px-8 py-5">Created At</th>
                  <th className="px-4 py-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {cases.slice(0,15).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">{c.caseId || "id"}</span>
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
                          <span className="text-xs font-bold text-slate-600">{c.caseCreatedBy || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-300 uppercase w-8">Status:</span>
 <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider
                        ${c.issueStatus === 'Open' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {c.issueStatus || "N/A"}
                      </span>                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {/* <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider
                        ${c.issueStatus === 'Open' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {c.issueStatus || "N/A"}
                      </span> */}
                      <div className="relative" ref={activeCaseId === c.id ? dropdownRef : null}>
          {/* <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1 flex items-center gap-2">
            <ShieldCheck size={14} className="text-slate-300" />
            Tech User Assignment
          </label> */}

          {/* Search bar only shows if editing, is admin, AND no user is currently selected */}
          {(!c.assignedTo || c.assignedTo === "Unassigned") && (
            <div className="relative group animate-in fade-in slide-in-from-top-1 duration-300">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${techSearch ? 'text-emerald-600' : 'text-slate-400'}`}>
                {searchLoading ? <RefreshCw size={16} className="animate-spin" /> : <UserPlus size={18} />}
              </div>
              
        <input
  value={techSearch[c.id] || ""}
  onKeyDown={(e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    setTechSearch(prev => ({ ...prev, [c.id]: "" }));
  }
}}
  onFocus={(e) => {
    setActiveCaseId(c.id);
    // Only initialize if not already set
    if (techSearch[c.id] === undefined) {
      setTechSearch(prev => ({
        ...prev,
        [c.id]: ""
      }));
    } else {
      // If search term exists, show dropdown immediately
      setShowTechDropdown(true);
    }
  }}
  onChange={(e) => {
    setTechSearch(prev => ({
      ...prev,
      [c.id]: e.target.value
    }));
  }}
  placeholder="Assign Tech User..."
  autoComplete="off"
  className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-all duration-300 font-bold text-sm shadow-sm outline-none bg-slate-100 hover:bg-white border-transparent text-slate-400`}
/>

              {/* Dropdown Menu */}
              {showTechDropdown && activeCaseId === c.id && (
                <div className="relative top-full left-0 right-0 mt-3 bg-white border border-slate-100 rounded-[1.5rem] z-50 max-h-[320px] overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                      {/* {!techSearch[c.id] || techSearch[c.id].length < 2 ? 'Quick Select (Top 20)' : `Results for "${techSearch}"`} */}
                    {!techSearch[c.id] || techSearch[c.id].length === 0 ? 'Quick Select (Top 20)' : `Results for "${techSearch[c.id]}"`}
                    </span>
                    <button onClick={() => setShowTechDropdown(false)} className="p-1 cursor-pointer hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                      <X size={14} />
                    </button>
                  </div>

                  <div className="overflow-y-auto custom-scrollbar">
                    {searchLoading ? (
                      <div className="p-8 text-center">
                        <RefreshCw className="animate-spin mx-auto text-emerald-500 mb-2" size={24} />
                        <p className="text-sm font-bold text-slate-400">Searching directory...</p>
                      </div>
                    ) 
                    : searchTechusers.length === 0 ? (
                      <div className="p-10 text-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Search size={20} className="text-slate-300" />
                        </div>
                        <p className="text-sm font-bold text-slate-500">No users found</p>
                        <p className="text-xs text-slate-400">Try a different name or email</p>
                      </div>
                    ) 
                    : (
                      searchTechusers.map((user) => (
                        <div
                          key={user.id}
                          className="p-3 mx-2 my-1 rounded-xl hover:bg-emerald-50 cursor-pointer transition-all flex items-center gap-3 border border-transparent hover:border-emerald-100 group/item"
                          onClick={() => handleSelectUser(user, c)}
                        >
                          {/* <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black group-hover/item:scale-110 transition-transform">
                            {user.initials}
                          </div> */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-700 truncate group-hover/item:text-emerald-700 transition-colors">
                              {user.name}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {user.email}
                            </p>
                          </div>
                          {/* {formData.techUserId === user.id && (
                            <Check size={16} className="text-emerald-500" />
                          )} */}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Current Selection Display */}
          {c.assignedTo && c.assignedTo !== "Unassigned" && (
      <div className="p-2 rounded-[1.25rem] border border-emerald-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm text-white flex items-center justify-center text-xs font-black">
              {/* {c.assignedTo.charAt(0).toUpperCase()} */}
                          <ShieldCheck size={18} className="text-slate-300" />

            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.15em] mb-0.5">
                Assigned To
              </p>
              <p className="text-sm font-black text-slate-800">
                {c.assignedTo}
              </p>
            </div>
          </div>
        </div>
      </div>
          )}
        </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-bold text-slate-500">{formatDateTime(c.date) || "date"}</p>
                    </td>
                    <td className="px-4 py-5">
                      <button
                          title="View Case"
                            className="p-2 cursor-pointer text-slate-400 hover:text-emerald-600 hover:scale-[1.1] hover:bg-emerald-50 rounded-xl transition-all ease-in-out active:scale-90"
                            onClick={() => {
                                console.log("Case:", c.caseId);
                                fetchCaseDetails(c.caseId, false);
                              }}                      
                      >
                      <Eye size={18} strokeWidth={2.5}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {cases.length > 0 && (
            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex flex-wrap justify-between items-center gap-6">
              <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <span>Show:</span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none font-black text-slate-700 focus:border-emerald-500 transition-all shadow-sm"
                >
                  {[10, 20, 30, 50].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <span>entries</span>
              </div>

              <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hidden lg:block">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{" "}
                entries
              </div>

              <div className="flex items-center gap-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="
                    px-4 py-3 cursor-pointer
                    text-[10px] font-black uppercase tracking-widest
                    rounded-2xl
                    border border-slate-200
                    bg-white text-slate-400
                    hover:bg-slate-50 hover:text-slate-700
                    disabled:opacity-30 disabled:cursor-not-allowed
                    transition-all
                    active:scale-95
                "
                >
                  Previous
                </button>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl uppercase tracking-widest shadow-sm border border-emerald-100">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className=" px-6 py-3 cursor-pointer text-[10px] font-black uppercase tracking-widest rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200/50 hover:bg-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 "
                                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      {showConfirmModal && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">

      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-black text-slate-800">
          Assign Tech User
        </h3>
      </div>

      {/* Body */}
      <div className="p-6">
        <p className="text-sm font-medium text-slate-600">
          Are you sure you want to assign{" "}
          <span className="font-black text-slate-800">
            {pendingTechUser?.name}
          </span>{" "}
          to this case?
        </p>
      </div>

      {/* Actions */}
      <div className="p-6 pt-0 flex justify-end gap-3">
        <button
          onClick={() => {
            setShowConfirmModal(false);
            setPendingTechUser(null);
          }}
          className="px-5 py-2.5 cursor-pointer rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95"
        >
          Cancel
        </button>

        <button
          onClick={handleConfirmTechAssign}
          className="px-6 py-2.5 cursor-pointer rounded-xl text-xs font-black uppercase tracking-widest text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminDashboard;