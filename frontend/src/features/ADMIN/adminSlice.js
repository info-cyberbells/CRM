import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminSearchAllCasesService, adminSearchTechUserService, adminViewCaseDetailService, getAdminDashboardDataService, updateCaseByAdminService } from "../../services/services";

// ADMIN DASBOARD THUNK
export const adminDashboard = createAsyncThunk(
    'admin/dashboard',
    async(_, thunkAPI) => {
        try {
            const response = await getAdminDashboardDataService();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to get Dashboard data");
        }
    }
)

// ADMIN GET ALL CASES WITH SEARCH
export const fetchAllCasesAdmin = createAsyncThunk(
    'admin/searchAllCases',
    async({ page = 1, limit = 10, filters = {} }, thunkAPI)=>{
        try {
            const response = await adminSearchAllCasesService(page, limit, filters);
            return {
                cases: response.cases,
                pagination: {
                    currentPage: response.pagination.currentPage,
                    totalPages: response.pagination.totalPages,
                    totalCount: response.pagination.total,
                    pageSize: response.pagination.pageSize,
            }
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to get cases");
        }
    }
);


// ADMIN VIEW CASE DETAILS
export const adminViewCase = createAsyncThunk(
    'admin/viewCaseDetails',
    async(caseId,thunkAPI)=>{
        try {
            const response = await adminViewCaseDetailService(caseId);
            return response.case;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to get case details");
        }
    }
);

// ADMIN UPDATE CASE DETAILS
export const updateCaseDetailsByAdmin = createAsyncThunk(
    'admin/updateCaseDetails',
    async({caseId, caseData}, thunkAPI) => {
        try {
            const response = await updateCaseByAdminService(caseId, caseData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update case details");
        }
    }
);

//ADMIN SEARCH TECH USER
export const searchTechUser  = createAsyncThunk(
    'admin/searchTechUser',
    async(keyword, thunkAPI) => {
        try {
            const response = await adminSearchTechUserService(keyword);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to get tech user details");
        }
    }
)

const adminSlice = createSlice({
    name : "admin",
    initialState : {
        dashboardData: null,
        cases: [],
        selectedCase: null,
        searchTechusers: [],
        searchLoading: false,
        modalLoading: false,
        showModal: false,
        isLoading: false,
        isError: false,
        isSuccess: false,
        error: null,
            pagination: {
            currentPage: 1,
            totalPages: 0,
            totalCount: 0,
            pageSize: 10
        },
        searchFilters: {
            customerName: '',
            phone: '',
            customerID: '',
            email: ''
        }
    },
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.error = null;
        },
         setAdminSearchFilters: (state, action) => {
            state.searchFilters = { ...state.searchFilters, ...action.payload };
        },
         setAdminPageSize: (state, action) => {
            state.pagination.pageSize = action.payload;
            state.pagination.currentPage = 1;
        },
        setAdminCurrentPage: (state, action) => {
            state.pagination.currentPage = action.payload;
        },
        setAdminShowModal: (state, action) => {
            state.showModal = action.payload;
                if (!action.payload) {
                    state.selectedCase = null;
            }
        },
        updateAdminSelectedCase: (state, action) => {
            state.selectedCase = { ...state.selectedCase, ...action.payload };
        }
    },
    extraReducers: (builders) =>{
        builders
        .addCase(adminDashboard.pending, (state)=>{
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
        })
        .addCase(adminDashboard.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isSuccess = true;
            state.dashboardData = action.payload;
        })
        .addCase(adminDashboard.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.error = action.payload;
        })

        // ADMDIN GET ALL CASE WITH SEARCH
        .addCase(fetchAllCasesAdmin.pending, (state)=>{
            state.isLoading = true;
            state.isError = false;
            state.error = null;
        })
        .addCase(fetchAllCasesAdmin.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.cases = action.payload.cases;
            state.pagination = { ...state.pagination, ...action.payload.pagination};
        })
        .addCase(fetchAllCasesAdmin.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.error = action.payload;
        })

        // admin view case in details
        .addCase(adminViewCase.pending, (state)=>{
            state.modalLoading = true;
        })
        .addCase(adminViewCase.fulfilled, (state, action)=>{
            state.modalLoading = false;
            state.selectedCase = action.payload;
            state.showModal = true;
        })
        .addCase(adminViewCase.rejected, (state, action)=>{
            state.modalLoading = false;
            state.error = action.payload;
        })

        // update case details by admin
        .addCase(updateCaseDetailsByAdmin.pending, (state)=>{
            state.modalLoading = true;
        })
        .addCase(updateCaseDetailsByAdmin.fulfilled, (state, action)=>{
            state.modalLoading = false;
            state.showModal = false;
            state.selectedCase = null;
        })
        .addCase(updateCaseDetailsByAdmin.rejected, (state)=>{
            state.modalLoading = false;
            state.error = action.payload;
        })
        .addCase(searchTechUser.pending, (state)=>{
            state.searchLoading = true;
        })
        .addCase(searchTechUser.fulfilled, (state, action)=>{
            state.searchLoading = false;
            state.searchTechusers = action.payload.users;
        })
        .addCase(searchTechUser.rejected, (state)=>{
            state.isLoading = false;
        })
    }
})

export const { setAdminSearchFilters, setAdminPageSize, setAdminCurrentPage, setAdminShowModal, updateAdminSelectedCase} = adminSlice.actions;
export default adminSlice.reducer;