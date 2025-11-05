import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import StudentMenuNavigation from '../../../components/student-components/student-menu-components/StudentMenuNavigation';
import LoaderOverlay from '../../../components/loader/LoaderOverlay';
import { getRequest } from '../../../api/apiRequests';
import { SubjectCard, StudentInfoCard } from '../../../components/student-components/student-courses-components/my-courses-components';

const MyCourses = () => {
  const user = useSelector((state) => state.user);
  const assignment = useSelector((state) => state.assignment);
  const [currentPage, setCurrentPage] = useState('my-courses');
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [topicsBySubject, setTopicsBySubject] = useState({});
  const [loadingTopics, setLoadingTopics] = useState({});
  const [subjects, setSubjects] = useState([]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleSubject = async (subject) => {
    const subjectId = subject._id;
    
    setExpandedSubjects(prev => {
      // If this subject is already open, close it
      if (prev[subjectId]) {
        return {
          ...prev,
          [subjectId]: false
        };
      }
      // Otherwise, close all subjects and open only this one
      const newState = {
        [subjectId]: true
      };
      
      // Fetch topics for the opened subject
      if (subjectId) {
        fetchTopicsForSubject(subjectId);
      }
      
      return newState;
    });
  };

  const fetchTopicsForSubject = async (subjectId) => {
    if (!subjectId) return;
    
    try {
      setLoadingTopics(prev => ({ ...prev, [subjectId]: true }));
      const response = await getRequest(`/topics/subject/${subjectId}`);
      
      if (response.data.success) {
        const topics = response.data.data || [];
        setTopicsBySubject(prev => ({
          ...prev,
          [subjectId]: topics
        }));
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
      setTopicsBySubject(prev => ({
        ...prev,
        [subjectId]: []
      }));
    } finally {
      setLoadingTopics(prev => ({ ...prev, [subjectId]: false }));
    }
  };

  // Fetch teaching assignments data
  useEffect(() => {
    const fetchTeachingAssignments = async () => {
      if (!user?.organizationId || !assignment?._id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getRequest(
          `/organization-setup/teachingAssignments/${user.organizationId}/${assignment._id}`
        );
        
        if (response.data.success && response.data.data) {
          const teachingAssignment = response.data.data;
          const assignedSubTeachers = teachingAssignment.assignedSubTeachers || [];

          // Transform API data to subjects format
          const transformedSubjects = assignedSubTeachers.map((item, index) => {
            const subjectId = item.subjectId?._id || item.subjectId;
            const subjectName = item.subjectId?.name || 'Unknown Subject';
            const subjectCode = item.subjectId?.code || `SUB${String(index + 1).padStart(3, '0')}`;
            const teacherName = item.teacherId?.name || 'No teacher assigned';

            // Color array for different subjects
            const colors = ['blue', 'green', 'purple', 'orange', 'pink', 'red', 'yellow', 'indigo'];
            const color = colors[index % colors.length];

            return {
              _id: subjectId,
              name: subjectName,
              code: subjectCode,
              instructor: teacherName,
              color: color
            };
          });

          // Update subjects if we have data
          if (transformedSubjects.length > 0) {
            setSubjects(transformedSubjects);
          }
        }
      } catch (error) {
        console.error('Error fetching teaching assignments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachingAssignments();
  }, [user?.organizationId, assignment?._id]);

  return (
    <>
      <LoaderOverlay isVisible={isLoading} title="My Courses" subtitle="Loading your courses..." />
      
      <StudentMenuNavigation currentPage={currentPage} onPageChange={handlePageChange} />
      
      <div className="min-h-screen bg-slate-50 lg:ml-72">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20 lg:pt-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <i className="fas fa-graduation-cap text-blue-600"></i>
                My Courses
              </h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Student Info Card */}
          <StudentInfoCard user={user} assignment={assignment} />

          {/* Subjects Grid */}
          <div className="space-y-6">
            {subjects.map((subject) => {
              const isExpanded = expandedSubjects[subject._id];

              return (
                <SubjectCard
                  key={subject._id}
                  subject={subject}
                  isExpanded={isExpanded}
                  onToggle={toggleSubject}
                  topics={topicsBySubject}
                  loadingTopics={loadingTopics}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyCourses;