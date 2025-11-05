import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import StudentMenuNavigation from '../../../components/student-components/student-menu-components/StudentMenuNavigation';
import LoaderOverlay from '../../../components/loader/LoaderOverlay';
import { VideoPlayer, RecordingsList } from '../../../components/student-components/student-courses-components/classroom-recordings-components';
import { getRequest } from '../../../api/apiRequests';

const ClassroomRecordings = () => {
  const user = useSelector((state) => state.user);
  const assignment = useSelector((state) => state.assignment);
  
  const [currentPage, setCurrentPage] = useState('classroom-recordings');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSubjectId, setExpandedSubjectId] = useState(null);
  const [expandedTopicId, setExpandedTopicId] = useState(null);
  const [activeRecording, setActiveRecording] = useState(null);
  const [currentTopics, setCurrentTopics] = useState([]);
  const [currentRecordings, setCurrentRecordings] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingRecordings, setLoadingRecordings] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const toggleSubject = (subjectId) => {
    if (expandedSubjectId === subjectId) {
      setExpandedSubjectId(null);
      setCurrentTopics([]);
      setExpandedTopicId(null);
      setCurrentRecordings([]);
    } else {
      setExpandedSubjectId(subjectId);
      setExpandedTopicId(null);
      setCurrentRecordings([]);
      fetchTopicsForSubject(subjectId);
    }
  };

  const toggleTopic = (topicId, subjectId) => {
    if (expandedTopicId === topicId) {
      setExpandedTopicId(null);
      setCurrentRecordings([]);
    } else {
      setExpandedTopicId(topicId);
      fetchRecordingsForTopic(subjectId, topicId);
    }
  };

  const fetchTopicsForSubject = async (subjectId) => {
    if (!subjectId) return;
    try {
      setLoadingTopics(true);
      const response = await getRequest(`/topics/subject/${subjectId}`);
      if (response.data.success) {
        const topics = response.data.data || [];
        setCurrentTopics(topics);
        if (topics.length > 0 && subjects.length > 0 && subjects[0].id === subjectId && !expandedTopicId) {
          const firstTopicId = topics[0]._id;
          setExpandedTopicId(firstTopicId);
          fetchRecordingsForTopic(subjectId, firstTopicId);
        }
      } else {
        setCurrentTopics([]);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
      setCurrentTopics([]);
    } finally {
      setLoadingTopics(false);
    }
  };

  const fetchRecordingsForTopic = async (subjectId, topicId) => {
    if (!subjectId || !topicId) return;
    try {
      setLoadingRecordings(true);
      const response = await getRequest(`/recordings/subject/${subjectId}/topic/${topicId}`);
      if (response.data.success) {
        const recordings = response.data.data || [];
        const transformedRecordings = recordings.map((recording) => ({
          id: recording._id,
          title: recording.name,
          videoId: getYouTubeVideoId(recording.link),
          duration: recording.duration || '00:00',
          addedBy: recording.addedBy || 'Unknown'
        }));
        setCurrentRecordings(transformedRecordings);
        if (transformedRecordings.length > 0 && !activeRecording) {
          const subject = subjects.find(s => s.id === subjectId);
          const topic = currentTopics.find(t => t._id === topicId);
          if (subject && topic) {
            setActiveRecording({
              ...transformedRecordings[0],
              subjectColor: subject.color,
              subjectName: subject.name,
              topicTitle: topic.name
            });
          }
        }
      } else {
        setCurrentRecordings([]);
      }
    } catch (error) {
      console.error('Error fetching recordings:', error);
      setCurrentRecordings([]);
    } finally {
      setLoadingRecordings(false);
    }
  };

  const handlePlayVideo = (recording, subject, topic) => {
    setActiveRecording({ 
      ...recording, 
      subjectColor: subject.color, 
      subjectName: subject.name,
      topicTitle: topic.name
    });
  };

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
          const assignedSubTeachers = response.data.data.assignedSubTeachers || [];
          const colors = ['blue', 'green', 'purple', 'orange', 'pink', 'red', 'yellow', 'indigo'];
          const transformedSubjects = assignedSubTeachers.map((item, index) => ({
            id: item.subjectId?._id || item.subjectId,
            name: item.subjectId?.name || 'Unknown Subject',
            code: item.subjectId?.code || `SUB${String(index + 1).padStart(3, '0')}`,
            instructor: item.teacherId?.name || 'No teacher assigned',
            color: colors[index % colors.length]
          }));
          setSubjects(transformedSubjects);
          if (transformedSubjects.length > 0) {
            setExpandedSubjectId(transformedSubjects[0].id);
            fetchTopicsForSubject(transformedSubjects[0].id);
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
      <LoaderOverlay isVisible={isLoading} title="Classroom Recordings" subtitle="Loading recordings..." />
      
      <StudentMenuNavigation currentPage={currentPage} onPageChange={(page) => setCurrentPage(page)} />
      
      <div className="min-h-screen bg-slate-50 lg:ml-72">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b border-slate-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4 pt-16 lg:pt-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <i className="fas fa-video text-blue-600"></i>
              Classroom Recordings
            </h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)] lg:h-[calc(100vh-89px)]">
          <div className="lg:w-[65%] bg-black flex flex-col">
            <VideoPlayer activeRecording={activeRecording} />
          </div>
          
          <RecordingsList
            subjects={subjects}
            expandedSubjectId={expandedSubjectId}
            topics={currentTopics}
            loadingTopics={loadingTopics}
            expandedTopicId={expandedTopicId}
            recordings={currentRecordings}
            loadingRecordings={loadingRecordings}
            activeRecordingId={activeRecording?.id}
            onToggleSubject={toggleSubject}
            onToggleTopic={toggleTopic}
            onPlayRecording={handlePlayVideo}
          />
        </div>
      </div>
    </>
  );
};

export default ClassroomRecordings;

