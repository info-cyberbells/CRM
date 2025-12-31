import React, { useState, useMemo, useEffect } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Circle, 
  Info, 
  AlertCircle, 
  Clock, 
  User, 
  Briefcase,
  CheckCircle2,
  MoreVertical,
  Filter,
  Inbox,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getSaleUserNotifications } from '../../features/NotificationSlice/notificationSlice';



const NotificationCenter = () => {

  const dispatch = useDispatch();

  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('ALL');
  const [expandedId, setExpandedId] = useState(null);
  
    useEffect(()=>{
      dispatch(getSaleUserNotifications());
    },[dispatch])
  
  const {notifications = [], isLoading, isError, isSuccess} = useSelector((state)=> state.notification);
  const unreadCount = notifications.filter(n => !n.isRead).length;


  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };


 const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-IN', {
    timeZone: 'UTC', 
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};


  const getTypeStyles = (type) => {
    switch (type) {
      case 'NEW_CASE': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'SYSTEM_UPDATE': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'UPDATE': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const filteredNotifications = useMemo(() => {
    let list = [...notifications].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (filter === 'unread') list = list.filter(n => !n.isRead);
    if (filter === 'read') list = list.filter(n => n.isRead);
    if (activeTab !== 'ALL') list = list.filter(n => n.type === activeTab);
    return list;
  }, [notifications, filter, activeTab]);

  // const uniqueTypes = ['ALL', ...new Set(notifications.map(n => n.type))];

  return (
    <div className="min-h-screen mt-16 bg-[#f8fafc] p-4 md:p-10 font-sans text-[#2c3e50]">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 border-b border-slate-200">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#2c3e50]">Notifications</h1>
            <p className="text-slate-500 font-medium">You have {unreadCount} unread updates.</p>
          </div>
          
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex bg-slate-200/50 p-1 rounded-xl w-full md:w-auto">
            {['all', 'unread', 'read'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 md:flex-none px-5 py-2 text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${
                  filter === f 
                  ? 'bg-white text-[#2c3e50] shadow-sm' 
                  : 'text-slate-400 cursor-pointer hover:text-[#2c3e50]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
            {uniqueTypes.map(type => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === type
                  ? 'bg-[#2c3e50] text-white shadow-md'
                  : 'bg-transparent text-slate-400 hover:text-[#2c3e50] hover:bg-slate-100'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div> */}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => {
              const isExpanded = expandedId === notif.id;
              return (
                <div 
                  key={notif.id}
                  onClick={() => toggleExpand(notif.id)}
                  className={`group cursor-pointer bg-white border rounded-2xl transition-all duration-300 overflow-hidden ${
                    isExpanded 
                      ? 'ring-2 ring-[#2c3e50] shadow-xl translate-x-1' 
                      : 'hover:shadow-md border-slate-100'
                  } ${!notif.isRead && !isExpanded ? 'bg-blue-50/20' : ''}`}
                >
                  <div className="p-4 md:p-6">
                    <div className="flex items-start gap-4">
                      {/* Left: Icon & Unread Dot */}
                      <div className="relative flex-shrink-0">
                        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${getTypeStyles(notif.type)}`}>
                          {notif.type === 'NEW_CASE' && <Briefcase className="w-6 h-6" />}
                          {notif.type === 'SYSTEM_UPDATE' && <AlertCircle className="w-6 h-6" />}
                          {notif.type === 'UPDATE' && <Info className="w-6 h-6" />}
                        </div>
                        {!notif.isRead && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm" />
                        )}
                      </div>

                      {/* Center: Content */}
                      <div className="flex-grow min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1">
                          <h3 className={`text-lg font-bold truncate ${notif.isRead ? 'text-slate-500' : 'text-[#2c3e50]'}`}>
                            {notif.title}
                          </h3>
                          <span className="flex-shrink-0 text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(notif.date)}
                          </span>
                        </div>

                        {/* Collapsed State: Single line message */}
                        {!isExpanded && (
                          <p className="text-sm text-slate-500 truncate max-w-2xl">
                            {notif.message}
                          </p>
                        )}

                        {/* Expanded Content */}
                        <div className={`transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                          <p className="text-base text-slate-700 leading-relaxed mb-6 border-l-4 border-[#2c3e50]/10 pl-4 py-1">
                            {notif.message}
                          </p>

                          {/* Detail Grid */}
                          {notif.caseId && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-black text-slate-400">Customer</span>
                                <div className="text-sm font-bold text-[#2c3e50] flex items-center gap-2">
                                  <User className="w-3.5 h-3.5" />
                                  {notif.customerName}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-black text-slate-400">Case ID</span>
                                <div className="text-sm font-bold text-[#2c3e50]">#{notif.caseId}</div>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-black text-slate-400">Status</span>
                                <div className={`text-sm font-bold flex items-center gap-2 ${notif.status === 'Open' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${notif.status === 'Open' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                  {notif.status}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-black text-slate-400">Actor</span>
                                <div className="text-sm font-bold text-slate-500 truncate italic">{notif.actor}</div>
                              </div>
                            </div>
                          )}

                          {/* Detail Actions */}
                          {/* <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#2c3e50] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                              <ExternalLink className="w-3.5 h-3.5" /> View Case File
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#2c3e50] rounded-lg shadow-md transition-transform hover:scale-105 active:scale-95">
                              Respond Now
                            </button>
                          </div> */}
                        </div>
                      </div>

                      {/* Right: Interaction Toggle */}
                      <div className="flex-shrink-0 self-center flex items-center gap-3">
                        <button
                          onClick={(e) => toggleReadStatus(e, notif.id)}
                          className={`p-2 rounded-xl transition-all ${
                            notif.isRead 
                            ? 'text-slate-200 hover:text-blue-500' 
                            : 'text-[#2c3e50] bg-slate-100 hover:bg-slate-200 shadow-sm'
                          }`}
                          title={notif.isRead ? "Mark as unread" : "Mark as read"}
                        >
                          {notif.isRead ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5 fill-[#2c3e50]" />}
                        </button>
                        <div className={`text-slate-300 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#2c3e50]' : ''}`}>
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white border border-slate-100 rounded-3xl py-24 flex flex-col items-center justify-center text-center px-6">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-slate-50/50">
                <Inbox className="w-10 h-10 text-slate-300 stroke-1" />
              </div>
              <h3 className="text-xl font-bold text-[#2c3e50]">No messages found</h3>
              <p className="text-slate-400 text-sm mt-1">Try resetting your filters.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default NotificationCenter;