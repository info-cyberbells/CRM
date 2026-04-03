import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  RotateCcw,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getActivityLogs } from "../../features/ADMIN/activitylogsSlice";
import { createPortal } from "react-dom";
import { useRef } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────

const ACTION_CONFIG = {
  LOGIN: {
    label: "Login",
    class: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  LOGOUT: {
    label: "Logout",
    class: "bg-red-50 text-red-600 border border-red-200",
  },
  CLOCK_IN: {
    label: "Clock In",
    class: "bg-green-50 text-green-700 border border-green-200",
  },
  CLOCK_OUT: {
    label: "Clock Out",
    class: "bg-orange-50 text-orange-600 border border-orange-200",
  },
  BREAK_START: {
    label: "Break Start",
    class: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  },
  BREAK_END: {
    label: "Break End",
    class: "bg-yellow-50 text-yellow-600 border border-yellow-200",
  },
  CASE_CREATED: {
    label: "Case Created",
    class: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  CASE_UPDATED: {
    label: "Case Updated",
    class: "bg-blue-50 text-blue-600 border border-blue-200",
  },
  CASE_STATUS_CHANGED: {
    label: "Status Changed",
    class: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  },
  CASE_NOTE_ADDED: {
    label: "Note Added",
    class: "bg-sky-50 text-sky-700 border border-sky-200",
  },
  PLAN_UPGRADED: {
    label: "Plan Upgraded",
    class: "bg-purple-50 text-purple-700 border border-purple-200",
  },
  PROFILE_UPDATED: {
    label: "Profile Updated",
    class: "bg-teal-50 text-teal-700 border border-teal-200",
  },
  CASE_SEARCH: {
    label: "Case Search",
    class: "bg-cyan-50 text-cyan-700 border border-cyan-200",
  },
  CASE_VIEWED: {
    label: "Case Viewed",
    class: "bg-violet-50 text-violet-700 border border-violet-200",
  },
};

const ROLE_CONFIG = {
  Sale: "bg-orange-50 text-orange-700 border border-orange-200",
  Tech: "bg-sky-50 text-sky-700 border border-sky-200",
  Tech_Lead: "bg-purple-50 text-purple-700 border border-purple-200",
};

const INITIAL_FILTERS = {
  search: "",
  userRole: "",
  action: "",
  entityType: "",
  startDate: "",
  endDate: "",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDateTime(iso) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ActionBadge({ action }) {
  const cfg = ACTION_CONFIG[action] || {
    label: action,
    class: "bg-slate-50 text-slate-600 border border-slate-200",
  };
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${cfg.class}`}
    >
      {cfg.label}
    </span>
  );
}

function RoleBadge({ role }) {
  const cls =
    ROLE_CONFIG[role] || "bg-slate-50 text-slate-600 border border-slate-200";
  return (
    <span
      className={`inline-block px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${cls}`}
    >
      {role}
    </span>
  );
}

function Avatar({ name, profileImage }) {
  // Get initials fallback
  const initials = getInitials(name || "?");

  if (profileImage) {
    return (
      <img
        src={profileImage}
        alt={name}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-[#1e293b] flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">
      {initials}
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col gap-1">
      <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.18em]">
        {label}
      </div>
      <div className="text-2xl font-black text-slate-800">{value ?? "—"}</div>
      <div className="text-[10px] font-semibold text-slate-400">{sub}</div>
    </div>
  );
}

function FilterInput({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-[130px]">
      <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.14em]">
        {label}
      </div>
      {children}
    </div>
  );
}

const inputCls =
  "px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none bg-white transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100";

function Spinner() {
  return (
    <tr>
      <td colSpan={9} className="py-32 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            Loading Logs...
          </p>
        </div>
      </td>
    </tr>
  );
}

function EmptyRow() {
  return (
    <tr>
      <td
        colSpan={9}
        className="py-20 text-center text-slate-400 font-black uppercase tracking-widest text-xs italic"
      >
        No activity logs found
      </td>
    </tr>
  );
}

function PageButton({ children, active, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 rounded-lg text-[11px] font-black border transition-all
        ${
          active
            ? "bg-emerald-500 text-white border-emerald-500"
            : disabled
              ? "opacity-40 cursor-not-allowed border-slate-200 bg-white text-slate-700"
              : "cursor-pointer border-slate-200 bg-white text-slate-700 hover:bg-[#1e293b] hover:text-white hover:border-[#1e293b]"
        }`}
    >
      {children}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ActivityLogs() {
  const dispatch = useDispatch();
  const { logs, pagination, loading } = useSelector(
    (state) => state.activityLogs,
  );

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });
  const [limit, setLimit] = useState(20);
  const debounceRef = useRef(null);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = { page, limit };
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      dispatch(getActivityLogs(params));
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [page, limit, filters, dispatch]);

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }

  function resetFilters() {
    setFilters(INITIAL_FILTERS);
    setPage(1);
  }

  function toggleRow(id, field) {
    setExpandedRows((prev) => ({
      ...prev,
      [`${id}-${field}`]: !prev[`${id}-${field}`],
    }));
  }

  // Pagination page numbers (window of 5)
  function getPageNumbers() {
    if (!pagination) return [];
    const { totalPages } = pagination;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  const pn = pagination;
  const from = pn ? (pn.page - 1) * pn.limit + 1 : 0;
  const to = pn ? Math.min(pn.page * pn.limit, pn.total) : 0;

  const showTooltip = (e, content) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      content,
      x: rect.left,
      y: rect.bottom + 8,
    });
  };

  const hideTooltip = () => {
    setTooltip({ visible: false, content: "", x: 0, y: 0 });
  };

  function handleLimitChange(val) {
    setLimit(Number(val));
    setPage(1);
  }

  function parseMetadata(value) {
    if (!value) return "—";
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === "string" ? parsed : value;
    } catch {
      return value;
    }
  }

  return (
    <div className="max-w-8xl mx-auto space-y-6 animate-in fade-in duration-500 pb-24 px-4 pt-6">
      {/* ── Header ── */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
        <div className="flex items-center gap-3">
          <FileText className="text-emerald-600" size={32} />
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Activity Logs
          </h1>
        </div>
        <p className="mt-2 text-sm text-slate-400 font-semibold ml-12">
          Track all agent actions — logins, cases, sessions, plans & more
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Records" value={pn?.total} sub="All time" />
        <StatCard
          label="This Page"
          value={pn ? to - from + 1 : "—"}
          sub="Showing now"
        />
        <StatCard label="Total Pages" value={pn?.totalPages} sub="Paginated" />
        <StatCard label="Current Page" value={pn?.page} sub="Active page" />
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-5">
        <div className="flex flex-wrap gap-3 items-end">
          <FilterInput label="Search">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                className={`${inputCls} pl-8 w-full`}
                placeholder="Case ID, description..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                // onKeyDown={handleKeyDown}
              />
            </div>
          </FilterInput>

          <FilterInput label="Role">
            <select
              className={inputCls}
              value={filters.userRole}
              onChange={(e) => handleFilterChange("userRole", e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="Sale">Sale</option>
              <option value="Tech">Tech</option>
            </select>
          </FilterInput>

          <FilterInput label="Action">
            <select
              className={inputCls}
              value={filters.action}
              onChange={(e) => handleFilterChange("action", e.target.value)}
            >
              <option value="">All Actions</option>
              {Object.entries(ACTION_CONFIG).map(([val, { label }]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          </FilterInput>

          <FilterInput label="Entity">
            <select
              className={inputCls}
              value={filters.entityType}
              onChange={(e) => handleFilterChange("entityType", e.target.value)}
            >
              <option value="">All Entities</option>
              <option value="case">Case</option>
              <option value="session">Session</option>
              <option value="plan">Plan</option>
              <option value="auth">Auth</option>
            </select>
          </FilterInput>

          <FilterInput label="From Date">
            <input
              type="date"
              className={inputCls}
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </FilterInput>

          <FilterInput label="To Date">
            <input
              type="date"
              className={inputCls}
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </FilterInput>

          <div className="flex gap-2 pb-0.5">
            <button
              onClick={resetFilters}
              className="px-4 py-2 cursor-pointer border border-slate-200 text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition flex items-center gap-1"
            >
              <RotateCcw size={11} /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm text-left">
            <thead className="bg-[#1e293b] text-white">
              <tr>
                {[
                  "#",
                  "Agent",
                  "Role",
                  "Action",
                  "Entity",
                  "Entity ID",
                  "Description",
                  "Meta Data",
                  "Timestamp",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-4 text-center font-black uppercase tracking-widest text-[9px] border border-slate-700 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <Spinner />
              ) : logs.length === 0 ? (
                <EmptyRow />
              ) : (
                logs.map((log, i) => {
                  const { date, time } = formatDateTime(log.created_at);
                  const serial = from + i;
                  return (
                    <tr
                      key={log.id}
                      className="border-b border-slate-100 hover:bg-emerald-50/30 transition duration-150"
                    >
                      {/* # */}
                      <td className="px-4 py-3 text-center border border-slate-100">
                        <span className="text-[10px] font-black text-slate-300">
                          {serial}
                        </span>
                      </td>

                      {/* Agent */}
                      <td className="px-4 py-3 border border-slate-100">
                        <div className="flex items-center gap-2 min-w-[150px]">
                          <Avatar
                            name={log.user?.name || "?"}
                            profileImage={log.user?.profileImage}
                          />
                          <div>
                            <div className="text-xs font-black text-slate-800 whitespace-nowrap">
                              {log.user?.name || "Unknown"}
                            </div>
                            <div className="text-[10px] font-semibold text-slate-400">
                              {log.user?.email || "—"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3 text-center border border-slate-100">
                        <RoleBadge role={log.userRole} />
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3 text-center border border-slate-100">
                        <ActionBadge action={log.action} />
                      </td>

                      {/* Entity Type */}
                      <td className="px-4 py-3 text-center border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-500 capitalize">
                          {log.entityType || "—"}
                        </span>
                      </td>

                      {/* Entity ID */}
                      <td className="px-4 py-3 text-center border border-slate-100">
                        <span className="text-[10px] font-black text-emerald-600">
                          {log.entityId || "—"}
                        </span>
                      </td>

                      <td
                        className="px-4 py-3 border border-slate-100 max-w-[220px]"
                        onMouseEnter={(e) =>
                          log.description && showTooltip(e, log.description)
                        }
                        onMouseLeave={hideTooltip}
                      >
                        <p
                          className={`text-[11px] font-semibold text-slate-500 `}
                        >
                          {log.description || "—"}
                        </p>
                      </td>

                      {/* meta data */}

                      <td
                        className="px-4 py-3 border border-slate-100 max-w-[160px] text-center"
                        onMouseEnter={(e) =>
                          log.metadata &&
                          !expandedRows[`${log.id}-meta`] &&
                          showTooltip(e, parseMetadata(log.metadata))
                        }
                        onMouseLeave={hideTooltip}
                      >
                        <p
                          className={`text-[11px] font-semibold text-slate-500 ${expandedRows[`${log.id}-meta`] ? "whitespace-pre-wrap break-words text-left" : "truncate"}`}
                        >
                          {parseMetadata(log.metadata)}
                        </p>
                        {log.metadata &&
                          parseMetadata(log.metadata).length > 30 && (
                            <button
                              onClick={() => {
                                toggleRow(log.id, "meta");
                                hideTooltip();
                              }}
                              className="text-[9px] cursor-pointer font-bold text-emerald-600 uppercase tracking-widest hover:text-emerald-800 mt-1"
                            >
                              {expandedRows[`${log.id}-meta`]
                                ? "Show Less"
                                : "See More"}
                            </button>
                          )}
                      </td>

                      {/* Timestamp */}
                      <td className="px-4 py-3 text-center border border-slate-100">
                        <span className="block text-[11px] font-black text-slate-700">
                          {date}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {time}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {pn && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 gap-3">
            <div className="flex items-center gap-3">
              <p className="text-[11px] font-bold text-slate-400">
                Showing{" "}
                <span className="text-slate-700 font-black">{from}</span>–
                <span className="text-slate-700 font-black">{to}</span> of{" "}
                <span className="text-slate-700 font-black">{pn.total}</span>{" "}
                records
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Rows
                </span>
                <select
                  value={limit}
                  onChange={(e) => handleLimitChange(e.target.value)}
                  className="px-2 py-1 border border-slate-200 rounded-lg text-[11px] font-black text-slate-700 outline-none bg-white focus:border-emerald-400 cursor-pointer"
                >
                  {[20, 40, 60, 100].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <PageButton
                disabled={!pn.hasPrevPage}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={13} />
              </PageButton>

              {getPageNumbers().map((p) => (
                <PageButton
                  key={p}
                  active={p === page}
                  onClick={() => setPage(p)}
                >
                  {p}
                </PageButton>
              ))}

              <PageButton
                disabled={!pn.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight size={13} />
              </PageButton>
            </div>
          </div>
        )}
      </div>

      {tooltip.visible &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: tooltip.y,
              left: tooltip.x,
            }}
            className="z-[9999] w-64 bg-[#1e293b] text-white text-[11px] font-semibold rounded-xl px-3 py-2 shadow-lg leading-relaxed"
          >
            {tooltip.content}
            <div className="absolute -top-1.5 left-6 w-3 h-3 bg-[#1e293b] rotate-45" />
          </div>,
          document.body,
        )}
    </div>
  );
}
