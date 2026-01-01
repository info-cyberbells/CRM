import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getTechDashboardData } from "../../services/services";


// TECH USER DASHBOARD
export const techUserDashboard = createAsyncThunk(
    'techUser/dasboard',
    async(_, thunkAPI )=>{
        try {
            const response = await getTechDashboardData();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "FAiled to get dashboard data");
        }
    }
)

const techUserSlice = createSlice({
    name: "techUser",
    initialState: {
        techUser: [],
        dashboardData: [],
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },
    reducers: {
        resetTechUser: (state)=>{
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },

    extraReducers: (builder)=>{
        builder

        // TECH DASHBORD BUILDER
        .addCase(techUserDashboard.pending, (state)=>{
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        })
        .addCase(techUserDashboard.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isSuccess = true;
            state.dashboardData = action.payload;
        })
        .addCase(techUserDashboard.rejected, (state, action)=>{
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = true;
            state.message = action.payload;
         })
    }

})

export const {resetTechUser} = techUserSlice.actions;
export default techUserSlice.reducer;