import React, { useState, useEffect } from 'react';
import StudentMenuNavigation from '../../components/student-components/student-menu-components/StudentMenuNavigation';
import LoaderOverlay from '../../components/loader/LoaderOverlay';

const Abc = () => {
  const [currentPage, setCurrentPage] = useState('classroom-recordings');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSubjects, setExpandedSubjects] = useState(new Set([1])); // First subject expanded by default
  const [expandedTopics, setExpandedTopics] = useState(new Set());
  const [playingVideo, setPlayingVideo] = useState(null);
  const [activeRecording, setActiveRecording] = useState(null);

  // Dummy data - subjects with topics and recordings
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: 'Amazon Ads Fundamentals',
      code: 'ADS101',
      color: 'blue',
      instructor: 'Sarah Johnson',
      topics: [
        {
          id: 101,
          title: 'Introduction to Amazon Advertising',
          recordings: [
            {
              id: 1001,
              title: 'Amazon Ads Overview & Ecosystem',
              videoId: 'OdXwlCElS_c',
              duration: '15:32',
              addedBy: 'Sarah Johnson',
              addedDate: '2024-10-10'
            },
            {
              id: 1002,
              title: 'Types of Amazon Ads Explained',
              videoId: 'REscpOYqGII',
              duration: '12:45',
              addedBy: 'Sarah Johnson',
              addedDate: '2024-10-12'
            },
            {
              id: 1003,
              title: 'Setting Up Your First Campaign',
              videoId: 'OdXwlCElS_c',
              duration: '18:20',
              addedBy: 'Sarah Johnson',
              addedDate: '2024-10-15'
            }
          ]
        },
        {
          id: 102,
          title: 'Sponsored Products Campaigns',
          recordings: [
            {
              id: 1004,
              title: 'Automatic vs Manual Targeting',
              videoId: 'REscpOYqGII',
              duration: '20:15',
              addedBy: 'Sarah Johnson',
              addedDate: '2024-10-18'
            },
            {
              id: 1005,
              title: 'Keyword Research for Sponsored Products',
              videoId: 'OdXwlCElS_c',
              duration: '22:30',
              addedBy: 'Sarah Johnson',
              addedDate: '2024-10-20'
            }
          ]
        },
        {
          id: 103,
          title: 'Sponsored Brands Strategy',
          recordings: [
            {
              id: 1006,
              title: 'Building Brand Awareness',
              videoId: 'REscpOYqGII',
              duration: '16:45',
              addedBy: 'Sarah Johnson',
              addedDate: '2024-10-22'
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Amazon Search & SEO',
      code: 'SEO201',
      color: 'green',
      instructor: 'Michael Chen',
      topics: [
        {
          id: 201,
          title: 'Amazon A9 Algorithm Basics',
          recordings: [
            {
              id: 2001,
              title: 'Understanding A9 Algorithm',
              videoId: 'OdXwlCElS_c',
              duration: '14:30',
              addedBy: 'Michael Chen',
              addedDate: '2024-10-08'
            },
            {
              id: 2002,
              title: 'Ranking Factors Deep Dive',
              videoId: 'REscpOYqGII',
              duration: '19:15',
              addedBy: 'Michael Chen',
              addedDate: '2024-10-10'
            }
          ]
        },
        {
          id: 202,
          title: 'Keyword Research & Strategy',
          recordings: [
            {
              id: 2003,
              title: 'Keyword Tools & Techniques',
              videoId: 'OdXwlCElS_c',
              duration: '17:40',
              addedBy: 'Michael Chen',
              addedDate: '2024-10-14'
            }
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'Amazon DSP (Demand-Side Platform)',
      code: 'DSP301',
      color: 'purple',
      instructor: 'Emily Rodriguez',
      topics: [
        {
          id: 301,
          title: 'Introduction to Programmatic Advertising',
          recordings: [
            {
              id: 3001,
              title: 'What is DSP?',
              videoId: 'REscpOYqGII',
              duration: '13:25',
              addedBy: 'Emily Rodriguez',
              addedDate: '2024-10-05'
            },
            {
              id: 3002,
              title: 'DSP vs Traditional Advertising',
              videoId: 'OdXwlCElS_c',
              duration: '15:50',
              addedBy: 'Emily Rodriguez',
              addedDate: '2024-10-07'
            }
          ]
        }
      ]
    }
  ]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleSubject = (subjectId) => {
    setExpandedSubjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subjectId)) {
        newSet.delete(subjectId);
      } else {
        newSet.add(subjectId);
      }
      return newSet;
    });
  };

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(topicId)) {
        newSet.delete(topicId);
      } else {
        newSet.add(topicId);
      }
      return newSet;
    });
  };

  const handlePlayVideo = (recording, subject, topic) => {
    setActiveRecording({ 
      ...recording, 
      subjectColor: subject.color, 
      subjectName: subject.name,
      topicTitle: topic.title
    });
  };

  // Simulate loading and set first video as default
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Set first recording as default active recording
      if (subjects.length > 0 && subjects[0].topics.length > 0 && subjects[0].topics[0].recordings.length > 0) {
        setActiveRecording({
          ...subjects[0].topics[0].recordings[0],
          subjectColor: subjects[0].color,
          subjectName: subjects[0].name,
          topicTitle: subjects[0].topics[0].title
        });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Calculate total recordings for a subject
  const getSubjectRecordingsCount = (subject) => {
    return subject.topics.reduce((sum, topic) => sum + topic.recordings.length, 0);
  };

  return (
    <>
      <LoaderOverlay isVisible={isLoading} title="Classroom Recordings" subtitle="Loading recordings..." />
      
      <StudentMenuNavigation currentPage={currentPage} onPageChange={handlePageChange} />
      
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

        {/* Main Content - Split Layout */}
        <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)] lg:h-[calc(100vh-89px)]">
          {/* Left Side - Video Player */}
          <div className="lg:w-[65%] bg-black flex flex-col">
            {activeRecording ? (
              <>
                {/* Video Player */}
                <div className="flex-1 bg-black flex items-center justify-center">
                  <div className="w-full h-full">
                    <iframe
                      src={`https://www.youtube.com/embed/${activeRecording.videoId}?autoplay=0`}
                      title={activeRecording.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
                
                {/* Video Info */}
                <div className="bg-slate-900 text-white px-3 py-2 lg:px-4 lg:py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 bg-gradient-to-br from-${activeRecording.subjectColor}-500 to-${activeRecording.subjectColor}-600 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <i className="fab fa-youtube text-white text-sm"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm lg:text-base font-semibold truncate">{activeRecording.title}</h2>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>{activeRecording.subjectName}</span>
                        <span>•</span>
                        <span>{activeRecording.duration}</span>
                        <span>•</span>
                        <span>{activeRecording.addedBy}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <i className="fas fa-video text-6xl mb-4"></i>
                  <p className="text-lg">Select a video to start watching</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Playlist/Accordion */}
          <div className="lg:w-[35%] bg-white border-t lg:border-t-0 lg:border-l border-slate-200 overflow-y-auto">
            <div className="sticky top-0 bg-slate-50 border-b border-slate-200 px-3 py-2 z-10">
              <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                <i className="fas fa-list text-blue-600 text-xs"></i>
                All Recordings
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {subjects.reduce((sum, s) => sum + getSubjectRecordingsCount(s), 0)} videos
              </p>
            </div>

            {/* Subjects List */}
            <div className="divide-y divide-slate-200">
              {subjects.map((subject) => {
                const isSubjectExpanded = expandedSubjects.has(subject.id);
                const totalRecordings = getSubjectRecordingsCount(subject);

                return (
                  <div key={subject.id} className="bg-white">
                    {/* Subject Header */}
                    <div
                      className="p-2 cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => toggleSubject(subject.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-9 h-9 bg-gradient-to-br from-${subject.color}-500 to-${subject.color}-600 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white font-bold text-[9px] leading-tight">{subject.code}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 text-sm truncate">{subject.name}</h4>
                          <p className="text-xs text-slate-600 flex items-center gap-1">
                            <i className="fas fa-film text-[10px]"></i>
                            {totalRecordings} video{totalRecordings !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <i className={`fas fa-chevron-${isSubjectExpanded ? 'up' : 'down'} text-${subject.color}-600 text-xs`}></i>
                      </div>
                    </div>

                    {/* Topics & Recordings */}
                    {isSubjectExpanded && (
                      <div className="bg-slate-50 px-2 pb-2">
                        {subject.topics.map((topic) => {
                          const isTopicExpanded = expandedTopics.has(topic.id);

                          return (
                            <div key={topic.id} className="mb-1.5">
                              {/* Topic Header */}
                              <div
                                className="bg-white rounded-lg p-1.5 cursor-pointer hover:bg-slate-100 transition-colors border border-slate-200"
                                onClick={() => toggleTopic(topic.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-900 text-xs truncate">{topic.title}</p>
                                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                                      <i className="fas fa-play-circle text-[10px]"></i>
                                      {topic.recordings.length} video{topic.recordings.length !== 1 ? 's' : ''}
                                    </p>
                                  </div>
                                  <i className={`fas fa-chevron-${isTopicExpanded ? 'up' : 'down'} text-${subject.color}-600 text-xs`}></i>
                                </div>
                              </div>

                              {/* Recordings List */}
                              {isTopicExpanded && (
                                <div className="mt-1.5 space-y-1 pl-1.5">
                                  {topic.recordings.map((recording) => {
                                    const isActive = activeRecording?.id === recording.id;
                                    return (
                                      <div
                                        key={recording.id}
                                        className={`rounded-lg p-1.5 cursor-pointer transition-all ${
                                          isActive 
                                            ? `bg-${subject.color}-100 border-2 border-${subject.color}-400` 
                                            : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm'
                                        }`}
                                        onClick={() => handlePlayVideo(recording, subject, topic)}
                                      >
                                        <div className="flex items-center gap-2">
                                          <div className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 ${
                                            isActive ? `bg-${subject.color}-500` : `bg-${subject.color}-100`
                                          }`}>
                                            <i className={`fab fa-youtube ${isActive ? 'text-white' : `text-${subject.color}-600`} text-xs`}></i>
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-medium truncate ${
                                              isActive ? `text-${subject.color}-900` : 'text-slate-900'
                                            }`}>{recording.title}</p>
                                            <span className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                                              <i className="fas fa-clock text-[10px]"></i>
                                              {recording.duration}
                                            </span>
                                          </div>
                                          {isActive && (
                                            <div className={`text-${subject.color}-600`}>
                                              <i className="fas fa-play-circle text-sm"></i>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Abc;

