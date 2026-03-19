import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  userClockInService,
  userStartBreakService,
  userEndBreakService,
  userClockOutService,
  getMySessionStatusService,
} from "../../services/services";


// 1. Clock In
export const userClockIn = createAsyncThunk(
  "userSession/clockIn",
  async (payload, { rejectWithValue }) => {
    try {
      return await userClockInService(payload);
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 2. Start Break
export const userStartBreak = createAsyncThunk(
  "userSession/startBreak",
  async (payload, { rejectWithValue }) => {
    try {
      return await userStartBreakService(payload);
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 3. End Break
export const userEndBreak = createAsyncThunk(
  "userSession/endBreak",
  async (payload, { rejectWithValue }) => {
    try {
      return await userEndBreakService(payload);
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 4. Clock Out
export const userClockOut = createAsyncThunk(
  "userSession/clockOut",
  async (payload, { rejectWithValue }) => {
    try {
      return await userClockOutService(payload);
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// 5. Get Session Status
export const getMySessionStatus = createAsyncThunk(
  "userSession/getStatus",
  async (_, { rejectWithValue }) => {
    try {
      return await getMySessionStatusService();
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// ---------------- SLICE ---------------- //

const userSessionSlice = createSlice({
  name: "userSession",
  initialState: {
    loading: false,
    actionLoading: false, 
    actionLoading2: false, 
    error: null,
    session: null,
    success: false,
  },
  reducers: {
    clearSessionState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // -------- CLOCK IN --------
      .addCase(userClockIn.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(userClockIn.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.success = true;
      })
      .addCase(userClockIn.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // -------- START BREAK --------
      .addCase(userStartBreak.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(userStartBreak.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.session = action.payload;
      })
      .addCase(userStartBreak.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // -------- END BREAK --------
      .addCase(userEndBreak.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(userEndBreak.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.session = action.payload;
      })
      .addCase(userEndBreak.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // -------- CLOCK OUT --------
      .addCase(userClockOut.pending, (state) => {
        state.actionLoading2 = true;
      })
      .addCase(userClockOut.fulfilled, (state) => {
        state.actionLoading2 = false;
      })
      .addCase(userClockOut.rejected, (state, action) => {
        state.actionLoading2 = false;
        state.error = action.payload;
      })

      // -------- GET SESSION STATUS --------
      .addCase(getMySessionStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMySessionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.session = action.payload?.data;
      })
      .addCase(getMySessionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSessionState } = userSessionSlice.actions;
export default userSessionSlice.reducer;