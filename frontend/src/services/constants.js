export const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;


export const USER_ENDPOINTS = {
  LOGIN_USER: `${API_BASE_URL}/auth/login`,
  CREATE_USER: `${API_BASE_URL}/users/createUser`,
  LOGOUT_USER: `${API_BASE_URL}/auth/logout`,
  GET_DASHBOARD: `${API_BASE_URL}/sale-user/dashboard`,
  SUBMIT_CASE: `${API_BASE_URL}/sale-user/createNewCase`,
  SEARCH_SALE_USER_CASES: `${API_BASE_URL}/sale-user/saleUser`,
  SEARCH_CASE_BY_ID: `${API_BASE_URL}/sale-user/getCaseById`,
  UPDATE_SEARCHED_CASE: `${API_BASE_URL}/sale-user/updateCase`,
  SALE_USER_NOTIFICATION: `${API_BASE_URL}/sale-user/notifications`,

  SALE_PREVIEW_CASEID: `${API_BASE_URL}/sale-user/previewCaseId`,
  SALE_USER_CREATE_NOTE: `${API_BASE_URL}/sale-user/createNote`,
  SALE_USER_GET_NOTES: `${API_BASE_URL}/sale-user/getCaseNotes`,

  SALE_USER_MY_ATTENDANCE: `${API_BASE_URL}/sale-user/my-attendance`,





  TECH_USER_DASHBOARD: `${API_BASE_URL}/tech-user/dashboard`,

  TECH_USER_MY_CASES: `${API_BASE_URL}/tech-user/my-cases`,
  TECH_USER_GET_CASE_BY_ID: `${API_BASE_URL}/tech-user/getCaseById`,
  TECH_USER_UPDATE_CASE: `${API_BASE_URL}/tech-user/updateCase`,

  TECH_USER_CREATE_NOTE: `${API_BASE_URL}/tech-user/createNote`,
  TECH_USER_GET_NOTES: `${API_BASE_URL}/tech-user/getCaseNotes`,

  TECH_USER_UPGRADE_PLAN: `${API_BASE_URL}/tech-user/upgrade-plan`,

  TECH_USER_MY_ATTENDANCE: `${API_BASE_URL}/tech-user/my-attendance`,


  TECH_USER_NOTIFICATIONS: `${API_BASE_URL}/tech-user/notifications`,


  ADMIN_DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
  ADMIN_SEARCH_CASES: `${API_BASE_URL}/admin/all-cases`,
  ADMIN_VIEW_CASE_DETAILS: `${API_BASE_URL}/admin/getCaseById`,
  ADMIN_UPDATE_CASE_DETAILS: `${API_BASE_URL}/admin/updateCase`,
  ADMIN_SEARCH_TECH_USER: `${API_BASE_URL}/admin/searchTechUser`,

  ADMIN_CREATE_NOTICE: `${API_BASE_URL}/admin/notice`,
  ADMIN_GET_ALL_NOTICES: `${API_BASE_URL}/admin/notices`,
  ADMIN_UPDATE_NOTICE: `${API_BASE_URL}/admin/notice`,
  ADMIN_DELETE_NOTICE: `${API_BASE_URL}/admin/notice`,

  ADMIN_SALES_REPORT: `${API_BASE_URL}/admin/sale-report`,
  ADMIN_OVERALL_SUMMARY: `${API_BASE_URL}/admin/overAllSummary`,

  ADMIN_NOTIFICATION: `${API_BASE_URL}/admin/notifications`,

  ADMIN_CREATE_AGENT: `${API_BASE_URL}/admin/createAgent`,
  ADMIN_UPDATE_AGENT: `${API_BASE_URL}/admin/updateAgent`,
  ADMIN_VIEW_AGENT: `${API_BASE_URL}/admin/getAgent`,
  ADMIN_GET_ALL_AGENTS: `${API_BASE_URL}/admin/getAllAgents`,

  ADMIN_CREATE_NOTE: `${API_BASE_URL}/admin/createNote`,
  ADMIN_GET_NOTES: `${API_BASE_URL}/admin/getCaseNotes`,

  ADMIN_ADD_ATTENDANCE: `${API_BASE_URL}/admin/attendance/mark`,
  GET_DAILY_ATTENDANCE: `${API_BASE_URL}/admin/attendance/daily`,
  GET_MONTHLY_ATTENDANCE: `${API_BASE_URL}/admin/attendance/monthly`,

  ADMIN_GET_ACTIVITY_LOGS: `${API_BASE_URL}/admin/activitylogs`,

  // CHAT ENDPOINTS
  CHAT_GET_USERS: `${API_BASE_URL}/chat/users`,
  CHAT_GET_MY_ROOMS: `${API_BASE_URL}/chat/rooms`,
  CHAT_CREATE_DIRECT: `${API_BASE_URL}/chat/rooms/direct`,
  CHAT_GET_MESSAGES: `${API_BASE_URL}/chat/rooms`,
  CHAT_UPLOAD_FILE: `${API_BASE_URL}/chat/upload`,
  CHAT_CREATE_GROUP: `${API_BASE_URL}/chat/rooms`,
  CHAT_ADD_MEMBER: `${API_BASE_URL}/chat/rooms`,
  CHAT_REMOVE_MEMBER: `${API_BASE_URL}/chat/rooms`,
  CHAT_ALL_ROOMS: `${API_BASE_URL}/chat/admin/rooms`,
  CHAT_GET_MEMBERS: `${API_BASE_URL}/chat/rooms`,


  // USER SESSIONS ENDPOINTS
  USER_CLOCK_IN: `${API_BASE_URL}/user-session/clockIn`,
  USER_START_BREAK: `${API_BASE_URL}/user-session/start-break`,
  USER_END_BREAK: `${API_BASE_URL}/user-session/end-break`,
  USER_CLOCK_OUT: `${API_BASE_URL}/user-session/clock-out`,
  USER_GET_MY_SESSION: `${API_BASE_URL}/user-session/get-my-session-status`,

  ADMIN_GET_AGENTS_MONITOR: `${API_BASE_URL}/admin/get-agent/status`,

  GET_PROFILE: `${API_BASE_URL}/profile/myprofile`,
  UPDATE_PROFILE: `${API_BASE_URL}/profile/updateProfile`
};
