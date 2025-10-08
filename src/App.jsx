import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login/login.jsx';
import MasterDashboard from './master/master-dashboard/master_dashboard.jsx';
import LocationManager from './master/master-location-manager/location_manager.jsx';
import AccountManagers from './master/master-account-managers/account_managers.jsx';
import OrgDashboard from './org_admin/org_admin-dashboard/org-dashboard.jsx';
import AdminClassManage from './org_admin/class_management/admin_class_manage.jsx';
import AdminSubjectAssign from './org_admin/subject_assign/admin_subject_assign.jsx';
import TeacherAssignments from './org_admin/teacher_management/teacher_assignments.jsx';
import TopicManagement from './org_admin/skills_academics/topic_management.jsx';
import MasterOrganizationSetup from './master/master-organization-setup/master-organization-setup.jsx';
import OrganizationLoginManager from './master/master-login-create/organization_login_manager.jsx';
import AuthWrapper from './wrappers/AuthWrapper.jsx';
import ProtectedWrapper from './wrappers/ProtectedWrapper.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes (login/register) */}
        <Route element={<AuthWrapper />}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
        </Route>

        {/* Master admin protected routes */}
        <Route element={<ProtectedWrapper allowedRoles={["master_admin"]} />}>
          <Route path="/master/dashboard" element={<MasterDashboard />} />
          <Route path="/master/organization-setup" element={<MasterOrganizationSetup />} />
          <Route path="/master/organization-logins" element={<OrganizationLoginManager />} />
          <Route path="/master/location-manager" element={<LocationManager />} />
          <Route path="/master/account-managers" element={<AccountManagers />} />
        </Route>

        {/* Organization admin protected routes */}
        <Route element={<ProtectedWrapper allowedRoles={["org_admin"]} />}>
          <Route path="/admin/dashboard" element={<OrgDashboard />} />
          <Route path="/admin/classrooms/view" element={<AdminClassManage />} />
          <Route path="/admin/classrooms/subjects" element={<AdminSubjectAssign />} />
          <Route path="/admin/classrooms/teacher-assignments" element={<TeacherAssignments />} />
          <Route path="/admin/skills/topics" element={<TopicManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
