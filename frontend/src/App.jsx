import react, { useEffect } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationCenter from "./components/NotificationPage/NotificationPage";
import AdminNoticePage from "./components/AdminNoticePage/AdminNoticePage";
import Login from "./components/LoginSignup/Login";
import Sidebar from "./components/Sidebar/Sidebar";
import AdminDashboard from "./components/Dashboard/AdminDashBoard";
import SearchCase from "./components/Search/SearchCase";
import CasesDetailsPage from "./components/CaseDetailsPage/CasesDetailsPage";
import SaleTechDashboard from "./components/Dashboard/SaleTechDashboard";
import NotesFeed from "./components/Notes/NotesFeed";
import CreateNewCase from "./components/Cases/CreateNewCase";
import TechUpdateCaseStatus from "./components/TechUserPages/TechUpdateCaseStatus";
import SalesReportPage from "./components/SalesReportPage/SalesReportPage";
import ManageAgentsTeam from "./components/ManageAgentsTeam/ManageAgentsTeam";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const role = localStorage.getItem("Role");

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            role === "Admin" ? (
              <Navigate to="/admin-dashboard" replace />
            ) : role ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/" element={<Login />} />

        {/* Protected Layout */}
        <Route element={role ? <Sidebar /> : <Navigate to="/" replace />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<SaleTechDashboard />} />
          <Route path="/search-cases" element={<SearchCase />} />
          <Route path="/my-team" element={<ManageAgentsTeam />} />
          <Route path="/case/:caseId" element={<CasesDetailsPage />} />
          <Route path="/manage-notes" element={<NotesFeed />}/>
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="/update-status" element={<TechUpdateCaseStatus />} />
          <Route path="/notices" element={<AdminNoticePage />} />
          <Route path="/create-case/:caseType" element={<CreateNewCase />} />
          <Route path="/sales-report" element={<SalesReportPage /> } />
        </Route>
      </Routes>
    </>
  );
}

export default App;
