import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Info,
  RefreshCw,
  TrendingUp,
  MinusCircle,
  Briefcase,
  WifiOff,
  ServerCrash,
} from 'lucide-react';
import { getMyAttendanceSale, getMyAttendanceTech } from '../../features/AttendanceSlice/attendanceSlice';
// ─────────────────────────────────────────────
// Status configuration
// ─────────────────────────────────────────────
const STATUS_CONFIG = {
  P:    { label: 'Present',  color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2  },
  HD:   { label: 'Half Day', color: 'bg-amber-100   text-amber-700   border-amber-200',   icon: Clock         },
  AB:   { label: 'Absent',   color: 'bg-red-100     text-red-700     border-red-200',     icon: XCircle       },
  NCNS: { label: 'NCNS',     color: 'bg-rose-900    text-white       border-rose-900',    icon: AlertTriangle },
  WO:   { label: 'Week Off', color: 'bg-slate-100   text-slate-500   border-slate-200',   icon: Info          },
  L:    { label: 'Leave',    color: 'bg-purple-100  text-purple-700  border-purple-200',  icon: Briefcase     },
};


const MyAttendance = () => {
  const dispatch = useDispatch();
  const { attendanceData, isLoading, error } = useSelector(
    (state) => state.attendance  
  );

  // Local month picker state
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  );

   const role = localStorage.getItem("Role")?.toLowerCase() || "tech";
  const isTech = role === "tech";
  const isSale = role === "sale";

  // Fetch whenever month changes
  useEffect(() => {
    if(isTech){
        dispatch(getMyAttendanceTech(currentMonth));
    } else {
        dispatch(getMyAttendanceSale(currentMonth));
    }
  }, [currentMonth, dispatch]);

  const calendarGrid = useMemo(() => {
    const [year, month] = currentMonth.split('-').map(Number);
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const daysInMonth     = new Date(year, month, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ type: 'padding', key: `pad-start-${i}` });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const record  = attendanceData?.days?.find((r) => r.date === dateStr);
      days.push({
        type:     'day',
        dayNumber: d,
        date:     dateStr,
        status:   record?.status   || null,
        comments: record?.comments || '',
        key:      dateStr,
      });
    }
    return days;
  }, [currentMonth, attendanceData]);

  const changeMonth = (offset) => {
    const [year, month] = currentMonth.split('-').map(Number);
    const newDate = new Date(year, month - 1 + offset, 1);
    setCurrentMonth(
      `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`
    );
  };

  const getMonthName = () =>
    new Date(currentMonth + '-01').toLocaleString('default', {
      month: 'long',
      year:  'numeric',
    });

  const handleRefresh = () => dispatch(getMyAttendanceTech(currentMonth));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 p-4 md:p-8">

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <CalendarIcon className="text-emerald-500" size={32} />
              My Attendance
            </h1>
            <p className="text-slate-400 font-medium text-sm mt-1">
              Track your monthly presence, leaves, and effective work days.
            </p>
          </div>

          {/* Month Navigator */}
          <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-600"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="px-6 py-2">
              <span className="text-sm font-black text-slate-700 uppercase tracking-widest min-w-[140px] text-center block">
                {getMonthName()}
              </span>
            </div>
            <button
              onClick={() => changeMonth(1)}
              
              className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-600"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* ── LEFT: STATS ──────────────────────── */}
        <div className="lg:col-span-1 space-y-6">

          {/* Performance Metrics */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
              Performance Metrics
            </h2>
            <StatRow
              icon={<TrendingUp size={18} />}
              label="Effective Days"
              value={isLoading ? '—' : (attendanceData?.effectiveDays ?? 0)}
              subText="Incl. WO & Leaves"
              color="text-emerald-600 bg-emerald-50"
            />
            <StatRow
              icon={<MinusCircle size={18} />}
              label="Deductions"
              value={isLoading ? '—' : (attendanceData?.deductions ?? 0)}
              subText="Absents & Penalties"
              color="text-rose-600 bg-rose-50"
            />
          </div>

          {/* Status Breakdown */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
              Status Breakdown
            </h2>
            <div className="space-y-3">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 rounded-2xl border border-gray-50 bg-gray-50/30"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${config.color.split(' ')[0]} ${config.color.split(' ')[1]}`}>
                      <config.icon size={16} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{config.label}</span>
                  </div>
                  <span className="text-lg font-black text-slate-800">
                    {isLoading ? '—' : (attendanceData?.summary?.[key] ?? 0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: CALENDAR ──────────────────── */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-200 overflow-hidden">

            {/* Calendar top bar */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${isLoading ? 'bg-amber-400' : error ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {isLoading ? 'Loading…' : error ? 'Error' : 'Live Schedule'}
                </span>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                title="Refresh"
              >
                <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
              </button>
            </div>

            {/* Calendar body */}
            <div className="p-8">

              {/* ── Loading state ── */}
              {isLoading && (
                <div className="h-[400px] flex flex-col items-center justify-center gap-4">
                  <RefreshCw size={48} className="animate-spin text-emerald-500 opacity-20" />
                  <p className="text-slate-400 font-bold">Refreshing Attendance Records…</p>
                </div>
              )}

              {/* ── Error state ── */}
              {!isLoading && error && (
                <div className="h-[400px] flex flex-col items-center justify-center gap-4 text-center px-8">
                  {/* Distinguish network errors from server errors */}
                  {String(error).toLowerCase().includes('network') ||
                   String(error).toLowerCase().includes('fetch') ? (
                    <>
                      <WifiOff size={48} className="text-rose-400 opacity-60" />
                      <p className="text-slate-700 font-black text-lg">No Connection</p>
                      <p className="text-slate-400 text-sm font-medium">
                        Check your internet connection and try again.
                      </p>
                    </>
                  ) : (
                    <>
                      <ServerCrash size={48} className="text-rose-400 opacity-60" />
                      <p className="text-slate-700 font-black text-lg">Something Went Wrong</p>
                      <p className="text-slate-400 text-sm font-medium max-w-xs">{error}</p>
                    </>
                  )}
                  <button
                    onClick={handleRefresh}
                    className="mt-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black rounded-2xl transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* ── Empty state (success but no records) ── */}
              {!isLoading && !error && attendanceData && (!attendanceData.days || attendanceData.days.length === 0) && (
                <div className="h-[400px] flex flex-col items-center justify-center gap-4 text-center">
                  <CalendarIcon size={48} className="text-slate-300" />
                  <p className="text-slate-700 font-black text-lg">No Records Found</p>
                  <p className="text-slate-400 text-sm font-medium">
                    No attendance data has been recorded for {getMonthName()}.
                  </p>
                </div>
              )}

              {/* ── Calendar grid (success + data) ── */}
              {!isLoading && !error && attendanceData?.days && attendanceData.days.length > 0 && (
                <>
                  {/* Day name headers */}
                  <div className="grid grid-cols-7 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div
                        key={day}
                        className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-2"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Day cells */}
                  <div className="grid grid-cols-7 gap-3">
                    {calendarGrid.map((cell) => {
                      if (cell.type === 'padding') return <div key={cell.key} className="aspect-square" />;

                      const config = cell.status ? STATUS_CONFIG[cell.status] : null;

                      return (
                        <div
                          key={cell.key}
                          className={`group relative aspect-square rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center p-2
                            ${config
                              ? config.color
                              : 'bg-white border-gray-100 hover:border-emerald-200 hover:shadow-md'
                            }`}
                        >
                          <span className={`text-sm font-black ${config ? '' : 'text-slate-400'}`}>
                            {cell.dayNumber}
                          </span>

                          {config && (
                            <config.icon
                              className="mt-1 opacity-60 group-hover:scale-110 transition-transform"
                              size={14}
                            />
                          )}

                          {/* Tooltip */}
                          {cell.comments && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-xl">
                              {cell.comments}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Legend footer */}
            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/30 flex flex-wrap gap-4">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${config.color.split(' ')[0]}`} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    {config.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Stat Row sub-component
// ─────────────────────────────────────────────
const StatRow = ({ icon, label, value, subText, color }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 bg-gray-50/50">
    <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
        {label}
      </p>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-2xl font-black text-slate-800">{value}</span>
        <span className="text-[10px] font-bold text-slate-400">{subText}</span>
      </div>
    </div>
  </div>
);

export default MyAttendance;