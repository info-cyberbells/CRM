import { configureStore } from '@reduxjs/toolkit';
import userReducer from './src/features/UserSlice/UserSlice';
import dashboardReducer from './src/features/DashboardSlice/dashboardSlice';
import caseReducer from './src/features/CaseSlice/CaseSlice'
import salesCasesReducer from './src/features/SearchSlice/searchSlice';
import notificationReducer from './src/features/NotificationSlice/notificationSlice'
import techUserReducer from './src/features/TechUserSlice/TechUserSlice'
import adminSliceReducer from './src/features/ADMIN/adminSlice';
import adminNoticeReducer from './src/features/NoticeSlice/NoticeSlice';
import caseNotesReducer from './src/features/CaseNotes/casenotesSlice';
import attendanceReducer from "./src/features/AttendanceSlice/attendanceSlice";
import chatReducer from "./src/features/chat/chatSlice";
import userSessionReducer from "./src/features/UserSessionSlice/userSessionSlice";
import profileReducer from './src/features/ProfileSlice/profileSlice';
import activityLogsReducer from './src/features/ADMIN/activitylogsSlice';


export const store = configureStore({
    reducer: {
        user: userReducer,
        dashboard: dashboardReducer,
        cases: caseReducer,
        salesCases: salesCasesReducer,
        notification: notificationReducer,
        techUser: techUserReducer,
        admin: adminSliceReducer,
        notice: adminNoticeReducer,
        caseNotes: caseNotesReducer,
        attendance: attendanceReducer,
        chat: chatReducer,
        userSession: userSessionReducer,
        profile: profileReducer,
        activityLogs: activityLogsReducer
    },
});
