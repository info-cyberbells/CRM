import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Github, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Building2,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  ChevronRight,
   ChevronLeft
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../ToastContext/ToastContext';
import { createUserThunk, loginUserThunk, reset } from '../../features/UserSlice/UserSlice';

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {showToast} = useToast();

  const { user, isLoading, isSuccess, isError, message } = useSelector((state)=> state.user);

  const [isLogin, setIsLogin] = useState(true);
  // const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [signupFormData, setSignupFormData] = useState({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'Sale',
          phone: '',
          address: '',
          city: '',
          state: '',
          country: ''
      });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
    const [ setIsLoading] = useState(false);
    const [step, setStep] = useState(1);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUserThunk(formData));
  };

useEffect(() => {
  if (isSuccess && user) {
    showToast("Login successful", "success");

    setTimeout(() => {
      dispatch(reset());
      navigate("/dashboard");
    }, 800);
  }

  if (isError) {
    showToast(message || "Login failed", "error");
    dispatch(reset());
  }
}, [isSuccess, isError, user, message, dispatch, navigate]);


 const handleSignupChange = (e) => {
    setSignupFormData({ ...signupFormData, [e.target.name]: e.target.value });
  };

     const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBackStep = () => {
    setStep(1);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (signupFormData.password !== signupFormData.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    dispatch(createUserThunk(formData));
    setTimeout(() => {
      showToast("Registration successful!", "success");
      console.log("Signup Data:", signupFormData);
    }, 1500);
  };

  return (
    <div className="h-screen bg-white flex flex-col md:flex-row font-[Poppins] selection:bg-[#17394D]/10">
      
      {/* Simplified Left Sidebar */}
      <div className="hidden lg:flex lg:w-4/12 bg-[#17394D] relative overflow-hidden flex-col  p-10 text-white">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/5 pointer-events-none"></div>
        
        <div className="relative z-10 ">
          <div className="flex items-center justify-center gap-2">
            <div className=" rounded-2xl  ">
              {/* <ShieldCheck className="w-10 h-10 text-[#17394D]" /> */}
              <img src="/cyberhub_Logo.png" alt="" className='w-60 ' />
              
            </div>
            {/* <span className="text-4xl font-extrabold tracking-wide">CYBERHUB</span> */}
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-center leading-tight tracking-tight">
              Manage customers.<span className="text-emerald-400"> Close deals. Grow faster.</span>
            </h1>
            {/* <p className="text-slate-300 text-lg leading-relaxed max-w-sm border-l-2 border-emerald-400/30 pl-6">
              The unified platform designed to help your team manage sales, support, and success in one clean interface.
            </p> */}
          </div>
          
          
        </div>
        
      </div>

      {/* Right Content - Modern Form */}
      <div className="h-full overflow-y-auto flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-20 relative bg-[#FBFBFE]">
        <div className="w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-500">
          
          <div className="mb-5 text-center">
            {/* Mobile-only logo */}
            <div className="flex items-center gap-2 mb-6 md:hidden justify-center">
              <ShieldCheck className="w-8 h-8 text-[#17394D]" />
              <span className="text-2xl font-bold">Cyberhub</span>
            </div>
            
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-slate-500 font-medium">
              {isLogin ? "Sign in to access your account." : "Signup to get Start"}
            </p>
          </div>

          {isLogin && <form onSubmit={handleSubmit} className="space-y-4">
            

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#17394D] transition-colors" />
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#17394D]/5 focus:border-[#17394D] outline-none transition-all placeholder:text-slate-300 font-medium"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                {isLogin && (
                  <button type="button" className="text-xs cursor-pointer font-bold text-[#17394D] hover:text-emerald-600 transition-colors">
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#17394D] transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  className="w-full pl-10 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#17394D]/5 focus:border-[#17394D] outline-none transition-all placeholder:text-slate-300 font-medium"
                  onChange={handleChange}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute cursor-pointer right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full cursor-pointer mt-2 py-4 bg-[#17394D] text-white rounded-xl font-bold hover:bg-[#0e2735] hover:scale-[1.02] shadow-lg shadow-[#17394D]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Sign in to Dashboard' : 'Get Started Now'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>}

          {!isLogin &&
          <form onSubmit={step === 1 ? handleNextStep : handleSignUp} className="space-y-4">
              {step === 1 ? (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#17394D]" />
                        <input name="name" required value={signupFormData.name} onChange={handleSignupChange} type="text" placeholder="John Doe" className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-[#17394D] outline-none text-sm" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Phone</label>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#17394D]" />
                        <input name="phone" required value={signupFormData.phone} onChange={handleSignupChange} type="tel" placeholder="+1 (555) 000" className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-[#17394D] outline-none text-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Work Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#17394D]" />
                      <input name="email" required value={signupFormData.email} onChange={handleSignupChange} type="email" placeholder="john@company.com" className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-[#17394D] outline-none text-sm" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Department</label>
                    <div className="relative group">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#17394D]" />
                      <select name="role" value={signupFormData.role} onChange={handleSignupChange} className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-[#17394D] outline-none text-sm appearance-none cursor-pointer">
                        <option value="Sale">Sales Department</option>
                        <option value="Tech">Tech Department</option>
                        {/* <option value="Support">Customer Support</option>
                        <option value="Admin">Administrator</option> */}
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="w-full py-4 bg-[#17394D] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.01] transition-all group">
                    Continue to Security
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Street Address</label>
                    <div className="relative group">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#17394D]" />
                      <input name="address" required value={signupFormData.address} onChange={handleSignupChange} type="text" placeholder="123 Business St" className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-[#17394D] outline-none text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input name="city" required value={signupFormData.city} onChange={handleSignupChange} placeholder="City" className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none text-sm border-slate-200 focus:border-[#17394D]" />
                    <input name="state" required value={signupFormData.state} onChange={handleSignupChange} placeholder="State" className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none text-sm border-slate-200 focus:border-[#17394D]" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Country</label>
                    <div className="relative group">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#17394D]" />
                      <input name="country" required value={signupFormData.country} onChange={handleSignupChange} type="text" placeholder="United States" className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-[#17394D] outline-none text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Password</label>
                      <input name="password" required value={signupFormData.password} onChange={handleSignupChange} type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none text-sm border-slate-200 focus:border-[#17394D]" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Confirm</label>
                      <input name="confirmPassword" required value={signupFormData.confirmPassword} onChange={handleSignupChange} type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none text-sm border-slate-200 focus:border-[#17394D]" />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button type="button" onClick={handleBackStep} className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button type="submit" disabled={isLoading} className="flex-[2] py-4 bg-[#17394D] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.01] transition-all disabled:opacity-70">
                      {isLoading ? "Creating..." : "Create Account"}
                      {!isLoading && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </form>
          }

          

          <p className="mt-8 text-center text-slate-500 text-sm font-medium">
            {isLogin ? "New to CyberHub?" : "Already have an account?"}
            <button 
              onClick={() => {
                // setIsLogin(!isLogin);
                // setError('');
                // setSuccess('');
              }}
              className="ml-1.5 font-bold text-[#17394D] hover:text-emerald-600 transition-colors"
            >
              {isLogin ? "Create account" : "Sign in instead"}
            </button>
          </p>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-8 text-slate-400 text-xs flex gap-6">
          <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Help Center</a>
        </div>
      </div>
    </div>
  );
};

export default Login;