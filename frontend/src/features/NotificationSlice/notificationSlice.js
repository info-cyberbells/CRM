import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getTechUserNotificationService, saleUserNotificationService } from "../../services/services";



// SALE USER THUNK SERVICE
export const getSaleUserNotifications = createAsyncThunk(
    'notification/saleUserNotification',
    async(_, thunkAPI)=>{
        try {
            const response = await saleUserNotificationService();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to get sale user Notification");
        }
    }
);

// GET TECH NOTIFICATIONS
export const getTechUserNotifications = createAsyncThunk(
    'techUser/getNotifications',
    async(_, thunkAPI)=>{
        try {
            const response = await getTechUserNotificationService();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to get notifications");
        }
    }
);


const notificationSlice = createSlice({
    name : "notification",
    initialState: {
        notifications: [],
        error: null,
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: '',
    },

    reducers: {
        resetNotification: (state)=>{
            state.notifications = [];
            state.error = null;
            state.isSuccess = false;
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        },
    },

    extraReducers: (builder)=>{
        builder

        //  SALE USER NOTIFICATIONS
        .addCase(getSaleUserNotifications.pending, (state)=>{
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
            state.error = null;
            state.message = '';
        })
        .addCase(getSaleUserNotifications.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isSuccess = true;
            state.notifications = action.payload.notifications;
        })
        .addCase(getSaleUserNotifications.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.error = action.payload;
        })

        // GET TECH NOTIFICATION
         .addCase(getTechUserNotifications.pending, (state)=>{
            state.isLoading = false;
            state.isError = false;
            state.error = null;
         })
         .addCase(getTechUserNotifications.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isSuccess = true;
            state.notifications = action.payload.notifications;
         })
         .addCase(getTechUserNotifications.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.error = action.payload;
         })

    }

})

export const {resetNotification} = notificationSlice.actions;
export default notificationSlice.reducer;