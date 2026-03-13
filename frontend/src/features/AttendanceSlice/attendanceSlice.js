import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMyAttendanceSaleService, getMyAttendanceTechService } from "../../services/services";

const initialState = {
  attendanceData: [],
  isLoading: false,
  error: null,
};

// TECH GET MY ATTENDANCE
export const getMyAttendanceTech = createAsyncThunk(
  "attendance/getMyAttendance",
  async (month, { rejectWithValue }) => {
    try {
      const response = await getMyAttendanceTechService(month);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const getMyAttendanceSale = createAsyncThunk(
  "attendance/getMyAttendanceSale",
  async (month, { rejectWithValue }) => {
    try {
      const response = await getMyAttendanceSaleService(month);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {

    clearAttendance: (state) => {
      state.attendanceData = null;
      state.error = null;
    },

  },

  extraReducers: (builder) => {
    builder

      .addCase(getMyAttendanceTech.pending, (state) => {
                state.isLoading = true;
                state.error = null;
              })

              .addCase(getMyAttendanceTech.fulfilled, (state, action) => {
                state.isLoading = false;
                state.attendanceData = action.payload;
              })

              .addCase(getMyAttendanceTech.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
              })
      .addCase(getMyAttendanceSale.pending, (state) => {
                state.isLoading = true;
                state.error = null;
              })

              .addCase(getMyAttendanceSale.fulfilled, (state, action) => {
                state.isLoading = false;
                state.attendanceData = action.payload;
              })

              .addCase(getMyAttendanceSale.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
              });

  },
});

export const { clearAttendance } = attendanceSlice.actions;

export default attendanceSlice.reducer;