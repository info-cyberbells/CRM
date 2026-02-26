import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  RefreshCw,
  User,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShieldCheck,
  Filter,
  DollarSign,
  Briefcase,
  Clock,
  LayoutGrid,
  Pencil,
  UserPlus,
  ShieldAlert,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Monitor,
  Lock,
  Calendar,
  CreditCard,
  FileText,
  Activity,
  StickyNote,
  AlertCircle,
  MessageSquare,
  Send,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  fetchCaseById,
  updateCase,
} from "../../features/SearchSlice/searchSlice";
import {
  getSingleCaseById,
  updateCaseByTech,
} from "../../features/TechUserSlice/TechUserSlice";
import {
  adminViewCase,
  searchTechUser,
  updateCaseDetailsByAdmin,
  resetSelectedCases,
} from "../../features/ADMIN/adminSlice";
import { useToast } from "../../ToastContext/ToastContext";
import { addCaseNoteTech, getCaseNotesTech, addCaseNoteSale, getCaseNotesSale, addCaseNoteAdmin, getCaseNotesAdmin } from "../../features/CaseNotes/casenotesSlice";

/**
 * --- CONSTANTS ---
 */
const operatingSystems = ["Windows", "Mac", "Chromebook", "IOS"];
const securitySoftwareOptions = [
  "Norton",
  "McAfee",
  "Kaspersky",
  "Bitdefender",
  "Avast",
];
const planOptions = ["Silver", "Gold", "Platinum"];

const planDurationOptions = [
  "1 Year",
  "2 Years",
  "3 Years",
  "4 Years",
  "5 Years",
  "6 Years",
  "7 Years",
  "8 Years",
  "9 Years",
  "10 Years",
  "Lifetime",
];

const formatCurrency = (val) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    val || 0,
  );

const getStatusStyle = (status) => {
  const s = status?.toLowerCase();
  if (["completed", "active", "success", "open"].includes(s))
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (["pending", "in progress"].includes(s))
    return "bg-amber-100 text-amber-700 border-amber-200";
  if (["failed", "cancelled", "void", "refund", "chargeback"].includes(s))
    return "bg-rose-100 text-rose-700 border-rose-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
};

