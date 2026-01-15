import React, { useState } from 'react';
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
  Building2
} from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    setTimeout(() => {
      setIsLoading(false);
      if (isLogin && formData.email === 'error@example.com') {
        setError('Invalid credentials. Please try again.');
      } else {
        setSuccess(isLogin ? 'Welcome back! Redirecting...' : 'Account created successfully!');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-[Poppins] selection:bg-[#17394D]/10">
      
      {/* Simplified Left Sidebar */}
      <div className="hidden lg:flex lg:w-4/12 bg-[#17394D] relative overflow-hidden flex-col  p-10 text-white">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/5 pointer-events-none"></div>
        
        <div className="relative z-10 ">
          <div className="flex items-center justify-center gap-2">
            <div className=" rounded-2xl  ">
              {/* <ShieldCheck className="w-10 h-10 text-[#17394D]" /> */}
              <img src="/cyberhub_Logo.png" alt="" srcset="" className='w-60 ' />
              
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
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-20 relative bg-[#FBFBFE]">
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

          {(error || success) && (
            <div className={`mb-6 p-4 rounded-xl border ${error ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'} flex items-center gap-3 animate-in slide-in-from-top-2`}>
              {error ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
              <p className="text-sm font-semibold">{error || success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            

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
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm font-medium">
            {isLogin ? "New to CyberHub?" : "Already have an account?"}
            <button 
            //   onClick={() => {
            //     setIsLogin(!isLogin);
            //     setError('');
            //     setSuccess('');
            //   }}
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