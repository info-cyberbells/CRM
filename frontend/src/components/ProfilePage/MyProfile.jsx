import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Lock, 
  Eye, 
  EyeOff, 
  Edit, 
  Camera, 
  ShieldCheck, 
  ChevronRight,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyProfile, updateMyProfile } from '../../features/ProfileSlice/profileSlice';
import { useToast } from '../../ToastContext/ToastContext';

const MyProfile = () => {

const {showToast} = useToast();
  const dispatch = useDispatch();
  const { profile, loading, updateLoading, updateSuccess } = useSelector((state) => state.profile);

  const [activeTab, setActiveTab] = useState('general'); // 'general' or 'security'
  const [formData, setFormData] = useState({});
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '',  confirmPassword: ''  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

    useEffect(() => {
    if (profile) {
        setFormData({
        name: profile.name ?? '',
        phone: profile.phone ?? '',
        address: profile.address ?? '',
        city: profile.city ?? '',
        state: profile.state ?? '',
        country: profile.country ?? '',
        email: profile.email ?? '',
        role: profile.role ?? '',
        status: profile.status ?? '',
        profileImage: profile.profileImage ?? '',
        });
    }
    }, [profile]);
  
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

    if (activeTab === "security") {
        if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
            showToast("Please fill all password fields", "error");
            return;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            showToast("New password and confirm password do not match", "error");
            return;
        }
    }

  try {
    const submissionData = new FormData();

    if (activeTab === "general") {
      submissionData.append("name", formData.name);
      submissionData.append("phone", formData.phone);
      submissionData.append("address", formData.address);
      submissionData.append("city", formData.city);
      submissionData.append("state", formData.state);
      submissionData.append("country", formData.country);

      if (fileInputRef.current?.files[0]) {
        submissionData.append(
          "profileImage",
          fileInputRef.current.files[0]
        );
      }
    } else {
      submissionData.append("currentPassword", passwords.currentPassword);
      submissionData.append("newPassword", passwords.newPassword);
    }

    const res = await dispatch(updateMyProfile(submissionData)).unwrap();

    showToast(res?.message || "Profile updated successfully", "success");

    if (activeTab === "security") {
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }

  } catch (error) {
    console.error("Update Error:", error);
    showToast(
      error || "Something went wrong while updating profile",
      "error"
    );
  }
};

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 rounded-2xl">
                <Edit className="text-emerald-600" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Edit Profile</h1>
                <p className="text-slate-500 font-medium">Manage your personal information and security</p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit">
              <button 
                onClick={() => setActiveTab('general')}
                className={`px-6 py-2.5 cursor-pointer rounded-xl font-bold text-[10px] md:text-sm transition-all duration-200 flex items-center gap-2 ${activeTab === 'general' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <User size={18} /> General
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`px-6 py-2.5 cursor-pointer rounded-xl font-bold text-[10px] md:text-sm transition-all duration-200 flex items-center gap-2 ${activeTab === 'security' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <ShieldCheck size={18} /> Security
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar - Profile Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 text-center">
              <div className="relative inline-block group">
                <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-emerald-50 shadow-inner mb-4 relative">
                 {imagePreview || formData.profileImage ? (
                    <img 
                        src={imagePreview || formData.profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + formData.name }}
                    />
                    ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-50">
                        <span className="text-5xl font-black text-emerald-600">
                        {formData.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                    </div>
                    )}
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-emerald-600/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white cursor-pointer"
                  >
                    <Camera size={28} />
                    <span className="text-xs font-bold mt-1 uppercase tracking-wider">Change Photo</span>
                  </button>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
              
              <h2 className="text-2xl font-black text-slate-800">{formData.name}</h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500 uppercase mt-2">
                {formData.role} 
              </div>
              
              <div className="mt-8 pt-8 border-t border-slate-100 space-y-4 text-left">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail size={18} className="text-emerald-500" />
                  <span className="text-sm font-medium">{formData.email}</span>
                </div>
                { formData.phone && <div className="flex items-center gap-3 text-slate-600">
                  <Phone size={18} className="text-emerald-500" />
                  <span className="text-sm font-medium">{formData.phone}</span>
                </div>}
                {/* <div className="flex items-center gap-3 text-slate-600">
                  <MapPin size={18} className="text-emerald-500" />
                  <span className="text-sm font-medium">{formData.city}, {formData.state}</span>
                </div> */}
              </div>
            </div>

           
          </div>

          {/* Right Content - Form Fields */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8">

                {activeTab === 'general' ? (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <User className="text-emerald-600" size={20} /> Personal Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field label="Full Name" name="name" value={formData.name} icon={<User size={18} />} onChange={handleInputChange} placeholder="Enter your name" />
                      <Field label="Phone Number" name="phone" value={formData.phone} icon={<Phone size={18} />} onChange={handleInputChange} placeholder="Enter your phone number" />
                      <Field label="City" name="city" value={formData.city} icon={<MapPin size={18} />} onChange={handleInputChange} placeholder="Enter your city" />
                      <Field label="State" name="state" value={formData.state} icon={<MapPin size={18} />} onChange={handleInputChange} placeholder="Enter your state"/>
                      <Field label="Country" name="country" value={formData.country} icon={<Globe size={18} />} onChange={handleInputChange} placeholder="Enter your country"/>
                      <div className="md:col-span-2">
                        <Field label="Street Address" name="address" value={formData.address} icon={<MapPin size={18} />} onChange={handleInputChange} placeholder="Enter your street address"/>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <Lock className="text-emerald-600" size={20} /> Change Password
                    </h3>
                    
                    <div className="max-w-md space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase ml-1">Current Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-500">
                            <Lock size={18} />
                          </div>
                          <input 
                            type={showCurrentPass ? "text" : "password"}
                            name="currentPassword"
                            value={passwords.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-700 outline-none"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowCurrentPass(!showCurrentPass)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 transition-colors"
                          >
                            {showCurrentPass ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase ml-1">New Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-500">
                            <ShieldCheck size={18} />
                          </div>
                          <input 
                            type={showNewPass ? "text" : "password"}
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-700 outline-none"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowNewPass(!showNewPass)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 transition-colors"
                          >
                            {showNewPass ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase ml-1">Confirm New Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-500">
                            <ShieldCheck size={18} />
                            </div>
                            <input 
                            type={showConfirmPass ? "text" : "password"}
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-700 outline-none"
                            />
                            <button 
                            type="button"
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 transition-colors"
                            >
                            {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        </div>
                      
                     
                    </div>
                  </div>
                )}

                <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-end gap-4">
                 
                  <button 
                    type="submit"
                    disabled={updateLoading}
                    className="group cursor-pointer bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-10 py-3.5 rounded-2xl font-medium text-sm shadow-lg shadow-emerald-600/20 flex items-center gap-3 transition-all transform active:scale-95"
                  >
                    {updateLoading ? 'Saving...' : (
                      <>
                        Save Changes
                        <Save size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable Input Field Component
const Field = ({ label, name, value, icon, onChange, placeholder }) => (
  <div className="space-y-2">
    <label className="text-xs font-black text-slate-500 uppercase ml-1">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-500">
        {icon}
      </div>
      <input 
        type="text"
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-700 outline-none"
      />
    </div>
  </div>
);

export default MyProfile;