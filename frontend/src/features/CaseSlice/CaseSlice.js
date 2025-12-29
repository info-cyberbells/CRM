import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createCase as createCaseAPI } from '../../services/services';

// Async thunk for creating a new case
export const createCase = createAsyncThunk(
    'cases/createCase',
    async (caseData, { rejectWithValue }) => {
        try {
            const response = await createCaseAPI(caseData);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const caseSlice = createSlice({
    name: 'cases',
    initialState: {
        loading: false,
        success: false,
        error: null,
        message: null
    },
    reducers: {
        clearCaseState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createCase.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(createCase.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message || 'Case created successfully';
                state.error = null;
            })
            .addCase(createCase.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    }
});

export const { clearCaseState } = caseSlice.actions;
export default caseSlice.reducer;