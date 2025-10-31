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
import AdminAccessManage from './org_admin/access_management/admin_access_manage.jsx';
import TopicManagement from './org_admin/skills_and_academics/topics/topic_management.jsx';
import ClassroomSessions from './org_admin/skills_and_academics/sessions/classroom_sessions.jsx';
import TestManagement from './org_admin/tests/test_management.jsx';
import JobsPlacements from './org_admin/jobs_placements/jobs_placements.jsx';
import MasterOrganizationSetup from './master/master-organization-setup/master-organization-setup.jsx';
import OrganizationLoginManager from './master/master-login-create/organization_login_manager.jsx';
import AuthWrapper from './wrappers/AuthWrapper.jsx';
import ProtectedWrapper from './wrappers/ProtectedWrapper.jsx';
import Azy from './org_admin/subject_assign/Azy.jsx';
import StudentDashboard from './student_user/student_dashboard/student_dashboard.jsx';
import MyCourses from './student_user/student_courses/my_courses/my_courses.jsx';
import ClassroomRecordings from './student_user/student_courses/classroom_recordings/classroom_recordings.jsx';
import CourseAssessments from './student_user/student_courses/course_assessments/course_assessments.jsx';
import JobBoard from './student_user/student_job_management/job_board/job_board.jsx';
import SkillPlanner from './student_user/student_job_management/skill_planner/skill_planner.jsx';
import JobAssessments from './student_user/student_job_management/job_assessments/job_assessments.jsx';
import JobCV from './student_user/student_job_management/job_cv/job_cv.jsx';

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
          <Route path="/admin/access/manage" element={<AdminAccessManage />} />
          <Route path="/admin/skills/topics" element={<TopicManagement />} />
          <Route path="/admin/skills/sessions" element={<ClassroomSessions />} />
          <Route path="/admin/tests/manage" element={<TestManagement />} />
          <Route path="/admin/skills/test-topics" element={<JobsPlacements />} />
          <Route path="/abc" element={<Azy />} />
        </Route>

        {/* Student routes - Temporarily unprotected for development */}
        {/* <Route element={<ProtectedWrapper allowedRoles={["student"]} />}> */}
          {/* Home/Dashboard */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          
          {/* Courses submenu */}
          <Route path="/student/courses" element={<MyCourses />} />
          <Route path="/student/recordings" element={<ClassroomRecordings />} />
          <Route path="/student/course-assessments" element={<CourseAssessments />} />
          
          {/* Job Management submenu */}
          <Route path="/student/jobs" element={<JobBoard />} />
          <Route path="/student/skill-planner" element={<SkillPlanner />} />
          <Route path="/student/job-assessments" element={<JobAssessments />} />
          <Route path="/student/cv" element={<JobCV />} />
          
          {/* Contacts submenu */}
          <Route path="/student/contacts/mentors" element={<StudentDashboard />} />
          <Route path="/student/contacts/hr" element={<StudentDashboard />} />
          <Route path="/student/contacts/founders" element={<StudentDashboard />} />
          
          {/* Settings */}
          <Route path="/student/settings" element={<StudentDashboard />} />
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
