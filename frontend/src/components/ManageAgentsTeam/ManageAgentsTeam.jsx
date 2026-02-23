import React, { useEffect, useState } from "react";
import {
  X,
  Users,
  CheckCircle2,
  Trash2,
  UserPlus,
  ShieldCheck as ShieldIcon,
  Eye,
  Edit,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createAgentByAdmin,
  getAllAgentsThunk,
  viewAgentDetailsThunk,
  updateAgentThunk,
} from "../../features/ADMIN/adminSlice";
import { useToast } from "../../ToastContext/ToastContext";

const AddMemberModal = ({
  isOpen,
  onClose,
  onAdd,
  selectedAgent,
  onUpdate,
  isEditMode,
  isViewMode,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Sale",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });

  useEffect(() => {
    if (selectedAgent && isOpen) {
      setFormData({
        name: selectedAgent.name || "",
        email: selectedAgent.email || "",
        password: "",
        confirmPassword: "",
        role: selectedAgent.role || "Sale",
        phone: selectedAgent.phone || "",
        address: selectedAgent.address || "",
        city: selectedAgent.city || "",
        state: selectedAgent.state || "",
        country: selectedAgent.country || "",
      });
    } else if (!selectedAgent && isOpen) {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Sale",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
      });
    }
  }, [selectedAgent, isOpen]);

  if (!isOpen) return null;

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (formData.password !== formData.confirmPassword) {
  //     alert("Passwords do not match");
  //     return;
  //   }
  //   onAdd(formData);
  //   onClose();
  // };

  // Fix handleSubmit:
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isEditMode && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (isEditMode) {
      // Only send fields relevant for update (no password)
      const { password, confirmPassword, ...updateData } = formData;
      onUpdate(updateData);
    } else {
      onAdd(formData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-emerald-600 p-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <UserPlus size={24} />
            <h3 className="text-xl font-black tracking-tight">Team Member</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-6 overflow-y-auto max-h-[80vh] "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                disabled={isViewMode}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter Name"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                disabled={isViewMode}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter Email"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                System Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-black text-xs uppercase outline-none focus:border-emerald-500 transition-all"
              >
                <option value="Sale">Sales</option>
                <option value="Tech">Tech</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                required
                disabled={isViewMode}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="984877483"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                required
                disabled={isViewMode}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Street number and name"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                City
              </label>
              <input
                type="text"
                name="city"
                required
                disabled={isViewMode}
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="City"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                State
              </label>
              <input
                type="text"
                name="state"
                required
                disabled={isViewMode}
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                placeholder="State"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                required
                disabled={isViewMode}
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                placeholder="Country"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>

            {!isViewMode && !isEditMode && (
              <>
                <div className="h-px bg-slate-100 md:col-span-2 my-2"></div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="********"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="********"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </>
            )}
          </div>

          <div className="pt-6 flex gap-3">
            {!isViewMode && (
              <button
                type="submit"
                className="flex-1 cursor-pointer bg-emerald-600 text-white font-black uppercase text-[11px] tracking-widest py-4 rounded-2xl shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                {isEditMode ? "Update Member" : "Register Member"}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 cursor-pointer bg-slate-50 text-slate-400 font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManageAgentsTeam = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const dispatch = useDispatch();

  const { showToast } = useToast();

  const { agents, isLoading, isError, error, pagination } = useSelector(
    (state) => state.admin,
  );
  const { currentPage, totalPages, totalCount, pageSize } = pagination;

  useEffect(() => {
    dispatch(getAllAgentsThunk({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleAddMember = async (memberData) => {
    try {
      await dispatch(createAgentByAdmin(memberData)).unwrap();

      dispatch(getAllAgentsThunk({ page: 1, limit: 10 }));

      showToast("Agent created successfully", "success");

      setIsModalOpen(false);
    } catch (error) {
      console.error("Create Agent Failed:", error);
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.payload || error?.message || "Failed to create agent";

      showToast(errorMessage, "error");
    }
  };

  const handleUpdateMember = async (memberData) => {
    try {
      await dispatch(
        updateAgentThunk({
          id: selectedAgent.id,
          agentData: memberData,
        }),
      ).unwrap();
      dispatch(getAllAgentsThunk({ page: currentPage, limit: pageSize }));
      showToast("Agent updated successfully", "success");
      setIsModalOpen(false);
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.payload || error?.message || "Failed to update agent";
      showToast(errorMessage, "error");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    dispatch(getAllAgentsThunk({ page: newPage, limit: pageSize }));
  };

  const handlePageSizeChange = (newLimit) => {
    dispatch(getAllAgentsThunk({ page: 1, limit: newLimit }));
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-rose-50 text-rose-600 border-rose-100";
      case "Tech":
        return "bg-teal-50 text-teal-600 border-teal-100";
      default:
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
    }
  };

  return (
    <div className="max-w-7xl text-[Poppins] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
              <Users size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none">
                Team Management
              </h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
                Manage personnel
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedAgent(null);
              setIsEditMode(false);
              setIsViewMode(false);
              setIsModalOpen(true);
            }}
            className="bg-emerald-600 text-white cursor-pointer px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest flex items-center gap-3 shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
          >
            <UserPlus size={18} /> Add Member to Team
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-5 font-black uppercase text-[10px] tracking-widest ">
                  Team Member
                </th>
                <th className="px-8 py-5 font-black uppercase text-[10px] tracking-widest text-center">
                  System Role
                </th>
                <th className="px-8 py-5 font-black uppercase text-[10px] tracking-widest text-center">
                  Contact
                </th>
                {/* <th className="px-8 py-5 font-black uppercase text-[10px] tracking-widest text-center">
                  Status
                </th> */}
                <th className="px-8 py-5 font-black uppercase text-[10px] tracking-widest text-center">
                  Joined On
                </th>
                <th className="px-8 py-5 font-black uppercase text-[10px] tracking-widest text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {agents.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-500">
                        {member.name?.charAt(0) || "-"}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 leading-none mb-1">
                          {member.name || "-"}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400">
                          {member.email || "-"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${getRoleColor(member.role)}`}
                    >
                      {member.role || "-"}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center text-xs font-bold text-slate-500">
                    {member.phone || "-"}
                  </td>
                  {/* <td className="px-8 py-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${member.status === "Active" ? "bg-emerald-500" : "bg-slate-300"}`}
                      ></div>
                      <span
                        className={`text-[10px] font-black uppercase ${member.status === "Active" ? "text-emerald-600" : "text-slate-400"}`}
                      >
                        {member.status || "-"}
                      </span>
                    </div>
                  </td> */}
                  <td className="px-8 py-6 text-center text-xs font-bold text-slate-400">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={async () => {
                          try {
                            setSelectedAgent(null);
                            console.log("member id:", member._id || member.id);
                            const data = await dispatch(
                              viewAgentDetailsThunk(member._id || member.id),
                            ).unwrap();
                            setSelectedAgent(data);
                            setIsViewMode(true);
                            setIsEditMode(false);
                            setIsModalOpen(true);
                          } catch (err) {
                            showToast("Failed to fetch agent details", "error");
                          }
                        }}
                        className="p-2 text-slate-400 cursor-pointer hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            setSelectedAgent(null);
                            const data = await dispatch(
                              viewAgentDetailsThunk(member.id),
                            ).unwrap();
                            setSelectedAgent(data);
                            setIsEditMode(true);
                            setIsViewMode(false);
                            setIsModalOpen(true);
                          } catch (err) {
                            showToast("Failed to fetch agent details", "error");
                          }
                        }}
                        className="p-2 text-slate-400 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Edit size={16} />
                      </button>
                      {/* <button className="p-2 text-slate-400 cursor-pointer hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                        <Trash2 size={16} />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {agents.length > 0 && (
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

      <AddMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddMember}
        selectedAgent={selectedAgent}
        onUpdate={handleUpdateMember}
        isEditMode={isEditMode}
        isViewMode={isViewMode}
      />
    </div>
  );
};

export default ManageAgentsTeam;
