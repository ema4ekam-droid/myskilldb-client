import './App.css'
import Login from './login/login.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MasterDashboard from './master/master-dashboard/master_dashboard.jsx';
import LocationManager from './master/master-location-manager/location_manager.jsx';
import MasterSchoolClassSetup from './master/master-school-manage/master-school-class-setup.jsx';
import SchoolLoginManager from './master/master-login-create/school_login_manager.jsx';
import AccountManagers from './master/master-account-managers/account_managers.jsx';
import OrgDashboard from './org_admin/org_admin-dashboard/org-dashboard.jsx';
import AdminClassManage from './org_admin/class_management/admin_class_manage.jsx';
import AdminSubjectAssign from './org_admin/subject_assign/admin_subject_assign.jsx';
import TeacherAssignments from './org_admin/teacher_management/teacher_assignments.jsx';
import TopicManagement from './org_admin/skills_academics/topic_management.jsx';
import HomePage from './Home.jsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Login stays at root */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />


          {/* Grouped under /master */}
          <Route path="/master/dashboard" element={<MasterDashboard />} />
          <Route path="/master/school-class-setup" element={<MasterSchoolClassSetup />} />
          <Route path="/master/school-logins" element={<SchoolLoginManager />} />
          <Route path="/master/location-manager" element={<LocationManager />} />
          <Route path="/master/account-managers" element={<AccountManagers />} />
          <Route path="/master/analytics" element={<h1 className="p-8">System Analytics - Coming Soon</h1>} />

          {/* Organization Admin Routes */}
          <Route path="/admin/dashboard" element={<OrgDashboard />} />
          <Route path="/admin/classrooms/view" element={<AdminClassManage />} />
          <Route path="/admin/classrooms/subjects" element={<AdminSubjectAssign />} />
          <Route path="/admin/classrooms/teacher-assignments" element={<TeacherAssignments />} />
          
          {/* Skills & Academics Routes */}
          <Route path="/admin/skills/topics" element={<TopicManagement />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
