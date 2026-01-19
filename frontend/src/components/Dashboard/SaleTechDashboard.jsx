import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation,
  Navigate,
} from "react-router-dom";
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
  SearchCode,
  ExternalLink,
  MoreVertical,
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { techUserDashboard } from "../../features/TechUserSlice/TechUserSlice";
import { adminDashboard } from "../../features/ADMIN/adminSlice";
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboardData } from "../../features/DashboardSlice/dashboardSlice";

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
  const {
    data : saleData,
    loading,
    error,
  } = useSelector((state) => state.dashboard);
  const { dashboardData } = useSelector(
    (state) => state.techUser
  );

  const userRole = localStorage.getItem("Role").toLowerCase();

  useEffect(() => {
    if (userRole == "sale") {
      dispatch(fetchDashboardData());
    }
    if (userRole == "tech") {
      dispatch(techUserDashboard());
    }
  }, [dispatch, userRole]);

  const data = userRole === "sale" ? saleData : dashboardData;

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  //   if (loading) return <LoadingScreen />;

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
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
              <button className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-700 tracking-widest bg-indigo-50 px-4 py-2 rounded-xl transition-all">
                View All Cases
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b">
                    <th className="px-8 py-5">Customer Info</th>
                    <th className="px-8 py-5">Issue / Plan</th>
                    <th className="px-8 py-5">Revenue</th>
                    <th className="px-8 py-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.cases?.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-100 p-2 rounded-xl text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                            <UserCircle size={18} />
                          </div>
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
                            c.status === "Open"
                              ? "bg-amber-50 text-amber-600 border border-amber-100"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          }`}
                        >
                          <span
                            className={`w-1 h-1 rounded-full ${
                              c.status === "Open"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                          ></span>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
