import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getCaseByIdService,
  getTechDashboardData,
  getTechUserCasesService,
  getTechUserOngoingCasesService,
  updateCaseByTechUserService,
} from "../../services/services";

// TECH USER DASHBOARD
export const techUserDashboard = createAsyncThunk(
  "techUser/dasboard",
  async (_, thunkAPI) => {
    try {
      const response = await getTechDashboardData();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "FAiled to get dashboard data"
      );
    }
  }
);

// GET ASSIGNED CASES
export const getTechUserAssignedCases = createAsyncThunk(
  "techUser/getAssignedCases",
  async ({ page = 1, limit = 10, filters = {} }, thunkAPI) => {
    try {
      const response = await getTechUserCasesService(page, limit, filters);
      return {
        cases: response.cases,
        pagination: {
          currentPage: response.pagination.currentPage,
          totalPages: response.pagination.totalPages,
          totalCount: response.pagination.total,
          pageSize: response.pagination.pageSize,
        },
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Failed to get assigned cases"
      );
    }
  }
);

//GET CASE BY TECH USER
export const getSingleCaseById = createAsyncThunk(
  "techUser/getSingleCaseDetails",
  async (caseId, { rejectWithValue }) => {
    try {
      const response = await getCaseByIdService(caseId);
      return response.case;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCaseByTech = createAsyncThunk(
    'salesCases/updateCase',
    async ({ caseId, caseData }, thunkAPI) => {
        try {
            const response = await updateCaseByTechUserService(caseId, caseData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchTechUserOngoingCases = createAsyncThunk(
    'salesCases/fetchSaleUserOngoingCases',
    async ({ page = 1, limit = 10}, { rejectWithValue }) => {
        try {
            const response = await getTechUserOngoingCasesService(page, limit);
            return {
                cases: response.cases,
                pagination: {
                    currentPage: response.pagination.currentPage,
                    totalPages: response.pagination.totalPages,
                    totalCount: response.pagination.total,
                    pageSize: response.pagination.pageSize
                }
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


const techUserSlice = createSlice({
  name: "techUser",
  initialState: {
    techUser: [],
    dashboardData: [],
    cases: [],
    ongoingCases: [],
    notifications: [],
    selectedCase: null,
    modalLoading: false,
    isLoading: false,
    isError: false,
    isSuccess: false,
    error: null,
    message: "",
    showModal: false,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      pageSize: 10,
    },
    searchFilters: {
      customerName: "",
      phone: "",
      customerID: "",
      email: "",
    },
  },
  reducers: {
    resetTechUser: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    setTechSearchFilters: (state, action) => {
      state.searchFilters = {
        ...state.searchFilters,
        ...action.payload,
      };
    },

    setTechPageSize: (state, action) => {
      state.pagination.pageSize = action.payload;
      state.pagination.currentPage = 1;
    },

    setTechCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },

    setTechShowModal: (state, action) => {
      state.showModal = action.payload;
      if (!action.payload) {
        state.selectedCase = null;
      }
    },
    updateTechSelectedCase: (state, action) => {
    state.selectedCase = { ...state.selectedCase, ...action.payload };
  },
  },

  extraReducers: (builder) => {
    builder

      // TECH DASHBORD BUILDER
      .addCase(techUserDashboard.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(techUserDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dashboardData = action.payload;
      })
      .addCase(techUserDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })

      // GET ASSIGNED CASES
      .addCase(getTechUserAssignedCases.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getTechUserAssignedCases.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cases = action.payload.cases;
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
        };
      })
      .addCase(getTechUserAssignedCases.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // get single case
      .addCase(getSingleCaseById.pending, (state) => {
        state.modalLoading = true;
      })
      .addCase(getSingleCaseById.fulfilled, (state, action) => {
        state.modalLoading = false;
        state.showModal = true;
        state.selectedCase = action.payload;
      })
      .addCase(getSingleCaseById.rejected, (state, action) => {
        state.modalLoading = false;
        state.error = action.payload;
      })
            // updateCase
            .addCase(updateCaseByTech.pending, (state) => {
                state.modalLoading = true;
            })
            .addCase(updateCaseByTech.fulfilled, (state) => {
                state.modalLoading = false;
                state.showModal = false;
                state.selectedCase = null;
            })
            .addCase(updateCaseByTech.rejected, (state, action) => {
                state.modalLoading = false;
                state.error = action.payload;
            })  
            
            // fetchSaleUserOngoingCases
            .addCase(fetchTechUserOngoingCases.pending, (state) => {
            state.isLoading = true;
            state.error = null;
            })
            .addCase(fetchTechUserOngoingCases.fulfilled, (state, action) => {
            state.isLoading = false;
            state.ongoingCases = action.payload.cases;
            state.pagination = { ...state.pagination, ...action.payload.pagination };
            })
            .addCase(fetchTechUserOngoingCases.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            })

  },
});

export const {
  resetTechUser,
  setTechSearchFilters,
  setTechPageSize,
  setTechCurrentPage,
  setTechShowModal,
  updateTechSelectedCase
} = techUserSlice.actions;

export default techUserSlice.reducer;
