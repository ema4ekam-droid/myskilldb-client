import React, { useState, useEffect } from 'react';
import StudentMenuNavigation from '../../components/student-components/student-menu-components/StudentMenuNavigation';
import LoaderOverlay from '../../components/loader/LoaderOverlay';

const StudentDashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [studentData, setStudentData] = useState({
    name: 'John Doe',
    studentId: 'STU2024001',
    department: 'Computer Science',
    semester: 'Semester 5',
    email: 'john.doe@example.com'
  });

  const [stats, setStats] = useState([
    {
      id: 1,
      title: 'Enrolled Courses',
      value: '6',
      icon: 'fas fa-book-open',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 2,
      title: 'Completed Assessments',
      value: '12',
      icon: 'fas fa-clipboard-check',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      id: 3,
      title: 'Skills Acquired',
      value: '24',
      icon: 'fas fa-award',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      id: 4,
      title: 'Job Applications',
      value: '8',
      icon: 'fas fa-briefcase',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ]);

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'course',
      title: 'Completed React Advanced Module',
      time: '2 hours ago',
      icon: 'fas fa-check-circle',
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'assessment',
      title: 'Data Structures Quiz - Score: 85%',
      time: '5 hours ago',
      icon: 'fas fa-star',
      color: 'text-yellow-600'
    },
    {
      id: 3,
      type: 'job',
      title: 'Applied for Frontend Developer Position',
      time: '1 day ago',
      icon: 'fas fa-paper-plane',
      color: 'text-blue-600'
    },
    {
      id: 4,
      type: 'skill',
      title: 'New Skill Unlocked: TypeScript',
      time: '2 days ago',
      icon: 'fas fa-trophy',
      color: 'text-purple-600'
    }
  ]);

  const [upcomingTasks, setUpcomingTasks] = useState([
    {
      id: 1,
      title: 'Database Management Assignment',
      dueDate: 'Due Tomorrow',
      priority: 'high',
      course: 'CS301'
    },
    {
      id: 2,
      title: 'Web Development Quiz',
      dueDate: 'Due in 3 days',
      priority: 'medium',
      course: 'CS402'
    },
    {
      id: 3,
      title: 'Algorithm Analysis Project',
      dueDate: 'Due in 5 days',
      priority: 'low',
      course: 'CS203'
    }
  ]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LoaderOverlay isVisible={isLoading} title="Dashboard" subtitle="Loading your dashboard..." />
      
      <StudentMenuNavigation currentPage={currentPage} onPageChange={handlePageChange} />
      
      <div className="min-h-screen bg-slate-50 lg:ml-72">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20 lg:pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                  <i className="fas fa-home text-blue-600"></i>
                  Dashboard
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Welcome back, <span className="font-semibold">{studentData.name}</span>! Here's your learning overview.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-slate-500">Student ID</p>
                  <p className="text-sm font-semibold text-slate-900">{studentData.studentId}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {studentData.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-2">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`w-14 h-14 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <i className={`${stat.icon} text-2xl ${stat.textColor}`}></i>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <i className="fas fa-clock text-blue-600"></i>
                    Recent Activity
                  </h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className={`w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0`}>
                        <i className={`${activity.icon} ${activity.color}`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <i className="fas fa-tasks text-orange-600"></i>
                  Upcoming Tasks
                </h2>
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-semibold text-slate-900 flex-1">{task.title}</p>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)} border`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">
                          <i className="fas fa-book mr-1"></i>
                          {task.course}
                        </span>
                        <span className="text-orange-600 font-medium">
                          <i className="fas fa-calendar-alt mr-1"></i>
                          {task.dueDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold text-sm">
                  View All Tasks
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <i className="fas fa-bolt text-yellow-600"></i>
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-all group">
                <div className="text-center">
                  <i className="fas fa-book-open text-3xl text-blue-600 mb-2 group-hover:scale-110 transition-transform"></i>
                  <p className="text-sm font-semibold text-slate-900">Browse Courses</p>
                </div>
              </button>
              <button className="p-4 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg transition-all group">
                <div className="text-center">
                  <i className="fas fa-clipboard-check text-3xl text-green-600 mb-2 group-hover:scale-110 transition-transform"></i>
                  <p className="text-sm font-semibold text-slate-900">Take Assessment</p>
                </div>
              </button>
              <button className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg transition-all group">
                <div className="text-center">
                  <i className="fas fa-bullseye text-3xl text-purple-600 mb-2 group-hover:scale-110 transition-transform"></i>
                  <p className="text-sm font-semibold text-slate-900">Skill Planner</p>
                </div>
              </button>
              <button className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-lg transition-all group">
                <div className="text-center">
                  <i className="fas fa-briefcase text-3xl text-orange-600 mb-2 group-hover:scale-110 transition-transform"></i>
                  <p className="text-sm font-semibold text-slate-900">Find Jobs</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;