const StatusConfirmModal = ({ isOpen, onCancel, onConfirm, pendingStatus }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100 scale-in-center">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-amber-50 text-amber-500 rounded-full">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            Confirm Status Change?
          </h2>
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            You are about to update this case status to{" "}
            <span className="text-emerald-600 font-black uppercase">
              "{pendingStatus}"
            </span>
            .
          </p>
          <div className="flex gap-3 w-full pt-4">
            <button
              onClick={onCancel}
              className="flex-1 cursor-pointer py-3 px-4 rounded-2xl bg-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 px-4 cursor-pointer rounded-2xl bg-emerald-600 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// add new note text box
const NoteInput = ({ newNote, handleInputChange, handlePostNote }) => (
  <div className="mt-4 pt-5 border-t border-slate-100">
    <div className="flex items-center justify-between mb-3">
      <div className="flex gap-1.5">
        {['General', 'Urgent', 'Follow-up'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => handleInputChange('type', type)}
            className={`text-xs font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full border transition-all ${
              newNote.type === type 
                ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
        New Note
      </span>
    </div>

    <div className="relative group">
      <textarea
        placeholder="Type note..."
        value={newNote.text}
        onChange={(e) => handleInputChange('text', e.target.value)}
        className="w-full p-4 pr-14 rounded-2xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none font-medium text-sm transition-all min-h-[90px] resize-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]"
      />
      <button 
        type="button"
        onClick={handlePostNote}
        disabled={!newNote.text.trim()}
        className="absolute bottom-3 cursor-pointer right-3 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-100 active:scale-95"
        aria-label="Send note"
      >
        <Send size={18} />
      </button>
    </div>
  </div>
);






const CaseDetailPage = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [newNote, setNewNote] = useState({
    type: "General",
    text: ""
  });

  const [editing, setEditing] = useState(location.state?.editing || false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  // Get role
  const role = localStorage.getItem("Role")?.toLowerCase() || "admin";
  const isTech = role === "tech";
  const isAdmin = role === "admin";
  const isSale = role === "sale";

  const [techSearch, setTechSearch] = useState("");
  const [showTechDropdown, setShowTechDropdown] = useState(false);
  const techDropdownRef = useRef(null);
  const [activeRemoteIndex, setActiveRemoteIndex] = useState(0);
  const [showAllRemotes, setShowAllRemotes] = useState(false);

  // Get data from Redux
  const { selectedCase: techSelectedCase, isLoading: techLoading } =
    useSelector((state) => state.techUser);
  const {
    selectedCase: adminSelectedCase,
    isLoading: adminLoading,
    searchLoading,
    searchTechusers,
  } = useSelector((state) => state.admin);
  const { selectedCase: salesSelectedCase, loading: salesLoading } =
    useSelector((state) => state.salesCases);

  const data = isTech
    ? techSelectedCase
    : isAdmin
      ? adminSelectedCase
      : salesSelectedCase;
  const loading = isTech ? techLoading : isAdmin ? adminLoading : salesLoading;

  const { notes, addloading, notesloading, noteserror } = useSelector(
    (state) => state.caseNotes,
  );

  useEffect(() => {
    //   window.scrollTo({ top: 0, behavior: "smooth" });
    document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [formData, setFormData] = useState({
    caseId: "",
    customerID: "",
    customerName: "",
    email: "",
    phone: "",
    altPhone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    remoteID: "",
    remotePass: "",
    operatingSystem: "",
    computerPass: "",
    remoteAccess: [],
    issue: "",
    modelNo: "",
    workToBeDone: "",
    specialNotes: "",
    securitySoftware: "",
    plan: "",
    planDuration: "",
    validity: "",
    saleAmount: 0,
    deductions: 0,
    chargeBack: 0,
    status: "Open",
    saleNoteText: "",
    techNoteText: "",
    adminNoteText: "",
    saleNoteType: "",
    techNoteType: "",
    adminNoteType: "",
    saleUser: { name: "" },
    techUser: { name: "" },
  });

  const remoteList = showAllRemotes
    ? formData.remoteAccess || []
    : formData.remoteAccess?.length
      ? [formData.remoteAccess[0]]
      : [];

  // Update formData when data loads
  useEffect(() => {
    if (data) {
      setFormData({
        caseId: data.caseId || "",
        customerID: data.customerID || "",
        customerName: data.customerName || "",
        email: data.email || "",
        phone: data.phone || "",
        altPhone: data.altPhone || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "",
        remoteID: data.remoteID || "",
        remotePass: data.remotePass || "",
        operatingSystem: data.operatingSystem || "",
        computerPass: data.computerPass || "",
        remoteAccess: (() => {
          if (Array.isArray(data.remoteAccess)) return data.remoteAccess;

          if (typeof data.remoteAccess === "string") {
            try {
              return JSON.parse(data.remoteAccess);
            } catch {
              return [];
            }
          }
          return [];
        })(),
        issue: data.issue || "",
        modelNo: data.modelNo || "",
        workToBeDone: data.workToBeDone || "",
        specialNotes: data.specialNotes || "",
        securitySoftware: data.securitySoftware || "",
        plan: data.plan || "",
        planDuration: data.planDuration || "",
        validity: data.validity || "",
        saleAmount: data.saleAmount || 0,
        deductions: data.deductions || 0,
        chargeBack: data.chargeBack || 0,
        saleNoteText: data.saleNoteText || "",
        techNoteText: data.techNoteText || "",
        adminNoteText: data.adminNoteText || "",
        saleNoteType: data.saleNoteType || "",
        techNoteType: data.techNoteType || "",
        adminNoteType: data.adminNoteType || "",
        status: data.status || "Open",
        saleUser: data.saleUser || { name: "" },
        techUser: data.techUser || { name: "" },
        id: data.id,
      });
    }
  }, [data]);

  // Fetch case if not loaded
  useEffect(() => {
    // Only fetch if we don't have data OR if the caseId in URL doesn't match loaded data
    if (!data || (data.caseId && data.caseId !== caseId)) {
      if (isTech) {
        dispatch(getSingleCaseById(caseId));
      } else if (isAdmin) {
        dispatch(adminViewCase(caseId));
      } else {
        dispatch(fetchCaseById(caseId));
      }
    }
  }, [caseId]);

  useEffect(() => {
    if (isTech) {
      dispatch(getCaseNotesTech(caseId));
    } else if (isAdmin) {
      dispatch(getCaseNotesAdmin(caseId));
    } else if (isSale){
      dispatch(getCaseNotesSale(caseId));
    }
  }, []);

  const adminNotes =
    notes?.filter((note) => note.createdByRole === "Admin") || [];

  const techNotes =
    notes?.filter((note) => note.createdByRole === "Tech") || [];

  const saleNotes =
    notes?.filter((note) => note.createdByRole === "Sale") || [];

 

  // Add useEffect for tech search
  useEffect(() => {
    // if (techSearch.length < 2) {
    //   setShowTechDropdown(false);
    //   return;
    // }

    if (!showTechDropdown) return;

    const timer = setTimeout(() => {
      dispatch(searchTechUser(techSearch));
      setShowTechDropdown(true);
    }, 400);

    return () => clearTimeout(timer);
  }, [techSearch, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        techDropdownRef.current &&
        !techDropdownRef.current.contains(event.target)
      ) {
        setShowTechDropdown(false);
      }
    };

    if (showTechDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTechDropdown]);

  const handleRemoteChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.remoteAccess];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, remoteAccess: updated };
    });
  };

  const handleBack = () => {
    navigate(-1);
    if (isAdmin) {
      dispatch(resetSelectedCases());
    }
  };

  const normalizeCaseData = (data) => ({
    ...data,
    saleNoteType: data.saleNoteType || null,
    techNoteType: data.techNoteType || null,
    adminNoteType: data.adminNoteType || null,
  });

  const handleToggleEdit = async (newEditingState) => {
    const normalizedData = normalizeCaseData(formData);

    if (editing && newEditingState === false) {
      // Saving
      try {
        if (isTech) {
          await dispatch(
            updateCaseByTech({
              caseId: normalizedData.caseId,
              caseData: normalizedData,
            }),
          ).unwrap();
          // Re-fetch to get updated data
          await dispatch(getSingleCaseById(caseId)).unwrap();
        } else if (isAdmin) {
          await dispatch(
            updateCaseDetailsByAdmin({
              caseId: normalizedData.caseId,
              caseData: normalizedData,
            }),
          ).unwrap();
          // Re-fetch to get updated data
          await dispatch(adminViewCase(caseId)).unwrap();
        } else {
          await dispatch(
            updateCase({
              caseId: normalizedData.caseId,
              caseData: normalizedData,
            }),
          ).unwrap();
          // Re-fetch to get updated data
          await dispatch(fetchCaseById(caseId)).unwrap();
        }

        showToast("Case updated successfully", "success");
        setEditing(false);
      } catch (error) {
        console.error("Update error:", error);
        showToast("Failed to update case", "error");
      }
    } else {
      setEditing(newEditingState);
    }
  };

  // Auto-update validity when planDuration changes
  useEffect(() => {
    if (!formData.planDuration) return;

    if (formData.planDuration === "Lifetime") {
      setFormData((prev) => ({ ...prev, validity: "Lifetime" }));
    } else {
      const years = parseInt(formData.planDuration);
      if (!isNaN(years)) {
        const date = new Date();
        date.setFullYear(date.getFullYear() + years);
        setFormData((prev) => ({ ...prev, validity: date.toISOString() }));
      }
    }
  }, [formData.planDuration]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusUpdate = (newStatus) => {
    setPendingStatus(newStatus);
    setShowConfirm(true);
  };

  const confirmStatusChange = () => {
    setFormData((prev) => ({ ...prev, status: pendingStatus }));
    showToast("Click Save Records button to save changes.", "info");
    setShowConfirm(false);
    setPendingStatus(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data && !formData.caseId) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-700">Case Not Found</h2>
          <button
            onClick={handleBack}
            className="mt-4 px-6 py-3 bg-emerald-600 text-white rounded-2xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
      day: "numeric",
    });
  };

  const NoteBubble = ({ note }) => {
    if (!note) return null;

    const typeStyles = {
      Urgent:
        "bg-rose-50 border-rose-100 text-rose-900 shadow-[0_4px_12px_rgba(244,63,94,0.08)]",
      "Follow-up":
        "bg-amber-50 border-amber-100 text-amber-900 shadow-[0_4px_12px_rgba(245,158,11,0.08)]",
      General:
        "bg-slate-50 border-slate-100 text-slate-900 shadow-[0_4px_12px_rgba(71,85,105,0.04)]",
    };

    const badgeStyles = {
      Urgent: "bg-rose-500 text-white",
      "Follow-up": "bg-amber-500 text-white",
      General: "bg-slate-500 text-white",
    };

    const initials =
      note?.creator?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "NA";

    return (
      <div
        className={`p-4 rounded-2xl border mb-4 transition-all hover:translate-y-[-2px] ${
          typeStyles[note.noteType] || typeStyles.General
        }`}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 font-bold text-[10px]">
                {initials}
              </div>
            </div>

            <div>
              <p className="text-[12px] font-black uppercase tracking-normal text-slate-700 leading-none mb-1">
                {note?.creator?.name || "Unknown"}
              </p>

              <p className="text-[11px] font-semibold flex items-center gap-1">
                <Clock size={8} />
                {note?.created_at ? formatTime(note.created_at) : "—"}
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${
              badgeStyles[note.noteType] || badgeStyles.General
            }`}
          >
            {note.noteType || "General"}
          </span>
        </div>

        <p className="text-[13px] font-medium leading-relaxed">
          {note.noteText || "—"}
        </p>
      </div>
    );
  };

  const handleInputChange = (field, value) => {
    setNewNote((prev) => ({
      ...prev,
      [field]: value
    }));
  };



const handlePostNote = async () => {
  if (!newNote.text.trim()) return;

  try {
    const payload = {
      noteType: newNote.type,
      noteText: newNote.text
    };

    if (isTech) {
      await dispatch(
        addCaseNoteTech({
          caseId,
          noteData: payload
        })
      ).unwrap();

      await dispatch(getCaseNotesTech(caseId));

    } else if (isAdmin) {
      await dispatch(
        addCaseNoteAdmin({
          caseId,
          noteData: payload
        })
      ).unwrap();

      await dispatch(getCaseNotesAdmin(caseId));

    } else if (isSale) {
      await dispatch(
        addCaseNoteSale({
          caseId,
          noteData: payload
        })
      ).unwrap();

      await dispatch(getCaseNotesSale(caseId));
    }

    // Clear input after success
    setNewNote({
      type: "General",
      text: ""
    });

    showToast("Note added successfully", "success");

  } catch (error) {
    console.error("Failed to add note:", error);
    showToast("Failed to add note", "error");
  }
};

  return (
    <div className="max-w-7xl font-[Poppins] mx-auto animate-in slide-in-from-right duration-500 pb-20 space-y-6">
      {/* Confirmation Modal */}
      <StatusConfirmModal
        isOpen={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmStatusChange}
        pendingStatus={pendingStatus}
      />

      {/* Detail Header */}
      <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-3 cursor-pointer bg-slate-50 text-slate-500 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-all active:scale-95"
            >
              <ArrowLeft size={24} strokeWidth={2.5} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                  {editing ? "Edit Case File" : "Case Overview"}
                </h1>
                <span
                  className={`px-3 py-1 text-[10px] font-black rounded-full border ${getStatusStyle(formData.status)} uppercase`}
                >
                  {formData.status}
                </span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                Case ID: {formData.caseId} CustomerID: {formData.customerID}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {isAdmin && (
              <button
                onClick={() => handleToggleEdit(!editing)}
                className={`px-8 py-3 cursor-pointer rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 ${
                  editing
                    ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100"
                    : "bg-slate-900 text-white"
                }`}
              >
                {editing ? "Save Records" : "Enter Edit Mode"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-emerald-600 border-b border-slate-50 pb-4">
              <User size={20} strokeWidth={2.5} />
              <h3 className="text-sm font-black uppercase tracking-widest">
                Customer Profile
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Customer Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] ml-1 text-slate-400">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-300 group-focus-within:text-emerald-500">
                    <User size={16} />
                  </div>
                  {editing ? (
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm transition-all shadow-sm"
                    />
                  ) : (
                    <div className="w-full pl-12 pr-4 py-4 rounded-2xl border border-transparent font-bold text-sm bg-slate-50/50 text-slate-700">
                      {formData.customerName || "—"}
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] ml-1 text-slate-400">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-300 group-focus-within:text-emerald-500">
                    <Mail size={16} />
                  </div>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm transition-all shadow-sm"
                    />
                  ) : (
                    <div className="w-full pl-12 pr-4 py-4 rounded-2xl border border-transparent font-bold text-sm bg-slate-50/50 text-slate-700">
                      {formData.email || "—"}
                    </div>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] ml-1 text-slate-400">
                  Phone Number
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-300 group-focus-within:text-emerald-500">
                    <Phone size={16} />
                  </div>
                  {editing ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm transition-all shadow-sm"
                    />
                  ) : (
                    <div className="w-full pl-12 pr-4 py-4 rounded-2xl border border-transparent font-bold text-sm bg-slate-50/50 text-slate-700">
                      {formData.phone || "—"}
                    </div>
                  )}
                </div>
              </div>

              {/* Alt Phone */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] ml-1 text-slate-400">
                  Alternate Phone
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-300 group-focus-within:text-emerald-500">
                    <Phone size={16} />
                  </div>
                  {editing ? (
                    <input
                      type="text"
                      name="altPhone"
                      value={formData.altPhone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm transition-all shadow-sm"
                    />
                  ) : (
                    <div className="w-full pl-12 pr-4 py-4 rounded-2xl border border-transparent font-bold text-sm bg-slate-50/50 text-slate-700">
                      {formData.altPhone || "Not Provided"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-6">
              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] ml-1 text-slate-400">
                  Physical Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-300 group-focus-within:text-emerald-500">
                    <MapPin size={16} />
                  </div>
                  {editing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm transition-all shadow-sm"
                    />
                  ) : (
                    <div className="w-full pl-12 pr-4 py-4 rounded-2xl border border-transparent font-bold text-sm bg-slate-50/50 text-slate-700">
                      {formData.address || "—"}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] ml-1 text-slate-400">
                    City
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-300 group-focus-within:text-emerald-500">
                      <MapPin size={16} />
                    </div>
                    {editing ? (
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm transition-all shadow-sm"
                      />
                    ) : (
                      <div className="w-full pl-12 pr-4 py-4 rounded-2xl border border-transparent font-bold text-sm bg-slate-50/50 text-slate-700">
                        {formData.city || "—"}
                      </div>
                    )}
                  </div>
                </div>
                {/* State */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] ml-1 text-slate-400">
                    State
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-300 group-focus-within:text-emerald-500">
                      <MapPin size={16} />
                    </div>
                    {editing ? (
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm transition-all shadow-sm"
                      />
                    ) : (
                      <div className="w-full pl-12 pr-4 py-4 rounded-2xl border border-transparent font-bold text-sm bg-slate-50/50 text-slate-700">
                        {formData.state || "—"}
                      </div>
                    )}
                  </div>
                </div>
                {/* Country */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] ml-1 text-slate-400">
                    Country
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-300 group-focus-within:text-emerald-500">
                      <MapPin size={16} />
                    </div>
                    {editing ? (
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm transition-all shadow-sm"
                      />
                    ) : (
                      <div className="w-full pl-12 pr-4 py-4 rounded-2xl border border-transparent font-bold text-sm bg-slate-50/50 text-slate-700">
                        {formData.country || "—"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Information */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-blue-600 border-b border-slate-50 pb-4">
              <Monitor size={20} strokeWidth={2.5} />
              <h3 className="text-sm font-black uppercase tracking-widest">
                Technical Diagnosis
              </h3>
            </div>

            {/* Issue */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] ml-1 text-slate-400">
                Technical Issue
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-6 transition-colors text-slate-300 group-focus-within:text-emerald-500">
                  <FileText size={16} />
                </div>
                {editing ? (
                  <textarea
                    name="issue"
                    value={formData.issue}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm transition-all min-h-[100px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                  />
                ) : (
                  <div className="w-full pl-12 pr-4 py-4 rounded-2xl border border-transparent font-bold text-sm bg-slate-50/50 text-slate-700 min-h-[100px]">
                    {formData.issue || "—"}
                  </div>
                )}
              </div>
            </div>

            {/* Work To Be Done */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] ml-1 text-slate-400">
                Work To Be Done
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-6 transition-colors text-slate-300 group-focus-within:text-emerald-500">
                  <Activity size={16} />
                </div>
                {editing ? (
                  <textarea
                    name="workToBeDone"
                    value={formData.workToBeDone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm transition-all min-h-[100px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                  />
                ) : (
                  <div className="w-full pl-12 pr-4 py-4 rounded-2xl border border-transparent font-bold text-sm bg-slate-50/50 text-slate-700 min-h-[100px]">
                    {formData.workToBeDone || "—"}
                  </div>
                )}
              </div>
            </div>
            {/* Model Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] ml-1 text-slate-400">
                  Model Number
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-300 group-focus-within:text-emerald-500">
                    <LayoutGrid size={16} />
                  </div>
                  {editing ? (
                    <input
                      type="text"
                      name="modelNo"
                      value={formData.modelNo}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm transition-all shadow-sm"
                    />
                  ) : (
                    <div className="w-full pl-12 pr-4 py-4 rounded-2xl border border-transparent font-bold text-sm bg-slate-50/50 text-slate-700">
                      {formData.modelNo || "—"}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {remoteList.map((remote, index) => (
              <div
                key={remote.id ?? index}
                className="bg-white rounded-[2rem] p-8 border border-slate-100 space-y-6"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-black uppercase tracking-widest text-blue-600">
                    Remote Access Info {index + 1}
                  </h4>

                  {!editing && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      ID: {remote.id}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* OS */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] ml-1 text-slate-400">
                      Operating System
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-300 group-focus-within:text-emerald-500">
                        <Monitor size={16} />
                      </div>
                      {editing ? (
                        <select
                          name="operatingSystem"
                          value={remote.operatingSystem}
                          onChange={(e) =>
                            handleRemoteChange(
                              index,
                              "operatingSystem",
                              e.target.value,
                            )
                          }
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm transition-all appearance-none"
                        >
                          {operatingSystems.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="w-full pl-12 pr-4 py-4 rounded-2xl border border-transparent font-bold text-sm bg-slate-50/50 text-slate-700">
                          {remote.operatingSystem || "—"}
                        </div>
                      )}
                      {editing && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <ChevronRight size={14} className="rotate-90" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Remote ID */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] ml-1 text-slate-400">
                      Remote ID
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-300 group-focus-within:text-emerald-500">
                        <LayoutGrid size={16} />
                      </div>
                      {editing ? (
                        <input
                          type="text"
                          name="remoteID"
                          value={remote.remoteID}
                          onChange={(e) =>
                            handleRemoteChange(
                              index,
                              "remoteID",
                              e.target.value,
                            )
                          }
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm transition-all shadow-sm"
                        />
                      ) : (
                        <div className="w-full pl-12 pr-4 py-4 rounded-2xl border border-transparent font-bold text-sm bg-slate-50/50 text-slate-700">
                          {remote.remoteID || "—"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Remote Password */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] ml-1 text-slate-400">
                      Remote Password
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-300 group-focus-within:text-emerald-500">
                        <Lock size={16} />
                      </div>
                      {editing ? (
                        <input
                          type="text"
                          name="remotePass"
                          value={remote.remotePass}
                          onChange={(e) =>
                            handleRemoteChange(
                              index,
                              "remotePass",
                              e.target.value,
                            )
                          }
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm transition-all shadow-sm"
                        />
                      ) : (
                        <div className="w-full pl-12 pr-4 py-4 rounded-2xl border border-transparent font-bold text-sm bg-slate-50/50 text-slate-700">
                          {remote.remotePass || "—"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] ml-1 text-slate-400">
                      Computer Pass
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-300 group-focus-within:text-emerald-500">
                        <Lock size={16} />
                      </div>
                      {editing ? (
                        <input
                          type="text"
                          name="computerPass"
                          value={remote.computerPass}
                          onChange={(e) =>
                            handleRemoteChange(
                              index,
                              "computerPass",
                              e.target.value,
                            )
                          }
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm transition-all shadow-sm"
                        />
                      ) : (
                        <div className="w-full pl-12 pr-4 py-4 rounded-2xl border border-transparent font-bold text-sm bg-slate-50/50 text-slate-700">
                          {remote.computerPass || "—"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {formData.remoteAccess?.length > 1 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setShowAllRemotes((p) => !p)}
                  className="text-xs cursor-pointer font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-800"
                >
                  {showAllRemotes ? "Show Less" : "Show More Remote Access"}
                </button>
              </div>
            )}
          </div>

          {/* Special Notes Section */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400"></div>
            <div className="flex items-center gap-2 text-amber-600 border-b border-slate-50 pb-4">
              <StickyNote size={20} strokeWidth={2.5} />
              <h3 className="text-sm font-black uppercase tracking-widest">
                Special Notes & Observations
              </h3>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] ml-1 text-slate-400">
                Special Note
              </label>

              <div className="relative group">
                <div className="absolute left-4 top-6 transition-colors text-slate-300 group-focus-within:text-emerald-500">
                  <StickyNote size={16} />
                </div>
                {editing ? (
                  <textarea
                    name="specialNotes"
                    value={formData.specialNotes}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm transition-all min-h-[100px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                  />
                ) : (
                  <div className="w-full pl-12 pr-4 py-4 rounded-2xl border border-transparent font-bold text-sm bg-slate-50/50 text-slate-700 min-h-[100px]">
                    {formData.specialNotes || "—"}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
              {" "}
              {/* SALE NOTES SECTION */}{" "}
              <section className="space-y-5">
                {" "}
                <div className="flex items-center gap-3 text-indigo-600 px-1">
                  {" "}
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    {" "}
                    <MessageSquare size={16} />{" "}
                  </div>{" "}
                  <h4 className="text-[12px] font-black uppercase tracking-[0.2em]">
                    Sale Agent Notes
                  </h4>{" "}
                  <div className="h-[1px] flex-grow bg-gradient-to-r from-indigo-100 to-transparent"></div>{" "}
                </div>{" "}
                <div className="max-h-[350px] overflow-y-auto px-1 custom-scrollbar">
                  {" "}
                  {saleNotes.length > 0 ? (
                    saleNotes.map((note) => (
                      <NoteBubble key={note.id} note={note} />
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic text-center py-6 border-2 border-dashed border-slate-100 rounded-3xl">
                      No sales activity logged yet.
                    </p>
                  )}{" "}
                </div>{" "}
                {isSale &&  <NoteInput
                        newNote={newNote}
                        handleInputChange={handleInputChange}
                        handlePostNote={handlePostNote}
                      /> } 
              </section>{" "}


              {/* TECH NOTES SECTION */}{" "}
              <section className="space-y-5">
                {" "}
                <div className="flex items-center gap-3 text-emerald-600 px-1">
                  {" "}
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    {" "}
                    <AlertCircle size={16} />{" "}
                  </div>{" "}
                  <h4 className="text-[12px] font-black uppercase tracking-[0.2em]">
                    Tech Agent Notes
                  </h4>{" "}
                  <div className="h-[1px] flex-grow bg-gradient-to-r from-emerald-100 to-transparent"></div>{" "}
                </div>{" "}
                <div className="max-h-[350px] overflow-y-auto px-1 custom-scrollbar">
                  {" "}
                  {techNotes.length > 0 ? (
                    techNotes.map((note) => (
                      <NoteBubble key={note.id} note={note} />
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic text-center py-6 border-2 border-dashed border-slate-100 rounded-3xl">
                      No technical updates found.
                    </p>
                  )}{" "}
                </div>{" "}
                {isTech &&  <NoteInput
                        newNote={newNote}
                        handleInputChange={handleInputChange}
                        handlePostNote={handlePostNote}
                      /> } 
                    </section>{" "}
              {/* ADMIN NOTES SECTION */}{" "}
              <section className="space-y-5">
                {" "}
                <div className="flex items-center gap-3 text-slate-900 px-1">
                  {" "}
                  <div className="p-2 bg-slate-100 rounded-lg">
                    {" "}
                    <User size={16} />{" "}
                  </div>{" "}
                  <h4 className="text-[12px] font-black uppercase tracking-[0.2em]">
                    Admin Note
                  </h4>{" "}
                  <div className="h-[1px] flex-grow bg-gradient-to-r from-slate-200 to-transparent"></div>{" "}
                </div>{" "}
                <div className="max-h-[350px] overflow-y-auto px-1 custom-scrollbar">
                  {" "}
                  {adminNotes.length > 0 ? (
                    adminNotes.map((note) => (
                      <NoteBubble key={note.id} note={note} />
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic text-center py-6 border-2 border-dashed border-slate-100 rounded-3xl">
                      No admin directives recorded.
                    </p>
                  )}{" "}
                </div>{" "}
                {isAdmin &&  <NoteInput
                        newNote={newNote}
                        handleInputChange={handleInputChange}
                        handlePostNote={handlePostNote}
                      /> }
              </section>{" "}
            </div>
          </div>
        </div>

        {/* Side Panel: Billing & Plan */}
        <div className="space-y-6">
          {/* Status Management Section */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-slate-800 border-b border-slate-50 pb-4">
              <Activity size={20} strokeWidth={2.5} />
              <h3 className="text-sm font-black uppercase tracking-widest">
                Case Status
              </h3>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] ml-1 text-slate-400">
                Update Status
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                  <Activity size={16} />
                </div>
                <select
                  value={formData.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  disabled={!editing}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-black text-xs uppercase transition-all shadow-sm appearance-none ${editing ? "cursor-pointer" : "cursor-default"}`}
                >
                  <option value="Open">Open</option>
                  <option value="Pending">Pending</option>
                  <option value="Closed">Closed</option>
                  {/* {isAdmin && (
                    <> */}
                  <option value="Void">Void</option>
                  <option value="Refund">Refund</option>
                  <option value="Chargeback">Chargeback</option>
                  {/* </>
                  )} */}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronRight size={14} className="rotate-90" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-slate-800 border-b border-slate-50 pb-4">
              <UserPlus size={20} strokeWidth={2.5} />
              <h3 className="text-sm font-black uppercase tracking-widest">
                Assignments
              </h3>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black uppercase tracking-tighter shadow-sm">
                    REP
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Sale User
                    </p>
                    <p className="text-sm font-black text-slate-700">
                      {formData.saleUser?.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tech User - Updated with Search */}
              {!isTech && (
                <div className="relative" ref={techDropdownRef}>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">
                    Tech User Assignment
                  </label>
                  {editing && isAdmin && (
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                        <UserPlus size={16} />
                      </div>
                      <input
                        type="text"
                        value={techSearch} // Remove the fallback here
                        disabled={!isAdmin}
                        onFocus={() => {
                          setShowTechDropdown(true);
                          if (!showTechDropdown) {
                            dispatch(searchTechUser(techSearch || ""));
                          }
                        }}
                        onChange={(e) => {
                          setTechSearch(e.target.value);
                          // Only clear techUserId if user is typing, not when empty
                          if (e.target.value === "") {
                            setFormData((prev) => ({
                              ...prev,
                              techUserId: null,
                              techUser: { name: "" },
                            }));
                          }
                        }}
                        placeholder={
                          formData.techUser?.name
                            ? formData.techUser.name
                            : isAdmin
                              ? "Assign Tech User"
                              : "Not assigned yet"
                        }
                        autoComplete="off"
                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 ${
                          isAdmin
                            ? "bg-[#f9fafb] focus:bg-white focus:border-emerald-500"
                            : "bg-slate-100 cursor-not-allowed"
                        } outline-none font-bold text-sm transition-all shadow-sm`}
                      />

                      {showTechDropdown && isAdmin && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto">
                          {searchLoading ? (
                            <div className="p-4 text-center text-slate-500">
                              <RefreshCw
                                className="animate-spin inline-block mr-2"
                                size={16}
                              />
                              Searching...
                            </div>
                          ) : searchTechusers.length === 0 ? (
                            <div className="p-4 text-center text-slate-400 text-sm">
                              No tech user found with this keyword
                            </div>
                          ) : (
                            searchTechusers.map((user) => (
                              <div
                                key={user.id}
                                className="p-4 hover:bg-emerald-50 cursor-pointer transition-colors border-b border-slate-50 last:border-b-0"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    techUserId: user.id,
                                    techUser: { name: user.name },
                                  }));
                                  setTechSearch(""); // Clear search after selection
                                  setShowTechDropdown(false);
                                  showToast(
                                    "Click Save Records to Save",
                                    "info",
                                  );
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black">
                                    {user.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-slate-700">
                                      {user.name}
                                    </p>
                                    <p className="text-xs text-slate-400 truncate">
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {formData.techUser?.name ? (
                    <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                            {formData.techUser.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                              Currently Assigned
                            </p>
                            <p className="text-xs font-black text-slate-700">
                              {formData.techUser.name}
                            </p>
                          </div>
                        </div>
                        {isAdmin && editing && (
                          <button
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                techUserId: null,
                                techUser: { name: "" },
                              }));
                              setTechSearch("");
                            }}
                            className="text-rose-500 cursor-pointer hover:text-rose-700 text-xs font-bold"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    !editing && (
                      <p className="mt-3 text-xs  text-center font-bold text-slate-400">
                        Not assigned yet
                      </p>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Plan & Validity Card */}
          <div className="bg-emerald-600 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-100 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <CreditCard size={80} strokeWidth={1} />
            </div>
            <div className="flex items-center gap-2 border-b border-emerald-500/50 pb-4">
              <CreditCard size={20} strokeWidth={2.5} />
              <h3 className="text-sm font-black uppercase tracking-widest">
                Plan Details
              </h3>
            </div>

            <div className="space-y-6">
              {/* Plan */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] ml-1 text-emerald-200">
                  Current Plan
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-emerald-300 group-focus-within:text-white">
                    <LayoutGrid size={16} />
                  </div>
                  {editing ? (
                    <select
                      name="plan"
                      value={formData.plan}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border outline-none font-bold text-sm transition-all shadow-sm appearance-none bg-emerald-700 border-emerald-500 text-white focus:border-white"
                    >
                      {planOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full pl-12 pr-4 py-4 rounded-2xl border border-transparent font-bold text-sm bg-emerald-500/20 text-white">
                      {formData.plan || "—"}
                    </div>
                  )}
                  {editing && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-300">
                      <ChevronRight size={14} className="rotate-90" />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Security Software */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] ml-1 text-emerald-200">
                    Security Software
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-emerald-300 group-focus-within:text-white">
                      <ShieldCheck size={16} />
                    </div>
                    {editing ? (
                      <input
                        name="securitySoftware"
                        value={formData.securitySoftware}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border outline-none font-bold text-sm transition-all shadow-sm appearance-none bg-emerald-700 border-emerald-500 text-white focus:border-white"
                      />
                    ) : (
                      <div className="w-full pl-12 pr-4 py-4 rounded-2xl border border-transparent font-bold text-sm bg-emerald-500/20 text-white">
                        {formData.securitySoftware || "—"}
                      </div>
                    )}
                  </div>
                </div>
                {/* Duration */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] ml-1 text-emerald-200">
                    Plan Duration
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-emerald-300 group-focus-within:text-white">
                      <Clock size={16} />
                    </div>
                    {editing ? (
                      <select
                        name="planDuration"
                        value={formData.planDuration}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border outline-none font-bold text-sm transition-all shadow-sm appearance-none bg-emerald-700 border-emerald-500 text-white focus:border-white"
                      >
                        {planDurationOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="w-full pl-12 pr-4 py-4 rounded-2xl border border-transparent font-bold text-sm bg-emerald-500/20 text-white">
                        {formData.planDuration || "—"}
                      </div>
                    )}
                    {editing && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-300">
                        <ChevronRight size={14} className="rotate-90" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Validity */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] ml-1 text-emerald-200">
                  Validity Date (Calculated)
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-emerald-300">
                    <Calendar size={16} />
                  </div>
                  <div className="w-full pl-12 pr-4 py-4 rounded-2xl border border-transparent font-bold text-sm bg-emerald-500/20 text-white">
                    {formData.validity
                      ? formData.validity === "Lifetime"
                        ? "Lifetime"
                        : formData.validity.split("T")[0]
                      : "—"}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-emerald-500/50">
              <div className="space-y-4">
                {/* Gross */}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                    Sale Amount
                  </span>
                  <div className="relative group w-32">
                    {editing ? (
                      <input
                        type="number"
                        name="saleAmount"
                        value={formData.saleAmount}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-xl border outline-none font-bold text-sm transition-all shadow-sm bg-emerald-700 border-emerald-500 text-white focus:border-white"
                      />
                    ) : (
                      <div className="w-full px-3 py-2 rounded-xl border border-transparent font-bold text-sm text-right text-white">
                        {formatCurrency(formData.saleAmount)}
                      </div>
                    )}
                  </div>
                </div>
                {/* Deduction */}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                    Chargeback
                  </span>
                  <div className="relative group w-32">
                    {editing ? (
                      <input
                        type="number"
                        name="chargeBack"
                        value={formData.chargeBack}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-xl border outline-none font-bold text-sm transition-all shadow-sm bg-emerald-700 border-emerald-500 text-white focus:border-white"
                      />
                    ) : (
                      <div className="w-full px-3 py-2 rounded-xl border border-transparent font-bold text-sm text-right text-white">
                        {formatCurrency(formData.chargeBack)}
                      </div>
                    )}
                  </div>
                </div>
                {/* Net */}
                <div className="flex justify-between items-center pt-2 border-t border-emerald-500/20">
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Net Value
                  </span>
                  <p className="text-2xl font-black">
                    {formatCurrency(formData.saleAmount - formData.chargeBack)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailPage;
