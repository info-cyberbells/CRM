import React, { useState, useEffect, useMemo } from "react";
import {
  ClipboardList,
  Search,
  Filter,
  Clock,
  StickyNote,
  History,
  X,
  PlusCircle,
  Briefcase,
  Wrench,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSaleUserOngoingCases,
  setCurrentPage,
  setPageSize,
  updateCase,
} from "../../features/SearchSlice/searchSlice";
import { useToast } from "../../ToastContext/ToastContext";
import {
  fetchTechUserOngoingCases,
  updateCaseByTech,
} from "../../features/TechUserSlice/TechUserSlice";

const NotesFeed = () => {
  const dispatch = useDispatch();
  const {
    ongoingCases: salecases,
    loading,
    error,
    showModal,
    pagination: salePagination,
    searchFilters,
  } = useSelector((state) => state.salesCases);

  const {
    ongoingCases: techCases,
    pagination: techPagination,
    isLoading,
  } = useSelector((state) => state.techUser);

  const role = localStorage.getItem("Role");

  const pagination = role === "Sale" ? salePagination : techPagination;

  const { currentPage, pageSize, totalPages, totalCount } = pagination;

  const [activeNote, setActiveNote] = useState(
    role === "SALE" ? "sale" : role === "TECH" ? "tech" : "admin",
  );

  useEffect(() => {
    if (role === "Sale") {
      dispatch(
        fetchSaleUserOngoingCases({ page: currentPage, limit: pageSize }),
      );
    } else {
      dispatch(
        fetchTechUserOngoingCases({ page: currentPage, limit: pageSize }),
      );
    }
  }, []);

  const cases = role === "Sale" ? salecases : techCases;

  const [activeNotesCase, setActiveNotesCase] = useState(null);

  const handlePageSizeChange = (newPageSize) => {
    if (role === "Sale") {
      dispatch(setPageSize(newPageSize));
      dispatch(
        fetchSaleUserOngoingCases({
          page: 1,
          limit: newPageSize,
          filters: searchFilters,
        }),
      );
    } else {
        dispatch(
          fetchTechUserOngoingCases({
            page: 1,
            limit: newPageSize,
            filters: {}
          })
        );
      }
  };

  const handlePageChange = (newPage) => {
    if (role === "Sale"){
        dispatch(setCurrentPage(newPage));
    dispatch(
      fetchSaleUserOngoingCases({
        page: newPage,
        limit: pageSize,
        filters: searchFilters,
      }),
    );
    } else {
        dispatch(
          fetchTechUserOngoingCases({
            page: newPage,
            limit: pageSize,
            filters: {}
          })
        );
    }
  };

  //   if (loading) return <LoadingScreen />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
              <ClipboardList size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none">
                Notes
              </h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
                Manage notes for all open cases
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        {/* <div className="p-6 border-b border-slate-100 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 mr-4">
            <Filter size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Filter Category</span>
          </div>
          {["ALL", "General", "Follow-up", "Urgent"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all
                ${categoryFilter === cat 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                  : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-transparent'}`}
            >
              {cat}
            </button>
          ))}
        </div> */}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b">
                <th className="px-8 py-5 w-64">Case & Customer</th>
                <th className="px-8 py-5 text-center">Note</th>
                {/* <th className="px-8 py-5 w-40">Posted By</th> */}
                <th className="px-8 py-5 w-40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {cases.length > 0 ? (
                cases.map((note) => (
                  <tr
                    key={note.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-600 font-black text-xs">
                            #{note.caseId}
                          </span>
                          {(
                            activeNote === "sale"
                              ? note.saleNoteType
                              : activeNote === "tech"
                                ? note.techNoteType
                                : note.adminNoteType
                          ) ? (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase border
      ${
        (activeNote === "sale"
          ? note.saleNoteType
          : activeNote === "tech"
            ? note.techNoteType
            : note.adminNoteType) === "Urgent"
          ? "bg-rose-100 text-rose-600 border-rose-200"
          : (activeNote === "sale"
                ? note.saleNoteType
                : activeNote === "tech"
                  ? note.techNoteType
                  : note.adminNoteType) === "Follow-up"
            ? "bg-amber-100 text-amber-600 border-amber-200"
            : "bg-slate-100 text-slate-600 border-slate-200"
      }`}
                            >
                              {activeNote === "sale"
                                ? note.saleNoteType
                                : activeNote === "tech"
                                  ? note.techNoteType
                                  : note.adminNoteType}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-sm font-bold text-slate-800">
                          {note.customerName || " "}
                        </p>
                        {/* <p className="text-[10px] text-slate-400 font-bold truncate max-w-[180px]">{note.issue || " "}</p> */}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {/* <div className="space-y-2">
                        <p className="text-sm text-slate-600 font-medium leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
                          {note.saleNoteText || "N/A"}
                        </p>
                      </div> */}
                        <div className="space-y-2  flex items-center">
                          {/* Switch Buttons */}
                          <div className="flex gap-1">
                            <button
                              onClick={() => setActiveNote("sale")}
                              className={`flex items-center gap-2.5 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300

          ${
            activeNote === "sale"
              ? "bg-white text-emerald-600 ring-1 ring-slate-200/50"
              : "text-slate-400 cursor-pointer hover:text-slate-600 hover:bg-white/40"
          }`}
                            >
                              Sale
                            </button>

                            <button
                              onClick={() => setActiveNote("tech")}
                              className={`flex items-center gap-2.5 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300

          ${
            activeNote === "tech"
              ? "bg-white text-purple-600 ring-1 ring-slate-200/50"
              : "text-slate-400 cursor-pointer hover:text-slate-600 hover:bg-white/40"
          }`}
                            >
                              Tech
                            </button>

                            <button
                              onClick={() => setActiveNote("admin")}
                              className={`flex items-center gap-2.5 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300

          ${
            activeNote === "admin"
              ? "bg-white text-blue-600 ring-1 ring-slate-200/50"
              : "text-slate-400 cursor-pointer hover:text-slate-600 hover:bg-white/40"
          }`}
                            >
                              Admin
                            </button>
                          </div>

                          {/* Note Content */}
                          <p className="text-sm ml-2 text-slate-600 font-medium leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
                            {activeNote === "sale" &&
                              (note.saleNoteText || "No sales note")}
                            {activeNote === "tech" &&
                              (note.techNoteText || "No tech note")}
                            {activeNote === "admin" &&
                              (note.adminNoteText || "No admin note")}
                          </p>
                        </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => setActiveNotesCase(note)}
                        className="inline-flex cursor-pointer items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest whitespace-nowrap"
                      >
                        <StickyNote size={12} /> Manage Notes
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="py-24 text-center opacity-30 italic"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <History size={48} />
                      <p className="text-sm font-black uppercase tracking-widest text-emerald-400">
                        No activity history found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
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

            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden lg:block">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{" "}
              entries
            </div>

            <div className="flex items-center gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="
                    px-6 py-3 cursor-pointer
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

      {activeNotesCase && (
        <CaseNotesPanel
          caseItem={activeNotesCase}
          currentUser={{ name: "Sale User" }} // or from auth redux
          onClose={() => setActiveNotesCase(null)}
          currentPage={currentPage}
          pageSize={pageSize}
          onAddNote={(caseId, note) => {
            console.log("Add note:", caseId, note);
          }}
        />
      )}
    </div>
  );
};



// modal to view and add Note
const CaseNotesPanel = ({ caseItem, onClose, currentPage, pageSize }) => {
  const [noteText, setNoteText] = useState("");
  const [category, setCategory] = useState("General");

  const { showToast } = useToast();

  const dispatch = useDispatch();

  const role = localStorage.getItem("Role");

  const categories = [
    {
      name: "General",
      color: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
    { name: "Urgent", color: "bg-rose-50 text-rose-700 ring-rose-100" },
    { name: "Follow-up", color: "bg-amber-50 text-amber-700 ring-amber-100" },
  ];

  const getCategoryStyle = (type) => {
    return (
      categories.find((c) => c.name === type)?.color ||
      "bg-slate-100 text-slate-500"
    );
  };

  useEffect(() => {
    if (!caseItem || !role) return;

    if (role === "Sale") {
      setNoteText(caseItem.saleNoteText || "");
      setCategory(caseItem.saleNoteType || "General");
    }

    if (role === "Tech") {
      setNoteText(caseItem.techNoteText || "");
      setCategory(caseItem.techNoteType || "General");
    }

    if (role === "Admin") {
      setNoteText(caseItem.adminNoteText || "");
      setCategory(caseItem.adminNoteType || "General");
    }
  }, [caseItem, role]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!noteText.trim() || !role) return;

    let payload = {};

    if (role === "Sale") {
      payload = {
        saleNoteText: noteText,
        saleNoteType: category,
      };
    }

    if (role === "Tech") {
      payload = {
        techNoteText: noteText,
        techNoteType: category,
      };
    }

    if (role === "Admin") {
      payload = {
        adminNoteText: noteText,
        adminNoteType: category,
      };
    }

    if (role === "Sale") {
      dispatch(updateCase({ caseId: caseItem.caseId, caseData: payload }))
        .unwrap()
        .then(() => {
          showToast("Your Note Added", "success");
          dispatch(
            fetchSaleUserOngoingCases({ page: currentPage, limit: pageSize }),
          );
          onClose();
        })
        .catch((err) => {
          console.error("Case update failed:", err);
          showToast("Failed to add Note", "error");
        });
    }
    if (role === "Tech") {
      dispatch(updateCaseByTech({ caseId: caseItem.caseId, caseData: payload }))
        .unwrap()
        .then(() => {
          showToast("Your Note Added", "success");
          dispatch(
            fetchTechUserOngoingCases({ page: currentPage, limit: pageSize }),
          );
          onClose();
        })
        .catch((err) => {
          console.error("Case update failed:", err);
          showToast("Failed to add Note", "error");
        });
    }

    //   onAddNote(caseItem.id, payload);
  };

  // Helper to render static note cards
  const StaticNoteCard = ({ title, type, content, icon: Icon, colorClass }) => (
    <div
      className={`border rounded-3xl p-5 bg-white shadow-sm border-slate-100 hover:border-emerald-200 transition-colors`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${colorClass}`}>
            <Icon size={14} />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
        </div>
        {type ? (
          <span
            className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full ring-1
                ${getCategoryStyle(type)}`}
          >
            {type}
          </span>
        ) : null}
      </div>
      <p className="text-slate-600 text-xs leading-relaxed">
        {content || `No ${title.toLowerCase()} recorded for this case.`}
      </p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="bg-white min-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-emerald-600 p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl text-white shadow-inner">
              <StickyNote size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg leading-tight">
                Case Notes
              </h3>
              <p className="text-emerald-100 text-[10px] font-bold tracking-[0.2em] uppercase opacity-80">
                #{caseItem.caseId} • {caseItem.customerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 cursor-pointer text-emerald-100 hover:bg-white/10 rounded-xl transition-all hover:rotate-90 duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50">
            {/* Historical/Departmental Notes Section */}
            <div className="space-y-4">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Departmental Overviews
              </h5>
              <div className="grid gap-4">
                <StaticNoteCard
                  title="Sales Note"
                  type={caseItem.saleNoteType}
                  content={caseItem.saleNoteText}
                  icon={Briefcase}
                  colorClass="bg-blue-50 text-blue-600"
                />
                <StaticNoteCard
                  title="Tech Note"
                  type={caseItem.techNoteType}
                  content={caseItem.techNoteText}
                  icon={Wrench}
                  colorClass="bg-purple-50 text-purple-600"
                />
                <StaticNoteCard
                  title="Admin Note"
                  type={caseItem.adminNoteType}
                  content={caseItem.adminNoteText}
                  icon={ShieldCheck}
                  colorClass="bg-emerald-50 text-emerald-600"
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border-t border-slate-100 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2 mb-2 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2
                    ${
                      category === cat.name
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                        : "border-transparent cursor-pointer bg-slate-50 text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="relative">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Share an update or internal note..."
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-4 pr-12 text-sm font-medium focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all resize-none h-28"
                />
                <div className="absolute top-4 right-4 text-slate-300">
                  <MessageSquare size={18} />
                </div>
              </div>

              <button
                type="submit"
                disabled={!noteText.trim()}
                className="w-full cursor-pointer bg-emerald-600 text-white font-black uppercase tracking-[0.15em] text-xs py-4 rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:scale-100 transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle size={18} strokeWidth={2.5} /> Your Case Note
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesFeed;
