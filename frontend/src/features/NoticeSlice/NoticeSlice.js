import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { adminCreateNoticeService, adminDeleteNoticeService, adminGetAllNoticeService, adminUpdateNoticeService } from "../../services/services";

// CREATE NOTICE BY ADMIN THUNK
export const createNotice = createAsyncThunk(
    'notice/create',
    async(noticeData, thunkAPI) =>{
        try {
            const response = await adminCreateNoticeService(noticeData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create Notice");
        }
    }
);

// GET ALL NOTICES THUNK
export const fetchAllNotices =  createAsyncThunk(
    'notice/getAllNotices',
    async({page = 1, limit = 10 }, thunkAPI)=>{
        try {
            const response = await adminGetAllNoticeService(page, limit);
            return {
                allNotices: response.notices,
                pagination: {
                    currentPage: response.pagination.currentPage,
                    totalPages: response.pagination.totalPages,
                    totalCount: response.pagination.total,
                    pageSize: response.pagination.pageSize,
                }
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to get all Notice");            
        }
    }
);

// UPDATE NOTICE THUNK
export const updateNotice = createAsyncThunk(
    'notice/updateNotice',
    async({id, noticeData}, thunkAPI) =>{
        try {
            const response = await adminUpdateNoticeService(id, noticeData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update Notice");            
        }
    }
);

// DELETE NOTICE THUNK
export const deleteNotice = createAsyncThunk(
    'notice/deleteNotice',
    async(id, thunkAPI)=>{
        try {
            const response = await adminDeleteNoticeService(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete Notice");             
        }
    }
);

const noticeSlice = createSlice({
    name: 'notice',
    initialState: {
        allNotices: [],
        notice: null,
        isLoading: false,
        isError: false,
        error: null,
        pagination: {
            currentPage: 1,
            totalPages: 0,
            totalCount: 0,
            pageSize: 10
        },
    },

    reducers: {
        resetNotices: (state)=>{
            state.isError = false;
            state.allNotices = [];
        }
    },

    extraReducers: (builder)=> {
        builder
        // create notice
        .addCase(createNotice.pending, (state)=>{
            state.isLoading = true;
            state.isError = false;
            state.error = null;
        })
        .addCase(createNotice.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.allNotices = [action.payload, ...state.allNotices];
            state.pagination.totalCount = (state.pagination.totalCount || 0) + 1;

        })
        .addCase(createNotice.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.error = action.payload;
        })

        // get all notices for admin
        .addCase(fetchAllNotices.pending, (state)=>{
            state.isLoading = true;
            state.isError = false;
            state.error = null;
        })
        .addCase(fetchAllNotices.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.allNotices = action.payload.allNotices;
            state.pagination = {...state.pagination, ...action.payload.pagination};
        })
        .addCase(fetchAllNotices.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.error = action.payload;
        })

        // update notice
        .addCase(updateNotice.pending, (state)=>{
            state.isLoading = true;
            state.isError = false;
            state.error = null;
        })
        .addCase(updateNotice.fulfilled, (state, action)=>{
            state.isLoading = false;
            const updatedNotice = action.payload;
            const index = state.allNotices.findIndex(
                (notice) => notice.id === updatedNotice.id
            );
            if (index !== -1) {
                state.allNotices[index] = updatedNotice;
            }

        })
        .addCase(updateNotice.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.error = action.payload;
        })

        //delete notice
        .addCase(deleteNotice.pending, (state)=>{
            state.isLoading = true;
            state.isError = false;
            state.error = null;
        })
        .addCase(deleteNotice.fulfilled,(state, action)=>{
            state.isLoading = false;
            state.allNotices = state.allNotices.filter(
                notice => notice.id !== action.meta.arg
            );

            state.pagination.totalCount = state.pagination.totalCount - 1;
        })
        .addCase(deleteNotice.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.error = action.payload;
        })
    }
})

export default noticeSlice.reducer;