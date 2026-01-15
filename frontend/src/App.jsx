import react, { useEffect } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Home from './components/Home/Home'
import Navbar from './components/Navbar/Navbar/Navbar';
import Dashboard from './components/Dashboard/dashboard';
import Cases from './components/Cases/Cases';
import Search from './components/Search/Search';
import Notes from './/components/Notes/Notes';
import NotificationCenter from './components/NotificationPage/NotificationPage';
import MyCases from './components/TechUserPages/MyCases';
import UpdateCaseStatus from './components/TechUserPages/UpdateCaseTech';
import AdminNoticePage from './components/AdminNoticePage/AdminNoticePage';
import Login from './components/LoginSignup/Login';



function App() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);

  const role = localStorage.getItem("Role");

  return (
    <>
      {role && <Navbar />}

      <Routes>
        {/* <Route path='/' element={<Home />} /> */}
        {/* <Route path='/dashboard' element={<Dashboard />} /> */}
         <Route
            path="/"
            element={role ? <Navigate to="/dashboard" replace /> : <Home />}
          />
            <Route
    path="/dashboard"
    element={role ? <Dashboard /> : <Navigate to="/" replace />}
  />
        <Route path='/login' element={<Login />}/>
        <Route path='/create-case/:id' element={<Cases />} />
        <Route path='/search' element={<Search />} />
        <Route path='/notes' element={<Notes />} />
        <Route path='/notifications' element={<NotificationCenter />} />
        <Route path='/my-cases' element={<MyCases />}/>
        <Route path='/update-status' element={<UpdateCaseStatus/>}/>
        <Route path='/notices' element={<AdminNoticePage />} />
      </Routes>
    </>
  )
}

export default App
