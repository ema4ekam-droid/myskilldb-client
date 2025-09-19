import './App.css'
import Login from './login/login.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MasterDashboard from './master/master-dashboard/master_dashboard.jsx';
import Schools from './master/master-school-manage/schools.jsx';
import LocationManager from './master/master-location-manager/location_manager.jsx';

function App() {

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MasterDashboard />} />
        <Route path="/master" element={<MasterDashboard />} />
        <Route path="/schools" element={<Schools />} />
        <Route path="/location-manager" element={<LocationManager />} />
        <Route path="/account-managers" element={<h1 className="p-8">Account Managers - Coming Soon</h1>} />
        <Route path="/analytics" element={<h1 className="p-8">System Analytics - Coming Soon</h1>} />
        <Route path="/settings" element={<h1 className="p-8">Settings - Coming Soon</h1>} />
      </Routes>
     </BrowserRouter>
    </>
  ) 
}

export default App
