import React, { useState, useEffect } from "react";
import {
    Calendar, ChevronLeft, ChevronRight, CheckCircle2,
    Clock, Users, Save, BarChart2, CalendarDays, Plus
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllAgentsThunk,
    markAttendanceThunk,
    fetchDailyAttendanceThunk,
    fetchMonthlyAttendanceThunk,
} from "../..//features/ADMIN/adminSlice";

const STATUS_OPTIONS = [
    { code: "P", label: "Present", color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" },
    { code: "HD", label: "Half Day", color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" },
    { code: "AB", label: "Absent", color: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100" },
    { code: "NCNS", label: "NCNS", color: "bg-red-50 text-red-800 border-red-300 hover:bg-red-100" },
    { code: "WO", label: "Week Off", color: "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100" },
    { code: "L", label: "Leave", color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" },
];

const getSelectedStyle = (code) => ({
    P: "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-100",
    HD: "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-100",
    AB: "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-100",
    NCNS: "bg-red-700 text-white border-red-700 shadow-md shadow-red-100",
    WO: "bg-slate-500 text-white border-slate-500 shadow-md shadow-slate-100",
    L: "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-100",
}[code] || "");

const STATUS_META = {
    P: { label: "Present", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
    HD: { label: "Half Day", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
    AB: { label: "Absent", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-500" },
    NCNS: { label: "NCNS", bg: "bg-red-50", text: "text-red-800", border: "border-red-300", dot: "bg-red-700" },
    WO: { label: "Week Off", bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" },
    L: { label: "Leave", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
};

const STATUS_COLORS = {
    P: { light: "bg-emerald-50", text: "text-emerald-700" },
    HD: { light: "bg-blue-50", text: "text-blue-700" },
    AB: { light: "bg-rose-50", text: "text-rose-700" },
    NCNS: { light: "bg-red-50", text: "text-red-800" },
    WO: { light: "bg-slate-50", text: "text-slate-600" },
    L: { light: "bg-amber-50", text: "text-amber-700" },
};

const DAY_STATUS_STYLE = {
    P: "bg-emerald-500 text-white",
    HD: "bg-blue-400 text-white",
    AB: "bg-rose-500 text-white",
    NCNS: "bg-red-700 text-white",
    WO: "bg-slate-300 text-slate-600",
    L: "bg-amber-400 text-white",
};

const getRoleColor = (role) =>
    role === "Tech" ? "bg-teal-50 text-teal-600 border-teal-100" : "bg-emerald-50 text-emerald-600 border-emerald-100";

const formatDate = (date) => date.toISOString().split("T")[0];
const formatDisplayDate = (date) =>
    date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

// ── Mark Tab ──────────────────────────────────────────────────────────────────
const MarkTab = () => {
    const today = new Date();
    const dispatch = useDispatch();
    const { agents, isLoading, agentsPagination } = useSelector((s) => s.admin);
    const { currentPage, totalPages, pageSize } = agentsPagination;
    const [selectedDate, setSelectedDate] = useState(today);
    const [attendance, setAttendance] = useState({});
    const [comments, setComments] = useState({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => { dispatch(getAllAgentsThunk({ page: 1, limit: 20 })); }, [dispatch]);

    const dateKey = formatDate(selectedDate);
    const cur = attendance[dateKey] || {};
    const curComments = comments[dateKey] || {};
    const markedCount = Object.values(cur).filter(Boolean).length;

    const handleStatus = (userId, status) => {
        setSubmitted(false);
        setAttendance((p) => ({ ...p, [dateKey]: { ...p[dateKey], [userId]: p[dateKey]?.[userId] === status ? null : status } }));
    };

    const handleComment = (userId, val) =>
        setComments((p) => ({ ...p, [dateKey]: { ...p[dateKey], [userId]: val } }));

    const handleSubmit = async () => {
        const records = agents.filter((a) => cur[a.id]).map((a) => ({ userId: a.id, status: cur[a.id], comments: curComments[a.id] || "" }));
        try { await dispatch(markAttendanceThunk({ date: dateKey, records })).unwrap(); setSubmitted(true); }
        catch (err) { console.error(err); }
    };

    const shiftDate = (n) => { const d = new Date(selectedDate); d.setDate(d.getDate() + n); setSelectedDate(d); setSubmitted(false); };

    return (
        <div className="space-y-6">
            {/* Date picker */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-5 flex items-center justify-between">
                <button onClick={() => shiftDate(-1)} className="p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"><ChevronLeft size={20} /></button>
                <div className="flex items-center gap-3">
                    <Clock size={16} className="text-emerald-500" />
                    <span className="text-sm font-black text-slate-700">{formatDisplayDate(selectedDate)}</span>
                    {formatDate(selectedDate) === formatDate(today) && <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Today</span>}
                </div>
                <button onClick={() => shiftDate(1)} disabled={formatDate(selectedDate) >= formatDate(today)} className="p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"><ChevronRight size={20} /></button>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Status Legend</p>
                <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((s) => (
                        <div key={s.code} className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${s.color}`}>
                            <span className="opacity-70">{s.code}</span> — {s.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="px-8 py-5">Agent</th>
                                <th className="px-8 py-5 text-center">Role</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Comments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={4} className="px-8 py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Loading agents...</td></tr>
                            ) : agents.length === 0 ? (
                                <tr><td colSpan={4} className="px-8 py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">No agents found</td></tr>
                            ) : agents.map((agent) => {
                                const selected = cur[agent.id];
                                return (
                                    <tr key={agent.id} className={`transition-colors border-b border-slate-50 last:border-0 ${selected ? "bg-slate-50/50" : "hover:bg-slate-50/30"}`}>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-500 text-sm">{agent.profileImage ? (
                                <img
                                  src={agent.profileImage}
                                  alt={agent.name}
                                  className="w-full h-full object-cover rounded-3xl"
                                />
                              ) : (
                                agent.name?.charAt(0)
                              )}</div>
                                                <div>
                                                    <p className="font-black text-slate-800 leading-none mb-1">{agent.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400">{agent.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${getRoleColor(agent.role)}`}>{agent.role}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-wrap gap-2">
                                                {STATUS_OPTIONS.map((s) => (
                                                    <button key={s.code} onClick={() => handleStatus(agent.id, s.code)}
                                                        className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer active:scale-95 ${selected === s.code ? getSelectedStyle(s.code) : s.color}`}>
                                                        {s.code}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <input type="text" placeholder="Add comment..." value={curComments[agent.id] || ""} onChange={(e) => handleComment(agent.id, e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 font-semibold text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-300" />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span>Show:</span>
                        <select value={pageSize} onChange={(e) => dispatch(getAllAgentsThunk({ page: 1, limit: Number(e.target.value) }))}
                            className="bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none font-black text-slate-700 focus:border-emerald-500 transition-all shadow-sm">
                            {[10, 20, 30, 50].map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>
                        <span>entries</span>
                    </div>
                    <div className="text-xs font-bold text-slate-400">{markedCount === 0 ? "No agents marked yet" : `${markedCount} of ${agents.length} agents marked`}</div>
                    <div className="flex items-center gap-4">
                        <button disabled={currentPage === 1} onClick={() => dispatch(getAllAgentsThunk({ page: currentPage - 1, limit: pageSize }))}
                            className="px-6 py-3 cursor-pointer text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95">Previous</button>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl uppercase tracking-widest border border-emerald-100">Page {currentPage} of {totalPages}</span>
                        <button disabled={currentPage === totalPages} onClick={() => dispatch(getAllAgentsThunk({ page: currentPage + 1, limit: pageSize }))}
                            className="px-6 py-3 cursor-pointer text-[10px] font-black uppercase tracking-widest rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200/50 hover:bg-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95">Next</button>
                    </div>
                    <button onClick={handleSubmit} disabled={markedCount === 0}
                        className="bg-emerald-600 text-white cursor-pointer px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest flex items-center gap-3 shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
                        {submitted ? <><CheckCircle2 size={16} />Submitted</> : <><Save size={16} />Submit Attendance</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Daily Tab ─────────────────────────────────────────────────────────────────
const DailyTab = () => {
    const today = new Date();
    const dispatch = useDispatch();
    const { dailyAttendance, isLoading } = useSelector((s) => s.admin);
    const [selectedDate, setSelectedDate] = useState(today);

    useEffect(() => { dispatch(fetchDailyAttendanceThunk(formatDate(selectedDate))); }, [selectedDate]);

    const attendance = dailyAttendance || [];
    const total = attendance.length;
    const marked = attendance.filter((a) => a.marked).length;
    const present = attendance.filter((a) => a.status === "P").length;
    const absent = attendance.filter((a) => ["AB", "NCNS"].includes(a.status)).length;
    const halfDay = attendance.filter((a) => a.status === "HD").length;
    const onLeave = attendance.filter((a) => ["L", "WO"].includes(a.status)).length;
    const shiftDate = (n) => { const d = new Date(selectedDate); d.setDate(d.getDate() + n); setSelectedDate(d); };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: "Total", value: total, bg: "bg-slate-50", border: "border-slate-100", text: "text-slate-700", sub: "text-slate-400" },
                    { label: "Present", value: present, bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-700", sub: "text-emerald-500" },
                    { label: "Half Day", value: halfDay, bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-700", sub: "text-blue-500" },
                    { label: "Absent", value: absent, bg: "bg-rose-50", border: "border-rose-100", text: "text-rose-700", sub: "text-rose-500" },
                    { label: "Leave/WO", value: onLeave, bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-700", sub: "text-amber-500" },
                ].map((s) => (
                    <div key={s.label} className={`${s.bg} rounded-2xl px-5 py-4 border ${s.border}`}>
                        <p className={`text-[9px] font-black uppercase tracking-widest ${s.sub}`}>{s.label}</p>
                        <p className={`text-2xl font-black ${s.text} leading-none mt-1`}>{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-5 flex items-center justify-between">
                <button onClick={() => shiftDate(-1)} className="p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"><ChevronLeft size={20} /></button>
                <div className="flex items-center gap-3">
                    <Clock size={16} className="text-emerald-500" />
                    <span className="text-sm font-black text-slate-700">{formatDisplayDate(selectedDate)}</span>
                    {formatDate(selectedDate) === formatDate(today) && <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Today</span>}
                </div>
                <button onClick={() => shiftDate(1)} disabled={formatDate(selectedDate) >= formatDate(today)} className="p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"><ChevronRight size={20} /></button>
            </div>

            {total > 0 && (
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marking Progress</p>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{marked} / {total} marked</p>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${(marked / total) * 100}%` }}></div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="px-8 py-5">Agent</th>
                                <th className="px-8 py-5 text-center">Role</th>
                                <th className="px-8 py-5 text-center">Status</th>
                                <th className="px-8 py-5">Comments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={4} className="px-8 py-16 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Loading...</td></tr>
                            ) : attendance.length === 0 ? (
                                <tr><td colSpan={4} className="px-8 py-16 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">No data for this date</td></tr>
                            ) : attendance.map((record) => {
                                const meta = STATUS_META[record.status] || { label: "Not Marked", bg: "bg-slate-50", text: "text-slate-400", border: "border-slate-100", dot: "bg-slate-300" };
                                return (
                                    <tr key={record.userId} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-500 text-sm">{record.profileImage ? (
                                                        <img
                                                        src={record.profileImage}
                                                        alt={record.name}
                                                        className="w-full h-full object-cover rounded-3xl"
                                                        />
                                                    ) : (
                                                        record.name?.charAt(0)
                                                    )}</div>
                                                <div>
                                                    <p className="font-black text-slate-800 leading-none mb-1">{record.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400">{record.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${getRoleColor(record.role)}`}>{record.role}</span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${meta.bg} ${meta.text} ${meta.border}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`}></span>
                                                {meta.label}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-xs font-semibold text-slate-500">{record.comments || <span className="text-slate-300">—</span>}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Monthly Tab 
const MonthlyTab = () => {
    const today = new Date();
    const dispatch = useDispatch();
    const { monthlyAttendance, isLoading } = useSelector((s) => s.admin);
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [expandedUser, setExpandedUser] = useState(null);
    const monthStr = `${year}-${String(month).padStart(2, "0")}`;

    useEffect(() => { dispatch(fetchMonthlyAttendanceThunk(monthStr)); }, [monthStr]);

    const prevMonth = () => { if (month === 1) { setMonth(12); setYear((y) => y - 1); } else setMonth((m) => m - 1); };
    const nextMonth = () => {
        const nM = month === 12 ? 1 : month + 1;
        const nY = month === 12 ? year + 1 : year;
        if (new Date(nY, nM - 1) > today) return;
        setMonth(nM); setYear(nY);
    };

    const isCurrent = year === today.getFullYear() && month === today.getMonth() + 1;
    const report = monthlyAttendance || [];
    const monthName = new Date(year, month - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const totalEff = report.reduce((s, r) => s + r.effectiveDays, 0);
    const totalDed = report.reduce((s, r) => s + r.deductions, 0);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-2xl px-5 py-4 border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Agents</p>
                    <p className="text-2xl font-black text-slate-700 leading-none mt-1">{report.length}</p>
                </div>
                <div className="bg-emerald-50 rounded-2xl px-5 py-4 border border-emerald-100">
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Total Eff. Days</p>
                    <p className="text-2xl font-black text-emerald-700 leading-none mt-1">{totalEff}</p>
                </div>
                <div className="bg-rose-50 rounded-2xl px-5 py-4 border border-rose-100">
                    <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Total Deductions</p>
                    <p className="text-2xl font-black text-rose-700 leading-none mt-1">{totalDed}</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-5 flex items-center justify-between">
                <button onClick={prevMonth} className="p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"><ChevronLeft size={20} /></button>
                <div className="flex items-center gap-3">
                    <CalendarDays size={16} className="text-emerald-500" />
                    <span className="text-sm font-black text-slate-700">{monthName}</span>
                    {isCurrent && <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Current</span>}
                </div>
                <button onClick={nextMonth} disabled={isCurrent} className="p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"><ChevronRight size={20} /></button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="px-8 py-5">Agent</th>
                                <th className="px-8 py-5 text-center">Role</th>
                                {["P", "HD", "AB", "NCNS", "WO", "L"].map((s) => <th key={s} className="px-5 py-5 text-center">{s}</th>)}
                                <th className="px-8 py-5 text-center">Eff. Days</th>
                                <th className="px-8 py-5 text-center">Deductions</th>
                                <th className="px-8 py-5 text-center">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={11} className="px-8 py-16 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Loading report...</td></tr>
                            ) : report.length === 0 ? (
                                <tr><td colSpan={11} className="px-8 py-16 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">No attendance data for this month</td></tr>
                            ) : report.map((record) => (
                                <React.Fragment key={record.user.id}>
                                    <tr className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-500 text-sm">{record.user?.profileImage ? (
                                                        <img
                                                        src={record.user?.profileImage}
                                                        alt={record.user?.name}
                                                        className="w-full h-full object-cover rounded-3xl"
                                                        />
                                                    ) : (
                                                        record.user.name?.charAt(0)
                                                    )}</div>
                                                <div>
                                                    <p className="font-black text-slate-800 leading-none mb-1">{record.user.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400">{record.user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${getRoleColor(record.user.role)}`}>{record.user.role}</span>
                                        </td>
                                        {["P", "HD", "AB", "NCNS", "WO", "L"].map((s) => (
                                            <td key={s} className="px-5 py-5 text-center">
                                                <span className={`inline-block w-7 h-7 rounded-xl text-[11px] font-black leading-7 ${record.summary[s] > 0 ? `${STATUS_COLORS[s].light} ${STATUS_COLORS[s].text}` : "text-slate-300"}`}>
                                                    {record.summary[s] || "—"}
                                                </span>
                                            </td>
                                        ))}
                                        <td className="px-8 py-5 text-center">
                                            <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100">{record.effectiveDays}</span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`text-sm font-black px-3 py-1 rounded-xl border ${record.deductions > 0 ? "text-rose-600 bg-rose-50 border-rose-100" : "text-slate-300 bg-slate-50 border-slate-100"}`}>
                                                {record.deductions > 0 ? `-${record.deductions}` : "0"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <button onClick={() => setExpandedUser(expandedUser === record.user.id ? null : record.user.id)}
                                                className="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-200 transition-all cursor-pointer">
                                                {expandedUser === record.user.id ? "Hide" : "View"}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedUser === record.user.id && (
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <td colSpan={11} className="px-8 py-5">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Day-wise Breakdown</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {record.days.length === 0 ? <span className="text-xs font-bold text-slate-400">No records</span>
                                                        : record.days.map((day) => (
                                                            <div key={day.date} className="flex flex-col items-center gap-1 group relative">
                                                                <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black ${DAY_STATUS_STYLE[day.status] || "bg-slate-100 text-slate-400"}`}>{day.status}</span>
                                                                <span className="text-[9px] font-bold text-slate-400">{new Date(day.date).getDate()}</span>
                                                                {day.comments && (
                                                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-10">
                                                                        {day.comments}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Main 
const TABS = [
    { id: "mark", label: "Mark Attendance", icon: Plus },
    { id: "daily", label: "Daily View", icon: Calendar },
    { id: "monthly", label: "Monthly Report", icon: BarChart2 },
];

const AdminAttendance = () => {
    const [activeTab, setActiveTab] = useState("mark");

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                <div className="flex items-center gap-4">
                    <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600"><Calendar size={32} /></div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none">Attendance</h1>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Mark, view daily & monthly reports</p>
                    </div>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-2 flex gap-2">
                {TABS.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => setActiveTab(id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer ${activeTab === id ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                            }`}>
                        <Icon size={15} />{label}
                    </button>
                ))}
            </div>

            {activeTab === "mark" && <MarkTab />}
            {activeTab === "daily" && <DailyTab />}
            {activeTab === "monthly" && <MonthlyTab />}
        </div>
    );
};

export default AdminAttendance;