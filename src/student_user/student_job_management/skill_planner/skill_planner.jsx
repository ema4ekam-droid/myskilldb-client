import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import StudentMenuNavigation from '../../../components/student-components/student-menu-components/StudentMenuNavigation';
import LoaderOverlay from '../../../components/loader/LoaderOverlay';
import {
  AddResourceModal,
  RequestTestimonialModal,
  ViewTestimonialModal,
  ViewNoteModal
} from '../../../components/student-components/student-job-management-components/skill-planner-components';

const SkillPlanner = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('skill-planner');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [expandedJobs, setExpandedJobs] = useState({});
  const [expandedSkills, setExpandedSkills] = useState({});
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false);
  const [isRequestTestimonialModalOpen, setIsRequestTestimonialModalOpen] = useState(false);
  const [isViewTestimonialModalOpen, setIsViewTestimonialModalOpen] = useState(false);
  const [isViewNoteModalOpen, setIsViewNoteModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [resourceType, setResourceType] = useState('youtube'); // youtube, linkedin, certificate
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);
  const [selectedLinkedInPost, setSelectedLinkedInPost] = useState(null);
  
  // Form states
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceNote, setResourceNote] = useState('');
  
  // LinkedIn Post Form states
  const [linkedInTopic, setLinkedInTopic] = useState('');
  const [generatedPostText, setGeneratedPostText] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Testimonial form states
  const [testimonialProject, setTestimonialProject] = useState('');
  const [validatorName, setValidatorName] = useState('');
  const [validatorEmail, setValidatorEmail] = useState('');
  const [validatorRole, setValidatorRole] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  
  // Dummy data - jobs added to skill planner with skills
  const [plannerJobs, setPlannerJobs] = useState([
    {
      _id: 'job-1',
      title: 'Frontend Developer',
      company: 'TechCorp Solutions',
      skills: [
        {
          id: 'skill-1',
          name: 'React',
          status: 'completed', // not-started, in-progress, completed
          progress: 100,
          assessmentCompleted: true,
          assessmentScore: 91.7,
          assessmentDate: '2024-01-28',
          linkedInPosts: [
            { 
              id: 'li-1', 
              topic: 'React Hooks Mastery', 
              postText: '🚀 Just completed my React journey! \n\nExcited to share that I\'ve mastered React Hooks and Context API. Here are 3 key takeaways:\n\n1️⃣ useState & useEffect are game-changers for state management\n2️⃣ Custom hooks make code reusable and clean\n3️⃣ Context API eliminates prop drilling\n\n#React #WebDevelopment #JavaScript #Coding',
              imageUrl: 'https://via.placeholder.com/1200x630/4F46E5/ffffff?text=React+Mastery',
              date: '2024-10-20' 
            }
          ],
          youtubeLinks: [
            { id: 'yt-1', title: 'React Complete Course', url: 'https://youtu.be/y9Dk6wMc8UM', addedDate: '2024-10-18' },
            { id: 'yt-2', title: 'React Hooks Tutorial', url: 'https://youtu.be/y9Dk6wMc8UM', addedDate: '2024-10-19' }
          ],
          certificates: [
            { id: 'cert-1', title: 'React Basics Certificate', url: 'https://drive.google.com/file/example', type: 'drive', addedDate: '2024-10-15' }
          ],
          testimonials: [
            { id: 'test-1', project: 'E-commerce Checkout System', skills: ['React'], validatorName: 'Ms. Priya Sharma', validatorEmail: 'priya.sharma@company.com', validatorRole: 'Project Manager, TechSolutions Inc.', personalMessage: 'Hi Ms. Sharma, I\'d really appreciate it if you could take a moment to validate my work on React for this project...', status: 'pending', requestedDate: '2024-10-20' },
            { id: 'test-2', project: 'Task Management Dashboard', skills: ['React'], validatorName: 'Mr. John Davis', validatorEmail: 'john.davis@startup.com', validatorRole: 'Lead Developer, StartupXYZ', personalMessage: 'Would love your feedback on my React work!', status: 'approved', testimonialText: 'Excellent work on implementing complex React components. Shows strong understanding of component architecture and state management.', approvedDate: '2024-10-18' }
          ]
        },
        {
          id: 'skill-2',
          name: 'JavaScript ES6+',
          status: 'completed',
          progress: 100,
          assessmentCompleted: true,
          assessmentScore: 87.5,
          assessmentDate: '2024-01-27',
          linkedInPosts: [],
          youtubeLinks: [
            { id: 'yt-3', title: 'JavaScript ES6 Complete Guide', url: 'https://youtu.be/y9Dk6wMc8UM', addedDate: '2024-10-19' }
          ],
          certificates: [],
          testimonials: []
        },
        {
          id: 'skill-3',
          name: 'CSS Flexbox & Grid',
          status: 'completed',
          progress: 100,
          assessmentCompleted: true,
          assessmentScore: 100,
          assessmentDate: '2024-01-25',
          linkedInPosts: [],
          youtubeLinks: [
            { id: 'yt-4', title: 'Tailwind CSS Crash Course', url: 'https://youtu.be/y9Dk6wMc8UM', addedDate: '2024-10-08' }
          ],
          certificates: [
            { id: 'cert-2', title: 'Tailwind CSS Project', url: 'https://dropbox.com/file/example', type: 'dropbox', addedDate: '2024-10-12' }
          ],
          testimonials: []
        },
        {
          id: 'skill-4',
          name: 'React State Management',
          status: 'completed',
          progress: 100,
          assessmentCompleted: true,
          assessmentScore: 91.7,
          assessmentDate: '2024-01-28',
          linkedInPosts: [],
          youtubeLinks: [],
          certificates: [],
          testimonials: []
        }
      ]
    },
    {
      _id: 'job-6',
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      skills: [
        {
          id: 'skill-5',
          name: 'Node.js Basics',
          status: 'in-progress',
          progress: 50,
          assessmentCompleted: false,
          linkedInPosts: [],
          youtubeLinks: [
            { id: 'yt-5', title: 'Node.js Tutorial', url: 'https://youtu.be/y9Dk6wMc8UM', addedDate: '2024-10-20' }
          ],
          certificates: [],
          testimonials: []
        },
        {
          id: 'skill-6',
          name: 'REST APIs & HTTP',
          status: 'in-progress',
          progress: 40,
          assessmentCompleted: false,
          linkedInPosts: [],
          youtubeLinks: [
            { id: 'yt-6', title: 'REST API Complete Guide', url: 'https://youtu.be/y9Dk6wMc8UM', addedDate: '2024-10-18' }
          ],
          certificates: [],
          testimonials: []
        }
      ]
    }
  ]);

  useEffect(() => {
    // In real app, fetch jobs from skill planner
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleJobExpansion = (jobId) => {
    setExpandedJobs(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  const isJobExpanded = (jobId) => {
    return expandedJobs[jobId] || false;
  };

  const toggleSkillExpansion = (jobId, skillId) => {
    const key = `${jobId}-${skillId}`;
    setExpandedSkills(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isSkillExpanded = (jobId, skillId) => {
    const key = `${jobId}-${skillId}`;
    return expandedSkills[key] || false;
  };

  const handleOpenAddResourceModal = (job, skill, type) => {
    setSelectedJob(job);
    setSelectedSkill(skill);
    setResourceType(type);
    setIsAddResourceModalOpen(true);
    setResourceTitle('');
    setResourceUrl('');
    setResourceNote('');
  };

  const handleCloseResourceModal = () => {
    setIsAddResourceModalOpen(false);
    setSelectedJob(null);
    setSelectedSkill(null);
    setResourceTitle('');
    setResourceUrl('');
    setResourceNote('');
  };

  const handleAddResource = () => {
    if (resourceType === 'youtube') {
      if (!resourceTitle.trim() || !resourceUrl.trim()) {
        toast.error('Please enter both title and URL');
        return;
      }

      const newVideo = {
        id: `yt-${Date.now()}`,
        title: resourceTitle,
        url: resourceUrl,
        addedDate: new Date().toISOString().split('T')[0]
      };

      setPlannerJobs(prev => prev.map(job => {
        if (job._id === selectedJob._id) {
          return {
            ...job,
            skills: job.skills.map(skill => {
              if (skill.id === selectedSkill.id) {
                return {
                  ...skill,
                  youtubeLinks: [...skill.youtubeLinks, newVideo]
                };
              }
              return skill;
            })
          };
        }
        return job;
      }));

      toast.success('YouTube video added successfully!');
      handleCloseResourceModal();
    } else if (resourceType === 'certificate') {
      if (!resourceTitle.trim() || !resourceUrl.trim()) {
        toast.error('Please enter both title and URL');
        return;
      }

      // Detect if it's Drive or Dropbox based on URL
      const type = resourceUrl.includes('drive.google.com') ? 'drive' : 
                   resourceUrl.includes('dropbox.com') ? 'dropbox' : 'other';

      const newCert = {
        id: `cert-${Date.now()}`,
        title: resourceTitle,
        url: resourceUrl,
        type: type,
        addedDate: new Date().toISOString().split('T')[0]
      };

      setPlannerJobs(prev => prev.map(job => {
        if (job._id === selectedJob._id) {
          return {
            ...job,
            skills: job.skills.map(skill => {
              if (skill.id === selectedSkill.id) {
                return {
                  ...skill,
                  certificates: [...skill.certificates, newCert]
                };
              }
              return skill;
            })
          };
        }
        return job;
      }));

      toast.success('Certificate/file added successfully!');
      handleCloseResourceModal();
    }
  };

  const handleDeleteResource = (jobId, skillId, resourceType, resourceId) => {
    setPlannerJobs(prev => prev.map(job => {
      if (job._id === jobId) {
        return {
          ...job,
          skills: job.skills.map(skill => {
            if (skill.id === skillId) {
              if (resourceType === 'youtube') {
                return {
                  ...skill,
                  youtubeLinks: skill.youtubeLinks.filter(yt => yt.id !== resourceId)
                };
              } else if (resourceType === 'certificate') {
                return {
                  ...skill,
                  certificates: skill.certificates.filter(cert => cert.id !== resourceId)
                };
              }
            }
            return skill;
          })
        };
      }
      return job;
    }));

    toast.success('Resource deleted successfully');
  };

  const handleUpdateSkillStatus = (jobId, skillId, newStatus) => {
    setPlannerJobs(prev => prev.map(job => {
      if (job._id === jobId) {
        return {
          ...job,
          skills: job.skills.map(skill => {
            if (skill.id === skillId) {
              const newProgress = newStatus === 'completed' ? 100 : 
                                  newStatus === 'in-progress' ? 50 : 0;
              return {
                ...skill,
                status: newStatus,
                progress: newProgress
              };
            }
            return skill;
          })
        };
      }
      return job;
    }));

    toast.success('Skill status updated!');
  };

  // Testimonial handlers
  const handleOpenRequestTestimonialModal = (job, skill) => {
    setSelectedJob(job);
    setSelectedSkill(skill);
    setIsRequestTestimonialModalOpen(true);
  };

  const handleCloseTestimonialModal = () => {
    setIsRequestTestimonialModalOpen(false);
    setSelectedJob(null);
    setSelectedSkill(null);
    setTestimonialProject('');
    setValidatorName('');
    setValidatorEmail('');
    setValidatorRole('');
    setPersonalMessage('');
  };

  const handleRequestTestimonial = () => {
    if (!testimonialProject || !validatorName || !validatorEmail || !validatorRole) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newTestimonial = {
      id: `test-${Date.now()}`,
      project: testimonialProject,
      skills: [selectedSkill.name], // Only the current skill
      validatorName,
      validatorEmail,
      validatorRole,
      personalMessage,
      status: 'pending',
      requestedDate: new Date().toISOString().split('T')[0]
    };

    setPlannerJobs(prev => prev.map(job => {
      if (job._id === selectedJob._id) {
        return {
          ...job,
          skills: job.skills.map(skill => {
            if (skill.id === selectedSkill.id) {
              return {
                ...skill,
                testimonials: [...skill.testimonials, newTestimonial]
              };
            }
            return skill;
          })
        };
      }
      return job;
    }));

    toast.success('Testimonial request sent successfully!');
    handleCloseTestimonialModal();
  };

  const handleViewTestimonial = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsViewTestimonialModalOpen(true);
  };

  const handleCloseViewTestimonialModal = () => {
    setIsViewTestimonialModalOpen(false);
    setSelectedTestimonial(null);
  };

  const handleDeleteTestimonial = (jobId, skillId, testimonialId) => {
    setPlannerJobs(prev => prev.map(job => {
      if (job._id === jobId) {
        return {
          ...job,
          skills: job.skills.map(skill => {
            if (skill.id === skillId) {
              return {
                ...skill,
                testimonials: skill.testimonials.filter(test => test.id !== testimonialId)
              };
            }
            return skill;
          })
        };
      }
      return job;
    }));

    toast.success('Testimonial deleted successfully');
  };

  // Note view handlers
  const handleViewNote = (note) => {
    setSelectedNote(note);
    setIsViewNoteModalOpen(true);
  };

  const handleCloseViewNoteModal = () => {
    setIsViewNoteModalOpen(false);
    setSelectedNote(null);
  };

  // LinkedIn Post handlers
  const handleOpenLinkedInModal = (job, skill) => {
    setSelectedJob(job);
    setSelectedSkill(skill);
    setIsLinkedInModalOpen(true);
    setLinkedInTopic('');
    setGeneratedPostText('');
    setGeneratedImageUrl('');
  };

  const handleCloseLinkedInModal = () => {
    setIsLinkedInModalOpen(false);
    setSelectedJob(null);
    setSelectedSkill(null);
    setLinkedInTopic('');
    setGeneratedPostText('');
    setGeneratedImageUrl('');
  };

  const handleGenerateLinkedInPost = async () => {
    if (!linkedInTopic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
      const postText = `🚀 Exciting achievement unlocked! \n\nI'm thrilled to share my progress in ${selectedSkill?.name}! \n\n${linkedInTopic}\n\nKey learnings:\n1️⃣ Hands-on practice makes perfect\n2️⃣ Real-world projects solidify concepts\n3️⃣ Continuous learning is the key\n\nWhat's your experience with ${selectedSkill?.name}? Drop a comment below! 👇\n\n#${selectedSkill?.name.replace(/\s+/g, '')} #TechSkills #ContinuousLearning #WebDevelopment`;
      const imageUrl = `https://via.placeholder.com/1200x630/6366F1/ffffff?text=${encodeURIComponent(selectedSkill?.name + ' Mastery')}`;
      
      setGeneratedPostText(postText);
      setGeneratedImageUrl(imageUrl);
      setIsGenerating(false);
      toast.success('LinkedIn post generated successfully!');
    }, 2000);
  };

  const handleSaveLinkedInPost = () => {
    if (!generatedPostText || !generatedImageUrl) {
      toast.error('Please generate the post first');
      return;
    }

    const newPost = {
      id: `li-${Date.now()}`,
      topic: linkedInTopic,
      postText: generatedPostText,
      imageUrl: generatedImageUrl,
      date: new Date().toISOString().split('T')[0]
    };

    setPlannerJobs(prev => prev.map(job => {
      if (job._id === selectedJob._id) {
        return {
          ...job,
          skills: job.skills.map(skill => {
            if (skill.id === selectedSkill.id) {
              return {
                ...skill,
                linkedInPosts: [...skill.linkedInPosts, newPost]
              };
            }
            return skill;
          })
        };
      }
      return job;
    }));

    toast.success('LinkedIn post saved successfully!');
    handleCloseLinkedInModal();
  };

  const handleViewLinkedInPost = (post) => {
    setSelectedLinkedInPost(post);
  };

  const handleCloseViewLinkedInPost = () => {
    setSelectedLinkedInPost(null);
  };

  const handleDeleteLinkedInPost = (jobId, skillId, postId) => {
    setPlannerJobs(prev => prev.map(job => {
      if (job._id === jobId) {
        return {
          ...job,
          skills: job.skills.map(skill => {
            if (skill.id === skillId) {
              return {
                ...skill,
                linkedInPosts: skill.linkedInPosts.filter(post => post.id !== postId)
              };
            }
            return skill;
          })
        };
      }
      return job;
    }));

    toast.success('LinkedIn post deleted successfully');
    handleCloseViewLinkedInPost();
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Text copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy text');
    });
  };

  const handleDownloadImage = (imageUrl) => {
    // In real app, this would trigger image download
    window.open(imageUrl, '_blank');
    toast.success('Opening image in new tab');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in-progress': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'not-started': return 'text-slate-600 bg-slate-50 border-slate-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'fa-check-circle';
      case 'in-progress': return 'fa-spinner';
      case 'not-started': return 'fa-circle';
      default: return 'fa-circle';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'not-started': return 'Not Started';
      default: return 'Not Started';
    }
  };

  const getTotalSkills = () => {
    return plannerJobs.reduce((total, job) => total + job.skills.length, 0);
  };

  const getCompletedSkills = () => {
    return plannerJobs.reduce((total, job) => {
      return total + job.skills.filter(skill => skill.status === 'completed').length;
    }, 0);
  };

  const getInProgressSkills = () => {
    return plannerJobs.reduce((total, job) => {
      return total + job.skills.filter(skill => skill.status === 'in-progress').length;
    }, 0);
  };

  const isJobCVReady = (job) => {
    // CV is ready only if ALL skills have completed assessments
    return job.skills.length > 0 && job.skills.every(skill => skill.assessmentCompleted);
  };

  const getJobCompletedAssessments = (job) => {
    return job.skills.filter(skill => skill.assessmentCompleted).length;
  };

  const handleTakeAssessment = (skillName) => {
    // Route to job assessments page
    toast.success(`Redirecting to ${skillName} assessment...`);
    navigate('/student/job-assessments');
  };

  return (
    <>
      <LoaderOverlay isVisible={isLoading} title="Skill Planner" subtitle="Loading your skills and resources..." />
      <StudentMenuNavigation currentPage={currentPage} onPageChange={handlePageChange} />
      
      <div className="min-h-screen bg-slate-50 lg:ml-72 p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Skill Planner</h1>
          <p className="text-sm text-slate-600">Track your skills, add learning resources, and manage certificates</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 lg:p-4">
            <div className="flex flex-col lg:flex-row items-center lg:gap-3 text-center lg:text-left">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2 lg:mb-0">
                <i className="fas fa-bullseye text-blue-600 text-lg lg:text-xl"></i>
              </div>
              <div>
                <p className="text-xs lg:text-sm text-slate-600">Total Skills</p>
                <p className="text-xl lg:text-2xl font-bold text-slate-900">{getTotalSkills()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 lg:p-4">
            <div className="flex flex-col lg:flex-row items-center lg:gap-3 text-center lg:text-left">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2 lg:mb-0">
                <i className="fas fa-spinner text-orange-600 text-lg lg:text-xl"></i>
              </div>
              <div>
                <p className="text-xs lg:text-sm text-slate-600">In Progress</p>
                <p className="text-xl lg:text-2xl font-bold text-slate-900">{getInProgressSkills()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 lg:p-4">
            <div className="flex flex-col lg:flex-row items-center lg:gap-3 text-center lg:text-left">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2 lg:mb-0">
                <i className="fas fa-check-circle text-green-600 text-lg lg:text-xl"></i>
              </div>
              <div>
                <p className="text-xs lg:text-sm text-slate-600">Completed</p>
                <p className="text-xl lg:text-2xl font-bold text-slate-900">{getCompletedSkills()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs and Skills */}
        {plannerJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-briefcase text-slate-400 text-3xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Jobs in Skill Planner</h3>
            <p className="text-sm text-slate-600 mb-4">
              Add jobs from the Job Board to start tracking skills
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {plannerJobs.map((job) => {
              const isExpanded = isJobExpanded(job._id);
              return (
                <div key={job._id} className="bg-white rounded-xl shadow-sm border-2 border-slate-200 overflow-hidden">
                  {/* Job Header - Clickable Accordion */}
                  <button
                    onClick={() => toggleJobExpansion(job._id)}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 p-4 lg:p-6 hover:from-indigo-600 hover:to-purple-700 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-briefcase text-indigo-600 text-xl"></i>
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <h2 className="text-sm lg:text-lg font-bold text-white break-words leading-tight">{job.title}</h2>
                        <p className="text-xs lg:text-sm text-indigo-100">{job.company}</p>
                        
                        {/* CV Status Notifier */}
                        <div className="mt-2">
                          {isJobCVReady(job) ? (
                            <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-500 bg-opacity-90 rounded-full">
                              <i className="fas fa-check-circle text-white text-xs"></i>
                              <span className="text-[10px] lg:text-xs font-semibold text-white">
                                CV Ready ({getJobCompletedAssessments(job)}/{job.skills.length} assessments completed)
                              </span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-yellow-400 bg-opacity-90 rounded-full animate-pulse">
                              <i className="fas fa-exclamation-triangle text-slate-900 text-xs"></i>
                              <span className="text-[10px] lg:text-xs font-semibold text-slate-900">
                                CV Not Ready - Complete assessments to create CV
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                       <div className="text-right flex items-center gap-4">
                         <div>
                           <p className="text-xs text-indigo-100">Skills</p>
                           <p className="text-xl font-bold text-white">{job.skills.length}</p>
                         </div>
                         <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                           <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-indigo-600`}></i>
                         </div>
                       </div>
                    </div>
                  </button>

                  {/* Skills List - Only show when expanded */}
                  {isExpanded && (
                    <div className="p-4 lg:p-6 space-y-3">
                  {job.skills.map((skill) => {
                    const isExpanded = isSkillExpanded(job._id, skill.id);
                    return (
                      <div key={skill.id} className="border-2 border-slate-200 rounded-lg overflow-hidden">
                        {/* Skill Header - Clickable */}
                        <button
                          onClick={() => toggleSkillExpansion(job._id, skill.id)}
                          className="w-full bg-slate-50 p-4 hover:bg-slate-100 transition-colors text-left"
                        >
                          <div className="flex items-start gap-2 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-slate-900 text-base lg:text-lg mb-2 break-words">{skill.name}</h3>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(skill.status)}`}>
                                  <i className={`fas ${getStatusIcon(skill.status)}`}></i>
                                  {getStatusText(skill.status)}
                                </span>
                                
                                {/* Take Assessment Button - Only show if assessment not completed */}
                                {!skill.assessmentCompleted && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTakeAssessment(skill.name);
                                    }}
                                    className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1 shadow-sm"
                                  >
                                    <i className="fas fa-clipboard-check"></i>
                                    Take Assessment
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex-shrink-0">
                              <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-slate-600`}></i>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-slate-600">Progress</span>
                              <span className="text-xs font-semibold text-slate-900">{skill.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  skill.status === 'completed' ? 'bg-green-500' :
                                  skill.status === 'in-progress' ? 'bg-orange-500' :
                                  'bg-slate-400'
                                }`}
                                style={{ width: `${skill.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Quick Stats */}
                          <div className="flex gap-4 text-xs flex-wrap items-center">
                            {skill.assessmentCompleted && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-1">
                                <i className="fas fa-check-circle"></i>
                                Assessment: {skill.assessmentScore}%
                              </span>
                            )}
                            <span className="text-blue-600">
                              <i className="fab fa-linkedin mr-1"></i>
                              {skill.linkedInPosts.length} {skill.linkedInPosts.length === 1 ? 'Post' : 'Posts'}
                            </span>
                            <span className="text-slate-600">
                              <i className="fas fa-video mr-1"></i>
                              {skill.youtubeLinks.length} {skill.youtubeLinks.length === 1 ? 'Video' : 'Videos'}
                            </span>
                            <span className="text-slate-600">
                              <i className="fas fa-certificate mr-1"></i>
                              {skill.certificates.length} {skill.certificates.length === 1 ? 'File' : 'Files'}
                            </span>
                            <span className="text-purple-600">
                              <i className="fas fa-award mr-1"></i>
                              {skill.testimonials.length} {skill.testimonials.length === 1 ? 'Testimonial' : 'Testimonials'}
                            </span>
                          </div>
                        </button>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="p-4 space-y-4 bg-white">
                            {/* LinkedIn Posts Section */}
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                  <i className="fab fa-linkedin text-blue-600"></i>
                                  LinkedIn Posts
                                  <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold rounded-full">
                                    AI
                                  </span>
                                </h4>
                                <button
                                  onClick={() => handleOpenLinkedInModal(job, skill)}
                                  className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-colors"
                                >
                                  <i className="fas fa-plus mr-1"></i>
                                  Create Post
                                </button>
                              </div>
                              {skill.linkedInPosts.length === 0 ? (
                                <p className="text-sm text-slate-500 italic">No LinkedIn posts yet</p>
                              ) : (
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                  {skill.linkedInPosts.map((post) => (
                                    <div 
                                      key={post.id} 
                                      onClick={() => handleViewLinkedInPost(post)}
                                      className="bg-blue-50 border border-blue-200 rounded-lg p-2 min-w-[140px] max-w-[140px] flex-shrink-0 cursor-pointer hover:bg-blue-100 transition-colors"
                                    >
                                      <div className="flex justify-between items-start gap-1 mb-1">
                                        <i className="fab fa-linkedin text-blue-600 text-sm"></i>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteLinkedInPost(job._id, skill.id, post.id);
                                          }}
                                          className="p-0.5 hover:bg-blue-200 rounded transition-colors"
                                        >
                                          <i className="fas fa-trash text-[10px] text-red-600"></i>
                                        </button>
                                      </div>
                                      <p className="text-xs font-medium text-blue-700 line-clamp-2 mb-1">{post.topic}</p>
                                      <p className="text-[10px] text-slate-500">{post.date}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* YouTube Videos Section */}
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                  <i className="fas fa-video text-red-600"></i>
                                  Learning Videos
                                </h4>
                                <button
                                  onClick={() => handleOpenAddResourceModal(job, skill, 'youtube')}
                                  className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-colors"
                                >
                                  <i className="fas fa-plus mr-1"></i>
                                  Add Video
                                </button>
                              </div>
                              {skill.youtubeLinks.length === 0 ? (
                                <p className="text-sm text-slate-500 italic">No videos yet</p>
                              ) : (
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                  {skill.youtubeLinks.map((video) => (
                                    <a
                                      key={video.id}
                                      href={video.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-red-50 border border-red-200 rounded-lg p-2 min-w-[140px] max-w-[140px] flex-shrink-0 cursor-pointer hover:bg-red-100 transition-colors block no-underline"
                                    >
                                      <div className="flex justify-between items-start gap-1 mb-1">
                                        <i className="fab fa-youtube text-red-600 text-sm"></i>
                                        <button
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleDeleteResource(job._id, skill.id, 'youtube', video.id);
                                          }}
                                          className="p-0.5 hover:bg-red-200 rounded transition-colors"
                                        >
                                          <i className="fas fa-trash text-[10px] text-red-600"></i>
                                        </button>
                                      </div>
                                      <p className="text-xs font-medium text-red-700 line-clamp-2 mb-1">
                                        {video.title}
                                      </p>
                                      <p className="text-[10px] text-slate-500">{video.addedDate}</p>
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Certificates/Files Section */}
                            <div>
                              <div className="mb-3">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                    <i className="fas fa-certificate text-blue-600"></i>
                                    Certificates & Files
                                  </h4>
                                  <button
                                    onClick={() => handleOpenAddResourceModal(job, skill, 'certificate')}
                                    className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-colors"
                                  >
                                    <i className="fas fa-plus mr-1"></i>
                                    Add File
                                  </button>
                                </div>
                                <p className="text-xs text-slate-500 flex items-center gap-2">
                                  <i className="fab fa-google-drive text-green-600"></i> Google Drive
                                  <span className="text-slate-400">|</span>
                                  <i className="fab fa-dropbox text-blue-600"></i> Dropbox
                                </p>
                              </div>
                              {skill.certificates.length === 0 ? (
                                <p className="text-sm text-slate-500 italic">No certificates or files yet</p>
                              ) : (
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                  {skill.certificates.map((cert) => (
                                    <a
                                      key={cert.id}
                                      href={cert.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-blue-50 border border-blue-200 rounded-lg p-2 min-w-[140px] max-w-[140px] flex-shrink-0 cursor-pointer hover:bg-blue-100 transition-colors block no-underline"
                                    >
                                      <div className="flex justify-between items-start gap-1 mb-1">
                                        <i className={`${
                                          cert.type === 'drive' ? 'fab fa-google-drive text-green-600' :
                                          cert.type === 'dropbox' ? 'fab fa-dropbox text-blue-600' :
                                          'fas fa-file text-slate-600'
                                        } text-sm`}></i>
                                        <button
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleDeleteResource(job._id, skill.id, 'certificate', cert.id);
                                          }}
                                          className="p-0.5 hover:bg-blue-200 rounded transition-colors"
                                        >
                                          <i className="fas fa-trash text-[10px] text-red-600"></i>
                                        </button>
                                      </div>
                                      <p className="text-xs font-medium text-blue-700 line-clamp-2 mb-1">
                                        {cert.title}
                                      </p>
                                      <p className="text-[10px] text-slate-500">{cert.addedDate}</p>
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Testimonials Section */}
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                  <i className="fas fa-award text-purple-600"></i>
                                  Testimonials
                                </h4>
                                <button
                                  onClick={() => handleOpenRequestTestimonialModal(job, skill)}
                                  className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs font-medium transition-colors"
                                >
                                  <i className="fas fa-plus mr-1"></i>
                                  Request Testimonial
                                </button>
                              </div>
                              {skill.testimonials.length === 0 ? (
                                <p className="text-sm text-slate-500 italic">No testimonials requested yet</p>
                              ) : (
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                  {skill.testimonials.map((testimonial) => (
                                    <div 
                                      key={testimonial.id}
                                      onClick={() => handleViewTestimonial(testimonial)}
                                      className="bg-purple-50 border border-purple-200 rounded-lg p-2 min-w-[140px] max-w-[140px] flex-shrink-0 cursor-pointer hover:bg-purple-100 transition-colors"
                                    >
                                      <div className="flex justify-between items-start gap-1 mb-2">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                          testimonial.status === 'approved' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-orange-100 text-orange-700'
                                        }`}>
                                          {testimonial.status === 'approved' ? 'Approved' : 'Pending'}
                                        </span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteTestimonial(job._id, skill.id, testimonial.id);
                                          }}
                                          className="p-0.5 hover:bg-purple-200 rounded transition-colors"
                                        >
                                          <i className="fas fa-trash text-[10px] text-red-600"></i>
                                        </button>
                                      </div>
                                      <p className="text-xs font-medium text-purple-700 line-clamp-2 mb-1">
                                        {testimonial.project}
                                      </p>
                                      <p className="text-[10px] text-slate-600 mb-1">{testimonial.validatorName}</p>
                                      <p className="text-[10px] text-slate-500">{testimonial.requestedDate}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
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
        )}
      </div>

      {/* Add Resource Modal */}
      <AddResourceModal
        isOpen={isAddResourceModalOpen}
        onClose={handleCloseResourceModal}
        resourceType={resourceType}
        selectedSkill={selectedSkill}
        resourceTitle={resourceTitle}
        setResourceTitle={setResourceTitle}
        resourceUrl={resourceUrl}
        setResourceUrl={setResourceUrl}
        resourceNote={resourceNote}
        setResourceNote={setResourceNote}
        onAddResource={handleAddResource}
      />

      {/* Request Testimonial Modal */}
      <RequestTestimonialModal
        isOpen={isRequestTestimonialModalOpen}
        onClose={handleCloseTestimonialModal}
        selectedSkill={selectedSkill}
        testimonialProject={testimonialProject}
        setTestimonialProject={setTestimonialProject}
        validatorName={validatorName}
        setValidatorName={setValidatorName}
        validatorEmail={validatorEmail}
        setValidatorEmail={setValidatorEmail}
        validatorRole={validatorRole}
        setValidatorRole={setValidatorRole}
        personalMessage={personalMessage}
        setPersonalMessage={setPersonalMessage}
        onRequestTestimonial={handleRequestTestimonial}
      />

      {/* View Testimonial Modal */}
      <ViewTestimonialModal
        isOpen={isViewTestimonialModalOpen}
        onClose={handleCloseViewTestimonialModal}
        selectedTestimonial={selectedTestimonial}
      />

      {/* View Note Modal */}
      <ViewNoteModal
        isOpen={isViewNoteModalOpen}
        onClose={handleCloseViewNoteModal}
        selectedNote={selectedNote}
      />

      {/* LinkedIn Post Creation Modal */}
      {isLinkedInModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fab fa-linkedin text-white text-2xl"></i>
                <h2 className="text-xl font-bold text-white">LinkedIn Post Maker</h2>
                <span className="px-2 py-1 bg-white text-purple-600 text-xs font-bold rounded-full">
                  AI Powered
                </span>
              </div>
              <button
                onClick={handleCloseLinkedInModal}
                className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-colors"
              >
                <i className="fas fa-times text-white"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Input Section */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  What would you like to post about? *
                </label>
                <textarea
                  value={linkedInTopic}
                  onChange={(e) => setLinkedInTopic(e.target.value)}
                  placeholder="E.g., Completed React certification, Built an e-commerce project, Learned advanced hooks..."
                  className="w-full p-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  rows={3}
                />
                <p className="text-xs text-slate-500 mt-1">
                  <i className="fas fa-magic mr-1"></i>
                  AI will generate an engaging LinkedIn post with text and image
                </p>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateLinkedInPost}
                disabled={isGenerating || !linkedInTopic.trim()}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Generating AI Content...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic"></i>
                    Generate LinkedIn Post
                  </>
                )}
              </button>

              {/* Generated Content */}
              {generatedPostText && generatedImageUrl && (
                <div className="space-y-4">
                  <div className="border-t-2 border-slate-200 pt-4">
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-600"></i>
                      Generated Post Content
                    </h3>

                    {/* Post Text */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-slate-700">Post Text</label>
                        <button
                          onClick={() => handleCopyText(generatedPostText)}
                          className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          <i className="fas fa-copy"></i>
                          Copy Text
                        </button>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 whitespace-pre-wrap text-sm text-slate-700 text-left max-h-64 overflow-y-auto">
                        {generatedPostText}
                      </div>
                    </div>

                    {/* Post Image */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-slate-700">Post Image</label>
                        <button
                          onClick={() => handleDownloadImage(generatedImageUrl)}
                          className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          <i className="fas fa-download"></i>
                          Download Image
                        </button>
                      </div>
                      <div className="bg-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                        <img src={generatedImageUrl} alt="Generated post image" className="w-full" />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSaveLinkedInPost}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-save"></i>
                    Save LinkedIn Post
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LinkedIn Post View Modal */}
      {selectedLinkedInPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fab fa-linkedin text-white text-2xl"></i>
                <h2 className="text-lg font-bold text-white">LinkedIn Post</h2>
              </div>
              <button
                onClick={handleCloseViewLinkedInPost}
                className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-colors"
              >
                <i className="fas fa-times text-white"></i>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Topic */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">TOPIC</label>
                <p className="text-lg font-bold text-slate-900">{selectedLinkedInPost.topic}</p>
              </div>

              {/* Post Text */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-500">POST TEXT</label>
                  <button
                    onClick={() => handleCopyText(selectedLinkedInPost.postText)}
                    className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <i className="fas fa-copy"></i>
                    Copy
                  </button>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 whitespace-pre-wrap text-sm text-slate-700 text-left max-h-96 overflow-y-auto">
                  {selectedLinkedInPost.postText}
                </div>
              </div>

              {/* Post Image */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-500">POST IMAGE</label>
                  <button
                    onClick={() => handleDownloadImage(selectedLinkedInPost.imageUrl)}
                    className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <i className="fas fa-download"></i>
                    Download
                  </button>
                </div>
                <div className="bg-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                  <img src={selectedLinkedInPost.imageUrl} alt="Post image" className="w-full" />
                </div>
              </div>

              {/* Date */}
              <div className="text-xs text-slate-500">
                <i className="fas fa-calendar mr-1"></i>
                Created on {selectedLinkedInPost.date}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SkillPlanner;

