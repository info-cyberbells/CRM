import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getActivityLogsService } from "../../services/services";

// GET ACTIVITY LOGS
export const getActivityLogs = createAsyncThunk(
  "activityLogs/getActivityLogs",
  async (params, thunkAPI) => {
    try {
      const res = await getActivityLogsService(params);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch activity logs"
      );
    }
  }
);


const activitylogsSlice = createSlice({
    name: "activityLogs",
    initialState: {
        logs: [],
        pagination: null,
        loading: false,
        error: null,
    },
     reducers : {

     },

     extraReducers: (builders) => {
        builders
        // GET ACTIVITY LOGS
      .addCase(getActivityLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActivityLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload.data.logs;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
     }
})

export default activitylogsSlice.reducer;