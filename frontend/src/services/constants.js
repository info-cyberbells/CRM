export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


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

    TECH_USER_DASHBOARD: `${API_BASE_URL}/tech-user/dashboard`,

    TECH_USER_MY_CASES: `${API_BASE_URL}/tech-user/my-cases`,
    TECH_USER_GET_CASE_BY_ID: `${API_BASE_URL}/tech-user/getCaseById`,
    TECH_USER_UPDATE_CASE: `${API_BASE_URL}/tech-user/updateCase`,


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
};
