import React, { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  ChevronDown,
  Megaphone,
  Target,
  X,
  RefreshCw,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createNotice,
  deleteNotice,
  fetchAllNotices,
  updateNotice,
} from "../../features/NoticeSlice/NoticeSlice";
import { useToast } from "../../ToastContext/ToastContext";

const AdminNoticePage = () => {
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const { allNotices, pagination, isLoading } = useSelector(
    (state) => state.notice
  );

  const { currentPage, totalPages, totalCount, pageSize } = pagination;

  const [formData, setFormData] = useState({
    id: null,
    title: "",
    message: "",
    noticeType: "ALL",
    isActive: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);

  // Custom Modal States
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => {
    dispatch(fetchAllNotices({ page: 1, limit: 10 }));
  }, []);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      // notify("Please fill in all required fields", "error");
      showToast("Please fill in all required fields", "error");
      return;
    }

    try {
      if (isEditing) {
        dispatch(updateNotice({ id: formData.id, noticeData: formData }));
        dispatch(fetchAllNotices({ page: 1, limit: 10 }));

        // notify("Notice updated successfully");
        showToast("Notice updated successfully", "success");
      } else {
        dispatch(createNotice(formData));
        dispatch(fetchAllNotices({ page: 1, limit: 10 }));
        showToast("New notice created", "success");
        // notify("New notice created");
      }

      // Fetch latest notices from API after add/update
      dispatch(fetchAllNotices({ page: 1, limit: 10 }));

      resetForm();
    } catch (err) {
      console.error(err);
      // notify("Something went wrong", "error");
      showToast("Something went wrong", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      title: "",
      message: "",
      noticeType: "ALL",
      isActive: true,
    });
    setIsEditing(false);
  };

  const handleEdit = (notice) => {
    setFormData(notice);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Trigger the custom delete modal
  const openDeleteModal = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    const id = deleteModal.id;
    try {
      await dispatch(deleteNotice(id));
      // notify("Notice deleted permanently", "error");
      showToast("Notice deleted permanently", "success");
    } catch (error) {
      console.error(error);
      // notify("Failed to delete notice", "error");
      showToast("Failed to delete notice", "error");
    } finally {
      setDeleteModal({ isOpen: false, id: null });
    }
  };

  const getAudienceBadgeStyle = (audience) => {
    switch (audience) {
      case "TECH":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "SALE":
        return "bg-orange-50 text-orange-600 border-orange-100";
      default:
        return "bg-purple-50 text-purple-600 border-purple-100";
    }
  };

  return (
    <div className="min-h-screen lg:mt-20 bg-gray-50 flex flex-col font-sans text-gray-900">
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {/* Simple Page Header */}
        <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-[#1e40af] tracking-tight">
              Notice Management
            </h1>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl border animate-in slide-in-from-bottom-4 duration-300 ${
              notification.type === "error"
                ? "bg-red-600 text-white border-red-500"
                : "bg-gray-900 text-white border-gray-800"
            }`}
          >
            {notification.type === "error" ? (
              <AlertCircle size={18} />
            ) : (
              <CheckCircle size={18} className="text-green-400" />
            )}
            <span className="font-medium">{notification.msg}</span>
          </div>
        )}

        <div className="max-w-5xl mx-auto space-y-8">
          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                {isEditing ? (
                  <Pencil size={20} className="text-amber-500" />
                ) : (
                  <Plus size={20} className="text-indigo-600" />
                )}
                {isEditing ? "Edit Existing Notice" : "Add New Notice"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Title */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">
                    Notice Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="e.g. Server Maintenance"
                    className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-gray-50/30 outline-none transition-all text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                {/* Send Notice To */}
                <div className="space-y-2 md:col-span-1">
                  <label className="text-sm font-bold text-gray-700 ml-1">
                    Send Notice To
                  </label>
                  <div className="relative">
                    <select
                      name="noticeType"
                      value={formData.noticeType}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-gray-50/30 outline-none appearance-none transition-all font-medium"
                    >
                      <option value="ALL">ALL USERS</option>
                      <option value="TECH">TECH USERS</option>
                      <option value="SALE">SALE USERS</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>

                {/* Mark as Active */}
                <div>
                  <label className="text-sm font-bold text-gray-700 ml-1"></label>
                  <label className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 bg-gray-50/50 cursor-pointer hover:bg-gray-100 transition-colors md:col-span-1">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded-lg text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="text-sm font-bold text-gray-700">
                      Mark as Active
                    </span>
                  </label>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Full Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Provide clear details for the users..."
                  className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-gray-50/30 outline-none transition-all resize-none text-gray-800"
                ></textarea>
              </div>

              {/* Bottom Actions Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3.5 cursor-pointer text-sm font-bold text-gray-500 hover:text-gray-800 transition-all"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 cursor-pointer md:flex-none px-10 py-3.5 rounded-2xl text-sm font-black tracking-wide transition-all flex items-center justify-center gap-2 ${
                      isEditing
                        ? "bg-amber-500 hover:bg-amber-600 text-white "
                        : "bg-indigo-600 hover:bg-indigo-700 text-white "
                    }`}
                  >
                    {isEditing ? <Pencil size={18} /> : <Plus size={18} />}
                    {isEditing ? "UPDATE NOTICE" : "PUBLISH NOTICE"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">Recent Notices</h2>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {totalCount} Records
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-left border-b border-gray-100">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      Notice Details
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      Message Content
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      Status
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
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
                  ) : allNotices.length > 0 ? (
                    allNotices.map((notice) => (
                      <tr
                        key={notice.id}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-gray-900">
                              {notice.title}
                            </span>
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-md border tracking-wider ${getAudienceBadgeStyle(
                                notice.noticeType
                              )}`}
                            >
                              {notice.noticeType}
                            </span>
                          </div>
                          <div className="text-xs font-medium text-gray-400 mt-1.5 flex items-center gap-2">
                            <Megaphone size={12} />
                            {notice.createdAt}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm text-gray-600 line-clamp-2 max-w-sm leading-relaxed">
                            {notice.message}
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <button
                            // onClick={() => toggleStatus(notice.id)}
                            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                              notice.isActive
                                ? "bg-green-50 text-green-700 border-green-100"
                                : "bg-gray-50 text-gray-400 border-gray-200"
                            }`}
                          >
                            {notice.isActive ? (
                              <CheckCircle size={14} />
                            ) : (
                              <XCircle size={14} />
                            )}
                            {notice.isActive ? "Active" : "Draft"}
                          </button>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEdit(notice)}
                              className="p-2.5 cursor-pointer text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                              title="Edit"
                            >
                              <Pencil size={20} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(notice.id)}
                              className="p-2.5 cursor-pointer text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              title="Delete"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-8 py-20 text-center text-gray-400"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="bg-gray-100 p-4 rounded-full">
                            <Megaphone size={32} className="opacity-30" />
                          </div>
                          <p className="font-bold">No notices created yet</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-8 py-5 border-t border-gray-100">
                {/* Limit Selector - Left */}
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <span>Show</span>
                  <select
                    value={pageSize}
                    onChange={(e) =>
                      dispatch(
                        fetchAllNotices({
                          page: 1,
                          limit: Number(e.target.value),
                        })
                      )
                    }
                    className="px-3 cursor-pointer py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                  <span>entries</span>
                </div>

                {/* Showing Results - Center */}
                <div className="text-sm font-bold text-gray-600">
                  {totalCount > 0 ? (
                    <>
                      {" "}
                      Showing {(currentPage - 1) * pageSize + 1} to{" "}
                      {Math.min(currentPage * pageSize, totalCount)} of{" "}
                      {totalCount}{" "}
                    </>
                  ) : (
                    <>No results to display</>
                  )}
                </div>

                {/* Page Controls - Right */}
                <div className="flex items-center gap-3">
                  <button
                    disabled={currentPage === 1}
                    onClick={() =>
                      dispatch(
                        fetchAllNotices({
                          page: currentPage - 1,
                          limit: pageSize,
                        })
                      )
                    }
                    className="px-4 py-2 cursor-pointer rounded-xl text-sm font-bold border border-gray-200 disabled:opacity-40 hover:bg-gray-100"
                  >
                    Prev
                  </button>

                  <span className="text-sm font-bold text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      dispatch(
                        fetchAllNotices({
                          page: currentPage + 1,
                          limit: pageSize,
                        })
                      )
                    }
                    className="px-4 py-2 cursor-pointer rounded-xl text-sm font-bold border border-gray-200 disabled:opacity-40 hover:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- CUSTOM DELETE CONFIRMATION MODAL --- */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setDeleteModal({ isOpen: false, id: null })}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setDeleteModal({ isOpen: false, id: null })}
              className="absolute cursor-pointer top-6 right-6 p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-2">
                <Trash2 size={32} />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-gray-900">
                  Delete this notice?
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  This action cannot be undone. The notice will be permanently
                  removed from the system and will no longer be visible to
                  users.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full pt-4">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, id: null })}
                  className="px-6 py-4 cursor-pointer rounded-2xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                >
                  Keep Notice
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-4 cursor-pointer rounded-2xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-all"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNoticePage;
