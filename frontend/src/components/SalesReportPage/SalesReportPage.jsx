import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Wrench,
  TrendingUp,
  Activity,
  DollarSign,
  Briefcase,
  Monitor,
  ShieldAlert,
  BarChart3,
  Timer,
  Users2,
  BanknoteArrowUp
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOverAllSummary, getSalesReportData } from "../../features/ADMIN/adminSlice";

const SalesReportPage = () => {
  const dispatch = useDispatch();
  const { salesReportData: currentData, isLoading, error, isError, overAllSummary } = useSelector((state) => state.admin);

  const [reportType, setReportType] = useState("weekly");

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  useEffect(() => {
    dispatch(getSalesReportData(reportType));
    dispatch(fetchOverAllSummary());
  }, [dispatch, reportType]);

  const reportData = currentData || { labels: [], totalSales: [], totalCases: [] };
  const overall  = overAllSummary || null;

  const ModernSalesChart = ({ reportData }) => {

    
    const chartData = useMemo(() => {
      if (!reportData?.labels?.length)
      return [{ name: "No Data", revenue: 0, cases: 0 }];

      return reportData.labels.map((label, index) => ({
        name: label,
        revenue: reportData.totalSales[index] ?? 0,
        cases: reportData.totalCases[index] ?? 0,
      }));
    }, [reportData]);

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-50 pb-2">
              {String(label)}
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-bold text-slate-600">
                    Sales
                  </span>
                </div>
                <span className="text-sm font-black text-slate-800">
                  ${Number(payload[0].value).toLocaleString()}
                </span>
              </div>
              {payload[1] && (
                <div className="flex items-center justify-between gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-teal-300"></div>
                    <span className="text-xs font-bold text-slate-600">
                      Cases
                    </span>
                  </div>
                  <span className="text-sm font-black text-slate-800">
                    {Number(payload[1].value)} cases
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="w-full h-[400px] mt-6">
        {chartData.every(d => d.revenue === 0 && d.cases === 0) && (
          <div className="flex items-center justify-center h-[400px] text-slate-400 text-sm font-bold">
            No sales data available
          </div>
        )}
        {!chartData.every(d => d.revenue === 0 && d.cases === 0) && (
           <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCase" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5eead4" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#5eead4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <YAxis
              domain={[0, 10]}
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorRev)"
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="cases"
              stroke="#5eead4"
              strokeWidth={2}
              strokeDasharray="5 5"
              fillOpacity={1}
              fill="url(#colorCase)"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer> )}
      </div>
    );
  };

  const DashboardMetricCard = ({ title, value, subtitle, icon: Icon, colorClass, iconBg }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
    <div className="flex items-center justify-between mb-4">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{String(title)}</span>
      <div className={`${iconBg} p-2.5 rounded-xl transition-transform group-hover:scale-110`}><Icon size={18} className={colorClass} /></div>
    </div>
    <div className="flex flex-col relative z-10">
      <span className="text-2xl font-black text-slate-800">{String(value)}</span>
      {subtitle && <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{String(subtitle)}</span>}
    </div>
  </div>
);



  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
            <BarChart3 size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 leading-none tracking-tight">
              Sales Analytics
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase mt-2 tracking-widest">
              Performance Insights
            </p>
          </div>
        </div>
        <div className="flex bg-slate-100/50 p-1.5 rounded-2xl gap-1">
          {["daily", "weekly", "monthly"].map((type) => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${reportType === type ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400  cursor-pointer hover:text-slate-600"}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* <div className="lg:col-span-1 space-y-6">
          <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform"><TrendingUp size={160} /></div>
            <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest mb-1">Total Revenue</p>
            <h3 className="text-4xl font-black">{formatCurrency(currentData?.summary?.totalSales || 0)}</h3>
            <div className="mt-8 flex items-center gap-2"><span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">Current {reportType}</span></div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between">
            <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Cases</p><h3 className="text-3xl font-black text-slate-800">{reportData?.summary?.totalCases || 0}</h3></div>
            <div className="bg-teal-50 p-4 rounded-2xl text-teal-600"><ClipboardList size={24} /></div>
          </div>
        </div> */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Activity size={16} className="text-emerald-500" /> Sales Flow
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[9px] font-black text-slate-400 uppercase">
                  Sales
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-teal-300"></div>
                <span className="text-[9px] font-black text-slate-400 uppercase">
                  Cases
                </span>
              </div>
            </div>
          </div>
          <ModernSalesChart reportData={reportData} />
        </div>
      </div>

       <section className="space-y-10">
        <div className="flex items-center gap-3 ml-4">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Overall Summary</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardMetricCard 
            title="Total Cases" 
            value={Number(overall?.totalCases || 0).toLocaleString()} 
            subtitle="OverAll" 
            icon={Briefcase} colorClass="text-slate-800" iconBg="bg-slate-100" 
          />
          <DashboardMetricCard 
            title="Overall Sales" 
            value={formatCurrency(overall?.sales?.totalAmount || 0)} 
            subtitle={`from all Cases`} 
            icon={DollarSign} colorClass="text-emerald-600" iconBg="bg-emerald-50" 
          />
          <DashboardMetricCard 
            title="Total Chargeback" 
            value={`$${Math.round(Number(overall?.chargebacks?.totalAmount || 0))}`} 
            subtitle={`${overall?.chargebacks?.count || 0} Total Disputes`} 
            icon={BanknoteArrowUp} colorClass="text-indigo-600" iconBg="bg-indigo-50" 
          />
          <DashboardMetricCard 
            title="Chargeback Avg" 
            value={`$${overall?.chargebacks?.avgAmount || "0.00"}`} 
            subtitle="per/case chargeback"
            icon={ShieldAlert} colorClass="text-rose-600" iconBg="bg-rose-50" 
          />
        </div>

        {/* TEAM PERFORMANCE - SEPARATED */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sale User Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:border-emerald-500 transition-all flex items-center justify-between overflow-hidden relative">
            <div className="absolute right-0 bottom-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform"><TrendingUp size={140} /></div>
            <div className="space-y-6 relative z-10 w-full">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500 p-3 rounded-2xl text-white shadow-lg shadow-emerald-100"><Users2 size={24} /></div>
                <h4 className="text-base font-black text-slate-800 uppercase tracking-tight">Sale Users</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Personnel</span>
                  <span className="text-3xl font-black text-slate-800">{String(overall?.users?.sales?.totalUsers || 0)}</span>
                </div>
                <div className="flex flex-col border-l border-slate-100 pl-6">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg Cases/User</span>
                  <span className="text-3xl font-black text-emerald-600">{String(overall?.users?.sales?.avgCasesPerUser || "0.00")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tech User Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:border-teal-500 transition-all flex items-center justify-between overflow-hidden relative">
            <div className="absolute right-0 bottom-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform"><Monitor size={140} /></div>
            <div className="space-y-6 relative z-10 w-full">
              <div className="flex items-center gap-3">
                <div className="bg-teal-500 p-3 rounded-2xl text-white shadow-lg shadow-teal-100"><Wrench size={24} /></div>
                <h4 className="text-base font-black text-slate-800 uppercase tracking-tight">Tech Users</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Personnel</span>
                  <span className="text-3xl font-black text-slate-800">{String(overall?.users?.tech?.totalUsers || 0)}</span>
                </div>
                <div className="flex flex-col border-l border-slate-100 pl-6">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg Cases/User</span>
                  <span className="text-3xl font-black text-teal-600">{String(overall?.users?.tech?.avgCasesPerUser || "0.00")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SalesReportPage;
