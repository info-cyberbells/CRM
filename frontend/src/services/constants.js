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

    TECH_USER_DASHBOARD: `${API_BASE_URL}/tech-user/dashboard`,
};
