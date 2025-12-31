import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchSaleUserCases, searchCaseById, updateSearchedCase, searchSaleUserOngoingCases } from '../../services/services';

// Async thunks
export const fetchSaleUserCases = createAsyncThunk(
    'salesCases/fetchSaleUserCases',
    async ({ page = 1, limit = 10, filters = {} }, { rejectWithValue }) => {
        try {
            const response = await searchSaleUserCases(page, limit, filters);
            return {
                cases: response.cases,
                pagination: {
                    currentPage: response.pagination.currentPage,
                    totalPages: response.pagination.totalPages,
                    totalCount: response.pagination.total,
                    pageSize: limit
                }
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchCaseById = createAsyncThunk(
    'salesCases/fetchCaseById',
    async (caseId, { rejectWithValue }) => {
        try {
            const response = await searchCaseById(caseId);
            return response.case;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateCase = createAsyncThunk(
    'salesCases/updateCase',
    async ({ caseId, caseData }, { rejectWithValue, dispatch, getState }) => {
        try {
            const response = await updateSearchedCase(caseId, caseData);

            // Refresh the cases list after update
            // const { pagination, searchFilters } = getState().salesCases;
            // dispatch(fetchSaleUserCases({
            //     page: pagination.currentPage,
            //     limit: pagination.pageSize,
            //     filters: searchFilters
            // }));

            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Async thunks
export const fetchSaleUserOngoingCases = createAsyncThunk(
    'salesCases/fetchSaleUserOngoingCases',
    async ({ page = 1, limit = 10}, { rejectWithValue }) => {
        try {
            const response = await searchSaleUserOngoingCases(page, limit);
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

const initialState = {
    cases: [],
    ongoingCases: [],
    selectedCase: null,
    loading: false,
    modalLoading: false,
    error: null,
    showModal: false,
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
};

const salesCasesSlice = createSlice({
    name: 'salesCases',
    initialState,
    reducers: {
        setSearchFilters: (state, action) => {
            state.searchFilters = { ...state.searchFilters, ...action.payload };
        },
        setPageSize: (state, action) => {
            state.pagination.pageSize = action.payload;
            state.pagination.currentPage = 1;
        },
        setCurrentPage: (state, action) => {
            state.pagination.currentPage = action.payload;
        },
        setShowModal: (state, action) => {
            state.showModal = action.payload;
            if (!action.payload) {
                state.selectedCase = null;
            }
        },
        clearError: (state) => {
            state.error = null;
        },
        updateSelectedCase: (state, action) => {
            state.selectedCase = { ...state.selectedCase, ...action.payload };
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchSaleUserCases
            .addCase(fetchSaleUserCases.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSaleUserCases.fulfilled, (state, action) => {
                state.loading = false;
                state.cases = action.payload.cases;
                state.pagination = { ...state.pagination, ...action.payload.pagination };
            })
            .addCase(fetchSaleUserCases.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // fetchCaseById
            .addCase(fetchCaseById.pending, (state) => {
                state.modalLoading = true;
            })
            .addCase(fetchCaseById.fulfilled, (state, action) => {
                state.modalLoading = false;
                state.selectedCase = action.payload;
                state.showModal = true;
            })
            .addCase(fetchCaseById.rejected, (state, action) => {
                state.modalLoading = false;
                state.error = action.payload;
            })

            // updateCase
            .addCase(updateCase.pending, (state) => {
                state.modalLoading = true;
            })
            .addCase(updateCase.fulfilled, (state) => {
                state.modalLoading = false;
                state.showModal = false;
                state.selectedCase = null;
            })
            .addCase(updateCase.rejected, (state, action) => {
                state.modalLoading = false;
                state.error = action.payload;
            })

            // fetchSaleUserOngoingCases
            .addCase(fetchSaleUserOngoingCases.pending, (state) => {
            state.loading = true;
            state.error = null;
            })
            .addCase(fetchSaleUserOngoingCases.fulfilled, (state, action) => {
            state.loading = false;
            state.ongoingCases = action.payload.cases;
            state.pagination = { ...state.pagination, ...action.payload.pagination };
            })
            .addCase(fetchSaleUserOngoingCases.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            });

            
    }
});

export const {
    setSearchFilters,
    setPageSize,
    setCurrentPage,
    setShowModal,
    clearError,
    updateSelectedCase
} = salesCasesSlice.actions;

export default salesCasesSlice.reducer;