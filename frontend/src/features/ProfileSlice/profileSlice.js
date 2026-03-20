import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMyProfileService, updateProfileService } from "../../services/services";

const initialState = {
  profile: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateSuccess: false,
};

// GET PROFILE
export const getMyProfile = createAsyncThunk(
  "profile/getMyProfile",
  async (_, thunkAPI) => {
    try {
      const res = await getMyProfileService();
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// UPDATE PROFILE
export const updateMyProfile = createAsyncThunk(
  "profile/updateMyProfile",
  async (payload, thunkAPI) => {
    try {
      const res = await updateProfileService(payload);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileState: (state) => {
      state.error = null;
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // GET PROFILE
      .addCase(getMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.user;
      })
      .addCase(getMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE PROFILE
      .addCase(updateMyProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateSuccess = false;
        state.error = null;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;

        state.profile = action.payload.data;
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileState } = profileSlice.actions;
export default profileSlice.reducer;