import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createCase as createCaseAPI, previwCaseIDService } from '../../services/services';

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

//PREVIEW CASE ID
export const previewCaseId = createAsyncThunk(
    'case/preveiwCaseID',
    async(caseType, thunkAPI)=>{
        try {
            const response = await previwCaseIDService(caseType);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

const caseSlice = createSlice({
    name: 'cases',
    initialState: {
        loading: false,
        success: false,
        error: null,
        message: null,
        caseID: null,
        createdCase: null,
    },
    reducers: {
        clearCaseState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.message = null;
        },
        clearCreatedCase: (state)=>{
            state.createdCase = null;
            state.success = false;  
            state.message = "";
            state.error = null;
        },
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
                state.createdCase = action.payload.case;
                state.error = null;
            })
            .addCase(createCase.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            })

            // builder 
            .addCase(previewCaseId.pending, (state)=>{
                state.loading = true;
                state.caseID = null;
                state.error = null;
            })
            .addCase(previewCaseId.fulfilled, (state, action)=>{
                state.loading = false;
                state.caseID = action.payload;
            })
            .addCase(previewCaseId.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload;
            })

    }
});

export const { clearCaseState, clearCreatedCase } = caseSlice.actions;
export default caseSlice.reducer;