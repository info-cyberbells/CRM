import { configureStore } from '@reduxjs/toolkit';
import userReducer from './src/features/UserSlice/UserSlice';
import dashboardReducer from './src/features/DashboardSlice/dashboardSlice';
import caseReducer from './src/features/CaseSlice/CaseSlice'
import salesCasesReducer from './src/features/SearchSlice/searchSlice';


export const store = configureStore({
    reducer: {
        user: userReducer,
        dashboard: dashboardReducer,
        cases: caseReducer,
        salesCases: salesCasesReducer,
    },
});
