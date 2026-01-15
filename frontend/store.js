import { configureStore } from '@reduxjs/toolkit';
import userReducer from './src/features/UserSlice/UserSlice';
import dashboardReducer from './src/features/DashboardSlice/dashboardSlice';
import caseReducer from './src/features/CaseSlice/CaseSlice'
import salesCasesReducer from './src/features/SearchSlice/searchSlice';
import notificationReducer from './src/features/NotificationSlice/notificationSlice'
import techUserReducer from './src/features/TechUserSlice/TechUserSlice'
import adminSliceReducer from './src/features/ADMIN/adminSlice';
import adminNoticeReducer from './src/features/NoticeSlice/NoticeSlice';


export const store = configureStore({
    reducer: {
        user: userReducer,
        dashboard: dashboardReducer,
        cases: caseReducer,
        salesCases: salesCasesReducer,
        notification: notificationReducer,
        techUser: techUserReducer,
        admin: adminSliceReducer,
        notice :  adminNoticeReducer,
    },
});
