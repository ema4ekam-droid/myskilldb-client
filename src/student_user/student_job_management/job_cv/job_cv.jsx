import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import StudentMenuNavigation from '../../../components/student-components/student-menu-components/StudentMenuNavigation';
import LoaderOverlay from '../../../components/loader/LoaderOverlay';
import { getRequest, putRequest, postRequest, deleteRequest } from '../../../api/apiRequests';

const JobCV = () => {
  const user = useSelector((state) => state.user);
  const assignment = useSelector((state) => state.assignment);
  const [currentPage, setCurrentPage] = useState('job-cv');
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('jobs'); // 'jobs', 'profile', 'preview'
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  // Profile data (saved once, used for all CVs)
  const [profile, setProfile] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.mobile || '',
    address: '',
    photo: user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=200&background=4F46E5&color=fff`,
    linkedin: '',
    github: '',
    portfolio: '',
    aboutMe: '',
    education: [],
    workExperience: []
  });

  // Jobs with assessment status
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [generatedCV, setGeneratedCV] = useState(null);

  useEffect(() => {
    if (user?._id) {
      fetchCVData();
    }
  }, [user?._id]);

  useEffect(() => {
    if (user?._id && (user?.organizationId || assignment?.departmentId)) {
      fetchJobsAndAssessments();
    } else if (user?._id) {
      setIsLoading(false);
    }
  }, [user?._id, user?.organizationId, assignment?.departmentId]);

  const fetchCVData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch CV profile
      const profileResponse = await getRequest('/cv/profile');
      const cvProfile = profileResponse.data.data;
      
      // Fetch education
      const educationResponse = await getRequest('/cv/education');
      const education = educationResponse.data.data || [];
      
      // Fetch experience
      const experienceResponse = await getRequest('/cv/experience');
      const experience = experienceResponse.data.data || [];
      
      // Update profile state
      setProfile(prev => ({
        ...prev,
        fullName: user?.name || prev.fullName,
        email: user?.email || prev.email,
        phone: user?.mobile || prev.phone,
        address: cvProfile?.address || '',
        linkedin: cvProfile?.linkedIn || '',
        github: cvProfile?.github || '',
        portfolio: cvProfile?.portfolio || '',
        aboutMe: cvProfile?.aboutMe || '',
        education: education.map(edu => ({
          id: edu._id,
          degree: edu.title,
          institution: edu.institution,
          location: edu.location,
          startYear: edu.startYear,
          endYear: edu.endYear,
          gpa: edu.gpa || ''
        })),
        workExperience: experience.map(exp => ({
          id: exp._id,
          title: exp.jobTitle,
          company: exp.company,
          location: exp.location,
          startDate: exp.startDate,
          endDate: exp.endDate || '',
          current: exp.isCurrent,
          description: exp.description
        }))
      }));
    } catch (error) {
      console.error('Error fetching CV data:', error);
      // Set default values from user if profile doesn't exist
      setProfile(prev => ({
        ...prev,
        fullName: user?.name || prev.fullName,
        email: user?.email || prev.email,
        phone: user?.mobile || prev.phone,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJobsAndAssessments = async () => {
    try {
      if (!user?._id || !user?.organizationId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      // Fetch jobs by department or organization
      let jobsResponse;
      if (assignment?.departmentId) {
        try {
          jobsResponse = await getRequest(`/jobs/departments/${user.organizationId}/${assignment.departmentId}`);
        } catch (error) {
          // Fallback to organization endpoint if department endpoint fails
          console.warn('Department endpoint failed, using organization endpoint:', error);
          jobsResponse = await getRequest(`/jobs/organization/${user.organizationId}`);
        }
      } else {
        jobsResponse = await getRequest(`/jobs/organization/${user.organizationId}`);
      }

      if (!jobsResponse.data?.success || !jobsResponse.data?.data) {
        setJobs([]);
        setIsLoading(false);
        return;
      }

      const apiJobs = jobsResponse.data.data || [];
      
      // Fetch skill planner entries to get skillPlannerId for each job
      let skillPlannerMap = {};
      try {
        const plannerResponse = await getRequest('/skill-planner');
        if (plannerResponse.data?.success && plannerResponse.data?.data) {
          plannerResponse.data.data.forEach(entry => {
            skillPlannerMap[entry.jobId] = entry._id; // skillPlannerId
          });
        }
      } catch (error) {
        console.error('Error fetching skill planner:', error);
      }

      // Transform jobs and fetch skills with assessment data
      const transformedJobs = await Promise.all(
        apiJobs.map(async (job) => {
          const jobId = job._id;
          const skillPlannerId = skillPlannerMap[jobId];
          
          // Fetch topics (skills) for this job
          let skills = [];
          try {
            const topicsResponse = await getRequest(`/topics/job/${jobId}`);
            if (topicsResponse.data?.success && topicsResponse.data?.data) {
              const topics = topicsResponse.data.data || [];
              
              // For each topic, fetch assessment status and related data
              skills = await Promise.all(
                topics.map(async (topic, index) => {
                  const topicId = topic._id;
                  
                  // Fetch average test score for this topic
                  let assessmentCompleted = false;
                  let score = null;
                  let completedDate = null;
                  
                  try {
                    const averageScoreResponse = await getRequest(
                      `/student-test-history/topic-average/${jobId}/${topicId}?studentId=${user._id}&organizationId=${user.organizationId}`
                    );
                    
                    if (averageScoreResponse.data?.success && averageScoreResponse.data?.data) {
                      const averageData = averageScoreResponse.data.data;
                      if (averageData.averageScore !== null && averageData.averageScore !== undefined) {
                        assessmentCompleted = true;
                        score = averageData.averageScore;
                        // Get the most recent completed date from individual assessments
                        try {
                          const assessmentResponse = await getRequest(
                            `/student-test-history/tests/job/${jobId}?studentId=${user._id}&organizationId=${user.organizationId}&topicId=${topicId}`
                          );
                          if (assessmentResponse.data?.success && assessmentResponse.data?.data) {
                            const assessments = assessmentResponse.data.data || [];
                            const completedAssessments = assessments.filter(a => a.status === 'Completed' && a.completedAt);
                            if (completedAssessments.length > 0) {
                              // Get the most recent completed date
                              const dates = completedAssessments.map(a => new Date(a.completedAt));
                              const latestDate = new Date(Math.max(...dates.map(d => d.getTime())));
                              completedDate = latestDate.toISOString().split('T')[0];
                            }
                          }
                        } catch (error) {
                          console.error(`Error fetching assessment dates for topic ${topicId}:`, error);
                        }
                      }
                    }
                  } catch (error) {
                    console.error(`Error fetching average score for topic ${topicId}:`, error);
                  }

                  // Fetch testimonials
                  let testimonials = [];
                  if (skillPlannerId) {
                    try {
                      const testimonialsResponse = await getRequest(
                        `/testimonials?skillPlannerId=${skillPlannerId}&topicId=${topicId}`
                      );
                      if (testimonialsResponse.data?.success && testimonialsResponse.data?.data) {
                        testimonials = testimonialsResponse.data.data.map(testimonial => ({
                          id: testimonial._id,
                          project: testimonial.project || '',
                          validatorName: testimonial.validatorName || '',
                          validatorRole: testimonial.validatorRole || '',
                          status: testimonial.status || 'pending',
                          testimonialText: testimonial.testimonialText || ''
                        }));
                      }
                    } catch (error) {
                      // Testimonials don't exist, which is fine
                    }
                  }

                  // Fetch certificates
                  let certificates = [];
                  if (skillPlannerId) {
                    try {
                      const certificatesResponse = await getRequest(
                        `/certificates?skillPlannerId=${skillPlannerId}&topicId=${topicId}`
                      );
                      if (certificatesResponse.data?.success && certificatesResponse.data?.data) {
                        certificates = certificatesResponse.data.data.map(cert => ({
                          id: cert._id,
                          name: cert.title || cert.name || '',
                          issuer: cert.storageProvider || cert.issuer || '',
                          link: cert.link || ''
                        }));
                      }
                    } catch (error) {
                      // Certificates don't exist, which is fine
                    }
                  }

                  // Fetch videos
                  let videos = [];
                  if (skillPlannerId) {
                    try {
                      const videosResponse = await getRequest(
                        `/student-videos?skillPlannerId=${skillPlannerId}&topicId=${topicId}`
                      );
                      if (videosResponse.data?.success && videosResponse.data?.data) {
                        videos = videosResponse.data.data.map(video => ({
                          id: video._id,
                          title: video.title || '',
                          link: video.link || video.url || ''
                        }));
                      }
                    } catch (error) {
                      // Videos don't exist, which is fine
                    }
                  }

                  return {
                    id: topicId || `skill-${index}`,
                    name: topic.name || topic.title || 'Skill',
                    assessmentCompleted,
                    score,
                    completedDate,
                    testimonials,
                    certificates,
                    videos
                  };
                })
              );
            }
          } catch (error) {
            console.error(`Error fetching topics for job ${jobId}:`, error);
          }

          return {
            id: jobId,
            _id: jobId,
            title: job.name || job.title || 'Job Title',
            company: job.companyName || job.company || 'Company',
            location: job.place || job.location || 'Location',
            jobType: job.jobType || 'Full-time',
            skills: skills
          };
        })
      );

      setJobs(transformedJobs);
    } catch (error) {
      console.error('Error fetching jobs and assessments:', error);
      toast.error('Failed to load jobs');
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const calculateJobReadiness = (job) => {
    if (!job || !job.skills || job.skills.length === 0) {
      return {
        completed: 0,
        total: 0,
        percentage: 0
      };
    }

    const completed = job.skills.filter(skill => skill.assessmentCompleted).length;
    const total = job.skills.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      completed,
      total,
      percentage
    };
  };

  const handleGenerateCV = (job) => {
    // Generate CV with profile data + completed assessments
    const cv = {
      job: job,
      profile: profile,
      skills: job.skills.filter(s => s.assessmentCompleted),
      generatedDate: new Date().toISOString()
    };

    setGeneratedCV(cv);
    setSelectedJob(job);
    setView('preview');
    toast.success('CV generated successfully!');
  };

  const handleDownloadCV = () => {
    // Use browser's print functionality to save as PDF
    window.print();
  };

  const handleShareCV = (platform) => {
    if (!generatedCV) return;
    
    const cvTitle = `${generatedCV.job.title} - ${profile.fullName}`;
    const cvText = `Check out my CV for ${generatedCV.job.title} position`;
    const currentUrl = window.location.href;

    switch(platform) {
      case 'email':
        const emailSubject = encodeURIComponent(`CV - ${profile.fullName} - ${generatedCV.job.title}`);
        const emailBody = encodeURIComponent(
          `Hi,\n\nPlease find my CV for the ${generatedCV.job.title} position.\n\n` +
          `Name: ${profile.fullName}\n` +
          `Email: ${profile.email}\n` +
          `Phone: ${profile.phone}\n\n` +
          `You can view my full CV here: ${currentUrl}\n\n` +
          `Best regards,\n${profile.fullName}`
        );
        window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`, '_blank');
        toast.success('Email client opened!');
        break;
      
      case 'whatsapp':
        const whatsappText = encodeURIComponent(
          `*CV - ${profile.fullName}*\n\n` +
          `Position: ${generatedCV.job.title}\n` +
          `Email: ${profile.email}\n` +
          `Phone: ${profile.phone}\n\n` +
          `View my full CV: ${currentUrl}`
        );
        window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
        toast.success('WhatsApp opened!');
        break;
      
      case 'linkedin':
        const linkedinUrl = encodeURIComponent(currentUrl);
        const linkedinTitle = encodeURIComponent(cvTitle);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${linkedinUrl}`, '_blank');
        toast.success('LinkedIn share opened!');
        break;
      
      case 'copy':
        const copyText = `CV - ${profile.fullName}\n\n` +
          `Position: ${generatedCV.job.title}\n` +
          `Email: ${profile.email}\n` +
          `Phone: ${profile.phone}\n\n` +
          `View CV: ${currentUrl}`;
        navigator.clipboard.writeText(copyText).then(() => {
          toast.success('CV link copied to clipboard!');
        }).catch(() => {
          toast.error('Failed to copy link');
        });
        break;
      
      default:
        break;
    }
  };

  const handleUpdateProfile = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const addEducation = async () => {
    const newEducation = {
      id: `temp-${Date.now()}`,
      degree: '',
      institution: '',
      location: '',
      startYear: '',
      endYear: '',
      gpa: ''
    };
    
    setProfile({
      ...profile,
      education: [...profile.education, newEducation]
    });
  };

  const removeEducation = async (id) => {
    try {
      // If it's a temporary ID (starts with 'temp-'), just remove from state
      if (id.startsWith('temp-')) {
        setProfile({
          ...profile,
          education: profile.education.filter(edu => edu.id !== id)
        });
        return;
      }
      
      // Otherwise, delete from API
      await deleteRequest(`/cv/education/${id}`);
      setProfile({
        ...profile,
        education: profile.education.filter(edu => edu.id !== id)
      });
      toast.success('Education removed successfully');
    } catch (error) {
      console.error('Error removing education:', error);
      toast.error('Failed to remove education');
    }
  };

  const updateEducation = async (id, field, value) => {
    const updatedEducation = profile.education.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    
    setProfile({
      ...profile,
      education: updatedEducation
    });
    
    // If it's not a temporary ID, save to API
    if (!id.startsWith('temp-')) {
      const edu = updatedEducation.find(e => e.id === id);
      if (edu) {
        try {
          await putRequest(`/cv/education/${id}`, {
            title: edu.degree,
            institution: edu.institution,
            location: edu.location,
            startYear: edu.startYear,
            endYear: edu.endYear,
            gpa: edu.gpa
          });
        } catch (error) {
          console.error('Error updating education:', error);
        }
      }
    }
  };

  const saveProfile = async () => {
    try {
      setIsLoading(true);
      
      // Update user info (name, email, phone)
      if (user?._id) {
        await putRequest('/users/me', {
          name: profile.fullName,
          email: profile.email,
          mobile: profile.phone
        });
      }
      
      // Update or create CV profile
      await putRequest('/cv/profile', {
        address: profile.address,
        linkedIn: profile.linkedin,
        github: profile.github,
        portfolio: profile.portfolio,
        aboutMe: profile.aboutMe
      });
      
      // Save new education entries (those with temp IDs)
      const newEducationEntries = profile.education.filter(edu => edu.id.startsWith('temp-'));
      for (const edu of newEducationEntries) {
        await postRequest('/cv/education', {
          title: edu.degree,
          institution: edu.institution,
          location: edu.location,
          startYear: edu.startYear,
          endYear: edu.endYear,
          gpa: edu.gpa || ''
        });
      }
      
      // Save new experience entries (those with temp IDs)
      const newExperienceEntries = profile.workExperience.filter(exp => exp.id.startsWith('temp-'));
      for (const exp of newExperienceEntries) {
        await postRequest('/cv/experience', {
          jobTitle: exp.title,
          company: exp.company,
          location: exp.location,
          startDate: exp.startDate,
          endDate: exp.endDate || '',
          isCurrent: exp.current,
          description: exp.description
        });
      }
      
      // Refresh CV data to get updated IDs
      await fetchCVData();
      
      toast.success('Profile saved successfully!');
      setView('jobs');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, photo: reader.result });
        toast.success('Photo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const addWorkExperience = async () => {
    const newExperience = {
      id: `temp-${Date.now()}`,
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    
    setProfile({
      ...profile,
      workExperience: [...profile.workExperience, newExperience]
    });
  };

  const removeWorkExperience = async (id) => {
    try {
      // If it's a temporary ID (starts with 'temp-'), just remove from state
      if (id.startsWith('temp-')) {
        setProfile({
          ...profile,
          workExperience: profile.workExperience.filter(exp => exp.id !== id)
        });
        return;
      }
      
      // Otherwise, delete from API
      await deleteRequest(`/cv/experience/${id}`);
      setProfile({
        ...profile,
        workExperience: profile.workExperience.filter(exp => exp.id !== id)
      });
      toast.success('Experience removed successfully');
    } catch (error) {
      console.error('Error removing experience:', error);
      toast.error('Failed to remove experience');
    }
  };

  const updateWorkExperience = async (id, field, value) => {
    const updatedExperience = profile.workExperience.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    
    setProfile({
      ...profile,
      workExperience: updatedExperience
    });
    
    // If it's not a temporary ID, save to API
    if (!id.startsWith('temp-')) {
      const exp = updatedExperience.find(e => e.id === id);
      if (exp) {
        try {
          await putRequest(`/cv/experience/${id}`, {
            jobTitle: exp.title,
            company: exp.company,
            location: exp.location,
            startDate: exp.startDate,
            endDate: exp.endDate,
            isCurrent: exp.current,
            description: exp.description
          });
        } catch (error) {
          console.error('Error updating experience:', error);
        }
      }
    }
  };

  // Profile Settings View
  if (view === 'profile') {
    return (
      <>
        <StudentMenuNavigation currentPage={currentPage} onPageChange={handlePageChange} />
        
        <div className="min-h-screen bg-slate-50 lg:ml-72 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Profile Settings</h1>
                <p className="text-sm text-slate-600">Update your default information used for all CVs</p>
              </div>
              <button
                onClick={() => setView('jobs')}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back
              </button>
            </div>

            {/* Profile Form */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => handleUpdateProfile('fullName', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleUpdateProfile('email', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => handleUpdateProfile('phone', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Address *</label>
                    <input
                      type="text"
                      value={profile.address}
                      onChange={(e) => handleUpdateProfile('address', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn</label>
                    <input
                      type="text"
                      value={profile.linkedin}
                      onChange={(e) => handleUpdateProfile('linkedin', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">GitHub</label>
                    <input
                      type="text"
                      value={profile.github}
                      onChange={(e) => handleUpdateProfile('github', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Portfolio</label>
                    <input
                      type="text"
                      value={profile.portfolio}
                      onChange={(e) => handleUpdateProfile('portfolio', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* About Me */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">About Me *</label>
                <textarea
                  value={profile.aboutMe}
                  onChange={(e) => handleUpdateProfile('aboutMe', e.target.value)}
                  placeholder="Brief professional summary..."
                  rows={4}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>

              {/* Education */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Education</h3>
                  <button
                    onClick={addEducation}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Add Education
                  </button>
                </div>

                <div className="space-y-4">
                  {profile.education.map((edu, index) => (
                    <div key={edu.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-slate-900">Education {index + 1}</h4>
                        {profile.education.length > 1 && (
                          <button
                            onClick={() => removeEducation(edu.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Degree *</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            placeholder="B.Tech in Computer Science"
                            className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Institution *</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                            placeholder="XYZ University"
                            className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Location</label>
                          <input
                            type="text"
                            value={edu.location}
                            onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                            placeholder="Bangalore, India"
                            className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Start</label>
                            <input
                              type="text"
                              value={edu.startYear}
                              onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)}
                              placeholder="2019"
                              className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">End</label>
                            <input
                              type="text"
                              value={edu.endYear}
                              onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)}
                              placeholder="2023"
                              className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">GPA</label>
                            <input
                              type="text"
                              value={edu.gpa}
                              onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                              placeholder="8.5/10"
                              className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Experience */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Work Experience</h3>
                  <button
                    onClick={addWorkExperience}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Add Experience
                  </button>
                </div>

                <div className="space-y-4">
                  {profile.workExperience.map((exp, index) => (
                    <div key={exp.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-slate-900">Experience {index + 1}</h4>
                        {profile.workExperience.length > 0 && (
                          <button
                            onClick={() => removeWorkExperience(exp.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Job Title *</label>
                            <input
                              type="text"
                              value={exp.title}
                              onChange={(e) => updateWorkExperience(exp.id, 'title', e.target.value)}
                              placeholder="Frontend Developer"
                              className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Company *</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateWorkExperience(exp.id, 'company', e.target.value)}
                              placeholder="Tech Company Inc."
                              className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Location</label>
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => updateWorkExperience(exp.id, 'location', e.target.value)}
                            placeholder="Bangalore, India"
                            className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Start Date</label>
                            <input
                              type="text"
                              value={exp.startDate}
                              onChange={(e) => updateWorkExperience(exp.id, 'startDate', e.target.value)}
                              placeholder="Jun 2022"
                              className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">End Date</label>
                            <input
                              type="text"
                              value={exp.endDate}
                              onChange={(e) => updateWorkExperience(exp.id, 'endDate', e.target.value)}
                              placeholder="Dec 2022"
                              disabled={exp.current}
                              className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-100"
                            />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => updateWorkExperience(exp.id, 'current', e.target.checked)}
                            className="mr-2"
                          />
                          <label className="text-xs text-slate-700">Currently working here</label>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                          <textarea
                            value={exp.description}
                            onChange={(e) => updateWorkExperience(exp.id, 'description', e.target.value)}
                            placeholder="Key responsibilities and achievements..."
                            rows={3}
                            className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={saveProfile}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
                >
                  <i className="fas fa-save mr-2"></i>
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // CV Preview
  if (view === 'preview' && generatedCV) {
    return (
      <>
        {/* Print Styles for A4 and Page Breaks */}
        <style>{`
          @media print {
            @page {
              size: A4;
              margin: 15mm 10mm;
            }
            
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            body {
              margin: 0;
              padding: 0;
            }
            
            .page-break {
              page-break-before: always;
            }
            
            .avoid-break {
              page-break-inside: avoid;
            }
            
            /* Hide only navigation and control buttons */
            nav, .no-print, button, .lg\\:hidden, .menu-button, header, .z-40, .z-50 {
              display: none !important;
            }
            
            /* Remove side margin */
            .lg\\:ml-72 {
              margin-left: 0 !important;
            }
            
            /* Remove outer padding */
            .min-h-screen {
              padding: 0 !important;
              background: white !important;
            }
            
            /* Center the CV properly */
            .max-w-4xl {
              max-width: 100% !important;
              margin: 0 auto !important;
            }
            
            /* Add proper margins to CV container */
            .cv-container {
              padding: 0 !important;
            }
            
            /* Keep the CV content width at A4 */
            .max-w-\\[210mm\\] {
              max-width: 100% !important;
              margin: 0 auto !important;
              padding: 15mm !important;
            }
            
            /* Remove overflow scroll for print */
            .overflow-x-auto {
              overflow: visible !important;
            }
            
            /* CV content full width in print */
            .w-\\[210mm\\] {
              width: 100% !important;
            }
            
            /* Ensure all text remains left-aligned */
            .text-center {
              text-align: left !important;
            }
            
            .justify-center {
              justify-content: flex-start !important;
            }
            
            .items-center {
              align-items: flex-start !important;
            }
          }
        `}</style>
        
        <StudentMenuNavigation currentPage={currentPage} onPageChange={handlePageChange} />
        
        <div className="min-h-screen bg-slate-50 lg:ml-72 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto cv-container">
            {/* Header */}
            <div className="mb-4 no-print">
              {/* Heading */}
              <div className="mb-3">
                <h1 className="text-xl lg:text-3xl font-bold text-slate-900">
                  CV Preview
                </h1>
                <p className="text-xs lg:text-sm text-slate-600">
                  {generatedCV.job.title} at {generatedCV.job.company}
                </p>
              </div>
              
              {/* Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setView('jobs')}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors text-sm"
                >
                  <i className="fas fa-arrow-left mr-1"></i>
                  <span className="hidden sm:inline">Back</span>
                  <span className="sm:hidden">Back</span>
                </button>
                
                {/* Share Button with Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    <i className="fas fa-share-alt mr-1"></i>
                    Share
                  </button>
                  
                  {showShareMenu && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setShowShareMenu(false)}
                      ></div>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                        <button
                          onClick={() => {
                            handleShareCV('email');
                            setShowShareMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-3 text-slate-700 transition-colors"
                        >
                          <i className="fas fa-envelope text-blue-600 w-5"></i>
                          <span className="font-medium">Email</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            handleShareCV('whatsapp');
                            setShowShareMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-3 text-slate-700 transition-colors"
                        >
                          <i className="fab fa-whatsapp text-green-600 w-5"></i>
                          <span className="font-medium">WhatsApp</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            handleShareCV('linkedin');
                            setShowShareMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-3 text-slate-700 transition-colors"
                        >
                          <i className="fab fa-linkedin text-blue-700 w-5"></i>
                          <span className="font-medium">LinkedIn</span>
                        </button>
                        
                        <hr className="my-2 border-slate-200" />
                        
                        <button
                          onClick={() => {
                            handleShareCV('copy');
                            setShowShareMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-3 text-slate-700 transition-colors"
                        >
                          <i className="fas fa-copy text-slate-600 w-5"></i>
                          <span className="font-medium">Copy Link</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
                
                <button
                  onClick={handleDownloadCV}
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  <i className="fas fa-download mr-1"></i>
                  <span className="hidden sm:inline">Download PDF</span>
                  <span className="sm:hidden">PDF</span>
                </button>
              </div>
            </div>

            {/* CV Content - A4 Size with Mobile Scroll */}
            <div className="overflow-x-auto">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 w-[210mm] mx-auto" style={{ minHeight: '297mm' }}>
              {/* Header Section */}
              <div className="mb-8 pb-6 border-b-2 border-slate-200">
                {/* Name and Job Title */}
                <div className="mb-4">
                  <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                    {generatedCV.profile.fullName}
                  </h1>
                  <p className="text-xl font-semibold text-indigo-600">
                    {generatedCV.job.title}
                  </p>
                </div>
                
                {/* Contact Information - Horizontal Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-slate-700">
                    <i className="fas fa-map-marker-alt text-indigo-600 w-5"></i>
                    <span className="text-sm">{generatedCV.profile.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-slate-700">
                    <i className="fas fa-phone text-indigo-600 w-5"></i>
                    <span className="text-sm">{generatedCV.profile.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-slate-700">
                    <i className="fas fa-envelope text-indigo-600 w-5"></i>
                    <span className="text-sm">{generatedCV.profile.email}</span>
                  </div>
                  
                  {(generatedCV.profile.linkedin || generatedCV.profile.github || generatedCV.profile.portfolio) && (
                    <div className="flex items-center gap-2 text-slate-700">
                      <i className="fas fa-link text-indigo-600 w-5"></i>
                      <div className="flex flex-wrap gap-3 text-sm">
                        {generatedCV.profile.linkedin && (
                          <a 
                            href={`https://${generatedCV.profile.linkedin}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-700 font-medium"
                          >
                            LinkedIn
                          </a>
                        )}
                        {generatedCV.profile.github && (
                          <a 
                            href={`https://${generatedCV.profile.github}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-700 font-medium"
                          >
                            GitHub
                          </a>
                        )}
                        {generatedCV.profile.portfolio && (
                          <a 
                            href={`https://${generatedCV.profile.portfolio}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-700 font-medium"
                          >
                            Portfolio
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Summary */}
              <div className="mb-6 avoid-break">
                <h2 className="text-xl font-bold text-slate-900 mb-3 pb-2 border-b-2 border-indigo-600 flex items-center gap-2">
                  <i className="fas fa-user text-indigo-600"></i>
                  PROFESSIONAL SUMMARY
                </h2>
                <p className="text-slate-700 leading-relaxed text-left">{generatedCV.profile.aboutMe}</p>
              </div>

              {/* Work Experience */}
              {generatedCV.profile.workExperience && generatedCV.profile.workExperience.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-3 pb-2 border-b-2 border-indigo-600 flex items-center gap-2">
                    <i className="fas fa-briefcase text-indigo-600"></i>
                    WORK EXPERIENCE
                  </h2>
                  <div className="space-y-4">
                    {generatedCV.profile.workExperience.map(exp => (
                      <div key={exp.id} className="avoid-break">
                        <div className="flex flex-row justify-between items-start mb-2">
                          <div className="text-left">
                            <h3 className="text-lg font-bold text-slate-900 text-left">{exp.title}</h3>
                            <p className="text-slate-700 font-medium text-left">{exp.company}</p>
                            {exp.location && <p className="text-sm text-slate-600 text-left">{exp.location}</p>}
                          </div>
                          <p className="text-slate-700 font-medium whitespace-nowrap text-right">
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </p>
                        </div>
                        {exp.description && (
                          <p className="text-slate-700 leading-relaxed text-left">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills & Assessments - Featured Section */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <i className="fas fa-code text-indigo-600"></i>
                  VERIFIED TECHNICAL SKILLS
                </h2>
                <p className="text-xs text-slate-600 mb-3">All skills verified through assessments and backed by certifications</p>
                <div className="grid grid-cols-2 gap-3">
                  {generatedCV.skills.map(skill => (
                    <div key={skill.id} className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm avoid-break">
                      <div className="mb-2">
                        <h3 className="text-base font-bold text-slate-900 mb-1">{skill.name}</h3>
                        
                        {/* Average Assessment Score Progress Bar */}
                        <div className="mb-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-slate-700">Average Assessment Score</span>
                            <span className="text-xs font-bold text-indigo-600">{skill.score?.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all bg-indigo-600"
                              style={{ width: `${skill.score || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Certificates and Videos - Horizontal Cards */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Certificates Card */}
                        {skill.certificates.length > 0 && (
                          <div className="bg-indigo-50 rounded p-2 border border-indigo-200 text-left">
                            <p className="text-xs font-semibold text-indigo-700 mb-1 flex items-center gap-1">
                              <i className="fas fa-certificate text-xs"></i>
                              Certifications
                            </p>
                            <div className="space-y-1 text-left">
                              {skill.certificates.map(cert => (
                                <div key={cert.id} className="text-xs text-slate-700 text-left">
                                  <a 
                                    href={cert.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:text-indigo-600 hover:underline font-medium text-left"
                                  >
                                    {cert.name}
                                  </a>
                                  <p className="text-xs text-slate-600 text-left">{cert.issuer}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Videos Card */}
                        {skill.videos && skill.videos.length > 0 && (
                          <div className="bg-indigo-50 rounded p-2 border border-indigo-200 text-left">
                            <p className="text-xs font-semibold text-indigo-700 mb-1 flex items-center gap-1">
                              <i className="fab fa-youtube text-xs"></i>
                              Skill based videos
                            </p>
                            <div className="space-y-1 text-left">
                              {skill.videos.map(video => (
                                <div key={video.id} className="text-xs text-slate-700 text-left">
                                  <a 
                                    href={video.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:text-indigo-600 hover:underline font-medium text-left"
                                  >
                                    {video.title}
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Testimonials */}
                      {skill.testimonials.length > 0 && skill.testimonials[0].status === 'approved' && (
                        <div className="mt-2 pl-2 border-l-2 border-slate-400 bg-slate-50 p-2 rounded-r">
                          <p className="text-xs font-semibold text-slate-800 mb-1 flex items-center gap-1">
                            <i className="fas fa-award text-xs"></i>
                            Testimonial
                          </p>
                          <p className="text-xs text-slate-800 italic leading-snug mb-1">
                            "{skill.testimonials[0].testimonialText}"
                          </p>
                          <p className="text-xs font-medium text-slate-700">
                            — {skill.testimonials[0].validatorName}, {skill.testimonials[0].validatorRole}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-3 pb-2 border-b-2 border-indigo-600 flex items-center gap-2">
                  <i className="fas fa-graduation-cap text-indigo-600"></i>
                  EDUCATION
                </h2>
                {generatedCV.profile.education.map(edu => (
                  <div key={edu.id} className="mb-4 avoid-break">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                        <p className="text-slate-700">{edu.institution}</p>
                        {edu.location && <p className="text-sm text-slate-600">{edu.location}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-slate-700">{edu.startYear} - {edu.endYear}</p>
                        {edu.gpa && <p className="text-sm text-slate-600">GPA: {edu.gpa}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Generated Date */}
              <div className="text-center text-xs text-slate-500 mt-8 pt-4 border-t border-slate-200">
                CV Generated on {new Date(generatedCV.generatedDate).toLocaleDateString()}
              </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Main Jobs List View
  return (
    <>
      {/* Print Styles for A4 and Page Breaks */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm 10mm;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          .page-break {
            page-break-before: always;
          }
          
          .avoid-break {
            page-break-inside: avoid;
          }
          
          /* Hide only navigation and control buttons */
          nav, .no-print, button, .lg\\:hidden, .menu-button, header, .z-40, .z-50 {
            display: none !important;
          }
          
          /* Remove side margin */
          .lg\\:ml-72 {
            margin-left: 0 !important;
          }
          
          /* Remove outer padding */
          .min-h-screen {
            padding: 0 !important;
            background: white !important;
          }
          
          /* Center the CV properly */
          .max-w-4xl {
            max-width: 100% !important;
            margin: 0 auto !important;
          }
          
          /* Add proper margins to CV container */
          .cv-container {
            padding: 0 !important;
          }
          
          /* Keep the CV content width at A4 */
          .max-w-\\[210mm\\] {
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 15mm !important;
          }
          
          /* Remove overflow scroll for print */
          .overflow-x-auto {
            overflow: visible !important;
          }
          
          /* CV content full width in print */
          .w-\\[210mm\\] {
            width: 100% !important;
          }
          
          /* Ensure all text remains left-aligned */
          .text-center {
            text-align: left !important;
          }
          
          .justify-center {
            justify-content: flex-start !important;
          }
          
          .items-center {
            align-items: flex-start !important;
          }
        }
      `}</style>
      
      <LoaderOverlay isVisible={isLoading} title="Job CVs" subtitle="Loading jobs..." />
      <StudentMenuNavigation currentPage={currentPage} onPageChange={handlePageChange} />
      
      <div className="min-h-screen bg-slate-50 lg:ml-72 p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6 pt-12 lg:pt-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Job-Specific CVs</h1>
          <p className="text-sm text-slate-600 mb-3">
            Generate professional CVs automatically based on completed skill assessments
          </p>
          <button
            onClick={() => setShowInfoModal(true)}
            className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1.5"
          >
            <i className="fas fa-info-circle"></i>
            How this works
          </button>
        </div>

        {/* Profile Settings Card */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="text-white">
              <h2 className="text-xl font-bold mb-2">Profile Settings</h2>
              <p className="text-white text-opacity-90 text-sm">
                Set up your default information once, use it for all job-specific CVs
              </p>
            </div>
            <button
              onClick={() => setView('profile')}
              className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              <i className="fas fa-user-edit mr-2"></i>
              Update Profile
            </button>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.map(job => {
            const readiness = calculateJobReadiness(job);
            const completedSkills = job.skills.filter(s => s.assessmentCompleted);
            const pendingSkills = job.skills.filter(s => !s.assessmentCompleted);

            return (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 lg:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Left Section */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-briefcase text-indigo-600 text-xl"></i>
                      </div>
                      <div>
                        <h3 className="text-lg lg:text-xl font-bold text-slate-900">{job.title}</h3>
                        <p className="text-sm text-slate-600">
                          <i className="fas fa-building mr-2"></i>
                          {job.company} • {job.location}
                        </p>
                        <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                          {job.jobType}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-700">CV Readiness</span>
                        <span className="text-sm font-bold text-slate-900">{readiness.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            readiness.percentage === 100
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                              : 'bg-gradient-to-r from-orange-500 to-yellow-500'
                          }`}
                          style={{ width: `${readiness.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleGenerateCV(job)}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors whitespace-nowrap"
                    >
                      <i className="fas fa-file-download mr-2"></i>
                      Generate CV
                    </button>
                    <a
                      href="/student/job-assessments"
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors text-center whitespace-nowrap"
                    >
                      <i className="fas fa-clipboard-check mr-2"></i>
                      Take Assessments
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Modal */}
        {showInfoModal && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[9998]"
              onClick={() => setShowInfoModal(false)}
            ></div>

            {/* Modal */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <i className="fas fa-info text-xl"></i>
                    </div>
                    <h2 className="text-xl font-bold">How Job-Specific CVs Work</h2>
                  </div>
                  <button
                    onClick={() => setShowInfoModal(false)}
                    className="w-8 h-8 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-colors"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-slate-600 mb-4">
                    Our intelligent CV generation system helps you create professional, job-specific CVs automatically based on your verified skills and achievements.
                  </p>

                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Complete Skill Assessments</h3>
                        <p className="text-sm text-slate-600">
                          Take assessments for all skills required for the job you're interested in. Each assessment verifies your knowledge and competency.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 font-bold">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Build Your Evidence</h3>
                        <p className="text-sm text-slate-600">
                          Add testimonials, certificates, and learning resources in Skill Planner to strengthen your CV with proof of expertise.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Generate Your CV</h3>
                        <p className="text-sm text-slate-600">
                          Once all assessments are completed (100% readiness), generate your CV automatically with one click.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600 font-bold">4</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Get Verified Results</h3>
                        <p className="text-sm text-slate-600">
                          Your CV will include only verified skills with proof: assessment scores, certificates, video demonstrations, and professional testimonials.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <i className="fas fa-lightbulb text-green-600 text-xl mt-1"></i>
                      <div>
                        <h4 className="font-semibold text-green-900 mb-1">Pro Tip</h4>
                        <p className="text-sm text-green-800">
                          The more evidence you add (testimonials, certificates, videos), the stronger your CV becomes. Employers love seeing verified proof of your skills!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 rounded-b-2xl flex justify-end">
                  <button
                    onClick={() => setShowInfoModal(false)}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Got it!
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default JobCV;
