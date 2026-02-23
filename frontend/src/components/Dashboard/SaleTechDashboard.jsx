import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  User,
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
  SearchCode,
  ExternalLink,
  MoreVertical,
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { getSingleCaseById, getTechUserAssignedCases, techUserDashboard, setTechCurrentPage, setTechPageSize } from "../../features/TechUserSlice/TechUserSlice";
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboardData } from "../../features/DashboardSlice/dashboardSlice";
import { fetchCaseById, fetchSaleUserCases, setPageSize, setCurrentPage } from "../../features/SearchSlice/searchSlice";
import { useToast } from "../../ToastContext/ToastContext";
import { logoutUserThunk } from "../../features/UserSlice/UserSlice";

const NoticeBoard = ({ notices }) => (
  <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
    <div className="bg-emerald-600 p-6 flex items-center gap-3">
      <div className="bg-white/20 p-2 rounded-xl text-white">
        <Bell size={20} />
      </div>
      <h3 className="text-white font-bold tracking-tight">Notice Board</h3>
    </div>
    <div className="p-6 space-y-4 overflow-y-auto max-h-[500px] custom-scrollbar">
      {notices && notices.length > 0 ? (
        notices.map((notice) => (
          <div
            key={notice.id}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors group"
          >
            <h4 className="text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-1 group-hover:translate-x-1 transition-transform">
              {notice.title}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {notice.message}
            </p>
          </div>
        ))
      ) : (
        <div className="text-center py-10">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            No active notices
          </p>
        </div>
      )}
    </div>
  </div>
);

const UserWelcomeHeader = ({ user }) => {
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative mb-8">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-emerald-500 to-indigo-600 opacity-5"></div>
      <div className="relative p-8 flex flex-col xl:flex-row items-start justify-between gap-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-slate-800 flex items-center justify-center text-white text-3xl font-black shadow-xl ring-4 ring-white">
              {user.name?.charAt(0) || "N/A"}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-4 border-white rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                Welcome back, {user.name || "N/A"}
              </h1>
              <BadgeCheck className="text-emerald-500" size={20} />
            </div>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-3">
              {user.role || "N/A"} Account Dashboard
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1.5">
                <Mail size={14} className="text-slate-300" /> {user.email || "N/A"}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={14} className="text-slate-300" /> {user.phone || "N/A"}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-slate-300" /> {user.city || "N/A"},{" "}
                {user.state || "N/A"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
          <div className="bg-white p-3 rounded-2xl shadow-sm text-indigo-500">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Current Session
            </p>
            <p className="text-xs font-black text-slate-700">
              {formatDate(new Date())}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardMetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorClass,
  iconBg,
}) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center justify-between mb-4">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {title || "N/A"}
      </span>
      <div
        className={`${iconBg} p-2.5 rounded-xl transition-transform group-hover:scale-110`}
      >
        <Icon size={18} className={colorClass} />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-2xl font-black text-slate-800">{value }</span>
      {subtitle && (
        <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
          {subtitle || "N/A"}
        </span>
      )}
    </div>
  </div>
);

const SaleTechDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data : saleData,
    loading,
    error,
  } = useSelector((state) => state.dashboard);
  const { dashboardData, dbLoading } = useSelector(
    (state) => state.techUser
  );

  const {
      cases: salesCases,
      selectedCase: salesSelectedCase,
      loading: salesLoading,
      modalLoading,
      error: salesError,
      showModal: saleShowModal,
      pagination: salesPagination,
      searchFilters: salesSearchFilters,
    } = useSelector((state) => state.salesCases);

      const {
        cases: techCases,
        selectedCase: techSelectedCase,
        pagination: techPagination,
        isLoading: techLoading,
        error: techError,
        showModal: techShowModal,
        searchFilters: techSearchFilters,
      } = useSelector((state) => state.techUser);

      const {showToast} = useToast();

  const userRole = localStorage.getItem("Role").toLowerCase();

  const dashboardLoading = userRole === "tech" ? dbLoading : loading;

    const cases = userRole === "tech" ? techCases : salesCases;
    const pagination = userRole === "tech" ? techPagination : salesPagination;

  const Loading = userRole === "tech" ? techLoading : salesLoading;

  const Error = userRole === "tech" ? techError : salesError;

    const { currentPage, pageSize, totalPages, totalCount } = pagination;

    useEffect(() => {
      const loadDashboard = async () => {
          try {
              if (userRole === "sale") {
                  await dispatch(fetchDashboardData()).unwrap();
              }
              if (userRole === "tech") {
                  await dispatch(techUserDashboard()).unwrap();
              }
          } catch (error) {
              console.log("Dashboard auth failed:", error);
              localStorage.clear();
              dispatch(logoutUserThunk());
              window.location.replace("/");
          }
      };
      loadDashboard();
  }, [dispatch, userRole]);

  useEffect(() => {
      if (userRole === "sale") {
          dispatch(fetchSaleUserCases({ page: currentPage, limit: pageSize }));
      }
      if (userRole === "tech") {
          dispatch(getTechUserAssignedCases({ page: currentPage, limit: pageSize }));
      }
  }, [dispatch, userRole]);

  const data = userRole === "sale" ? saleData : dashboardData;

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  //   if (loading) return <LoadingScreen />;

  if (dashboardLoading || !data) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        {/* <Loader2 className="animate-spin text-indigo-600" size={40} /> */}
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
  }

  const getMetricCards = () => {
    if (!data) return [];

    if (userRole === "sale") {
      const {
        todayCases = 0,
        todaySales = 0,
        monthlyCases = 0,
        monthlySales = 0,
        casesGrowth = 0,
        salesGrowth = 0,
      } = data;

      return [
        {
          title: "Today Cases",
          value: todayCases || 0,
          subtitle: `${formatCurrency(todaySales)} Generated`,
          icon: FileText,
          colorClass: "text-blue-600",
          iconBg: "bg-blue-50",
        },
        {
          title: "Monthly Total",
          value: monthlyCases,
          subtitle: `${formatCurrency(monthlySales)} Sales`,
          icon: TrendingUp,
          colorClass: "text-emerald-600",
          iconBg: "bg-emerald-50",
        },
        {
          title: "Cases Growth",
          value: `${casesGrowth}%`,
          subtitle: "Vs Last Month",
          icon: Activity,
          colorClass: "text-amber-600",
          iconBg: "bg-amber-50",
        },
        {
          title: "Sales Growth",
          value: `${salesGrowth}%`,
          subtitle: "Vs Last Month",
          icon: DollarSign,
          colorClass: "text-indigo-600",
          iconBg: "bg-indigo-50",
        },
      ];
    } else if (userRole === "tech") {
      const { totalAssignedCases = 0, statusCounts = {} } = data || {};

      return [
        {
          title: "Total Assigned",
          value: totalAssignedCases,
          subtitle: "Total Assigned Cases",
          icon: ClipboardList,
          colorClass: "text-indigo-600",
          iconBg: "bg-indigo-50",
        },
        {
          title: "Open Cases",
          value: statusCounts.open ?? 0,
          subtitle: "Awaiting Action",
          icon: AlertCircle,
          colorClass: "text-amber-600",
          iconBg: "bg-amber-50",
        },
        {
          title: "In Progress",
          value: statusCounts.inProgress ?? 0,
          subtitle: "Currently Working",
          icon: Wrench,
          colorClass: "text-blue-600",
          iconBg: "bg-blue-50",
        },
        {
          title: "Closed Cases",
          value: statusCounts.closed ?? 0,
          subtitle: "Successfully Closed",
          icon: CheckCircle2,
          colorClass: "text-emerald-600",
          iconBg: "bg-emerald-50",
        },
      ];
    } 
  };

   const fetchCaseDetails = async (caseId, editMode = false) => {
    try {
      // Wait for the fetch to complete
      if (userRole === "tech") {
        await dispatch(getSingleCaseById(caseId)).unwrap();
      }  else {
        await dispatch(fetchCaseById(caseId)).unwrap();
      }
  
      // Navigate with editing state after data is loaded
      navigate(`/case/${caseId}`, { 
        state: { editing: editMode, fromPage: currentPage } 
      });
    } catch (error) {
      console.error("Failed to fetch case:", error);
      showToast("Failed to load case details", "error");
    }
  };

  const handlePageChange = (newPage) => {
      if (userRole === "tech") {
        dispatch(setTechCurrentPage(newPage));
        dispatch(getTechUserAssignedCases({page: newPage, limit: pageSize}));
      }
      else {
        dispatch(setCurrentPage(newPage));
        dispatch(fetchSaleUserCases({page: newPage, limit: pageSize}));
      }
    };

     const handlePageSizeChange = (newPageSize) => {
        if (userRole === "tech") {
          dispatch(setTechPageSize(newPageSize));
          dispatch(setTechCurrentPage(1));
          dispatch(getTechUserAssignedCases({limit: newPageSize}));
        } else {
          dispatch(setPageSize(newPageSize));
          dispatch(setCurrentPage(1));
          dispatch(fetchSaleUserCases({limit: newPageSize}));

        }

      };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-8">
          <UserWelcomeHeader user={data.user || ""} />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {getMetricCards().map((card, idx) => (
              <DashboardMetricCard key={idx} {...card} />
            ))}
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mt-8">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 bg-indigo-500 rounded-full"></div>
                <h3 className="text-xl font-black text-slate-800">
                  Recent Assignments
                </h3>
              </div>
              <button 
              onClick={()=>navigate("/search-cases")}
              className="text-[10px] cursor-pointer font-black uppercase text-indigo-600 hover:text-indigo-700 hover:scale-[1.10] active:scale-95 tracking-widest bg-indigo-50 px-4 py-2 rounded-xl transition-all">
                View All Cases
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b">
                    <th className="px-8 py-5">Customer Info</th>
                    <th className="px-8 py-5">Plan</th>
                    <th className="px-8 py-5">Sale Amount</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Loading ? <tr>
                    <td colSpan="12" className="py-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                        <p className="font-black text-[10px] text-slate-400 uppercase tracking-[0.3em]">
                          Processing Records...
                        </p>
                      </div>
                    </td>
                  </tr> : cases.length > 0 ? cases.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          {/* <div className="bg-slate-100 p-2 rounded-xl text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                            <UserCircle size={18} />
                          </div> */}
                          <div>
                            <p className="font-bold text-slate-800 text-sm">
                              {c.customerName}
                            </p>
                            <p className="font-mono text-[10px] font-bold text-slate-400">
                              {c.customerID}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">
                            {c.issue}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 italic">
                            {c.plan} ({c.planDuration})
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-black text-slate-800">
                          {formatCurrency(c.saleAmount)}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                          ${
                            c.issueStatus === "Open"
                              ? "bg-amber-50 text-amber-600 border border-amber-100"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          }`}
                        >
                          <span
                            className={`w-1 h-1 rounded-full ${
                              c.issueStatus === "Open"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                          ></span>
                          {c.issueStatus}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <button
                        title="View Case"
                            className="p-2 cursor-pointer text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all active:scale-90"
                            onClick={() => {
                                console.log("Case:", c.caseId);
                                fetchCaseDetails(c.caseId, false);
                              }}
                        >
                          <Eye size={18} strokeWidth={2.5}/>
                        </button>
                      </td>
                    </tr>
                  )) : (
                  <tr>
                    <td colSpan="12" className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 text-slate-200">
                          <User size={48} />
                        </div>
                        <h3 className="text-lg font-black text-slate-700">
                          No Records Found
                        </h3>
                      </div>
                    </td>
                  </tr>                    
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Section */}
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

              <div className="text-[9px] font-black text-slate-800 uppercase tracking-[tight] hidden lg:block">
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
        </div>

        {/* Notice Board Column */}
        <div className="lg:col-span-4 xl:col-span-3">
          <NoticeBoard notices={data.notices} />
        </div>
      </div>
    </div>
  );
};

export default SaleTechDashboard;
