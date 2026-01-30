import react, { useEffect } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar/Navbar";
import Dashboard from "./components/Dashboard/dashboard";
import Cases from "./components/Cases/Cases";
import Search from "./components/Search/Search";
import Notes from ".//components/Notes/Notes";
import NotificationCenter from "./components/NotificationPage/NotificationPage";
import MyCases from "./components/TechUserPages/MyCases";
import UpdateCaseStatus from "./components/TechUserPages/UpdateCaseTech";
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
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<SaleTechDashboard />} />
          {/* <Route path="/search" element={<Search />} /> */}
          <Route path="/search-cases" element={<SearchCase />} />
          <Route path="/case/:caseId" element={<CasesDetailsPage />} />
          {/* <Route path="/notes" element={<Notes />} /> */}
          <Route path="/manage-notes" element={<NotesFeed />}/>
          <Route path="/notifications" element={<NotificationCenter />} />
          {/* <Route path="/my-cases" element={<MyCases />} /> */}
          {/* <Route path="/my-cases" element={<TechUpdateCaseStatus />} /> */}
          {/* <Route path="/update-status" element={<UpdateCaseStatus />} /> */}
          <Route path="/update-status" element={<TechUpdateCaseStatus />} />
          <Route path="/notices" element={<AdminNoticePage />} />
          {/* <Route path="/create-case/:id" element={<Cases />} /> */}
          <Route path="/create-case/:caseType" element={<CreateNewCase />} />
          <Route path="/sales-report" element={<SalesReportPage /> } />
        </Route>
      </Routes>
    </>
  );
}

export default App;
