import { useState, useEffect, useMemo } from 'react';
import OrgMenuNavigation from '../../components/org-admin-components/org-admin-menu_components/OrgMenuNavigation';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AdminAccessManage = () => {
  const API_BASE_URL = useMemo(() => `${import.meta.env.VITE_SERVER_API_URL}/api`, []);

  // State for data
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [users, setUsers] = useState([]);
  // Filters & pagination
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(""); // '', 'HOD', 'Teacher', 'Student'
  const [userPage, setUserPage] = useState(1);
  const pageSize = 10;

  // Modal states
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [loginFormData, setLoginFormData] = useState({
    role: '',
    name: '',
    email: '',
    mobileNumber: '',
    departmentId: '',
    classId: '',
    sectionId: '',
    password: ''
  });

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingEntities, setLoadingEntities] = useState({
    departments: false,
    classes: false,
    sections: false,
    users: false
  });

  // Current organization ID (would come from context/auth in real app)
  const [currentOrganizationId, setCurrentOrganizationId] = useState('org-123');

  // --- API CALLS ---

  const fetchDepartments = async () => {
    try {
      setLoadingEntities(prev => ({ ...prev, departments: true }));
      
      const dummyDepartments = [
        { _id: 'dept-1', name: 'Nursery', description: 'Nursery Level' },
        { _id: 'dept-2', name: 'Lower Primary', description: 'Lower Primary Level (Grades 1-5)' },
        { _id: 'dept-3', name: 'Upper Primary', description: 'Upper Primary Level (Grades 6-7)' },
        { _id: 'dept-4', name: 'High School', description: 'High School Level (Grades 8-10)' },
        { _id: 'dept-5', name: 'Higher Secondary', description: 'Higher Secondary Level (Grades 11-12)' }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setDepartments(dummyDepartments);
      
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to fetch departments');
    } finally {
      setLoadingEntities(prev => ({ ...prev, departments: false }));
    }
  };

  const fetchClasses = async () => {
    try {
      setLoadingEntities(prev => ({ ...prev, classes: true }));
      
      const dummyClasses = [
        // Nursery
        { _id: 'class-1', name: 'LKG', description: 'Lower Kindergarten', departmentId: 'dept-1' },
        { _id: 'class-2', name: 'UKG', description: 'Upper Kindergarten', departmentId: 'dept-1' },
        // Lower Primary
        { _id: 'class-3', name: 'Grade 1', description: 'First Grade', departmentId: 'dept-2' },
        { _id: 'class-4', name: 'Grade 2', description: 'Second Grade', departmentId: 'dept-2' },
        { _id: 'class-5', name: 'Grade 3', description: 'Third Grade', departmentId: 'dept-2' },
        { _id: 'class-6', name: 'Grade 4', description: 'Fourth Grade', departmentId: 'dept-2' },
        { _id: 'class-7', name: 'Grade 5', description: 'Fifth Grade', departmentId: 'dept-2' },
        // Upper Primary
        { _id: 'class-8', name: 'Grade 6', description: 'Sixth Grade', departmentId: 'dept-3' },
        { _id: 'class-9', name: 'Grade 7', description: 'Seventh Grade', departmentId: 'dept-3' },
        // High School
        { _id: 'class-10', name: 'Grade 8', description: 'Eighth Grade', departmentId: 'dept-4' },
        { _id: 'class-11', name: 'Grade 9', description: 'Ninth Grade', departmentId: 'dept-4' },
        { _id: 'class-12', name: 'Grade 10', description: 'Tenth Grade', departmentId: 'dept-4' },
        // Higher Secondary
        { _id: 'class-13', name: 'Grade 11 Bio Math', description: 'Biology with Mathematics Stream', departmentId: 'dept-5' },
        { _id: 'class-14', name: 'Grade 11 Bio Language', description: 'Biology with Language Stream', departmentId: 'dept-5' },
        { _id: 'class-15', name: 'Grade 11 Computer Maths', description: 'Computer Science with Mathematics Stream', departmentId: 'dept-5' },
        { _id: 'class-16', name: 'Grade 11 Commerce', description: 'Commerce Stream', departmentId: 'dept-5' },
        { _id: 'class-17', name: 'Grade 12 Bio Math', description: 'Biology with Mathematics Stream', departmentId: 'dept-5' },
        { _id: 'class-18', name: 'Grade 12 Bio Language', description: 'Biology with Language Stream', departmentId: 'dept-5' },
        { _id: 'class-19', name: 'Grade 12 Computer Maths', description: 'Computer Science with Mathematics Stream', departmentId: 'dept-5' },
        { _id: 'class-20', name: 'Grade 12 Commerce', description: 'Commerce Stream', departmentId: 'dept-5' }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setClasses(dummyClasses);
      
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to fetch classes');
    } finally {
      setLoadingEntities(prev => ({ ...prev, classes: false }));
    }
  };

  const fetchSections = async () => {
    try {
      setLoadingEntities(prev => ({ ...prev, sections: true }));
      
      const dummySections = [
        { _id: 'section-1', name: 'Section A', description: 'Section A' },
        { _id: 'section-2', name: 'Section B', description: 'Section B' }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setSections(dummySections);
      
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Failed to fetch sections');
    } finally {
      setLoadingEntities(prev => ({ ...prev, sections: false }));
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingEntities(prev => ({ ...prev, users: true }));
      
      // Dummy data for existing users
      const dummyUsers = [
        { _id: 'user-1', name: 'Dr. Sarah Johnson', email: 'sarah.johnson@school.edu', role: 'HOD', departmentId: 'dept-4', status: 'active' },
        { _id: 'user-2', name: 'Ms. Priya Nair', email: 'priya.nair@school.edu', role: 'Teacher', departmentId: 'dept-2', status: 'active' },
        { _id: 'user-3', name: 'Mr. Rajan Kumar', email: 'rajan.kumar@school.edu', role: 'Teacher', departmentId: 'dept-2', status: 'active' },
        { _id: 'user-4', name: 'Mrs. Lakshmi Menon', email: 'lakshmi.menon@school.edu', role: 'Teacher', departmentId: 'dept-3', status: 'active' },
        { _id: 'user-5', name: 'Mr. Suresh Pillai', email: 'suresh.pillai@school.edu', role: 'Teacher', departmentId: 'dept-3', status: 'active' },
        { _id: 'user-6', name: 'Dr. Anjali Varma', email: 'anjali.varma@school.edu', role: 'Teacher', departmentId: 'dept-4', status: 'active' },
        { _id: 'user-7', name: 'Prof. Ramesh Iyer', email: 'ramesh.iyer@school.edu', role: 'Teacher', departmentId: 'dept-4', status: 'active' },
        { _id: 'user-8', name: 'Dr. Kavita Sharma', email: 'kavita.sharma@school.edu', role: 'Teacher', departmentId: 'dept-5', status: 'active' },
        { _id: 'user-9', name: 'Mr. Arun Krishnan', email: 'arun.krishnan@school.edu', role: 'Teacher', departmentId: 'dept-5', status: 'active' },
        { _id: 'user-10', name: 'Ms. Divya Thomas', email: 'divya.thomas@school.edu', role: 'Teacher', departmentId: 'dept-5', status: 'active' },
        { _id: 'user-11', name: 'Dr. Vinod Menon', email: 'vinod.menon@school.edu', role: 'Teacher', departmentId: 'dept-5', status: 'active' },
        { _id: 'user-12', name: 'Mr. John Smith', email: 'john.smith@student.com', role: 'Student', departmentId: 'dept-2', classId: 'class-3', sectionId: 'section-1', status: 'active' },
        { _id: 'user-13', name: 'Mrs. Mary Johnson', email: 'mary.johnson@student.com', role: 'Student', departmentId: 'dept-3', classId: 'class-8', sectionId: 'section-2', status: 'active' },
        { _id: 'user-14', name: 'Mr. David Wilson', email: 'david.wilson@student.com', role: 'Student', departmentId: 'dept-4', classId: 'class-11', sectionId: 'section-1', status: 'active' }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(dummyUsers);
      
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoadingEntities(prev => ({ ...prev, users: false }));
    }
  };

  const fetchAllData = async () => {
    await Promise.all([
      fetchDepartments(),
      fetchClasses(),
      fetchSections(),
      fetchUsers()
    ]);
  };

  // --- EFFECTS ---
  
  useEffect(() => {
    fetchAllData();
  }, []);

  // --- EVENT HANDLERS ---

  const openLoginForm = (role = '') => {
    setLoginFormData({
      role,
      name: '',
      email: '',
      mobileNumber: '',
      departmentId: '',
      classId: '',
      sectionId: '',
      password: ''
    });
    setIsLoginFormOpen(true);
  };

  const closeLoginForm = () => {
    setIsLoginFormOpen(false);
    setLoginFormData({
      role: '',
      name: '',
      email: '',
      mobileNumber: '',
      departmentId: '',
      classId: '',
      sectionId: '',
      password: ''
    });
  };

  const handleLoginFormSubmit = async (formData) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Basic validation for Student role: require department, class, and section
      if (formData.role === 'Student') {
        if (!formData.departmentId || !formData.classId || !formData.sectionId) {
          toast.error('Please select Department, Class and Section for Student');
          setIsLoading(false);
          return;
        }
      }

      // Create new user
      const newUser = {
        _id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        departmentId: formData.departmentId || '',
        classId: formData.classId || '',
        sectionId: formData.sectionId || '',
        status: 'active'
      };
      
      setUsers(prev => [...prev, newUser]);
      toast.success(`Successfully created ${formData.role} login for ${formData.name}`);
      closeLoginForm();
      
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  // --- COMPUTED VALUES ---

  const userStats = useMemo(() => {
    const total = users.length;
    const hod = users.filter(u => u.role === 'HOD').length;
    const teachers = users.filter(u => u.role === 'Teacher').length;
    const students = users.filter(u => u.role === 'Student').length;
    
    return { total, hod, teachers, students };
  }, [users]);

  // Filtered + paginated users
  const filteredUsers = useMemo(() => {
    let list = [...users];
    if (roleFilter) {
      list = list.filter(u => u.role === roleFilter);
    }
    if (userSearch.trim()) {
      const term = userSearch.toLowerCase();
      list = list.filter(u =>
        u.name.toLowerCase().includes(term) ||
        (u.email || '').toLowerCase().includes(term)
      );
    }
    return list;
  }, [users, roleFilter, userSearch]);

  const totalUserPages = useMemo(() => Math.max(Math.ceil(filteredUsers.length / pageSize), 1), [filteredUsers.length]);
  const pagedUsers = useMemo(() => {
    const start = (userPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, userPage]);

  // --- STYLES ---
  const inputBaseClass = "w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-200 disabled:cursor-not-allowed";
  const btnBaseClass = "font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors transform active:scale-95";
  const btnTealClass = `${btnBaseClass} bg-teal-500 hover:bg-teal-600 text-white`;
  const btnIndigoClass = `${btnBaseClass} bg-indigo-500 hover:bg-indigo-600 text-white`;
  const btnSlateClass = `${btnBaseClass} bg-slate-200 hover:bg-slate-300 text-slate-800`;

  // Navigation handler
  const handlePageChange = (pageId) => {
    console.log(`Navigating to: ${pageId}`);
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      <Toaster position="top-right" />
      
      {/* Navigation Component - hidden when modal is open */}
      {!isLoginFormOpen && <OrgMenuNavigation currentPage="access-management" onPageChange={handlePageChange} />}

      {/* Main Content */}
      <div className={isLoginFormOpen ? "" : "lg:ml-72"}>
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Access Management</h1>
              <p className="text-slate-500 text-sm">Create and manage user logins for HOD, Teachers, and Parents</p>
            </div>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900">{userStats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-users text-blue-600 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">HOD</p>
                  <p className="text-2xl font-bold text-slate-900">{userStats.hod}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-user-tie text-purple-600 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Teachers</p>
                  <p className="text-2xl font-bold text-slate-900">{userStats.teachers}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-chalkboard-teacher text-green-600 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Students</p>
                  <p className="text-2xl font-bold text-slate-900">{userStats.students}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-user-graduate text-orange-600 text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Create User Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* HOD Card */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-purple-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <span className="text-slate-400 font-bold text-xl">H</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Create HOD Login</h3>
                    <p className="text-purple-100 text-sm">Head of Department access</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 text-sm mb-4">
                  Create login credentials for Head of Department to manage their department.
                </p>
                <button
                  onClick={() => openLoginForm('HOD')}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fas fa-plus"></i>
                  Create HOD Login
                </button>
              </div>
            </div>

            {/* Teacher Card */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-green-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <span className="text-slate-400 font-bold text-xl">T</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Create Teacher Login</h3>
                    <p className="text-green-100 text-sm">Teacher access credentials</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 text-sm mb-4">
                  Create login credentials for teachers to access their teaching assignments.
                </p>
                <button
                  onClick={() => openLoginForm('Teacher')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fas fa-plus"></i>
                  Create Teacher Login
                </button>
              </div>
            </div>

            {/* Student Card */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-orange-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <span className="text-slate-400 font-bold text-xl">S</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Create Student Login</h3>
                    <p className="text-orange-100 text-sm">Student access credentials</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 text-sm mb-4">
                  Create login credentials for students with department, class and section mapping.
                </p>
                <button
                  onClick={() => openLoginForm('Student')}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fas fa-plus"></i>
                  Create Student Login
                </button>
              </div>
            </div>
          </div>

          {/* Recent Users Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Users</h3>
                  <p className="text-slate-500 text-sm">Search and filter user accounts</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
                      placeholder="Search user by name or email..."
                      className="pl-10 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm"
                    />
                  </div>
                  <select
                    value={roleFilter}
                    onChange={(e) => { setRoleFilter(e.target.value); setUserPage(1); }}
                    className="bg-slate-100 border border-slate-200 rounded-md p-2 text-sm"
                  >
                    <option value="">All Roles</option>
                    <option value="HOD">HOD</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Student">Student</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Section</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {pagedUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mr-3">
                            <i className={`fas fa-user text-slate-600 text-sm`}></i>
                          </div>
                          <div className="text-sm font-medium text-slate-900">{user.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'HOD' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'Teacher' ? 'bg-green-100 text-green-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.departmentId ? (departments.find(d => d._id === user.departmentId)?.name || 'Unknown') : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.classId ? (classes.find(c => c._id === user.classId)?.name || 'Unknown') : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.sectionId ? (sections.find(s => s._id === user.sectionId)?.name || 'Unknown') : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
              <p className="text-xs text-slate-500">Showing {(userPage - 1) * pageSize + 1}-{Math.min(userPage * pageSize, filteredUsers.length)} of {filteredUsers.length}</p>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded-md text-sm"
                  onClick={() => setUserPage(p => Math.max(p - 1, 1))}
                  disabled={userPage === 1}
                >
                  Prev
                </button>
                <span className="text-sm text-slate-600">Page {userPage} of {totalUserPages}</span>
                <button
                  className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded-md text-sm"
                  onClick={() => setUserPage(p => Math.min(p + 1, totalUserPages))}
                  disabled={userPage === totalUserPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Login Form Modal */}
      {isLoginFormOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  Create {loginFormData.role} Login
                </h3>
                <button
                  onClick={closeLoginForm}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleLoginFormSubmit(loginFormData);
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  className={inputBaseClass}
                  value={loginFormData.name}
                  onChange={(e) => setLoginFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                <input
                  type="email"
                  className={inputBaseClass}
                  value={loginFormData.email}
                  onChange={(e) => setLoginFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number *</label>
                <input
                  type="tel"
                  className={inputBaseClass}
                  value={loginFormData.mobileNumber}
                  onChange={(e) => setLoginFormData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                  required
                />
              </div>

              {(loginFormData.role === 'HOD' || loginFormData.role === 'Teacher' || loginFormData.role === 'Student') && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Department *</label>
                  <select
                    className={inputBaseClass}
                    value={loginFormData.departmentId}
                    onChange={(e) => setLoginFormData(prev => ({ ...prev, departmentId: e.target.value, classId: '', sectionId: '' }))}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {loginFormData.role === 'Student' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Class *</label>
                    <select
                      className={inputBaseClass}
                      value={loginFormData.classId || ''}
                      onChange={(e) => setLoginFormData(prev => ({ ...prev, classId: e.target.value, sectionId: '' }))}
                      disabled={!loginFormData.departmentId}
                      required
                    >
                      <option value="">Select Class</option>
                      {classes.filter(c => c.departmentId === loginFormData.departmentId).map(cls => (
                        <option key={cls._id} value={cls._id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Section *</label>
                    <select
                      className={inputBaseClass}
                      value={loginFormData.sectionId || ''}
                      onChange={(e) => setLoginFormData(prev => ({ ...prev, sectionId: e.target.value }))}
                      disabled={!loginFormData.classId}
                      required
                    >
                      <option value="">Select Section</option>
                      {sections.map(section => (
                        <option key={section._id} value={section._id}>{section.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Temporary Password *</label>
                <input
                  type="password"
                  className={inputBaseClass}
                  value={loginFormData.password}
                  onChange={(e) => setLoginFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
                <p className="text-xs text-slate-500 mt-1">User will be prompted to change this on first login</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className={btnTealClass} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus"></i>
                      Create Login
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={closeLoginForm}
                  className={btnSlateClass}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAccessManage;
