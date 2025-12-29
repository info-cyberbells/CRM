export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const USER_ENDPOINTS = {
    LOGIN_USER: `${API_BASE_URL}/users/login`,
    CREATE_USER: `${API_BASE_URL}/users/createUser`,
    VERIFY_TOKEN: `${API_BASE_URL}/users/verifyToken`,
    LOGOUT_USER: `${API_BASE_URL}/users/logout`,
    GET_DASHBOARD: `${API_BASE_URL}/cases/dashboard`,
    SUBMIT_CASE: `${API_BASE_URL}/cases/createNewCase`,
    SEARCH_SALE_USER_CASES: `${API_BASE_URL}/cases/saleUser`,
    SEARCH_CASE_BY_ID: `${API_BASE_URL}/cases/getCaseById`,
    UPDATE_SEARCHED_CASE: `${API_BASE_URL}/cases/updateCase`,
};
