import './App.css'
import Login from './login/login.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<h1>Home Page</h1>} />
      </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
