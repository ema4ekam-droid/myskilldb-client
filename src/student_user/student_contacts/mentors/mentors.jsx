import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import StudentMenuNavigation from '../../../components/student-components/student-menu-components/StudentMenuNavigation';
import LoaderOverlay from '../../../components/loader/LoaderOverlay';

const Mentors = () => {
  const [currentPage, setCurrentPage] = useState('mentors');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEmailTemplates, setShowEmailTemplates] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    whatsappContact: '',
    linkedinLink: '',
    focusJob: ''
  });

  // Dummy contacts data
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@techcorp.com',
      whatsappContact: '+91 98765 43210',
      companyName: 'TechCorp Solutions',
      companyWebsite: 'www.techcorp.com',
      linkedinLink: 'linkedin.com/in/sarahjohnson',
      focusJob: 'Frontend Developer'
    },
    {
      id: 2,
      name: 'Athifa Michel',
      email: 'athifa@indosat.com',
      whatsappContact: '+91 98123 45678',
      companyName: 'PT Indosat',
      companyWebsite: 'www.indosat.co.id',
      linkedinLink: 'linkedin.com/in/athifamichel',
      focusJob: 'Full Stack Developer'
    },
    {
      id: 3,
      name: 'Zieggy R.',
      email: 'zieggy@accenture.com',
      whatsappContact: '+91 98765 12345',
      companyName: 'PT Accenture',
      companyWebsite: 'www.accenture.com',
      linkedinLink: 'linkedin.com/in/zieggyr',
      focusJob: 'Backend Developer'
    }
  ]);

  // Email templates
  const emailTemplates = [
    {
      id: 1,
      title: 'Initial Introduction Request',
      subject: 'Request for Mentorship - {Your Name}',
      body: `Dear {Mentor Name},

I hope this email finds you well. My name is {Your Name}, and I am currently a student at {Your College} pursuing {Your Degree} with a focus on {Your Focus Area}.

I came across your profile on LinkedIn and was truly inspired by your work at {Company Name}, particularly your experience in {Specific Area}. I am reaching out to seek your guidance as I navigate my career path towards becoming a {Target Role}.

I would be grateful for the opportunity to connect with you for a brief conversation (15-20 minutes) to learn from your experiences and seek your advice on:
- Breaking into the {Industry} industry
- Key skills and technologies I should focus on
- Any internship or learning opportunities you might recommend

I understand you have a busy schedule, so I'm happy to work around your availability. Would you be open to a quick virtual coffee chat in the coming weeks?

Thank you for considering my request. I look forward to hearing from you.

Best regards,
{Your Name}
{Your Email}
{Your LinkedIn Profile}`
    },
    {
      id: 2,
      title: 'Follow-up After Meeting',
      subject: 'Thank You for Your Time and Guidance',
      body: `Dear {Mentor Name},

I wanted to extend my heartfelt thanks for taking the time to speak with me {yesterday/last week}. Our conversation was incredibly valuable, and I truly appreciate the insights you shared about {Specific Topic Discussed}.

Your advice on {Key Advice} has given me a clear direction, and I'm already taking steps to {Action You're Taking}. I've also started exploring {Resource/Opportunity They Mentioned} as you suggested.

I would love to keep you updated on my progress and hope we can stay connected. If you're open to it, I'd be grateful for the opportunity to reach out occasionally with questions as I continue on this journey.

Thank you once again for your generosity with your time and knowledge. Your mentorship means a great deal to me.

Best regards,
{Your Name}`
    },
    {
      id: 3,
      title: 'Progress Update to Mentor',
      subject: 'Progress Update - {Your Name}',
      body: `Dear {Mentor Name},

I hope you're doing well. I wanted to share a quick update on the progress I've made since our last conversation.

Following your advice, I have:
✓ {Achievement 1}
✓ {Achievement 2}
✓ {Achievement 3}

I'm also working on {Current Project/Learning}, which aligns with the career path we discussed. I would love to hear your thoughts on my approach when you have a moment.

Additionally, I had a specific question about {Your Question}. Based on your experience, I'd greatly appreciate any insights you could share.

Thank you for continuing to guide me on this journey. Your mentorship has been instrumental in keeping me focused and motivated.

Looking forward to hearing from you.

Best regards,
{Your Name}`
    },
    {
      id: 4,
      title: 'Request for Introduction/Referral',
      subject: 'Seeking Your Guidance on an Opportunity',
      body: `Dear {Mentor Name},

I hope this message finds you well. I wanted to reach out because I recently came across an exciting opportunity at {Company Name} for a {Position Title} role that aligns perfectly with our discussions about my career goals.

Given your experience in the industry and your network, I was wondering if you might be willing to provide any insights about the company or the role. If you happen to know anyone at {Company Name} who I could connect with to learn more about the team and culture, I would be immensely grateful for an introduction.

I've been preparing for this opportunity by:
- {Skill/Project 1}
- {Skill/Project 2}
- {Skill/Project 3}

I completely understand if this isn't possible, and I appreciate all the guidance you've already provided. Please let me know if there's any additional information I can provide.

Thank you for considering my request.

Best regards,
{Your Name}
{Your LinkedIn Profile}
{Your Portfolio/Resume Link}`
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddContact = () => {
    if (!formData.name || !formData.email || !formData.focusJob) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newContact = {
      id: Date.now(),
      ...formData,
      companyWebsite: `www.${formData.companyName.toLowerCase().replace(/\s+/g, '')}.com`
    };

    setContacts([newContact, ...contacts]);
    setShowAddModal(false);
    setFormData({
      name: '',
      companyName: '',
      email: '',
      whatsappContact: '',
      linkedinLink: '',
      focusJob: ''
    });
    toast.success('Mentor contact added successfully!');
  };

  const handleCopyTemplate = (template) => {
    const fullTemplate = `Subject: ${template.subject}\n\n${template.body}`;
    navigator.clipboard.writeText(fullTemplate);
    toast.success('Email template copied to clipboard!');
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.focusJob.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <LoaderOverlay isVisible={isLoading} title="Mentors" subtitle="Loading your contacts..." />
      <StudentMenuNavigation currentPage={currentPage} onPageChange={handlePageChange} />
      
      <div className="min-h-screen bg-slate-50 lg:ml-72 p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6 pt-12 lg:pt-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Mentor Contacts</h1>
          <p className="text-sm text-slate-600">
            Manage your mentor connections and access email templates
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus-circle"></i>
            Add New Mentor
          </button>
          
          <button
            onClick={() => setShowEmailTemplates(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-envelope"></i>
            Email Templates
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex items-center gap-3">
            <i className="fas fa-search text-slate-400"></i>
            <input
              type="text"
              placeholder="Search mentors by name, email, company, or job..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-slate-700"
            />
          </div>
        </div>

        {/* Contacts Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider hidden md:table-cell">
                    WhatsApp
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider hidden lg:table-cell">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider hidden xl:table-cell">
                    Focus Job
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{contact.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-700 text-sm">{contact.email}</p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-slate-700 text-sm">{contact.whatsappContact}</p>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <p className="text-slate-700 text-sm">{contact.companyName}</p>
                    </td>
                    <td className="px-6 py-4 hidden xl:table-cell">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {contact.focusJob}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={`mailto:${contact.email}`}
                          className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                          title="Send Email"
                        >
                          <i className="fas fa-envelope text-purple-600"></i>
                        </a>
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            setShowDetailModal(true);
                          }}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          DETAIL
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredContacts.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-user-friends text-5xl text-slate-300 mb-4"></i>
              <p className="text-slate-500">No mentors found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[9998]"
            onClick={() => setShowAddModal(false)}
          ></div>

          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <i className="fas fa-user-plus text-xl"></i>
                  </div>
                  <h2 className="text-xl font-bold">Add New Mentor</h2>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter mentor's name"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g., TechCorp Solutions"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="mentor@example.com"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      WhatsApp Contact
                    </label>
                    <input
                      type="text"
                      value={formData.whatsappContact}
                      onChange={(e) => setFormData({ ...formData, whatsappContact: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="text"
                      value={formData.linkedinLink}
                      onChange={(e) => setFormData({ ...formData, linkedinLink: e.target.value })}
                      placeholder="linkedin.com/in/username"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Focus Job *
                    </label>
                    <input
                      type="text"
                      value={formData.focusJob}
                      onChange={(e) => setFormData({ ...formData, focusJob: e.target.value })}
                      placeholder="e.g., Frontend Developer"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 rounded-b-2xl flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddContact}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Add Mentor
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Email Templates Modal */}
      {showEmailTemplates && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[9998]"
            onClick={() => setShowEmailTemplates(false)}
          ></div>

          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <i className="fas fa-envelope text-xl"></i>
                  </div>
                  <h2 className="text-xl font-bold">Email Templates for Mentors</h2>
                </div>
                <button
                  onClick={() => setShowEmailTemplates(false)}
                  className="w-8 h-8 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {emailTemplates.map((template) => (
                  <div key={template.id} className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{template.title}</h3>
                        <p className="text-sm text-slate-600">Subject: {template.subject}</p>
                      </div>
                      <button
                        onClick={() => handleCopyTemplate(template)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                      >
                        <i className="fas fa-copy"></i>
                        Copy
                      </button>
                    </div>
                    <pre className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-200 max-h-64 overflow-y-auto">
                      {template.body}
                    </pre>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 bg-slate-50 rounded-b-2xl flex justify-end">
                <button
                  onClick={() => setShowEmailTemplates(false)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedContact && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[9998]"
            onClick={() => setShowDetailModal(false)}
          ></div>

          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
                <h2 className="text-xl font-bold">Contact Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-8 h-8 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Name</p>
                  <p className="text-lg font-semibold text-slate-900">{selectedContact.name}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Email</p>
                    <p className="text-slate-900">{selectedContact.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600 mb-1">WhatsApp</p>
                    <p className="text-slate-900">{selectedContact.whatsappContact}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600 mb-1">Company</p>
                    <p className="text-slate-900">{selectedContact.companyName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600 mb-1">Focus Job</p>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {selectedContact.focusJob}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-600 mb-1">LinkedIn Profile</p>
                  <a
                    href={`https://${selectedContact.linkedinLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {selectedContact.linkedinLink}
                  </a>
                </div>

                <div className="flex gap-3 pt-4">
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors text-center"
                  >
                    <i className="fas fa-envelope mr-2"></i>
                    Send Email
                  </a>
                  <a
                    href={`https://wa.me/${selectedContact.whatsappContact.replace(/\s+/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors text-center"
                  >
                    <i className="fab fa-whatsapp mr-2"></i>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Mentors;

