import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import StudentMenuNavigation from '../../../components/student-components/student-menu-components/StudentMenuNavigation';
import LoaderOverlay from '../../../components/loader/LoaderOverlay';

const JobCV = () => {
  const [currentPage, setCurrentPage] = useState('cv');
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('jobs'); // 'jobs', 'profile', 'preview'
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // Profile data (saved once, used for all CVs)
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    address: 'Bangalore, Karnataka, India',
    photo: 'https://ui-avatars.com/api/?name=John+Doe&size=200&background=4F46E5&color=fff',
    linkedin: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe',
    portfolio: 'johndoe.dev',
    aboutMe: 'Passionate developer with strong problem-solving skills and experience in building scalable web applications.',
    education: [
      {
        id: 'edu-1',
        degree: 'B.Tech in Computer Science',
        institution: 'XYZ University',
        location: 'Bangalore, India',
        startYear: '2019',
        endYear: '2023',
        gpa: '8.5/10'
      }
    ],
    workExperience: [
      {
        id: 'exp-1',
        title: 'Frontend Developer Intern',
        company: 'Tech Startup Inc.',
        location: 'Bangalore, India',
        startDate: 'Jun 2022',
        endDate: 'Dec 2022',
        current: false,
        description: 'Built responsive UI with React and Tailwind CSS, implemented reusable components, integrated REST APIs and auth, and improved performance metrics by optimizing bundle size and lazy-loading routes.'
      },
      {
        id: 'exp-2',
        title: 'Web Development Trainee',
        company: 'Digital Solutions Ltd.',
        location: 'Bangalore, India',
        startDate: 'Jan 2022',
        endDate: 'May 2022',
        current: false,
        description: 'Completed intensive bootcamp covering HTML5, CSS3, JavaScript and React. Delivered 5+ mobile-first landing pages, collaborated in Agile sprints, and practiced Git workflow and code reviews.'
      },
      {
        id: 'exp-3',
        title: 'Volunteer Developer',
        company: 'Open Source Community',
        location: 'Remote',
        startDate: 'Aug 2021',
        endDate: 'Dec 2021',
        current: false,
        description: 'Contributed bug fixes and documentation to a React component library; added unit tests and accessibility improvements following WCAG guidelines.'
      }
    ]
  });

  // Jobs with assessment status
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [generatedCV, setGeneratedCV] = useState(null);

  useEffect(() => {
    fetchJobsAndAssessments();
  }, []);

  const fetchJobsAndAssessments = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Jobs with skills and assessment completion status
      const jobsData = [
        {
          id: 'job-1',
          title: 'Frontend Developer',
          company: 'TechCorp Solutions',
          location: 'Bangalore, India',
          jobType: 'Full-time',
          skills: [
            {
              id: 'skill-1',
              name: 'React',
              assessmentCompleted: true,
              score: 91.7,
              completedDate: '2024-01-28',
              testimonials: [
                {
                  id: 'test-1',
                  project: 'E-commerce Platform',
                  validatorName: 'Ms. Priya Sharma',
                  validatorRole: 'Project Manager, TechSolutions Inc.',
                  status: 'approved',
                  testimonialText: 'John demonstrated exceptional React skills while building our e-commerce platform. His understanding of component architecture and state management was impressive.'
                }
              ],
              certificates: [
                {
                  id: 'cert-1',
                  name: 'React - The Complete Guide',
                  issuer: 'Udemy',
                  link: 'https://udemy.com/certificate/UC-12345678'
                }
              ],
              videos: [
                {
                  id: 'vid-1',
                  title: 'React Hooks Deep Dive',
                  link: 'https://youtu.be/y9Dk6wMc8UM'
                },
                {
                  id: 'vid-2',
                  title: 'Optimizing React Performance',
                  link: 'https://youtu.be/dpw9EHDh2bM'
                }
              ]
            },
            {
              id: 'skill-2',
              name: 'JavaScript/TypeScript',
              assessmentCompleted: true,
              score: 87.5,
              completedDate: '2024-01-27',
              testimonials: [],
              certificates: [
                {
                  id: 'cert-2',
                  name: 'Modern JavaScript',
                  issuer: 'Coursera',
                  link: 'https://coursera.org/verify/ABCD1234'
                }
              ],
              videos: [
                {
                  id: 'vid-3',
                  title: 'Async/Await in Depth',
                  link: 'https://youtu.be/V_Kr9OSfDeU'
                },
                {
                  id: 'vid-4',
                  title: 'TypeScript for React Devs',
                  link: 'https://youtu.be/zQnBQ4tB3ZA'
                },
                {
                  id: 'vid-5',
                  title: 'JavaScript ES6 Features',
                  link: 'https://youtu.be/WZQc7RUAg18'
                }
              ]
            },
            {
              id: 'skill-3',
              name: 'CSS/Tailwind',
              assessmentCompleted: true,
              score: 100,
              completedDate: '2024-01-25',
              testimonials: [],
              certificates: [
                {
                  id: 'cert-3',
                  name: 'Advanced CSS Grid & Flexbox',
                  issuer: 'Udemy',
                  link: 'https://udemy.com/certificate/EFGH5678'
                }
              ],
              videos: [
                {
                  id: 'vid-6',
                  title: 'Tailwind CSS Crash Course',
                  link: 'https://youtu.be/dFgzHOX84xQ'
                }
              ]
            }
          ]
        },
        {
          id: 'job-2',
          title: 'Full Stack Developer',
          company: 'Innovation Labs',
          location: 'Remote',
          jobType: 'Full-time',
          skills: [
            {
              id: 'skill-4',
              name: 'Node.js',
              assessmentCompleted: false,
              score: null,
              testimonials: [],
              certificates: [],
              videos: 0
            },
            {
              id: 'skill-5',
              name: 'REST APIs',
              assessmentCompleted: false,
              score: null,
              testimonials: [],
              certificates: [],
              videos: 0
            },
            {
              id: 'skill-2',
              name: 'JavaScript/TypeScript',
              assessmentCompleted: true,
              score: 87.5,
              completedDate: '2024-01-27',
              testimonials: [],
              certificates: [
                {
                  id: 'cert-2',
                  name: 'Modern JavaScript',
                  issuer: 'Coursera',
                  link: 'https://coursera.org/verify/ABCD1234'
                }
              ],
              videos: [
                {
                  id: 'vid-3',
                  title: 'Async/Await in Depth',
                  link: 'https://youtu.be/V_Kr9OSfDeU'
                },
                {
                  id: 'vid-4',
                  title: 'TypeScript for React Devs',
                  link: 'https://youtu.be/zQnBQ4tB3ZA'
                },
                {
                  id: 'vid-5',
                  title: 'JavaScript ES6 Features',
                  link: 'https://youtu.be/WZQc7RUAg18'
                }
              ]
            }
          ]
        },
        {
          id: 'job-3',
          title: 'UI/UX Developer',
          company: 'Design Studio',
          location: 'Bangalore, India',
          jobType: 'Contract',
          skills: [
            {
              id: 'skill-6',
              name: 'Figma',
              assessmentCompleted: false,
              score: null,
              testimonials: [],
              certificates: [],
              videos: 0
            },
            {
              id: 'skill-3',
              name: 'CSS/Tailwind',
              assessmentCompleted: true,
              score: 100,
              completedDate: '2024-01-25',
              testimonials: [],
              certificates: [
                {
                  id: 'cert-3',
                  name: 'Advanced CSS Grid & Flexbox',
                  issuer: 'Udemy',
                  link: 'https://udemy.com/certificate/EFGH5678'
                }
              ],
              videos: [
                {
                  id: 'vid-6',
                  title: 'Tailwind CSS Crash Course',
                  link: 'https://youtu.be/dFgzHOX84xQ'
                }
              ]
            }
          ]
        }
      ];

      setJobs(jobsData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const calculateJobReadiness = (job) => {
    const completedSkills = job.skills.filter(s => s.assessmentCompleted).length;
    const totalSkills = job.skills.length;
    return {
      completed: completedSkills,
      total: totalSkills,
      percentage: Math.round((completedSkills / totalSkills) * 100)
    };
  };

  const handleGenerateCV = (job) => {
    const readiness = calculateJobReadiness(job);
    
    if (readiness.percentage < 100) {
      toast.error('Please complete all skill assessments before generating CV');
      return;
    }

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

  const addEducation = () => {
    setProfile({
      ...profile,
      education: [
        ...profile.education,
        {
          id: `edu-${Date.now()}`,
          degree: '',
          institution: '',
          location: '',
          startYear: '',
          endYear: '',
          gpa: ''
        }
      ]
    });
  };

  const removeEducation = (id) => {
    setProfile({
      ...profile,
      education: profile.education.filter(edu => edu.id !== id)
    });
  };

  const updateEducation = (id, field, value) => {
    setProfile({
      ...profile,
      education: profile.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const saveProfile = () => {
    toast.success('Profile saved successfully!');
    setView('jobs');
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

  const addWorkExperience = () => {
    setProfile({
      ...profile,
      workExperience: [
        ...profile.workExperience,
        {
          id: `exp-${Date.now()}`,
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        }
      ]
    });
  };

  const removeWorkExperience = (id) => {
    setProfile({
      ...profile,
      workExperience: profile.workExperience.filter(exp => exp.id !== id)
    });
  };

  const updateWorkExperience = (id, field, value) => {
    setProfile({
      ...profile,
      workExperience: profile.workExperience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
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
              {/* Profile Photo */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Profile Photo</h3>
                <div className="flex items-center gap-6">
                  {profile.photo ? (
                    <img
                      src={profile.photo}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center">
                      <i className="fas fa-user text-4xl text-slate-400"></i>
                    </div>
                  )}
                  <div>
                    <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors cursor-pointer inline-block">
                      <i className="fas fa-upload mr-2"></i>
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-slate-600 mt-2">Recommended: Square image, at least 200x200px</p>
                  </div>
                </div>
              </div>

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
              {/* Header Section with Photo */}
              <div className="mb-8 pb-6 border-b-2 border-slate-200">
                <div className="flex flex-row items-start gap-6">
                  {/* Profile Photo */}
                  {generatedCV.profile.photo && (
                    <img
                      src={generatedCV.profile.photo}
                      alt={generatedCV.profile.fullName}
                      className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 shadow-lg flex-shrink-0"
                    />
                  )}
                  
                  {/* Contact Information */}
                  <div className="flex-1 text-left">
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                      {generatedCV.profile.fullName}
                    </h1>
                    <p className="text-lg font-semibold text-indigo-600 mb-2">
                      {generatedCV.job.title}
                    </p>
                    <p className="text-slate-600 mb-3">{generatedCV.profile.address}</p>
                    
                    <div className="flex flex-wrap justify-start gap-x-6 gap-y-2 text-sm text-slate-600 mb-2">
                      <span className="flex items-center gap-2">
                        <i className="fas fa-phone text-indigo-600"></i>
                        {generatedCV.profile.phone}
                      </span>
                      <span className="flex items-center gap-2">
                        <i className="fas fa-envelope text-indigo-600"></i>
                        {generatedCV.profile.email}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap justify-start gap-x-6 gap-y-2 text-sm">
                      {generatedCV.profile.linkedin && (
                        <a 
                          href={`https://${generatedCV.profile.linkedin}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                        >
                          <i className="fab fa-linkedin"></i>
                          LinkedIn
                        </a>
                      )}
                      {generatedCV.profile.github && (
                        <a 
                          href={`https://${generatedCV.profile.github}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                        >
                          <i className="fab fa-github"></i>
                          GitHub
                        </a>
                      )}
                      {generatedCV.profile.portfolio && (
                        <a 
                          href={`https://${generatedCV.profile.portfolio}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                        >
                          <i className="fas fa-globe"></i>
                          Portfolio
                        </a>
                      )}
                    </div>
                  </div>
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
                <div className="space-y-2">
                  {generatedCV.skills.map(skill => (
                    <div key={skill.id} className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm avoid-break">
                      <div className="mb-2">
                        <h3 className="text-base font-bold text-slate-900 mb-1">{skill.name}</h3>
                        
                        {/* Assessment Score Progress Bar */}
                        <div className="mb-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-slate-700">Assessment Score</span>
                            <span className="text-xs font-bold text-indigo-600">{skill.score}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all bg-indigo-600"
                              style={{ width: `${skill.score}%` }}
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
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Job-Specific CVs</h1>
          <p className="text-sm text-slate-600">
            Generate professional CVs automatically based on completed skill assessments
          </p>
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

        {/* How it Works */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <i className="fas fa-info-circle"></i>
            How Job-Specific CVs Work
          </h3>
          <ol className="text-sm text-blue-800 space-y-1 ml-6 list-decimal">
            <li>Complete skill assessments for the job you're interested in</li>
            <li>Add testimonials, certificates, and learning resources in Skill Planner</li>
            <li>Once all assessments are completed, generate your CV automatically</li>
            <li>Your CV will include only verified skills with proof (scores, certificates, testimonials)</li>
          </ol>
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
                      <p className="text-xs text-slate-600 mt-1">
                        {readiness.completed} of {readiness.total} skills verified
                      </p>
                    </div>

                    {/* Skills Breakdown */}
                    <div className="space-y-3">
                      {/* Completed Skills */}
                      {completedSkills.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-2">
                            <i className="fas fa-check-circle"></i>
                            Verified Skills ({completedSkills.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {completedSkills.map(skill => (
                              <span
                                key={skill.id}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-300"
                                title={`Score: ${skill.score}% • ${skill.certificates.length} certificates • ${skill.testimonials.length} testimonials`}
                              >
                                <i className="fas fa-check mr-1"></i>
                                {skill.name}
                                {skill.testimonials.length > 0 && (
                                  <i className="fas fa-award ml-1 text-yellow-600" title="Has testimonial"></i>
                                )}
                                {skill.certificates.length > 0 && (
                                  <i className="fas fa-certificate ml-1 text-blue-600" title="Has certificate"></i>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pending Skills */}
                      {pendingSkills.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-orange-700 mb-2 flex items-center gap-2">
                            <i className="fas fa-clock"></i>
                            Pending Assessments ({pendingSkills.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {pendingSkills.map(skill => (
                              <span
                                key={skill.id}
                                className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium border border-orange-300"
                              >
                                <i className="fas fa-exclamation-circle mr-1"></i>
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex flex-col gap-2">
                    {readiness.percentage === 100 ? (
                      <button
                        onClick={() => handleGenerateCV(job)}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors whitespace-nowrap"
                      >
                        <i className="fas fa-file-download mr-2"></i>
                        Generate CV
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          toast.info(`Complete ${pendingSkills.length} more assessment(s) to generate CV`);
                        }}
                        className="px-6 py-3 bg-slate-300 text-slate-600 rounded-lg font-semibold cursor-not-allowed whitespace-nowrap"
                        disabled
                      >
                        <i className="fas fa-lock mr-2"></i>
                        Complete Assessments
                      </button>
                    )}
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
      </div>
    </>
  );
};

export default JobCV;
