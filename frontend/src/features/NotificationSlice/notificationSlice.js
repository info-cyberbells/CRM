import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { saleUserNotificationService } from "../../services/services";



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



const notificationSlice = createSlice({
    name : "notification",
    initialState: {
        notifications: [],
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: '',
    },

    reducers: {
        resetNotification: (state)=>{
            state.notifications = [];
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
            state.message = '';
        })
        .addCase(getSaleUserNotifications.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isSuccess = true;
            state.notifications = action.payload.notifications;
        })
        .addCase(getSaleUserNotifications.rejected, (state)=>{
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
        })

    }

})

export const {resetNotification} = notificationSlice.actions;
export default notificationSlice.reducer;