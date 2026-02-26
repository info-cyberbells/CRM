import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addCaseNoteAdminService, addCaseNoteSaleService, addCaseNoteTechService, getCaseNotesAdminService, getCaseNotesSaleService, getCaseNotesTechService } from "../../services/services";


//TECH USER CREATE NOTE
export const addCaseNoteTech = createAsyncThunk(
    'caseNotes/addNoteByTech',
    async ({ caseId, noteData }, { rejectWithValue }) => {
        try {
            const response = await addCaseNoteTechService(caseId, noteData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// TECH USER GET NOTE
export const getCaseNotesTech = createAsyncThunk(
    'caseNotes/getNotesByTech',
    async (caseId, { rejectWithValue }) => {
        try {
            const response = await getCaseNotesTechService(caseId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }   
    }
);


//SALE USER CREATE NOTE
export const addCaseNoteSale = createAsyncThunk(
    'caseNotes/addNoteBySale',
    async ({ caseId, noteData }, { rejectWithValue }) => {
        try {
            const response = await addCaseNoteSaleService(caseId, noteData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// SALE USER GET NOTE
export const getCaseNotesSale = createAsyncThunk(
    'caseNotes/getNotesBySale',
    async (caseId, { rejectWithValue }) => {
        try {
            const response = await getCaseNotesSaleService(caseId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }   
    }
);


//Admin USER CREATE NOTE
export const addCaseNoteAdmin = createAsyncThunk(
    'caseNotes/addNoteByAdmin',
    async ({ caseId, noteData }, { rejectWithValue }) => {
        try {
            const response = await addCaseNoteAdminService(caseId, noteData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Admin USER GET NOTE
export const getCaseNotesAdmin = createAsyncThunk(
    'caseNotes/getNotesByAdmin',
    async (caseId, { rejectWithValue }) => {
        try {
            const response = await getCaseNotesAdminService(caseId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }   
    }
);


const caseNoteSlice = createSlice({
  name: "caseNotes",
  initialState: {
    notes: [],
    notesloading: false,
    noteserror: null,
    addLoading: false,
  },
  reducers: {
    clearCaseNoteError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* =================TECH GET NOTES ================= */
      .addCase(getCaseNotesTech.pending, (state) => {
        state.notesloading = true;
        state.noteserror = null;
      })
      .addCase(getCaseNotesTech.fulfilled, (state, action) => {
        state.notesloading = false;
        state.notes = action.payload?.notes || [];
      })
      .addCase(getCaseNotesTech.rejected, (state, action) => {
        state.notesloading = false;
        state.noteserror = action.payload;
      })

      /* =================TECH ADD NOTE ================= */
      .addCase(addCaseNoteTech.pending, (state) => {
        state.addLoading = true;
        state.noteserror = null;
      })
      .addCase(addCaseNoteTech.fulfilled, (state, action) => {
        state.addLoading = false;
      })
      .addCase(addCaseNoteTech.rejected, (state, action) => {
        state.addLoading = false;
        state.noteserror = action.payload;
      })

      /* SALE GET NOTES ================= */
      .addCase(getCaseNotesSale.pending, (state) => {
        state.notesloading = true;
        state.noteserror = null;
      })
      .addCase(getCaseNotesSale.fulfilled, (state, action) => {
        state.notesloading = false;
        state.notes = action.payload?.notes || [];
      })
      .addCase(getCaseNotesSale.rejected, (state, action) => {
        state.notesloading = false;
        state.noteserror = action.payload;
      })

    //  SALE ADD NOTE
      .addCase(addCaseNoteSale.pending, (state) => {
        state.addLoading = true;
        state.noteserror = null;
      })
      .addCase(addCaseNoteSale.fulfilled, (state, action) => {
        state.addLoading = false;
      })
      .addCase(addCaseNoteSale.rejected, (state, action) => {
        state.addLoading = false;
        state.noteserror = action.payload;
      })

      // admin get case notes
      .addCase(getCaseNotesAdmin.pending, (state) => {
        state.notesloading = true;
        state.noteserror = null;
      })
      .addCase(getCaseNotesAdmin.fulfilled, (state, action) => {
        state.notesloading = false;
        state.notes = action.payload?.notes || [];
      })
      .addCase(getCaseNotesAdmin.rejected, (state, action) => {
        state.notesloading = false;
        state.noteserror = action.payload;
      })

    //  ADMIN ADD NOTE
      .addCase(addCaseNoteAdmin.pending, (state) => {
        state.addLoading = true;
        state.noteserror = null;
      })
      .addCase(addCaseNoteAdmin.fulfilled, (state, action) => {
        state.addLoading = false;
      })
      .addCase(addCaseNoteAdmin.rejected, (state, action) => {
        state.addLoading = false;
        state.noteserror = action.payload;
      });
  },
});

export const { clearCaseNoteError } = caseNoteSlice.actions;

export default caseNoteSlice.reducer;