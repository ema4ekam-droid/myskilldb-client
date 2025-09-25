import './App.css'
import Login from './login/login.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MasterDashboard from './master/master-dashboard/master_dashboard.jsx';
import LocationManager from './master/master-location-manager/location_manager.jsx';
import MasterSchoolClassSetup from './master/master-school-manage/master-school-class-setup.jsx';

function App() {

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MasterDashboard />} />
        <Route path="/master" element={<MasterDashboard />} />
        <Route path="/schools" element={<h1 className="p-8">Schools - Coming Soon</h1>} />
        <Route path="/school-class-setup" element={<MasterSchoolClassSetup />} />
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
