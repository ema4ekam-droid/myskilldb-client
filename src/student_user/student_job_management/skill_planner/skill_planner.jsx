import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import StudentMenuNavigation from '../../../components/student-components/student-menu-components/StudentMenuNavigation';
import LoaderOverlay from '../../../components/loader/LoaderOverlay';
import { getRequest, postRequest } from '../../../api/apiRequests';
import {
  AddResourceModal,
  RequestTestimonialModal,
  ViewTestimonialModal,
  ViewNoteModal,
  CameraRecorder
} from '../../../components/student-components/student-job-management-components/skill-planner-components';

import {
  AIGenerationLoader,
  AssessmentReviewModal,
  AddVideoModal,
  VideosListModal,
  TestimonialsListModal,
  LinkedInPostsModal,
  LearningModuleReader,
  VideoScriptViewer,
  ViewAllResourcesModal,
  CreateLinkedInPostModal
} from '../../../components/student-components/student-job-management-components/skill-planner-components/modals';

const SkillPlanner = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
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
  const [resourceType, setResourceType] = useState('youtube');
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);
  const [selectedLinkedInPost, setSelectedLinkedInPost] = useState(null);
  const [showVideoScriptModal, setShowVideoScriptModal] = useState(false);
  const [showModuleReaderModal, setShowModuleReaderModal] = useState(false);
  const [showAssessmentReviewModal, setShowAssessmentReviewModal] = useState(false);
  const [showVideosModal, setShowVideosModal] = useState(false);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [showLinkedInPostsModal, setShowLinkedInPostsModal] = useState(false);
  const [showViewAllResourcesModal, setShowViewAllResourcesModal] = useState(false);
  const [showCameraRecorder, setShowCameraRecorder] = useState(false);
  const [showScriptGeneratorModal, setShowScriptGeneratorModal] = useState(false);
  const [showCertificatesModal, setShowCertificatesModal] = useState(false);
  const [showAddCertificateModal, setShowAddCertificateModal] = useState(false);
  const [showVideoScriptsModal, setShowVideoScriptsModal] = useState(false);
  const [scriptIdea, setScriptIdea] = useState('');
  const [videoLength, setVideoLength] = useState('5-7'); // '2-3', '5-7', or '8-10'
  const [readerMode, setReaderMode] = useState(false);
  const [generatedModule, setGeneratedModule] = useState(null);
  const [generatedVideoScript, setGeneratedVideoScript] = useState(null);
  const [generationType, setGenerationType] = useState(''); // 'module' or 'script'
  
  // Certificate form states
  const [certificateTitle, setCertificateTitle] = useState('');
  const [certificateLink, setCertificateLink] = useState('');
  const [certificateProvider, setCertificateProvider] = useState('drive'); // 'drive' or 'dropbox'
  
  // Form states
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceNote, setResourceNote] = useState('');
  
  // Video Form states
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  
  // LinkedIn Post Form states
  const [showCreateLinkedInPostModal, setShowCreateLinkedInPostModal] = useState(false);
  const [linkedInPostTopic, setLinkedInPostTopic] = useState('');
  const [linkedInPostContext, setLinkedInPostContext] = useState('');
  const [generatedLinkedInPost, setGeneratedLinkedInPost] = useState('');
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
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
  
  // Planner jobs data
  const [plannerJobs, setPlannerJobs] = useState([]);

  useEffect(() => {
    if (user?._id) {
      fetchSkillPlannerJobs();
    } else {
      setIsLoading(false);
    }
  }, [user?._id]);

  const fetchSkillPlannerJobs = async () => {
    if (!user?._id) return;
    
    try {
      setIsLoading(true);
      const response = await getRequest('/skill-planner');
      
      if (response.data?.success && response.data?.data) {
        const plannerEntries = response.data.data; // Contains both jobId and _id (skillPlannerId)
        
        // Fetch full job details for each job ID
        const jobsPromises = plannerEntries.map(async (plannerEntry) => {
          const jobId = plannerEntry.jobId;
          const skillPlannerId = plannerEntry._id;
          try {
            // Fetch job details
            const jobResponse = await getRequest(`/jobs/${jobId}`);
            if (jobResponse.data?.success && jobResponse.data?.data) {
              const jobData = jobResponse.data.data;
              
              // Fetch topics (skills) for this job
              let skills = [];
              try {
                const topicsResponse = await getRequest(`/topics/job/${jobId}`);
                if (topicsResponse.data?.success && topicsResponse.data?.data) {
                  // Transform topics to skills format and check for existing reading modules
                  const skillsPromises = topicsResponse.data.data.map(async (topic, index) => {
                    let hasReadingModule = false;
                    let existingModule = null;
                    
                    // Check if reading module exists for this job and topic
                    try {
                      const moduleResponse = await getRequest(`/reading-modules?jobId=${jobId}&topicId=${topic._id}`);
                      if (moduleResponse.data?.success && moduleResponse.data?.data) {
                        hasReadingModule = true;
                        existingModule = moduleResponse.data.data;
                      }
                    } catch (error) {
                      // Module doesn't exist, which is fine
                    }

                    return {
                      id: topic._id || `skill-${index}`,
                      name: topic.name || topic.title || 'Skill',
                      status: 'not-started',
                      progress: 0,
                      assessmentCompleted: false,
                      hoursInvested: 0,
                      estimatedHoursLeft: 0,
                      linkedInPosts: [],
                      youtubeLinks: [],
                      certificates: [],
                      testimonials: [],
                      assessments: [],
                      readingModules: hasReadingModule ? [existingModule] : [],
                      videoScripts: [],
                      hasReadingModule: hasReadingModule,
                      existingReadingModule: existingModule
                    };
                  });
                  
                  skills = await Promise.all(skillsPromises);
                }
              } catch (error) {
                console.error('Error fetching topics for job:', jobId, error);
              }
              
              // Transform API data to match component's expected format
              return {
                _id: jobData._id,
                title: jobData.name || jobData.title || 'Job Title',
                company: jobData.companyName || jobData.company || 'Company',
                targetDate: jobData.targetDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 90 days from now
                priority: jobData.priority || 'medium',
                skillPlannerId: skillPlannerId,
                skills: skills.length > 0 ? skills : []
              };
            }
            return null;
          } catch (error) {
            console.error('Error fetching job details:', jobId, error);
            return null;
          }
        });
        
        const fetchedJobs = await Promise.all(jobsPromises);
        const validJobs = fetchedJobs.filter(job => job !== null);
        
        setPlannerJobs(validJobs);
      } else {
        setPlannerJobs([]);
      }
    } catch (error) {
      console.error('Error fetching skill planner jobs:', error);
      toast.error('Failed to load skill planner jobs');
      setPlannerJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

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

  const getTotalJobs = () => {
    return plannerJobs.length;
  };

  const getTotalSkillsWorkingOn = () => {
    return plannerJobs.reduce((total, job) => {
      return total + job.skills.filter(skill => skill.status === 'in-progress' || skill.status === 'completed').length;
    }, 0);
  };

  const getTotalSkillContentCreated = () => {
    return plannerJobs.reduce((total, job) => {
      return total + job.skills.reduce((sum, skill) => {
        const content = (skill.readingModules?.length || 0) + 
                       (skill.videoScripts?.length || 0) + 
                       (skill.linkedInPosts?.length || 0) + 
                       (skill.youtubeLinks?.length || 0);
        return sum + content;
      }, 0);
    }, 0);
  };

  const getSkillsWithTestimonials = () => {
    return plannerJobs.reduce((total, job) => {
      return total + job.skills.filter(skill => 
        skill.testimonials && skill.testimonials.length > 0
      ).length;
    }, 0);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-slate-600 bg-slate-50 border-slate-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  // View Existing Module Handler
  const handleViewModule = async (job, skill) => {
    if (!skill?.existingReadingModule) {
      toast.error('Module not found');
      return;
    }

    setSelectedJob(job);
    setSelectedSkill(skill);
    
    // Transform database module to display format
    const module = {
      skillName: skill.existingReadingModule.skillName,
      jobContext: skill.existingReadingModule.jobContext,
      introduction: skill.existingReadingModule.introduction,
      keyConcepts: skill.existingReadingModule.keyConcepts,
      practicalExample: skill.existingReadingModule.practicalExample,
      summary: skill.existingReadingModule.summary
    };

    setGeneratedModule(module);
    setReaderMode(true);
  };

  // Generate Module Handler
  const handleGenerateModule = async (job, skill) => {
    if (!user?._id || !job?._id || !skill?.id) {
      toast.error('Unable to generate module. Missing required information.');
      return;
    }

    setSelectedJob(job);
    setSelectedSkill(skill);
    setIsGenerating(true);
    setGenerationType('module');
    setReaderMode(true);
    
    try {
      // Generate module content (simulating AI generation)
      const module = {
        skillName: skill.name,
        jobContext: job.title,
        introduction: `${skill.name} is a crucial skill for ${job.title} roles. This technology enables developers to build modern, efficient applications that meet industry standards. Understanding this skill will help you excel in your career path and stand out in job interviews.`,
        keyConcepts: [
          {
            title: 'Core Fundamentals',
            content: `The foundation of ${skill.name} involves understanding the basic principles and architecture. These fundamentals form the building blocks for more advanced topics. Mastering these concepts will give you a solid base to build upon.`
          },
          {
            title: 'Best Practices',
            content: `Industry-standard approaches to ${skill.name} include following established patterns, maintaining code quality, and ensuring scalability. Professional developers follow these practices to write clean, maintainable code.`
          },
          {
            title: 'Common Patterns',
            content: `Learn the most frequently used patterns and techniques that professionals use when working with ${skill.name} in real-world projects. These patterns solve common problems efficiently.`
          },
          {
            title: 'Real-World Applications',
            content: `Understanding how ${skill.name} is applied in production environments helps you see the practical value. Top companies use these techniques to build reliable, scalable applications.`
          }
        ],
        practicalExample: `// Example implementation of ${skill.name}\n\nfunction demonstrateSkill() {\n  console.log("Practical example for ${skill.name}");\n  \n  // Core implementation\n  const result = processData();\n  \n  return result;\n}\n\n// Usage\nconst output = demonstrateSkill();\nconsole.log(output);`,
        summary: [
          `${skill.name} is essential for ${job.title} roles`,
          'Understanding core concepts leads to better implementations',
          'Practice with real-world examples solidifies knowledge',
          'Following best practices ensures code quality',
          'Continuous learning keeps skills relevant'
        ]
      };

      // Save to database
      const response = await postRequest('/reading-modules', {
        jobId: job._id,
        topicId: skill.id,
        skillName: module.skillName,
        jobContext: module.jobContext,
        introduction: module.introduction,
        keyConcepts: module.keyConcepts,
        practicalExample: module.practicalExample,
        summary: module.summary
      });

      if (response.data?.success) {
        setGeneratedModule(module);
        toast.success('Learning module generated and saved successfully!');
        // Refresh the jobs to update the hasReadingModule flag
        fetchSkillPlannerJobs();
      } else {
        if (response.data?.message?.includes('already exists')) {
          toast.info('Module already exists. Loading existing module...');
          // Fetch and show existing module
          try {
            const moduleResponse = await getRequest(`/reading-modules?jobId=${job._id}&topicId=${skill.id}`);
            if (moduleResponse.data?.success && moduleResponse.data?.data) {
              const existingModule = moduleResponse.data.data;
              setGeneratedModule({
                skillName: existingModule.skillName,
                jobContext: existingModule.jobContext,
                introduction: existingModule.introduction,
                keyConcepts: existingModule.keyConcepts,
                practicalExample: existingModule.practicalExample,
                summary: existingModule.summary
              });
              fetchSkillPlannerJobs();
            }
          } catch (error) {
            console.error('Error fetching existing module:', error);
          }
        } else {
          toast.error(response.data?.message || 'Failed to save module');
          setGeneratedModule(module); // Still show the module even if save fails
        }
      }
    } catch (error) {
      console.error('Error generating module:', error);
      toast.error('Failed to generate module');
    } finally {
      setIsGenerating(false);
      setGenerationType('');
    }
  };

  const handleCloseReader = () => {
    setReaderMode(false);
    setGeneratedModule(null);
    setGeneratedVideoScript(null);
  };

  // Generate Video Script Handler - Show Modal
  const handleGenerateVideoScript = (job, skill) => {
    setSelectedJob(job);
    setSelectedSkill(skill);
    setScriptIdea('');
    setVideoLength('5-7');
    setShowScriptGeneratorModal(true);
  };

  // View Video Scripts Handler
  const handleViewVideoScripts = (job, skill) => {
    setSelectedJob(job);
    setSelectedSkill(skill);
    setShowVideoScriptsModal(true);
  };

  // Handle Script Generation with Vertex AI
  const handleGenerateScript = async () => {
    if (!selectedSkill || !selectedJob) {
      toast.error('Please select a skill and job');
      return;
    }

    if (!scriptIdea.trim()) {
      toast.error('Please enter a specific idea or focus for the video script');
      return;
    }

    if (!selectedJob.skillPlannerId) {
      toast.error('Skill planner ID is missing');
      return;
    }

    setShowScriptGeneratorModal(false);
    setIsGenerating(true);
    setGenerationType('script');
    
    try {
      const durationMap = {
        '2-3': '2-3 minutes',
        '5-7': '5-7 minutes',
        '8-10': '8-10 minutes'
      };

      // Generate sections (this would normally come from AI, but keeping the same structure for now)
      const sections = [
        {
          time: '0:00 - 0:30',
          title: 'Hook & Introduction',
          content: `"Hey everyone! Today I'm going to share everything I've learned about ${selectedSkill.name}${scriptIdea ? `, specifically focusing on ${scriptIdea}` : ''}. If you're preparing for a ${selectedJob.title} role, this is essential knowledge you need to master. By the end of this video, you'll understand the core concepts and how to apply them in real projects."`
        },
        {
          time: '0:30 - 1:30',
          title: `What is ${selectedSkill.name}?`,
          content: `"Let me start by explaining what ${selectedSkill.name} actually is and why it matters${scriptIdea ? `, especially when it comes to ${scriptIdea}` : ''}. This is particularly important for ${selectedJob.title} because it's a fundamental skill that employers look for."`
        },
        {
          time: '1:30 - 3:30',
          title: 'Key Concepts',
          content: `"Now let's dive into the most important concepts you need to know. I'll walk you through each one with examples that relate to real-world scenarios${scriptIdea ? `, particularly around ${scriptIdea}` : ''}."`
        },
        ...(videoLength !== '2-3' ? [
          {
            time: videoLength === '5-7' ? '3:30 - 5:00' : '3:30 - 6:00',
            title: 'Practical Examples',
            content: `"Let me show you how this works in practice. I'll demonstrate with a real example that shows ${selectedSkill.name} in action${scriptIdea ? `, focusing on ${scriptIdea}` : ''}."`
          }
        ] : []),
        ...(videoLength === '8-10' ? [
          {
            time: '6:00 - 8:00',
            title: 'Best Practices & Tips',
            content: `"Here are some best practices and pro tips that will help you master ${selectedSkill.name}. These are insights I've learned through my journey and from industry professionals."`
          }
        ] : []),
        {
          time: videoLength === '2-3' ? '2:30 - 3:00' : videoLength === '5-7' ? '5:00 - 5:30' : '8:00 - 8:30',
          title: 'Closing',
          content: `"Thanks for watching! If you found this helpful, please like and subscribe. Drop a comment below with your questions about ${selectedSkill.name}, and I'll answer them. Keep learning and keep building!"`
        }
      ];

      // Call API to create video script
      const response = await postRequest('/video-scripts', {
        jobId: selectedJob._id,
        topicId: selectedSkill.id,
        skillPlannerId: selectedJob.skillPlannerId,
        userIdea: scriptIdea.trim(),
        selectedLength: durationMap[videoLength],
        sections: sections
      });

      if (response.data?.success) {
        // Transform response to match frontend format
        const script = {
          duration: durationMap[videoLength],
          sections: sections,
          generatedAt: new Date().toISOString(),
          userIdea: scriptIdea.trim(),
          selectedLength: durationMap[videoLength]
        };
        
        setGeneratedVideoScript(script);
        setShowVideoScriptModal(true);
        toast.success('Video script generated and saved successfully!');
      } else {
        // Check if it's a duplicate error
        if (response.data?.message?.includes('already exists')) {
          toast.error('A video script with this idea already exists for this skill and topic');
        } else {
          toast.error(response.data?.message || 'Failed to generate video script');
        }
      }
    } catch (error) {
      console.error('Error generating video script:', error);
      toast.error('Failed to generate video script');
    } finally {
      setIsGenerating(false);
      setGenerationType('');
    }
  };

  // Handle Create LinkedIn Post
  const handleCreateLinkedInPost = (job, skill) => {
    setSelectedJob(job);
    setSelectedSkill(skill);
    setLinkedInPostTopic('');
    setLinkedInPostContext('');
    setGeneratedLinkedInPost('');
    setShowCreateLinkedInPostModal(true);
  };

  // Handle Add Video
  const handleAddVideo = (job, skill) => {
    setSelectedJob(job);
    setSelectedSkill(skill);
    setVideoTitle('');
    setVideoUrl('');
    setVideoDescription('');
    setShowAddVideoModal(true);
  };

  // Save Video
  const handleSaveVideo = () => {
    if (!videoTitle.trim() || !videoUrl.trim()) {
      toast.error('Please enter video title and URL');
      return;
    }

    // Validate YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(videoUrl)) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }

    const newVideo = {
      id: Date.now(),
      title: videoTitle.trim(),
      url: videoUrl.trim(),
      description: videoDescription.trim(),
      addedAt: new Date().toISOString()
    };

    // Update the plannerJobs state to add the video
    setPlannerJobs(prevJobs => 
      prevJobs.map(job => {
        if (job.id === selectedJob.id) {
          return {
            ...job,
            skills: job.skills.map(skill => {
              if (skill.name === selectedSkill.name) {
                return {
                  ...skill,
                  youtubeLinks: [...(skill.youtubeLinks || []), newVideo]
                };
              }
              return skill;
            })
          };
        }
        return job;
      })
    );

    setShowAddVideoModal(false);
    setVideoTitle('');
    setVideoUrl('');
    setVideoDescription('');
    toast.success('Video added successfully!');
  };

  // Generate LinkedIn Post
  const handleGenerateLinkedInPost = () => {
    if (!linkedInPostTopic.trim()) {
      toast.error('Please enter what your post is about');
      return;
    }

    setIsGeneratingPost(true);
    
    setTimeout(() => {
      const companyName = selectedJob?.company || 'MySkillDB';
      const jobName = selectedJob?.title || 'Career Development';
      const skillName = selectedSkill?.name || '';
      
      const post = `🚀 Excited to share my journey in ${skillName}!

${linkedInPostTopic}

${linkedInPostContext ? linkedInPostContext + '\n\n' : ''}As I work towards my goal of becoming a ${jobName}, mastering ${skillName} has been a game-changer. The learning process has been challenging but incredibly rewarding.

Key takeaways so far:
✅ Understanding the core fundamentals
✅ Applying concepts to real-world projects  
✅ Building a strong foundation for career growth

Grateful for the learning resources and support from the MySkillDB community. Every step forward counts!

#${companyName.replace(/\s+/g, '')} #${jobName.replace(/\s+/g, '')} #${skillName.replace(/\s+/g, '')} #MySkillDB #CareerGrowth #LearningJourney #TechCareers #SkillDevelopment #ProfessionalDevelopment`;

      setGeneratedLinkedInPost(post);
      setIsGeneratingPost(false);
      toast.success('LinkedIn post generated successfully!');
    }, 2000);
  };

  // Copy LinkedIn Post to Clipboard
  const handleCopyLinkedInPost = () => {
    navigator.clipboard.writeText(generatedLinkedInPost);
    toast.success('Post copied to clipboard!');
  };

  // Add Certificate
  const handleSaveCertificate = () => {
    if (!certificateTitle.trim() || !certificateLink.trim()) {
      toast.error('Please enter certificate title and link');
      return;
    }

    // Basic URL validation
    try {
      new URL(certificateLink);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    const newCertificate = {
      id: Date.now(),
      title: certificateTitle.trim(),
      url: certificateLink.trim(),
      provider: certificateProvider,
      addedAt: new Date().toISOString()
    };

    // Update the plannerJobs state to add the certificate
    setPlannerJobs(prevJobs => 
      prevJobs.map(job => {
        if (job._id === selectedJob._id) {
          return {
            ...job,
            skills: job.skills.map(skill => {
              if (skill.id === selectedSkill.id) {
                return {
                  ...skill,
                  certificates: [...(skill.certificates || []), newCertificate]
                };
              }
              return skill;
            })
          };
        }
        return job;
      })
    );

    setShowAddCertificateModal(false);
    setCertificateTitle('');
    setCertificateLink('');
    setCertificateProvider('drive');
    toast.success('Certificate added successfully!');
  };

  // Delete Certificate
  const handleDeleteCertificate = (certificateId) => {
    setPlannerJobs(prevJobs => 
      prevJobs.map(job => {
        if (job._id === selectedJob._id) {
          return {
            ...job,
            skills: job.skills.map(skill => {
              if (skill.id === selectedSkill.id) {
                return {
                  ...skill,
                  certificates: skill.certificates.filter(cert => cert.id !== certificateId)
                };
              }
              return skill;
            })
          };
        }
        return job;
      })
    );
    toast.success('Certificate deleted successfully!');
  };

  // Save LinkedIn Post
  const handleSaveLinkedInPost = () => {
    // In a real app, this would save to backend
    toast.success('LinkedIn post saved successfully!');
    setShowCreateLinkedInPostModal(false);
    setLinkedInPostTopic('');
    setLinkedInPostContext('');
    setGeneratedLinkedInPost('');
  };

  return (
    <>
      <LoaderOverlay isVisible={isLoading} title="Skill Planner" subtitle="Loading your learning journey..." />
      <StudentMenuNavigation currentPage={currentPage} onPageChange={handlePageChange} />
      
      <div className="min-h-screen bg-slate-50 lg:ml-72 p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Skill Planner</h1>
          <p className="text-sm text-slate-600 mb-3">work on your skills</p>
          <button
            onClick={() => navigate('/student/jobs')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Add Job Skills
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex w-12 h-12 bg-indigo-100 rounded-lg items-center justify-center">
                <i className="fas fa-briefcase text-indigo-600 text-xl"></i>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-600">Jobs</p>
                <p className="text-sm text-slate-500">Under Planning</p>
                <p className="text-2xl font-bold text-slate-900 lg:text-slate-900">
                  <span className="lg:bg-transparent bg-indigo-100 text-indigo-600 lg:text-slate-900 px-3 py-1 rounded-lg inline-block">{getTotalJobs()}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex w-12 h-12 bg-blue-100 rounded-lg items-center justify-center">
                <i className="fas fa-tasks text-blue-600 text-xl"></i>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-600">Skills</p>
                <p className="text-sm text-slate-500">Working On</p>
                <p className="text-2xl font-bold text-slate-900 lg:text-slate-900">
                  <span className="lg:bg-transparent bg-blue-100 text-blue-600 lg:text-slate-900 px-3 py-1 rounded-lg inline-block">{getTotalSkillsWorkingOn()}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex w-12 h-12 bg-purple-100 rounded-lg items-center justify-center">
                <i className="fas fa-layer-group text-purple-600 text-xl"></i>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-600">Skill Content</p>
                <p className="text-sm text-slate-500">Created</p>
                <p className="text-2xl font-bold text-slate-900 lg:text-slate-900">
                  <span className="lg:bg-transparent bg-purple-100 text-purple-600 lg:text-slate-900 px-3 py-1 rounded-lg inline-block">{getTotalSkillContentCreated()}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex w-12 h-12 bg-amber-100 rounded-lg items-center justify-center">
                <i className="fas fa-award text-amber-600 text-xl"></i>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-600">Skills With</p>
                <p className="text-sm text-slate-500">Testimonials</p>
                <p className="text-2xl font-bold text-slate-900 lg:text-slate-900">
                  <span className="lg:bg-transparent bg-amber-100 text-amber-600 lg:text-slate-900 px-3 py-1 rounded-lg inline-block">{getSkillsWithTestimonials()}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        {plannerJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-briefcase text-slate-400 text-3xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Jobs in Your Planner</h3>
            <p className="text-sm text-slate-600 mb-4">
              Add jobs from the Job Board to start planning your skill development
            </p>
            <button
              onClick={() => navigate('/student/jobs')}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {plannerJobs.map((job) => {
              const isExpanded = isJobExpanded(job._id);
              return (
                <div key={job._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  {/* Job Header */}
                  <div className="border-b border-slate-200">
                    {/* Mobile Layout */}
                    <button 
                      onClick={() => toggleJobExpansion(job._id)}
                      className="lg:hidden w-full text-left"
                    >
                      {/* Top Colored Section - Job & Company */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h2 className="text-lg font-bold text-slate-900 mb-1">{job.title}</h2>
                            <p className="text-sm text-slate-600 mb-2">{job.company}</p>
                          </div>
                          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-slate-400 text-xl ml-2`}></i>
                        </div>
                      </div>
                      
                      {/* Status & Info */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border ${getPriorityColor(job.priority)}`}>
                            <i className="fas fa-flag"></i>
                            {job.priority.toUpperCase()}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                              <i className="fas fa-calendar"></i>
                              {job.targetDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <i className="fas fa-list-check"></i>
                              {job.skills.length} Skills
                            </span>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate-700">Progress</span>
                            <span className="text-xs font-semibold text-indigo-600">50%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all"
                              style={{ width: '50%' }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Desktop Layout */}
                    <button 
                      onClick={() => toggleJobExpansion(job._id)}
                      className="hidden lg:block w-full text-left hover:bg-slate-50 transition-colors"
                    >
                      {/* Job Title and Company with Background */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h2 className="text-xl font-bold text-slate-900 mb-1">{job.title}</h2>
                            <p className="text-sm text-slate-600 mb-3">{job.company}</p>
                          </div>
                          <div className="px-4 py-2 bg-white text-slate-700 rounded-lg font-medium flex items-center gap-2 shadow-sm">
                            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
                            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">Overall Progress</span>
                          <span className="text-sm font-semibold text-slate-900">50%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all"
                            style={{ width: '50%' }}
                          ></div>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Skills List */}
                  {isExpanded && (
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Skills to Master</h3>
                      <div className="space-y-4">
                        {job.skills.map((skill) => {
                          const skillExpanded = isSkillExpanded(job._id, skill.id);
                          return (
                            <div key={skill.id} className="border border-slate-200 rounded-lg overflow-hidden">
                              {/* Skill Header */}
                              <button
                                onClick={() => toggleSkillExpansion(job._id, skill.id)}
                                className="w-full bg-slate-50 p-4 hover:bg-slate-100 transition-colors text-left"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-slate-900 mb-2">{skill.name}</h4>
                                    <div className="flex items-center gap-3 flex-wrap">
                                      {skill.assessmentCompleted && (
                                        <span className="flex items-center gap-1 text-green-600 font-medium text-xs">
                                          <i className="fas fa-check-circle"></i>
                                          Assessment: {skill.assessmentScore}%
                                        </span>
                                      )}
                                      {!skill.assessmentCompleted && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            navigate('/student/job-assessments');
                                          }}
                                          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium text-xs underline"
                                        >
                                          <i className="fas fa-clipboard-check"></i>
                                          Take Assessment
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <i className={`fas fa-chevron-${skillExpanded ? 'up' : 'down'} text-slate-400`}></i>
                                </div>
                              </button>

                              {/* Skill Details */}
                              {skillExpanded && (
                                <div className="p-4 bg-slate-50 border-t border-slate-200">
                                  <div className="relative">
                                    {/* Scroll indicator - only visible on mobile */}
                                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none z-10 lg:hidden"></div>
                                    
                                    <div className="flex lg:grid lg:grid-cols-3 gap-4 lg:gap-6 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 snap-x snap-mandatory scrollbar-hide">
                                      {/* Learning Resources */}
                                      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 flex-shrink-0 w-[85%] lg:w-auto snap-start">
                                        <div className="mb-5">
                                          <h5 className="font-semibold text-slate-900 text-xs tracking-wide flex items-center gap-2">
                                            <i className="fas fa-graduation-cap text-indigo-600"></i>
                                            Learning resources
                                          </h5>
                                          <p className="text-slate-500 text-[11px] mt-1" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 100 }}>
                                            AI-powered content to accelerate your learning
                                          </p>
                                        </div>
                                        
                                        {/* Reading Modules */}
                                        <div className="mb-4">
                                          <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                              <i className="fas fa-book text-slate-600 text-sm"></i>
                                              <span className="text-xs font-medium text-slate-700">Reading Modules</span>
                                              <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[9px] font-semibold">AI</span>
                                            </div>
                                            <span className="text-xs text-slate-500 font-medium">{skill.readingModules?.length || 0}</span>
                                          </div>
                                          {skill.hasReadingModule ? (
                                            <button
                                              onClick={() => handleViewModule(job, skill)}
                                              className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg font-semibold transition-colors shadow-sm"
                                            >
                                              View Module
                                            </button>
                                          ) : (
                                            <button
                                              onClick={() => handleGenerateModule(job, skill)}
                                              className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg font-semibold transition-colors shadow-sm"
                                            >
                                              Generate
                                            </button>
                                          )}
                                        </div>

                                        <div className="border-t border-slate-100 my-4"></div>

                                        {/* Video Scripts */}
                                        <div className="mb-4">
                                          <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                              <i className="fas fa-video text-slate-600 text-sm"></i>
                                              <span className="text-xs font-medium text-slate-700">Video Scripts</span>
                                              <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[9px] font-semibold">AI</span>
                                            </div>
                                            <span className="text-xs text-slate-500 font-medium">{skill.videoScripts?.length || 0}</span>
                                          </div>
                                          <button
                                            onClick={() => handleGenerateVideoScript(job, skill)}
                                            className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg font-semibold transition-colors shadow-sm mb-2"
                                          >
                                            Generate Script
                                          </button>
                                          <button
                                            onClick={() => {
                                              setSelectedSkill(skill);
                                              setSelectedJob(job);
                                              setShowViewAllResourcesModal(true);
                                            }}
                                            className="w-full text-center text-indigo-600 hover:text-indigo-800 text-xs font-medium transition-colors py-2"
                                          >
                                            View All Scripts
                                          </button>
                                        </div>
                                      </div>

                                      {/* Evidence & Proof */}
                                      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 flex-shrink-0 w-[85%] lg:w-auto snap-start">
                                        <div className="mb-5">
                                          <h5 className="font-semibold text-slate-900 text-xs tracking-wide flex items-center gap-2">
                                            <i className="fas fa-certificate text-green-600"></i>
                                            Evidence & proof
                                          </h5>
                                          <p className="text-slate-500 text-[11px] mt-1" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 100 }}>
                                            Validate your skills with assessments and testimonials
                                          </p>
                                        </div>
                                        
                                        {/* Assessments */}
                                        <div className="mb-4">
                                          <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                              <i className="fas fa-clipboard-check text-slate-600 text-sm"></i>
                                              <span className="text-xs font-medium text-slate-700">Assessment</span>
                                            </div>
                                            {skill.assessmentCompleted && (
                                              <span className="text-xs font-semibold text-green-600">{skill.assessmentScore}%</span>
                                            )}
                                          </div>
                                          {!skill.assessmentCompleted ? (
                                            <button
                                              onClick={() => navigate('/student/job-assessments')}
                                              className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg font-semibold transition-colors shadow-sm"
                                            >
                                              Take Assessment
                                            </button>
                                          ) : (
                                            <button
                                              onClick={() => {
                                                setSelectedSkill(skill);
                                                setShowAssessmentReviewModal(true);
                                              }}
                                              className="w-full px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs rounded-lg font-medium transition-colors"
                                            >
                                              Review Results
                                            </button>
                                          )}
                                        </div>

                                        <div className="border-t border-slate-100 my-4"></div>

                                        {/* Testimonials */}
                                        <div className="mb-4">
                                          <div className="mb-3">
                                            <div className="flex items-center gap-2 mb-1">
                                              <i className="fas fa-award text-slate-600 text-sm"></i>
                                              <span className="text-xs font-medium text-slate-700">Testimonials</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                              <span className="text-slate-500 font-medium">
                                                {skill.testimonials?.filter(t => t.status === 'approved').length || 0} Approved
                                              </span>
                                              <span className="text-slate-300">·</span>
                                              <span className="text-orange-600 font-semibold">
                                                {skill.testimonials?.filter(t => t.status === 'pending').length || 0} Pending
                                              </span>
                                            </div>
                                          </div>
                                          <div className="flex gap-2">
                                            {skill.testimonials && skill.testimonials.length > 0 && (
                                              <button
                                                onClick={() => {
                                                  setSelectedSkill(skill);
                                                  setIsViewTestimonialModalOpen(true);
                                                }}
                                                className="flex-1 px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                              >
                                                <i className="fas fa-eye lg:hidden"></i>
                                                <span className="hidden lg:inline">View All ({skill.testimonials.length})</span>
                                              </button>
                                            )}
                                            <button
                                              onClick={() => {
                                                setSelectedJob(job);
                                                setSelectedSkill(skill);
                                                setIsRequestTestimonialModalOpen(true);
                                              }}
                                              className={`px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 ${skill.testimonials && skill.testimonials.length > 0 ? 'flex-1' : 'w-full'}`}
                                            >
                                              <i className="fas fa-plus lg:hidden"></i>
                                              <span className="hidden lg:inline">Request New</span>
                                            </button>
                                          </div>
                                        </div>

                                        <div className="border-t border-slate-100 my-4"></div>

                                        {/* Certifications */}
                                        <div className="mb-4">
                                          <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                              <i className="fas fa-file-certificate text-slate-600 text-sm"></i>
                                              <span className="text-xs font-medium text-slate-700">Certificates</span>
                                            </div>
                                            <span className="text-xs text-slate-500 font-medium">{skill.certificates?.length || 0}</span>
                                          </div>
                                          <div className="flex gap-2">
                                            {skill.certificates && skill.certificates.length > 0 && (
                                              <button
                                                onClick={() => {
                                                  setSelectedSkill(skill);
                                                  setShowCertificatesModal(true);
                                                }}
                                                className="flex-1 px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                              >
                                                <i className="fas fa-eye lg:hidden"></i>
                                                <span className="hidden lg:inline">View All ({skill.certificates.length})</span>
                                              </button>
                                            )}
                                            <button
                                              onClick={() => {
                                                setSelectedJob(job);
                                                setSelectedSkill(skill);
                                                setShowAddCertificateModal(true);
                                              }}
                                              className={`px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 ${skill.certificates && skill.certificates.length > 0 ? 'flex-1' : 'w-full'}`}
                                            >
                                              <i className="fas fa-plus lg:hidden"></i>
                                              <span className="hidden lg:inline">Add Link</span>
                                            </button>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Content Creation */}
                                      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 flex-shrink-0 w-[85%] lg:w-auto snap-start">
                                        <div className="mb-5">
                                          <h5 className="font-semibold text-slate-900 text-xs tracking-wide flex items-center gap-2">
                                            <i className="fas fa-share-alt text-blue-600"></i>
                                            Content & sharing
                                          </h5>
                                          <p className="text-slate-500 text-[11px] mt-1" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 100 }}>
                                            Showcase your expertise and build your presence
                                          </p>
                                        </div>
                                        
                                        {/* LinkedIn Posts */}
                                        <div className="mb-4">
                                          <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                              <i className="fab fa-linkedin text-slate-600 text-sm"></i>
                                              <span className="text-xs font-medium text-slate-700">LinkedIn Posts</span>
                                              <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[9px] font-semibold">AI</span>
                                            </div>
                                            <span className="text-xs text-slate-500 font-medium">{skill.linkedInPosts?.length || 0}</span>
                                          </div>
                                          {skill.linkedInPosts && skill.linkedInPosts.length > 0 ? (
                                            <button
                                              onClick={() => {
                                                setSelectedSkill(skill);
                                                setShowLinkedInPostsModal(true);
                                              }}
                                              className="w-full px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs rounded-lg font-medium transition-colors"
                                            >
                                              View Post
                                            </button>
                                          ) : (
                                            <button
                                              onClick={() => handleCreateLinkedInPost(job, skill)}
                                              className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg font-semibold transition-colors shadow-sm"
                                            >
                                              Create Post
                                            </button>
                                          )}
                                        </div>

                                        <div className="border-t border-slate-100 my-4"></div>

                                        {/* Videos */}
                                        <div className="mb-4">
                                          <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                              <i className="fab fa-youtube text-slate-600 text-sm"></i>
                                              <span className="text-xs font-medium text-slate-700">Your Videos</span>
                                            </div>
                                            <span className="text-xs text-slate-500 font-medium">{skill.youtubeLinks?.length || 0}</span>
                                          </div>
                                          <div className="flex gap-2">
                                            {skill.youtubeLinks && skill.youtubeLinks.length > 0 && (
                                              <button
                                                onClick={() => {
                                                  setSelectedSkill(skill);
                                                  setShowVideosModal(true);
                                                }}
                                                className="flex-1 px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                              >
                                                <i className="fas fa-eye lg:hidden"></i>
                                                <span className="hidden lg:inline">View All ({skill.youtubeLinks.length})</span>
                                              </button>
                                            )}
                                            <button
                                              onClick={() => handleAddVideo(job, skill)}
                                              className={`px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 ${skill.youtubeLinks && skill.youtubeLinks.length > 0 ? 'flex-1' : 'w-full'}`}
                                            >
                                              <i className="fas fa-plus lg:hidden"></i>
                                              <span className="hidden lg:inline">Add Video</span>
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals remain the same */}
      <AddResourceModal
        isOpen={isAddResourceModalOpen}
        onClose={() => setIsAddResourceModalOpen(false)}
        resourceType={resourceType}
        selectedSkill={selectedSkill}
        resourceTitle={resourceTitle}
        setResourceTitle={setResourceTitle}
        resourceUrl={resourceUrl}
        setResourceUrl={setResourceUrl}
        resourceNote={resourceNote}
        setResourceNote={setResourceNote}
        onAddResource={() => {}}
      />

      <RequestTestimonialModal
        isOpen={isRequestTestimonialModalOpen}
        onClose={() => setIsRequestTestimonialModalOpen(false)}
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
        onRequestTestimonial={() => {}}
      />

      <ViewTestimonialModal
        isOpen={isViewTestimonialModalOpen}
        onClose={() => setIsViewTestimonialModalOpen(false)}
        selectedTestimonial={selectedTestimonial}
      />

      <ViewNoteModal
        isOpen={isViewNoteModalOpen}
        onClose={() => setIsViewNoteModalOpen(false)}
        selectedNote={selectedNote}
      />

      {/* Reader Mode for Learning Modules */}
      <LearningModuleReader
        isOpen={readerMode && (generatedModule || isGenerating)}
        onClose={handleCloseReader}
        generatedModule={generatedModule}
        selectedSkill={selectedSkill}
        selectedJob={selectedJob}
        isGenerating={isGenerating}
      />

      {/* Video Script Modal */}
      <VideoScriptViewer
        isOpen={showVideoScriptModal}
        onClose={() => setShowVideoScriptModal(false)}
        generatedVideoScript={generatedVideoScript}
        onOpenRecorder={() => setShowCameraRecorder(true)}
      />

      {/* Assessment Review Modal */}
      <AssessmentReviewModal
        isOpen={showAssessmentReviewModal}
        onClose={() => setShowAssessmentReviewModal(false)}
        selectedSkill={selectedSkill}
      />

      {/* View All Testimonials Modal */}
      <TestimonialsListModal
        isOpen={isViewTestimonialModalOpen}
        onClose={() => setIsViewTestimonialModalOpen(false)}
        selectedSkill={selectedSkill}
      />

      {/* LinkedIn Posts Modal */}
      <LinkedInPostsModal
        isOpen={showLinkedInPostsModal}
        onClose={() => setShowLinkedInPostsModal(false)}
        selectedSkill={selectedSkill}
      />

      {/* Videos Modal */}
      <VideosListModal
        isOpen={showVideosModal}
        onClose={() => setShowVideosModal(false)}
        selectedSkill={selectedSkill}
      />

      {/* Add Video Modal */}
      <AddVideoModal
        isOpen={showAddVideoModal}
        onClose={() => setShowAddVideoModal(false)}
        selectedSkill={selectedSkill}
        selectedJob={selectedJob}
        videoTitle={videoTitle}
        setVideoTitle={setVideoTitle}
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
        videoDescription={videoDescription}
        setVideoDescription={setVideoDescription}
        onSave={handleSaveVideo}
      />

      {/* View Certificates Modal */}
      {showCertificatesModal && selectedSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Certificates</h3>
                <p className="text-sm text-slate-600">{selectedSkill.name}</p>
              </div>
              <button
                onClick={() => setShowCertificatesModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="p-6">
              {selectedSkill.certificates && selectedSkill.certificates.length > 0 ? (
                <div className="space-y-4">
                  {selectedSkill.certificates.map((cert) => (
                    <div key={cert.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <i className={`fas ${cert.provider === 'drive' ? 'fa-google-drive' : 'fa-dropbox'} text-lg ${cert.provider === 'drive' ? 'text-blue-600' : 'text-blue-500'}`}></i>
                            <h4 className="font-semibold text-slate-900">{cert.title}</h4>
                          </div>
                          <a 
                            href={cert.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
                          >
                            {cert.url}
                          </a>
                          <p className="text-xs text-slate-500 mt-2">
                            Added: {new Date(cert.addedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteCertificate(cert.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <i className="fas fa-file-certificate text-5xl text-slate-300 mb-4"></i>
                  <p className="text-slate-500">No certificates added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Certificate Modal */}
      {showAddCertificateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Add Certificate</h3>
                  <p className="text-sm text-slate-600">{selectedSkill?.name}</p>
                </div>
                <button
                  onClick={() => {
                    setShowAddCertificateModal(false);
                    setCertificateTitle('');
                    setCertificateLink('');
                    setCertificateProvider('drive');
                  }}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  value={certificateTitle}
                  onChange={(e) => setCertificateTitle(e.target.value)}
                  placeholder="e.g., React Developer Certification"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Storage Provider *
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setCertificateProvider('drive')}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                      certificateProvider === 'drive'
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <i className="fab fa-google-drive text-2xl mb-1"></i>
                    <p className="text-sm font-medium">Google Drive</p>
                  </button>
                  <button
                    onClick={() => setCertificateProvider('dropbox')}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                      certificateProvider === 'dropbox'
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <i className="fab fa-dropbox text-2xl mb-1"></i>
                    <p className="text-sm font-medium">Dropbox</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Certificate Link *
                </label>
                <input
                  type="url"
                  value={certificateLink}
                  onChange={(e) => setCertificateLink(e.target.value)}
                  placeholder={certificateProvider === 'drive' ? 'https://drive.google.com/...' : 'https://www.dropbox.com/...'}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Make sure the link is publicly accessible
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddCertificateModal(false);
                    setCertificateTitle('');
                    setCertificateLink('');
                    setCertificateProvider('drive');
                  }}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCertificate}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Add Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View All Resources Modal */}
      <ViewAllResourcesModal
        isOpen={showViewAllResourcesModal}
        onClose={() => setShowViewAllResourcesModal(false)}
        selectedSkill={selectedSkill}
        selectedJob={selectedJob}
        onOpenModule={(module) => {
          setGeneratedModule(module.content);
          setReaderMode(true);
          setShowViewAllResourcesModal(false);
        }}
        onOpenScript={(script) => {
          setGeneratedVideoScript(script.content);
          setShowVideoScriptModal(true);
          setShowViewAllResourcesModal(false);
        }}
      />

      {/* Create LinkedIn Post Modal */}
      <CreateLinkedInPostModal
        isOpen={showCreateLinkedInPostModal}
        onClose={() => setShowCreateLinkedInPostModal(false)}
        selectedSkill={selectedSkill}
        selectedJob={selectedJob}
        linkedInPostTopic={linkedInPostTopic}
        setLinkedInPostTopic={setLinkedInPostTopic}
        linkedInPostContext={linkedInPostContext}
        setLinkedInPostContext={setLinkedInPostContext}
        generatedLinkedInPost={generatedLinkedInPost}
        setGeneratedLinkedInPost={setGeneratedLinkedInPost}
        isGeneratingPost={isGeneratingPost}
        onGenerate={handleGenerateLinkedInPost}
        onCopy={handleCopyLinkedInPost}
        onSave={handleSaveLinkedInPost}
      />

      {/* AI Generation Loader */}
      <AIGenerationLoader
        isVisible={isGenerating}
        generationType={generationType}
      />

      {/* Script Generator Modal */}
      {showScriptGeneratorModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[9998]"
            onClick={() => setShowScriptGeneratorModal(false)}
          ></div>

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <i className="fas fa-video text-xl text-white text-opacity-30"></i>
                  </div>
                  <h2 className="text-xl font-bold">Generate Video Script</h2>
                </div>
                <button
                  onClick={() => setShowScriptGeneratorModal(false)}
                  className="w-8 h-8 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-colors"
                >
                  <i className="fas fa-times text-white text-opacity-30"></i>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-slate-600 text-sm mb-4">
                    Creating video script for <span className="font-semibold text-slate-900">{selectedSkill?.name}</span>
                  </p>
                </div>

                {/* Specific Idea Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Any specific idea or focus? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={scriptIdea}
                    onChange={(e) => setScriptIdea(e.target.value)}
                    placeholder="e.g., focus on hooks and state management, or explain async/await patterns..."
                    rows={3}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                  />
                </div>

                {/* Video Length Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Video Length
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setVideoLength('2-3')}
                      className={`px-4 py-4 rounded-lg border-2 transition-all ${
                        videoLength === '2-3'
                          ? 'border-purple-600 bg-purple-50 text-purple-900'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-center">
                        <i className={`fas fa-clock text-2xl mb-2 ${videoLength === '2-3' ? 'text-purple-600' : 'text-slate-300'}`}></i>
                        <p className="text-sm font-semibold">2-3 mins</p>
                        <p className="text-xs text-slate-500 mt-1">Quick</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setVideoLength('5-7')}
                      className={`px-4 py-4 rounded-lg border-2 transition-all ${
                        videoLength === '5-7'
                          ? 'border-purple-600 bg-purple-50 text-purple-900'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-center">
                        <i className={`fas fa-clock text-2xl mb-2 ${videoLength === '5-7' ? 'text-purple-600' : 'text-slate-300'}`}></i>
                        <p className="text-sm font-semibold">5-7 mins</p>
                        <p className="text-xs text-slate-500 mt-1">Standard</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setVideoLength('8-10')}
                      className={`px-4 py-4 rounded-lg border-2 transition-all ${
                        videoLength === '8-10'
                          ? 'border-purple-600 bg-purple-50 text-purple-900'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-center">
                        <i className={`fas fa-clock text-2xl mb-2 ${videoLength === '8-10' ? 'text-purple-600' : 'text-slate-300'}`}></i>
                        <p className="text-sm font-semibold">8-10 mins</p>
                        <p className="text-xs text-slate-500 mt-1">Detailed</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-slate-50 rounded-b-2xl flex gap-3">
                <button
                  onClick={() => setShowScriptGeneratorModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateScript}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fas fa-magic text-white text-opacity-80"></i>
                  Generate Script
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Camera Recorder */}
      <CameraRecorder
        isOpen={showCameraRecorder}
        onClose={() => setShowCameraRecorder(false)}
        skillName={selectedSkill?.name || 'Video Recording'}
        videoScript={generatedVideoScript}
      />
    </>
  );
};

export default SkillPlanner;
