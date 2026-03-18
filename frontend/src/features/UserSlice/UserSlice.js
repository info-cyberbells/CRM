import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createUser, loginUser, logoutUserAPI } from "../../services/services";

const initialState = {
    user: JSON.parse(localStorage.getItem("user") || "null"),
    isLoading: false,
    isError: false,
    token: localStorage.getItem("token") || null,
    isSuccess: false,
    message: "",
};

//Async Thunk
export const createUserThunk = createAsyncThunk(
    "users/createUser",
    async (userData, thunkAPI) => {
        try {
            return await createUser(userData);
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || "Something went wrong";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

//Login Thunk
export const loginUserThunk = createAsyncThunk(
    "users/loginUser",
    async (userData, thunkAPI) => {
        try {
            return await loginUser(userData);
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || "Something went wrong";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

//Logout Thunk
export const logoutUserThunk = createAsyncThunk(
    "users/logoutUser",
    async (_, thunkAPI) => {
        try {
            return await logoutUserAPI();
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || "Logout failed";
            return thunkAPI.rejectWithValue(message);
        }
    }
);


//initial State
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = "";
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
            localStorage.removeItem("token");
            localStorage.removeItem("Role");
            localStorage.removeItem("user");
        },
    },

    extraReducers: (builder) => {
        builder

            //create user
            .addCase(createUserThunk.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.message = "";
            })
            .addCase(createUserThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(createUserThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })

            //login builder
            .addCase(loginUserThunk.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.message = "";
            })
            .addCase(loginUserThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);

                localStorage.setItem('Role', action.payload.user.role);
                localStorage.setItem("user", JSON.stringify(action.payload.user));
            })
            .addCase(loginUserThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })

            //logout builder
            .addCase(logoutUserThunk.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = "";
            })
            .addCase(logoutUserThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = null;
                state.token = null;
                state.message = action.payload.message;
                localStorage.removeItem("token");
                localStorage.removeItem("Role");
                localStorage.removeItem("user");
            })
            .addCase(logoutUserThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });

    },
});

//export
export const { reset, logout } = userSlice.actions;
export default userSlice.reducer;