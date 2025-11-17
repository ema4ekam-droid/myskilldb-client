import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import LoaderOverlay from '../../components/loader/LoaderOverlay';
import OrgMenuNavigation from '../../components/org-admin-components/org-admin-menu_components/OrgMenuNavigation';
import toast, { Toaster } from 'react-hot-toast';
import { getRequest, postRequest } from '../../api/apiRequests';

const AdminAccessManage = () => {
  // Get organization data from Redux
  const organization = useSelector((state) => state.organization);

  // State for data
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [users, setUsers] = useState([]);
  // Filters
  const [roleFilter, setRoleFilter] = useState(""); // '', 'HOD', 'Teacher', 'Student'

  // Modal states
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [loginFormData, setLoginFormData] = useState({
    role: '',
    name: '',
    email: '',
    mobileNumber: '',
    departmentId: '',
    classId: '',
    sectionId: ''
  });

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingEntities, setLoadingEntities] = useState({
    departments: false,
    classes: false,
    sections: false,
    users: false
  });

  // --- API CALLS ---

  const fetchDepartments = async () => {
    if (!organization?._id) return;
    
    try {
      setLoadingEntities(prev => ({ ...prev, departments: true }));
      
      const response = await getRequest(
        `/organization-setup/departments/${organization._id}`
      );

      if (response.data.success) {
        setDepartments(response.data.data || []);
      } else {
        setDepartments([]);
        console.error("Failed to fetch departments:", response.data.message);
        toast.error('Failed to fetch departments');
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([]);
      toast.error('Failed to fetch departments');
    } finally {
      setLoadingEntities(prev => ({ ...prev, departments: false }));
    }
  };

  const fetchClasses = async (departmentId) => {
    if (!organization?._id || !departmentId) return;
    
    try {
      setLoadingEntities(prev => ({ ...prev, classes: true }));
      
      const response = await getRequest(
        `/organization-setup/classes/${organization._id}/${departmentId}`
      );

      if (response.data.success) {
        setClasses(response.data.data || []);
      } else {
        setClasses([]);
        console.error("Failed to fetch classes:", response.data.message);
        toast.error('Failed to fetch classes');
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      setClasses([]);
      toast.error('Failed to fetch classes');
    } finally {
      setLoadingEntities(prev => ({ ...prev, classes: false }));
    }
  };

  const fetchSections = async (departmentId, classId) => {
    if (!organization?._id || !departmentId || !classId) return;
    
    try {
      setLoadingEntities(prev => ({ ...prev, sections: true }));
      
      const response = await getRequest(
        `/organization-setup/sections/${organization._id}/${departmentId}/${classId}`
      );

      if (response.data.success) {
        setSections(response.data.data || []);
      } else {
        setSections([]);
        console.error("Failed to fetch sections:", response.data.message);
        toast.error('Failed to fetch sections');
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      setSections([]);
      toast.error('Failed to fetch sections');
    } finally {
      setLoadingEntities(prev => ({ ...prev, sections: false }));
    }
  };

  const fetchUsers = async (role = null) => {
    if (!organization?._id) return;
    
    try {
      setLoadingEntities(prev => ({ ...prev, users: true }));
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('organizationId', organization._id);
      
      // Only add role parameter if a specific role is requested
      if (role) {
        queryParams.append('role', role.toLowerCase());
      }
      
      const response = await getRequest(`/users?${queryParams.toString()}`);
      
      if (response.data.success) {
        setUsers(response.data.data || []);
      } else {
        setUsers([]);
        console.error("Failed to fetch users:", response.data.message);
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      toast.error('Failed to fetch users');
    } finally {
      setLoadingEntities(prev => ({ ...prev, users: false }));
    }
  };

  const fetchAllData = async () => {
    if (!organization?._id) return;
    
    await Promise.all([
      fetchDepartments(),
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
      sectionId: ''
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
      sectionId: ''
    });
  };

  const handleLoginFormSubmit = async (formData) => {
    try {
      setIsLoading(true);
      
      // Basic validation for Student role: require department, class, and section
      if (formData.role === 'Student') {
        if (!formData.departmentId || !formData.classId || !formData.sectionId) {
          toast.error('Please select Department, Class and Section for Student');
          setIsLoading(false);
          return;
        }
      }

      // Prepare user data for API
      const userData = {
        name: formData.name,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        role: formData.role.toLowerCase(), // Convert to lowercase
        departmentId: formData.departmentId,
        organizationId: organization._id
      };

      // Add assignmentId for students, departmentId for all roles
      if (formData.role === 'Student') {
        const selectedSection = sections.find(s => s._id === formData.sectionId);
        if (selectedSection?.assignmentId) {
          userData.assignmentId = selectedSection.assignmentId;
        }
        userData.classId = formData.classId;
        userData.sectionId = formData.sectionId;
      }

      // Make API call to create user
      const response = await postRequest('/users', userData);
      
      if (response.data.success) {
        toast.success(`Successfully created ${formData.role} login for ${formData.name}`);
        closeLoginForm();
        // Optionally refresh users list
        fetchUsers();
      } else {
        toast.error(response.data.message || 'Failed to create user');
      }
      
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  // --- COMPUTED VALUES ---

  // Users are now filtered on the server side

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

  // Global loading flag for fancy loader overlay
  const isAnyLoading = useMemo(() => {
    return (
      isLoading ||
      loadingEntities.departments ||
      loadingEntities.classes ||
      loadingEntities.sections ||
      loadingEntities.users
    );
  }, [isLoading, loadingEntities]);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen flex flex-col">
      <Toaster position="top-right" />
      {/* Global Loader Overlay */}
      <LoaderOverlay isVisible={isAnyLoading} title="MySkillDB" subtitle="Loading your data, please wait…" />
      
      {/* Navigation Component - hidden when modal is open */}
      {!isLoginFormOpen && <OrgMenuNavigation currentPage="access-management" onPageChange={handlePageChange} />}

      {/* Main Content */}
      <div className={isLoginFormOpen ? "flex-1 flex flex-col" : "lg:ml-72 flex-1 flex flex-col"}>
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Access Management</h1>
              <p className="text-slate-500 text-sm">Create and manage user logins for HOD, Teachers, and Parents</p>
            </div>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Teachers</p>
                  <p className="text-2xl font-bold text-slate-900">{organization?.totalTeachers || 0}</p>
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
                  <p className="text-2xl font-bold text-slate-900">{organization?.totalStudents || 0}</p>
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
                  <p className="text-slate-500 text-sm">Filter user accounts by role</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={roleFilter}
                    onChange={(e) => {
                      const selectedRole = e.target.value;
                      setRoleFilter(selectedRole);
                      // Fetch users with the selected role filter
                      fetchUsers(selectedRole || null);
                    }}
                    className="bg-slate-100 border border-slate-200 rounded-md p-2 text-sm"
                  >
                    <option value="">All Roles</option>
                    <option value="org_admin">Org Admin</option>
                    <option value="hod">HOD</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {users.map((user) => (
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
                    onChange={(e) => {
                      const departmentId = e.target.value;
                      setLoginFormData(prev => ({ ...prev, departmentId, classId: '', sectionId: '' }));
                      if (departmentId) {
                        fetchClasses(departmentId);
                      } else {
                        setClasses([]);
                        setSections([]);
                      }
                    }}
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
                      onChange={(e) => {
                        const classId = e.target.value;
                        setLoginFormData(prev => ({ ...prev, classId, sectionId: '' }));
                        if (classId) {
                          fetchSections(loginFormData.departmentId, classId);
                        } else {
                          setSections([]);
                        }
                      }}
                      disabled={!loginFormData.departmentId}
                      required
                    >
                      <option value="">Select Class</option>
                      {classes.map(cls => (
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
