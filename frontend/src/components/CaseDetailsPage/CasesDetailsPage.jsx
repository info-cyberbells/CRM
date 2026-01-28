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

/**
 * --- CONSTANTS ---
 */
const operatingSystems = [
  "Windows 10",
  "Windows 11",
  "macOS",
  "Linux Ubuntu",
  "Linux Mint",
];
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

const CaseDetailPage = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [editing, setEditing] = useState(location.state?.editing || false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  // Get role
  const role = localStorage.getItem("Role")?.toLowerCase() || "admin";
  const isTech = role === "tech";
  const isAdmin = role === "admin";

  const [techSearch, setTechSearch] = useState("");
  const [showTechDropdown, setShowTechDropdown] = useState(false);

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

  // Add useEffect for tech search
  useEffect(() => {
    if (techSearch.length < 2) {
      setShowTechDropdown(false);
      return;
    }

    const timer = setTimeout(() => {
      dispatch(searchTechUser(techSearch));
      setShowTechDropdown(true);
    }, 400);

    return () => clearTimeout(timer);
  }, [techSearch, dispatch]);

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
            updateCaseByTech({ caseId: normalizedData.caseId, caseData: normalizedData }),
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
            updateCase({ caseId: normalizedData.caseId, caseData: normalizedData }),
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
            {isAdmin && 
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
            }
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                      value={formData.operatingSystem}
                      onChange={handleChange}
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
                      {formData.operatingSystem || "—"}
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
                      value={formData.remoteID}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm transition-all shadow-sm"
                    />
                  ) : (
                    <div className="w-full pl-12 pr-4 py-4 rounded-2xl border border-transparent font-bold text-sm bg-slate-50/50 text-slate-700">
                      {formData.remoteID || "—"}
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
                      value={formData.remotePass}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm transition-all shadow-sm"
                    />
                  ) : (
                    <div className="w-full pl-12 pr-4 py-4 rounded-2xl border border-transparent font-bold text-sm bg-slate-50/50 text-slate-700">
                      {formData.remotePass || "—"}
                    </div>
                  )}
                </div>
              </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Computer Pass */}
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
                      value={formData.computerPass}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm transition-all shadow-sm"
                    />
                  ) : (
                    <div className="w-full pl-12 pr-4 py-4 rounded-2xl border border-transparent font-bold text-sm bg-slate-50/50 text-slate-700">
                      {formData.computerPass || "—"}
                    </div>
                  )}
                </div>
              </div>
              {/* Model Number */}
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

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                  Sale Note
                </label>
                {formData.saleNoteType && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase
          ${
            formData.saleNoteType === "Urgent"
              ? "bg-rose-100 text-rose-600"
              : formData.saleNoteType === "Follow-up"
                ? "bg-amber-100 text-amber-600"
                : "bg-slate-100 text-slate-600"
          }`}
                  >
                    {formData.saleNoteType}
                  </span>
                )}
              </div>
              <div className="pl-4 pr-4 py-4 rounded-2xl bg-slate-50 text-slate-700 font-bold text-sm min-h-[80px]">
                {formData.saleNoteText || "—"}
              </div>
            </div>

            {/* TECH NOTE */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                  Tech Note
                </label>

                {formData.techNoteType && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase
          ${
            formData.techNoteType === "Urgent"
              ? "bg-rose-100 text-rose-600"
              : formData.techNoteType === "Follow-up"
                ? "bg-amber-100 text-amber-600"
                : "bg-slate-100 text-slate-600"
          }`}
                  >
                    {formData.techNoteType}
                  </span>
                )}
              </div>
              <div className="pl-4 pr-4 py-4 rounded-2xl bg-slate-50 text-slate-700 font-bold text-sm min-h-[80px]">
                {formData.techNoteText || "—"}
              </div>
            </div>

            {/* ADMIN NOTE */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                  Admin Note
                </label>

                {/* NOTE TYPE */}
                {isAdmin && editing ? (
                  <select
                    value={formData.adminNoteType || "General"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        adminNoteType: e.target.value,
                      }))
                    }
                    className="text-[9px] font-black uppercase rounded-full px-2 py-1
                   bg-white border border-slate-200 text-slate-600
                   focus:outline-none focus:border-emerald-500"
                  >
                    <option value="General">General</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Follow-up">Follow-up</option>
                  </select>
                ) : (
                  formData.adminNoteType && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase
            ${
              formData.adminNoteType === "Urgent"
                ? "bg-rose-100 text-rose-600"
                : formData.adminNoteType === "Follow-up"
                  ? "bg-amber-100 text-amber-600"
                  : "bg-slate-100 text-slate-600"
            }`}
                    >
                      {formData.adminNoteType}
                    </span>
                  )
                )}
              </div>

              {/* NOTE TEXT */}
              {isAdmin && editing ? (
                <textarea
                  value={formData.adminNoteText || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      adminNoteText: e.target.value,
                    }))
                  }
                  placeholder="Write admin note..."
                  className="w-full pl-4 pr-4 py-4 rounded-2xl border border-slate-200
                 bg-white text-slate-700 font-bold text-sm min-h-[100px]
                 focus:outline-none focus:border-emerald-500 transition-all"
                />
              ) : (
                <div className="pl-4 pr-4 py-4 rounded-2xl bg-slate-50 text-slate-700 font-bold text-sm min-h-[80px]">
                  {formData.adminNoteText || "—"}
                </div>
              )}
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
                <div className="relative">
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
                              ? "Search Tech User"
                              : "Not assigned yet"
                        }
                        autoComplete="off"
                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 ${
                          isAdmin
                            ? "bg-[#f9fafb] focus:bg-white focus:border-emerald-500"
                            : "bg-slate-100 cursor-not-allowed"
                        } outline-none font-bold text-sm transition-all shadow-sm`}
                      />

                      {showTechDropdown &&
                        techSearch.length >= 2 &&
                        isAdmin && (
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
                                    <div>
                                      <p className="text-sm font-black text-slate-700">
                                        {user.name}
                                      </p>
                                      <p className="text-xs text-slate-400">
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
