import react, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyTokenThunk } from './features/UserSlice/UserSlice';
import Home from './components/Home/Home'
import Navbar from './components/Navbar/Navbar/Navbar';
import Dashboard from './components/Dashboard/dashboard';
import Cases from './components/Cases/Cases';
import Search from './components/Search/Search';
import Notes from './/components/Notes/Notes';



function App() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(verifyTokenThunk());
  }, [dispatch]);

  return (
    <>
      {user && <Navbar />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/create-case/:id' element={<Cases />} />
        <Route path='/search' element={<Search />} />
        <Route path='/notes' element={<Notes />} />
      </Routes>
    </>
  )
}

export default App
