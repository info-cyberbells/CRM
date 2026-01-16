import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  RefreshCw,
  User,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShieldCheck,
  SearchCode,
  Filter,
  DollarSign,
  Briefcase,
  Clock,
  LayoutGrid,
} from "lucide-react";
import {
  fetchSaleUserCases,
  fetchCaseById,
  updateCase,
  setSearchFilters,
  setPageSize,
  setCurrentPage,
  setShowModal,
  updateSelectedCase,
} from "../../features/SearchSlice/searchSlice";
import { useToast } from "../../ToastContext/ToastContext";
import {
  getTechUserAssignedCases,
  setTechCurrentPage,
  setTechPageSize,
  setTechSearchFilters,
  getSingleCaseById,
  setTechShowModal,
  updateCaseByTech,
  updateTechSelectedCase,
} from "../../features/TechUserSlice/TechUserSlice";
import {
  fetchAllCasesAdmin,
  setAdminSearchFilters,
  setAdminCurrentPage,
  setAdminShowModal,
  setAdminPageSize,
  adminViewCase,
  updateAdminSelectedCase,
  updateCaseDetailsByAdmin,
  searchTechUser,
} from "../../features/ADMIN/adminSlice";


const SearchCase = () => {
  const dispatch = useDispatch();
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

  const {
    cases: adminCases,
    pagination: adminPagination,
    isLoading: adminLoading,
    error: adminError,
    showModal: adminShowModal,
    searchFilters: adminSearchFilters,
    selectedCase: adminSelectedCase,
    searchLoading,
    searchTechusers,
  } = useSelector((state) => state.admin);

  const role = localStorage.getItem("Role")?.toLowerCase() || "Admin";
  const isTech = role === "tech";
  const isSale = role === "sale";
  const isAdmin = role === "admin";

  const { showToast } = useToast();

  const debounceRef = useRef();
  const isInitialMount = useRef(true);

  const [filters, setFilters] = useState({
    customerName: "",
    phone: "",
    customerID: "",
    email: "",
  });

  const cases =
    role === "tech" ? techCases : role === "admin" ? adminCases : salesCases;
  const pagination =
    role === "tech"
      ? techPagination
      : role === "admin"
      ? adminPagination
      : salesPagination;

  const loading =
    role === "tech"
      ? techLoading
      : role === "admin"
      ? adminLoading
      : salesLoading;

  const error =
    role === "tech" ? techError : role === "admin" ? adminError : salesError;

  const searchFilters =
    role === "tech"
      ? techSearchFilters
      : role === "admin"
      ? adminSearchFilters
      : salesSearchFilters;

  const selectedCase =
    role === "tech"
      ? techSelectedCase
      : role === "admin"
      ? adminSelectedCase
      : salesSelectedCase;

  const showModal =
    role === "tech"
      ? techShowModal
      : role === "admin"
      ? adminShowModal
      : saleShowModal;

  const { currentPage, pageSize, totalPages, totalCount } = pagination;

  const fetchCases = ({ page, limit, filters }) => {
    if (role === "admin") {
      dispatch(fetchAllCasesAdmin({ page, limit, filters }));
    }
    if (role === "tech") {
      dispatch(getTechUserAssignedCases({ page, limit, filters }));
    }
    if (role === "sale") {
      dispatch(fetchSaleUserCases({ page, limit, filters }));
    }
  };

  const handleRefresh = () => {
    const emptyFilters = {
      customerName: "",
      phone: "",
      customerID: "",
      email: "",
    };

    if (isTech) dispatch(setTechSearchFilters(emptyFilters));
    else if (isAdmin) dispatch(setAdminSearchFilters(emptyFilters));
    else dispatch(setSearchFilters(emptyFilters));

    // dispatch(isTech ? setTechCurrentPage(1) : setCurrentPage(1));

    if (isTech) {
      dispatch(setTechCurrentPage(1));
    }
    if (isAdmin) {
      dispatch(setAdminCurrentPage(1));
    }
    if (isSale) {
      dispatch(setCurrentPage(1));
    }

    fetchCases({
      page: 1,
      limit: pageSize,
      filters: emptyFilters,
    });
  };

  useEffect(() => {
    const emptyFilters = {
      customerName: "",
      phone: "",
      customerID: "",
      email: "",
    };

    if (isTech) dispatch(setTechSearchFilters(emptyFilters));
    else if (isAdmin) dispatch(setAdminSearchFilters(emptyFilters));
    else dispatch(setSearchFilters(emptyFilters));

    if (isTech) {
      dispatch(setTechCurrentPage(1));
    }
    if (isAdmin) {
      dispatch(setAdminCurrentPage(1));
    }
    if (isSale) {
      dispatch(setCurrentPage(1));
    }

    // Fetch once on mount
    // fetchCases({
    //   page: 1,
    //   limit: pageSize,
    //   filters: emptyFilters,
    // });

    return () => {
      if (isTech) {
        dispatch(setTechSearchFilters(emptyFilters));
        dispatch(setTechCurrentPage(1));
      } else if (isAdmin) {
        dispatch(setAdminSearchFilters(emptyFilters));
        dispatch(setAdminCurrentPage(1));
      } else if (isSale) {
        dispatch(setSearchFilters(emptyFilters));
        dispatch(setCurrentPage(1));
      }
    };
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Skip fetch on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchCases({
        page: 1,
        limit: pageSize,
        filters: searchFilters,
      });
    }, 1000);

    return () => clearTimeout(debounceRef.current);
  }, [searchFilters]); // Remove pageSize from here

  const handleFilterChange = (field, value) => {
    if (isTech) dispatch(setTechSearchFilters({ [field]: value }));
    else if (isAdmin) dispatch(setAdminSearchFilters({ [field]: value }));
    else dispatch(setSearchFilters({ [field]: value }));
  };

  const handlePageSizeChange = (newPageSize) => {
    if (isTech) {
      dispatch(setTechPageSize(newPageSize));
      dispatch(setTechCurrentPage(1));
    } else if (isAdmin) {
      dispatch(setAdminPageSize(newPageSize));
      dispatch(setAdminCurrentPage(1));
    } else {
      dispatch(setPageSize(newPageSize));
      dispatch(setCurrentPage(1));
    }

    // Fetch with new page size and reset to page 1
    fetchCases({
      page: 1,
      limit: newPageSize,
      filters: searchFilters,
    });
  };

  const handlePageChange = (newPage) => {
    if (isTech) dispatch(setTechCurrentPage(newPage));
    else if (isAdmin) dispatch(setAdminCurrentPage(newPage));
    else dispatch(setCurrentPage(newPage));
    fetchCases({
      page: newPage,
      limit: pageSize,
      filters: searchFilters,
    });
  };

  // --- Helpers ---
  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val || 0);

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "completed" || s === "active" || s === "success")
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (s === "pending" || s === "in progress")
      return "bg-amber-100 text-amber-700 border-amber-200";
    if (s === "failed" || s === "cancelled")
      return "bg-rose-100 text-rose-700 border-rose-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-6 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="max-w-8xl mx-auto space-y-6 animate-in fade-in duration-700 pb-20">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
          <div className="flex justify-between">
            <div className="flex items-center gap-3">
              <SearchCode className="text-emerald-600" size={32} />
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                Global Case Search
              </h1>
            </div>
            <button
                onClick={handleRefresh}
              className="px-6 py-3 cursor-pointer bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200 active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Customer Name */}
            <div className="group space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-[0.15em]">
                Customer Name
              </label>
              <input
                type="text"
                placeholder="Enter customer name"
                value={searchFilters.customerName || ""}
                onChange={(e) =>
                  handleFilterChange("customerName", e.target.value)
                }
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm"
              />
            </div>

            {/* Phone Number */}
            <div className="group space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-[0.15em]">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="Enter phone number"
                value={searchFilters.phone || ""}
                onChange={(e) => handleFilterChange("phone", e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm"
              />
            </div>

            {/* Customer ID */}
            <div className="group space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-[0.15em]">
                Customer ID
              </label>
              <input
                type="text"
                placeholder="Enter customer ID"
                value={searchFilters.customerID || ""}
                onChange={(e) =>
                  handleFilterChange("customerID", e.target.value)
                }
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm"
              />
            </div>

            {/* Email */}
            <div className="group space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-[0.15em]">
                Email Address
              </label>
              <input
                type="text"
                placeholder="Enter email address"
                value={searchFilters.email || ""}
                onChange={(e) => handleFilterChange("email", e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-[#f9fafb] focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm"
              />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-4 py-6">Case ID</th>
                  <th className="px-6 py-6">Customer</th>
                  <th className="px-6 py-6">Plan</th>
                  <th className="px-6 py-6">Sale</th>
                  {/* {role === "admin" && (
                    <th className="px-6 py-6 text-center">Tech</th>
                  )} */}
                  <th className="px-6 py-6">Amount</th>
                  {/* <th className="px-6 py-6">Ded.</th>
                  <th className="px-6 py-6">Net</th> */}
                  <th className="px-6 py-6">Case Status</th>
                  <th className="px-6 py-6">Date</th>
                  <th className="px-6 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="12" className="py-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                        <p className="font-black text-[10px] text-slate-400 uppercase tracking-[0.3em]">
                          Processing Records...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : cases.length > 0 ? (
                  cases.map((c, idx) => (
                    <tr
                      key={c.id || idx}
                      className="hover:bg-emerald-50/30 transition-all group"
                    >
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-black text-emerald-800">
                        {c.caseId}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800 group-hover:text-emerald-700 transition-colors">
                            {c.customerName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                            {c.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-tight">
                          {c.plan || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center text-[13px] text-slate-500 font-bold italic">
                        {/* {c.caseCreatedBy || "N/A"} */}
                        <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-gray-500 uppercase w-8">Sale:</span>
                          <span className="text-xs font-bold text-slate-600">{c.caseCreatedBy || "N/A"}</span>
                        </div>
                        {role === "admin" && <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-gray-500 uppercase w-8">Tech:</span>
                          <span className={`px-2 py-1 rounded text-[10px] font-black uppercase
                                ${c.assignedTo === "Unassigned"
                                ? "bg-rose-100 text-rose-700 border border-rose-200"
                                : "bg-emerald-50 text-emerald-700"}
                            `}
                            >
                            {c.assignedTo}</span>
                        </div>}
                      </div>
                      </td>
                      {/* {role === "admin" && (
                        <td className="px-6 py-5 whitespace-nowrap text-center">
                          {c.assignedTo ? (
                            <span
                            className={`px-2 py-1 rounded text-[10px] font-black uppercase
                                ${c.assignedTo === "Unassigned"
                                ? "bg-rose-100 text-rose-700 border border-rose-200"
                                : "bg-emerald-50 text-emerald-700"}
                            `}
                            >
                            {c.assignedTo}
                            </span>
                          ) : (
                            <span className="text-slate-300 text-[10px] font-bold uppercase">
                              N/A
                            </span>
                          )}
                        </td>
                      )} */}
                      <td className="px-6 py-5 whitespace-nowrap text-[13px] font-bold text-slate-400">
                        {formatCurrency(c.saleAmount)}
                      </td>
                      {/* <td className="px-6 py-5 whitespace-nowrap text-[13px] font-bold text-rose-400">
                        -{formatCurrency(c.deduction)}
                      </td> */}
                      {/* <td className="px-6 py-5 whitespace-nowrap text-sm font-black text-slate-800">
                        {formatCurrency(c.netAmount)}
                      </td> */}
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-[10px] font-black rounded-full border shadow-sm ${getStatusStyle(
                            c.issueStatus
                          )} uppercase tracking-tighter`}
                        >
                          {c.issueStatus}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-700">
                            {c.date}
                          </span>
                          
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <button className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all">
                          <Eye size={20} strokeWidth={2.5} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 text-slate-200">
                          <User size={48} />
                        </div>
                        <h3 className="text-lg font-black text-slate-700">
                          No Records Found
                        </h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
                          Adjust filters to see results
                        </p>
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
      </div>
    </div>
  );
};

export default SearchCase;
