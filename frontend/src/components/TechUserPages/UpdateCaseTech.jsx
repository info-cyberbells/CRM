import React, { useEffect, useState } from "react";
import { fetchTechUserOngoingCases, getSingleCaseById, getTechUserAssignedCases, updateCaseByTech,updateTechSelectedCase } from "../../features/TechUserSlice/TechUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { RefreshCw } from "lucide-react";
import { useToast } from "../../ToastContext/ToastContext";

const UpdateCaseTech = () => {
 
  const {showToast} = useToast();

  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
const [showConfirm, setShowConfirm] = useState(false);


const {ongoingCases: cases,  pagination, isLoading, selectedCase, modalLoading} = useSelector((state)=> state.techUser);
const { currentPage, totalPages, totalCount, pageSize } = pagination;


 useEffect(()=>{
  dispatch(fetchTechUserOngoingCases({
      page: 1,
      limit: 10,
      filters: {}
    }));
 },[])




  const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages) {
    dispatch(
      getTechUserAssignedCases({
        page,
        limit: pageSize,
        filters: {}
      })
    );
  }
};


 const handlePageSizeChange = (size) => {
  dispatch(
    getTechUserAssignedCases({
      page: 1,
      limit: size,
      filters: {}
    })
  );
};


const updateCaseHandler = async () => {
  if (!selectedCase?.id) return;

  try {
    await dispatch(
      updateCaseByTech({
        caseId: selectedCase.id,
        caseData: {
          status: selectedCase.status,
          issue: selectedCase.issue,
          specialNotes: selectedCase.specialNotes,
        },
      })
    ).unwrap();
    showToast("Case Updated!!!", "success")
    dispatch(getTechUserAssignedCases({
      page: 1,
      limit: 10,
      filters: {}
    }))
    setShowModal(false);
  } catch (err) {
    console.error("Update failed", err);
    showToast("Failed to Update", "error")
  }
};


  return (
    <div className='min-h-screen mt-20 bg-[#f0f9ff] font-["Segoe_UI",Roboto,sans-serif]'>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-center text-4xl pt-6 text-[#1e40af] font-bold">
          Update Ongoing Cases
        </h1>

        <div className="bg-white mt-6 rounded-xl border border-gray-200">
          <div className=" overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-[#37506a] text-white">
                <tr>
                  <th className="px-4 py-3 text-center font-semibold border border-[#4a637d]">
                    Case ID
                  </th>
                  <th className="px-4 py-3 text-center font-semibold border border-[#4a637d]">
                    Customer ID
                  </th>
                  <th className="px-4 py-3 text-center font-semibold border border-[#4a637d]">
                    Customer Name
                  </th>
                  <th className="px-4 py-3 text-center font-semibold border border-[#4a637d]">
                    Date Assigned
                  </th>
                  <th className="px-4 py-3 text-center font-semibold border border-[#4a637d]">
                    Sale Amount
                  </th>
                  <th className="px-4 py-3 text-center font-semibold border border-[#4a637d]">
                    Plan
                  </th>
                  <th className="px-4 py-3 text-center font-semibold border border-[#4a637d]">
                    Case Status
                  </th>
                  {/* <th className="px-4 py-3 text-center font-semibold border border-[#4a637d]">
                    Case Duration
                  </th> */}
                  <th className="px-4 py-3 text-center font-semibold border border-[#4a637d]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {isLoading ? (
                <tr>
                  <td colSpan={13} className="text-center py-8">
                    <div className="flex items-center justify-center gap-3">
                      <RefreshCw
                        size={32}
                        className="animate-spin text-blue-600"
                      />
                      <span className="text-lg text-gray-500">
                        Loading cases...
                      </span>
                    </div>
                  </td>
                </tr>
              ) :
                
                cases.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-6 text-center text-gray-500 font-medium"
                    >
                      No cases assigned to you
                    </td>
                  </tr>
                ) : (
                  cases.map((item, index) => (
                    <tr
                      key={index}
                      className="text-center border-b hover:bg-blue-50 transition"
                    >
                      <td className="px-4 py-3 border border-gray-200">
                        {item.caseId || "N/A"}
                      </td>
                      <td className="px-4 py-3 border border-gray-200">
                        {item.customerID || "N/A"}
                      </td>
                      <td className="px-4 py-3 border border-gray-200">
                        {item.customerName || "N/A"}
                      </td>
                      <td className="px-4 py-3 border border-gray-200">
                        {item.date || "N/A"}
                      </td>
                      <td className="px-4 py-3 border border-gray-200">
                        {item.saleAmount || "N/A"}
                      </td>
                      <td className="px-4 py-3 border border-gray-200">
                        {item.plan || "N/A"}
                      </td>
                      <td className="px-4 py-3 border border-gray-200">
                        {item.issueStatus || "N/A"}
                      </td>
                      {/* <td className="px-4 py-3 border border-gray-200">
                        {item.duration || "N/A"}
                      </td> */}
                      <td className="px-4 py-3 border border-gray-200 text-blue-600 ">
                        <div className="flex justify-center gap-4">
                          <button
                          onClick={() => {
                                dispatch(getSingleCaseById(item.caseId))
                                setShowModal(true);
                            }}
                          className="cursor-pointer hover:text-gray-700">
                            View{" "}
                          </button>
                          {/* <button className="cursor-pointer hover:text-gray-700">
                            Add{" "}
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {cases.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-5 mt-5 flex flex-wrap items-center justify-between gap-4">
            {/* Page size selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Show:</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-500">entries</span>
            </div>

            {/* Pagination info */}
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className={`px-4 py-2 rounded-md text-sm font-medium transition
          ${
            currentPage <= 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }
        `}
              >
                Previous
              </button>

              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={`px-4 py-2 rounded-md text-sm font-medium transition
          ${
            currentPage >= totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }
        `}
              >
                Next
              </button>
            </div>
          </div>
        )}
        {showModal && (
  <div
    className="fixed inset-0 z-10000 flex items-center justify-center bg-black/50"
onClick={() => setShowModal(false)}
  >
<div className="bg-white w-full max-w-3xl rounded-xl overflow-y-auto shadow-lg p-6 relative max-h-[90vh] flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button
onClick={() => setShowModal(false)}
        className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
      >
        ×
      </button>

      <h2 className="text-xl font-semibold text-center text-gray-900 mb-6">
        Case Details
      </h2>

      {/* Loading */}
      {modalLoading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : selectedCase ? (
        <form className="grid grid-cols-1 overflow-y-auto md:grid-cols-2 gap-4">
          
          {/* Case ID */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Case ID
            </label>
            <input
              disabled
              value={selectedCase.id}
              className="w-full px-3 py-2 border rounded-md bg-gray-100 text-sm"
            />
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Customer Name
            </label>
            <input
              value={selectedCase.customerName}
              onChange={(e) =>
                dispatch(updateTechSelectedCase({ customerName: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={selectedCase.email}
              onChange={(e) =>
                dispatch(updateTechSelectedCase({ email: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Phone
            </label>
            <input
              value={selectedCase.phone}
              onChange={(e) =>
                dispatch(updateTechSelectedCase({ phone: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>

          {/* Plan */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Plan
            </label>
            <input
              value={selectedCase.plan}
              onChange={(e) =>
                dispatch(updateTechSelectedCase({ plan: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>

          {/* Created By */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Created By
            </label>
            <input
              disabled
              value={selectedCase?.saleUser?.name || ""}
              className="w-full px-3 py-2 border rounded-md bg-gray-100 text-sm"
            />
          </div>

          

          {/* Sale Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Sale Amount
            </label>
            <input
              type="number"

              value={selectedCase.saleAmount || 0}
              onChange={(e) =>
                dispatch(updateTechSelectedCase({ saleAmount: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>

          {/* Issue Status */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Issue Status
            </label>
            <select
              value={selectedCase.status || "Open"}
              // onChange={(e) =>
              //   dispatch(updateSelectedCase({ issueStatus: e.target.value }))
              // }
              onChange={(e) => {
    setPendingStatus(e.target.value);
    setShowConfirm(true);
  }}

              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="Open">Open</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Issue */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Issue
            </label>
            <textarea
              rows={3}
              value={selectedCase.issue || ""}
              onChange={(e) =>
                dispatch(updateTechSelectedCase({ issue: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Note
            </label>
            <textarea
              rows={3}
              value={selectedCase.specialNotes || ""}
              onChange={(e) =>
                dispatch(
                  updateTechSelectedCase({ specialNotes: e.target.value })
                )
              }
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>

        </form>
      ) : null}

      {/* Footer buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => updateCaseHandler(selectedCase.id, selectedCase)}
          className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Changes
        </button>
        <button
        //   onClick={() => dispatch(setShowModal(false))}
        onClick={() => setShowModal(false)}
          className="px-4 py-2 cursor-pointer bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{showConfirm && (
  <div className="fixed inset-0 z-[11000] flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Confirm Status Change
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Once you change the case status, this action cannot be undone.  
        Are you sure you want to continue?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowConfirm(false)}
          className="px-4 py-2 cursor pointer bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            dispatch(updateTechSelectedCase({ status: pendingStatus }));
            setShowConfirm(false);
            setPendingStatus(null);
          }}
          className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
)}


      </div>
    </div>
  );
};

export default UpdateCaseTech;
