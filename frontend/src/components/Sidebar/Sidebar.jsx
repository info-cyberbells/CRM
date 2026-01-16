import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, NavLink, useLocation, Navigate, Outlet, useNavigate  } from 'react-router-dom';
import { 
  UserCircle, 
  Settings, 
  Bell, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  LogOut, 
  ShieldCheck, 
  Search, 
  ChevronLeft,
  LayoutDashboard,
  PieChart,
  Users,
  Wrench,
  TrendingUp,
  MessageSquare,
  FileText,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { loginUserThunk, logoutUserThunk } from '../../features/UserSlice/UserSlice';

const ROLE_BASED_MENUS = {
  Admin: [
    { id: "admin-dashboard", title: "Admin Dashboard", icon: LayoutDashboard },
    {id: "search-cases",title: "Search",icon: Search,},
  { id: "notices", title: "Notices",icon: FileText,},
//   { id: "chat", title: "Chat", icon: MessageSquare,},
  { id: "notifications", title: "Notifications", icon: Bell,},
    {
      id: "support",
      title: "Support",
      icon: HelpCircle,
      children: [
        { id: "privacy", title: "Privacy Policy", path: "privacy" },
        { id: "terms", title: "Terms & Conditions", path: "terms" },
      ],
    },
  ],
  Sale: [
    { id: "dashboard", title: "Sales Overview", icon: TrendingUp },
    {
  id: "create-case",
  title: "Create Case",
  icon: FileText,
  children: [
    {id: "create-case-dig", title: "DIG",path: "create-case/DIG",},
    { id: "create-case-cbh", title: "CBH",path: "create-case/CBH",},
    { id: "create-case-td", title: "TD", path: "create-case/TD",},
    {id: "create-case-pws", title: "PWS",path: "create-case/PWS",},
    { id: "create-case-no-sale", title: "No Sale", path: "create-case/no-sale",},
    ],
    },
    {id: "search-cases",title: "Search",icon: Search,},
    { id: "notes", title: "Notes", icon: FileText },
    //   { id: "chat", title: "Chat", icon: MessageSquare,},
  { id: "notifications", title: "Notifications", icon: Bell,},
  ],
  Tech: [
    { id: "dashboard", title: "Tech Monitor", icon: Wrench },
    {id: "search-cases",title: "Search",icon: Search,},
    {id: "update-status",title: "Update Onging Case",icon: FileText,},
        //   { id: "chat", title: "Chat", icon: MessageSquare,},
    { id: "notifications", title: "Notifications", icon: Bell,},
  ],
};

const ROLES = [
  { id: 'Admin', name: 'Admin', color: 'bg-red-500' },
  { id: 'Sale', name: 'Sale', color: 'bg-emerald-500' },
  { id: 'Tech', name: 'Tech', color: 'bg-blue-500' },
];


const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentRole = localStorage.getItem("Role") || 'Admin';
  
  const profileRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (id) => {
    if (isCollapsed) setIsCollapsed(false);
    setOpenDropdowns(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const menuItems = ROLE_BASED_MENUS[currentRole] || [];

  const getActiveTitle = () => {
    const currentPath = location.pathname.substring(1);
    for (const item of menuItems) {
      if (item.id === currentPath) return item.title;
      if (item.children) {
        const child = item.children.find(c => c.path === currentPath || c.id === currentPath);
        if (child) return child.title;
      }
    }
    return "DASHBOARD";
  };


  const handleLogout = () => {
    dispatch(logoutUserThunk()).then(()=>{
        navigate('/login');
    })
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out lg:relative 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64 w-64'}
        `}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* <div className="bg-emerald-600 p-2 rounded-xl text-white shrink-0 shadow-sm">
            //   {/* <ShieldCheck size={20} /> 
            </div> */}
              <img src="/cyberhub_Logo.png" alt="" className='w-18' />
            {!isCollapsed && <span className="text-xl font-bold tracking-tight text-emerald-800">CYBERHUB</span>}
          </div>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1.5 text-slate-400"><X size={20} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(item.id)}
                    className="flex w-full items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="shrink-0"><item.icon size={22} /></div>
                      {!isCollapsed && <span className="whitespace-nowrap">{item.title}</span>}
                    </div>
                    {!isCollapsed && (openDropdowns[item.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
                  </button>
                  {openDropdowns[item.id] && !isCollapsed && (
                    <div className="mt-1 ml-9 space-y-1 border-l border-emerald-100">
                      {item.children.map(child => (
                        <NavLink
                          key={child.id}
                          to={"/" + (child.path || child.id)}
                          onClick={() => setIsSidebarOpen(false)}
                          className={({ isActive }) => 
                            `flex w-full items-center px-4 py-2 text-xs font-medium rounded-lg transition-all
                            ${isActive ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-400 hover:text-emerald-600'}`
                          }
                        >
                          {child.title}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  to={"/" + item.id}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) => 
                    `flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-emerald-600 !text-white shadow-lg shadow-emerald-600/20 font-semibold [&_svg]:text-white' 
                      : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
                    }`
                  }
                >
                  <div className="shrink-0"><item.icon size={22} /></div>
                  {!isCollapsed && <span className="text-sm flex-1 whitespace-nowrap">{item.title}</span>}
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100 bg-white">
          {/* {!isCollapsed && (
            <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">Simulation</p>
              <div className="flex justify-center gap-1">
                {ROLES.map(role => (
                  <button 
                    key={role.id}
                    onClick={() => setCurrentRole(role.id)}
                    className={`px-2 py-1 text-[10px] rounded-md border transition-all ${
                      currentRole === role.id ? 'bg-white border-emerald-200 text-emerald-700 shadow-sm font-bold' : 'text-slate-400 border-transparent'
                    }`}
                  >
                    {role.name}
                  </button>
                ))}
              </div>
            </div>
          )} */}
          <button
          onClick={handleLogout}
          className={`flex cursor-pointer w-full items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all ${isCollapsed ? 'justify-center px-0' : ''}`}>
            <div className="shrink-0"><LogOut size={20} /></div>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* --- FRAME CONTENT --- */}
      <div className="flex flex-col flex-1 min-w-0">
        
        {/* --- TOP BAR --- */}
        <header className="flex h-16 items-center justify-between px-4 sm:px-8 bg-white border-b border-slate-200 z-40 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-slate-400 text-sm">
              <span className="capitalize font-medium">{currentRole}</span>
              <ChevronRight size={14} className="opacity-50" />
              <span className="font-bold text-slate-800">{getActiveTitle().toUpperCase()}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative items-center">
              <Search className="absolute left-3 text-slate-400" size={16} />
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-slate-50 border border-transparent focus:border-emerald-500 rounded-full text-sm outline-none w-48 lg:w-64" />
            </div>
            <button onClick={()=> navigate('/notifications')} className="p-2 cursor-pointer text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 hover:scale-[1.08] rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="relative" ref={profileRef}>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex cursor-pointer items-center gap-2 p-1.5 rounded-full border border-slate-200 hover:bg-slate-50">
                <div className={`w-8 h-8 rounded-full ${ROLES.find(r => r.id === currentRole)?.color} flex items-center justify-center text-white font-bold text-xs`}>{currentRole.charAt(0).toUpperCase()}</div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 overflow-hidden">
                  <button className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-emerald-50"><UserCircle size={16} /> Profile</button>
                  <button className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-emerald-50"><Settings size={16} /> Settings</button>
                  <div className="h-px bg-slate-100 my-1 mx-2"></div>
                  <button onClick={handleLogout} className="flex cursor-pointer w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"><LogOut size={16} /> Sign out</button>
                </div>
              )}
            </div>
          </div>
        </header>

               <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <Outlet />
                </main>
       
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden" />}
    </div>
  );
}

export default Sidebar;
