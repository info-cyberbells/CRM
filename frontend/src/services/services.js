import axios from 'axios';
import { USER_ENDPOINTS } from './constants';

// Configure axios defaults
axios.defaults.withCredentials = true; // Always send HTTP-only cookies
axios.defaults.timeout = 10000; // 10 second timeout
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Optional: Add response interceptor for global error handling
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors globally
        if (error.response?.status === 401) {
            console.log('Unauthorized - token may have expired');
        }

        // Extract error message
        const message = error.response?.data?.message || error.message || 'Something went wrong';
        return Promise.reject(new Error(message));
    }
);

// Create User
export const createUser = async (userData) => {
    try {
        const response = await axios.post(USER_ENDPOINTS.CREATE_USER, userData);
        return response.data;
    } catch (error) {
        throw error; // Axios interceptor already formatted the error
    }
};

// Login User
export const loginUser = async (userData) => {
    const response = await axios.post(USER_ENDPOINTS.LOGIN_USER, userData);
    return response.data;
};


// Logout User
export const logoutUserAPI = async () => {
    try {
        const response = await axios.post(USER_ENDPOINTS.LOGOUT_USER);
        return response.data;
    } catch (error) {
        throw error;
    }
};

//get dashboard data
export const getDashboardData = async () => {
    const response = await axios.get(USER_ENDPOINTS.GET_DASHBOARD, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response.data;
};

// PREVIEW CASE ID
export const previwCaseIDService = async(caseType)=>{
    try {
        const response = await axios.get(
            `${USER_ENDPOINTS.SALE_PREVIEW_CASEID}/${caseType}`,{
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        return response.data;
    } catch (error) {
        throw error;
    }
}

//create acse
export const createCase = async (caseData) => {
    try {
        const response = await axios.post(USER_ENDPOINTS.SUBMIT_CASE, caseData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

//search sale users cases
export const searchSaleUserCases = async (page, limit, filters) => {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        });

        if (filters.customerName?.trim()) queryParams.append('customerName', filters.customerName.trim());
        if (filters.phone?.trim()) queryParams.append('phone', filters.phone.trim());
        if (filters.customerID?.trim()) queryParams.append('customerID', filters.customerID.trim());
        if (filters.email?.trim()) queryParams.append('email', filters.email.trim());
        if (filters.status?.trim()) queryParams.append('status', filters.status.trim());

        const response = await axios.get(`${USER_ENDPOINTS.SEARCH_SALE_USER_CASES}?${queryParams}`, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Search case details by ID
export const searchCaseById = async (caseId) => {
    try {
        const response = await axios.get(`${USER_ENDPOINTS.SEARCH_CASE_BY_ID}/${caseId}`, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update searched case
export const updateSearchedCase = async (caseId, caseData) => {
    try {
        const response = await axios.put(`${USER_ENDPOINTS.UPDATE_SEARCHED_CASE}/${caseId}`, caseData, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

//search sale users cases
export const searchSaleUserOngoingCases = async (page, limit) => {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
              status: "ongoing"
        });

        // if (filters.status?.trim()) queryParams.append('status', filters.status.trim());

        const response = await axios.get(`${USER_ENDPOINTS.SEARCH_SALE_USER_CASES}?${queryParams}`, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// SALE USER NOTIFICATION API
export const saleUserNotificationService = async ()=>{
    const response = await axios.get(
        USER_ENDPOINTS.SALE_USER_NOTIFICATION, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            },
        },
    );
    return response.data;
}

export const getTechDashboardData = async () => {
    const response = await axios.get(USER_ENDPOINTS.TECH_USER_DASHBOARD, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response.data;
};

//GET USER ASSIGNED CASES
export const getTechUserCasesService = async (page, limit, filters) => {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        });

        if (filters.customerName?.trim()) queryParams.append('customerName', filters.customerName.trim());
        if (filters.phone?.trim()) queryParams.append('phone', filters.phone.trim());
        if (filters.customerID?.trim()) queryParams.append('customerID', filters.customerID.trim());
        if (filters.email?.trim()) queryParams.append('email', filters.email.trim());

        const response = await axios.get(`${USER_ENDPOINTS.TECH_USER_MY_CASES}?${queryParams}`, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// GET NOTIFICATIONS FOR TECH USER
export const getTechUserNotificationService = async ()=>{
    try {
        const response = await axios.get(
            USER_ENDPOINTS.TECH_USER_NOTIFICATIONS, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json'}
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Search case details by ID tech user
export const getCaseByIdService = async (caseId) => {
    try {
        const response = await axios.get(`${USER_ENDPOINTS.TECH_USER_GET_CASE_BY_ID}/${caseId}`, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// updated Cases by tech user
export const updateCaseByTechUserService = async (caseId, caseData) => {
    try {
        const response = await axios.put(`${USER_ENDPOINTS.TECH_USER_UPDATE_CASE}/${caseId}`, caseData, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

//tech user onging cases cases
export const getTechUserOngoingCasesService = async (page, limit) => {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
              status: "ongoing"
        });

        const response = await axios.get(`${USER_ENDPOINTS.TECH_USER_MY_CASES}?${queryParams}`, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};












//  ADMIN DASHBOARD SERVICE
export const getAdminDashboardDataService = async () => {
    const response = await axios.get(USER_ENDPOINTS.ADMIN_DASHBOARD, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response.data;
};


// ADMIN GET ALL CASE WITH SEARCH
export const adminSearchAllCasesService = async(page, limit, filters) =>{
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (filters.customerName?.trim()) queryParams.append('customerName', filters.customerName.trim());
        if (filters.customerID?.trim()) queryParams.append('customerID', filters.customerID.trim());
        if (filters.email?.trim()) queryParams.append('email', filters.email.trim());
        if (filters.phone?.trim()) queryParams.append('phone', filters.phone.trim());

        const response = await axios.get(
            `${USER_ENDPOINTS.ADMIN_SEARCH_CASES}?${queryParams}`,{
                withCredentials: true,
                headers: {
                    'Content-Type' : 'application/json',
                }
            }
        );
         return response.data;

    } catch (error) {
        throw error;
    }
};

// ADMIN VIEW CASE IN DETAILS
export const adminViewCaseDetailService = async(caseId)=>{
    try {
        const response = await axios.get(
            `${USER_ENDPOINTS.ADMIN_VIEW_CASE_DETAILS}/${caseId}`,{
                withCredentials: true,
                headers: {
                    'Content-Type' : 'application/json', 
                }
            }
        );
        return response.data
    } catch (error) {
        throw error;
    }
};

// updated Cases by ADMIN
export const updateCaseByAdminService = async (caseId, caseData) => {
    try {
        const response = await axios.put(`${USER_ENDPOINTS.ADMIN_UPDATE_CASE_DETAILS}/${caseId}`, caseData, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ADMIN CREATE NOTICE SERVICE
export const adminCreateNoticeService = async(noticeData)=>{
    try {
        const response = await axios.post(
            USER_ENDPOINTS.ADMIN_CREATE_NOTICE, noticeData, {
                withCredentials: true,
                headers: {
                    'Content-Type' : 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

// ADMIN GET ALL NOTICES
export const adminGetAllNoticeService = async(page, limit)=>{
    try {

        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        const response = await axios.get(
            `${USER_ENDPOINTS.ADMIN_GET_ALL_NOTICES}?${queryParams}`, {
                withCredentials: true,
                headers: {
                    'Content-Type' : 'application/json'
                }
            } 
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

// UPADTE NOTICE ADMIN
export const adminUpdateNoticeService = async(id, noticeData)=>{
    try {
        const response = await axios.put(
            `${USER_ENDPOINTS.ADMIN_UPDATE_NOTICE}/${id}`,noticeData,{
                withCredentials: true,
                headers:{
                    'Content-Type' : 'application/json'
                }
            }
        );
        return response.data
    } catch (error) {
        throw error;
    }
}

// DELETE NOTICE BY AMDIN
export const adminDeleteNoticeService = async(id)=>{
    try {
        const response = await axios.delete(
            `${USER_ENDPOINTS.ADMIN_DELETE_NOTICE}/${id}`,{
                withCredentials: true,
                headers: {
                    'Content-type' : 'application/json' 
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

// SEARCH TECH USER BY ADMIN
export const adminSearchTechUserService = async(keyword)=>{
    try {
         const queryParams = new URLSearchParams({
            keyword: keyword.toString(),
            });
        const response = await axios.get(
            `${USER_ENDPOINTS.ADMIN_SEARCH_TECH_USER}?${queryParams}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

//ADMIN GET NOTIFICATIONS 
export const getAdminNotificationsService = async ()=>{
    try {
        const response = await axios.get(USER_ENDPOINTS.ADMIN_NOTIFICATION,{
            withCredentials: true,
            headers: {
                "Content-Type":"application/json"
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}