import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Eye, CirclePlus, RefreshCcw, Edit, AlertCircle } from 'lucide-react';
import { getSingleCaseById, getTechUserAssignedCases, setTechCurrentPage, setTechPageSize, updateCaseByTech } from '../../features/TechUserSlice/TechUserSlice';
import { useToast } from '../../ToastContext/ToastContext';
import { useNavigate } from 'react-router-dom';

const TechUpdateCaseStatus = () => {
    const dispatch = useDispatch();
    const {showToast} = useToast();
    const navigate =  useNavigate();
    const [ShowConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedCaseId, setSelectedCaseId] = useState(null);
    const [targetStatus, setTargetStatus] = useState("");

    const {cases,  pagination, isLoading} = useSelector((state)=> state.techUser);
    const { currentPage, totalPages, totalCount, pageSize } = pagination;

useEffect(()=>{
  dispatch(getTechUserAssignedCases({
      page: 1,
      limit: 10,
      filters: {}
    }));
 },[])


  const fetchCaseDetails = async (caseId, editMode = false) => {
   try {
       await dispatch(getSingleCaseById(caseId)).unwrap();
     navigate(`/case/${caseId}`, { 
       state: { editing: editMode, fromPage: currentPage } 
     });
   } catch (error) {
     console.error("Failed to fetch case:", error);
     showToast("Failed to load case details", "error");
   }
 };

 const handlePageSizeChange = (newPageSize) => {
       dispatch(setTechPageSize(newPageSize));
       dispatch(setTechCurrentPage(1));
   
 dispatch(getTechUserAssignedCases({
      page: 1,
      limit: newPageSize,
      filters: {}
    }));
   };
 
   const handlePageChange = (newPage) => {
    dispatch(setTechCurrentPage(newPage));
  
    dispatch(getTechUserAssignedCases({
       page: newPage,
       limit: pageSize,
       filters: {},
     }));
   };

   const handleStatusChange = (caseId, status) => {
  setSelectedCaseId(caseId);
  setTargetStatus(status);
  setShowConfirmModal(true);
};

const onConfirm = async () => {
    let payload = {status: targetStatus}
  try {
    await dispatch(updateCaseByTech({ caseId: selectedCaseId, caseData: payload }))
      .unwrap();

    showToast("Case status updated successfully", "success");
    setShowConfirmModal(false);

    await dispatch(getTechUserAssignedCases({
      page: currentPage,
      limit: pageSize,
      filters: {},
    }));
  } catch (err) {
    showToast("Failed to update status", "error");
  }
};

const onCancel = () => {
  setShowConfirmModal(false);
  setSelectedCaseId(null);
  setTargetStatus("");
};


  return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
        <div className="flex items-center gap-3">
          {/* <SearchCode className="text-emerald-600" size={32} /> */}
          <Edit className="text-emerald-600 hover:text-emerald-700 transition" size={32} />
          <h1 className="text-3xl font-black text-slate-800 tracking-tight"> Update Case Status </h1>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm text-left">
            <thead className="bg-[#1e293b] text-white">
              <tr>
                <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-[10px] border border-slate-700">Case ID</th>
                <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-[10px] border border-slate-700">Customer ID</th>
                <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-[10px] border border-slate-700">Customer Name</th>
                <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-[10px] border border-slate-700">Date Assigned</th>
                <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-[10px] border border-slate-700">Sale Amount</th>
                <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-[10px] border border-slate-700">Plan</th>
                <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-[10px] border border-slate-700">Case Status</th>
                <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-[10px] border border-slate-700">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {isLoading ?
                <tr>
                    <td colSpan="12" className="py-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                        <p className="font-black text-[10px] text-slate-400 uppercase tracking-[0.3em]">
                          Processing Records...
                        </p>
                      </div>
                    </td>
                  </tr> : cases.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-20 text-center text-slate-400 font-black uppercase tracking-widest text-xs italic">No cases found</td></tr>
              ) : (
                cases.map((item, index) => (
                  <tr key={index} className="text-center border-b hover:bg-emerald-50/30 transition duration-150">
                    <td className="px-4 py-4 border border-slate-100 font-black text-emerald-600 text-xs tracking-tight">{item.caseId || "N/A"}</td>
                    <td className="px-4 py-4 border border-slate-100 font-bold text-slate-500 text-xs">{item.customerID || "N/A"}</td>
                    <td className="px-4 py-4 border border-slate-100 font-black text-slate-800">{item.customerName || "N/A"}</td>
                    <td className="px-4 py-4 border border-slate-100 font-bold text-slate-400 text-xs">{item.date || "N/A"}</td>
                    <td className="px-4 py-4 border border-slate-100 font-black text-emerald-700">${item.saleAmount || "0"}</td>
                    <td className="px-4 py-4 border border-slate-100 font-bold text-slate-600 uppercase text-[10px]">{item.plan || "N/A"}</td>
                    <td className="px-4 py-4 border border-slate-100">
                       {["Open", "Pending", "Closed"].includes(item.issueStatus) ? (
                      <select 
                        value={item.issueStatus}
                         disabled={!["Open", "Pending", "Closed"].includes(item.issueStatus)}
                        onChange={(e) => handleStatusChange(item.caseId, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest border transition-all outline-none
                          ${
                            ["Open", "Pending", "Closed"].includes(item.issueStatus)
                              ? "cursor-pointer"
                              : " opacity-60 appearance-none"
                          }
                          ${
                            item.issueStatus === "Open"
                              ? "bg-amber-50 text-amber-600 border-amber-100"
                              : item.issueStatus === "Pending"
                              ? "bg-blue-50 text-blue-600 border-blue-100"
                              : item.issueStatus === "Closed"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-slate-50 text-slate-500 border-slate-200"
                          }`}
                      >
                          {["Open", "Pending", "Closed"].map(status => (
                            <option
                              key={status}
                              value={status}
                              disabled={status === item.issueStatus}
                            >
                              {status}
                            </option>
                          ))}
                      </select>) : (
                          <span className="px-3 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest bg-red-50 text-red-600 border border-red-200 inline-block">
                            {item.issueStatus}
                          </span>
                      )}
                    </td>
                    <td className="px-4 py-4 border border-slate-100">
                      <button 
                        // onClick={() => setActiveNotesCase(item)}
                        title='View Full Details'
                        onClick={() => {
                                     console.log("Case item:", item);
                                      fetchCaseDetails(item.caseId, false);
                                  }}                           
                            className="p-2 cursor-pointer text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all active:scale-90"
                      >
                        <Eye size={18} strokeWidth={2.5} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Block (from snippet) */}
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

      {ShowConfirmModal && 
   
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Change Status?</h3>
          <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
            Are you sure you want to update <span className="text-emerald-600 font-bold">#{selectedCaseId}</span> to <span className="text-slate-800 font-bold uppercase tracking-wider">"{targetStatus}"</span>?
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={onConfirm}
              className="w-full cursor-pointer bg-emerald-600 text-white font-black uppercase text-[11px] tracking-widest py-4 rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
            >
              Yes, Update Status
            </button>
            <button 
              onClick={onCancel}
              className="w-full bg-slate-50 text-slate-400 font-black uppercase text-[11px] tracking-widest py-4 rounded-2xl hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

      }
        

    </div>
  )
}

export default TechUpdateCaseStatus