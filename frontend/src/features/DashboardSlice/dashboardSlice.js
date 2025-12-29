import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDashboardData } from "../../services/services";

export const fetchDashboardData = createAsyncThunk(
    "dashboard/fetchDashboardData",
    async (_, { rejectWithValue }) => {
        try {
            return await getDashboardData();
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearDashboardError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;