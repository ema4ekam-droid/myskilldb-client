import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import StudentMenuNavigation from '../../../components/student-components/student-menu-components/StudentMenuNavigation';
import LoaderOverlay from '../../../components/loader/LoaderOverlay';

const HRManagers = () => {
  const [currentPage, setCurrentPage] = useState('hr-managers');
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
      name: 'Michael Chen',
      email: 'michael.chen@microsoft.com',
      whatsappContact: '+91 98765 43210',
      companyName: 'Microsoft',
      companyWebsite: 'www.microsoft.com',
      linkedinLink: 'linkedin.com/in/michaelchen',
      focusJob: 'Software Engineer'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya@amazon.com',
      whatsappContact: '+91 98123 45678',
      companyName: 'Amazon',
      companyWebsite: 'www.amazon.com',
      linkedinLink: 'linkedin.com/in/priyasharma',
      focusJob: 'Full Stack Developer'
    },
    {
      id: 3,
      name: 'David Wilson',
      email: 'david.wilson@google.com',
      whatsappContact: '+91 98765 12345',
      companyName: 'Google',
      companyWebsite: 'www.google.com',
      linkedinLink: 'linkedin.com/in/davidwilson',
      focusJob: 'Product Manager'
    }
  ]);

  // Email templates specific to HR Managers
  const emailTemplates = [
    {
      id: 1,
      title: 'Initial Job Application Follow-up',
      subject: 'Following Up on My Application - {Position Title}',
      body: `Dear {HR Manager Name},

I hope this email finds you well. I recently submitted my application for the {Position Title} role at {Company Name} (Application ID: {Your Application ID}), and I wanted to follow up to express my continued interest in this opportunity.

I am particularly excited about this role because:
- {Reason 1 - Align with company mission/values}
- {Reason 2 - Your relevant skills/experience}
- {Reason 3 - Career growth alignment}

My background in {Your Key Skills/Experience} aligns well with the requirements mentioned in the job description. I've worked on projects involving {Relevant Projects/Technologies}, which I believe would add immediate value to your team.

I would welcome the opportunity to discuss how my skills and experience can contribute to {Company Name}'s goals. I'm available for an interview at your convenience and can adjust to your schedule.

Thank you for considering my application. I look forward to hearing from you.

Best regards,
{Your Name}
{Your Phone Number}
{Your Email}
{Your LinkedIn Profile}`
    },
    {
      id: 2,
      title: 'Thank You After Interview',
      subject: 'Thank You for the Interview Opportunity',
      body: `Dear {HR Manager Name},

Thank you for taking the time to interview me {yesterday/today} for the {Position Title} role at {Company Name}. I truly enjoyed our conversation and learning more about the team and the exciting projects you're working on.

Our discussion about {Specific Topic Discussed} was particularly engaging, and it reinforced my enthusiasm for this opportunity. I'm especially excited about {Specific Aspect of the Role} and the chance to contribute to {Company Goal/Project}.

I believe my experience with {Your Relevant Skills} and my passion for {Industry/Field} make me a strong fit for this role. I'm confident I can {Specific Contribution You Can Make}.

Please feel free to contact me if you need any additional information. I'm very excited about the possibility of joining your team and contributing to {Company Name}'s success.

Thank you once again for this opportunity.

Best regards,
{Your Name}
{Your Contact Information}`
    },
    {
      id: 3,
      title: 'Request for Informational Interview',
      subject: 'Request for Career Guidance and Company Insights',
      body: `Dear {HR Manager Name},

I hope this message finds you well. My name is {Your Name}, and I am currently a {Your Year} student at {Your College} pursuing {Your Degree}. I'm reaching out to request a brief informational interview to learn more about career opportunities at {Company Name}.

I've been following {Company Name}'s work in {Specific Area}, and I'm impressed by {Specific Achievement/Initiative}. As I plan my career path towards {Your Career Goal}, I would greatly appreciate the opportunity to learn from your experience and insights.

I'm particularly interested in understanding:
- The skills and qualities {Company Name} values most in candidates
- Career growth paths within the organization
- Advice for students aspiring to join {Company Name}

I understand you have a busy schedule, so I would be grateful for even 15-20 minutes of your time. I'm flexible and happy to work around your availability for a phone call or virtual meeting.

Thank you for considering my request. I look forward to the possibility of connecting with you.

Best regards,
{Your Name}
{Your Email}
{Your Phone Number}
{Your LinkedIn Profile}`
    },
    {
      id: 4,
      title: 'Salary Negotiation Email',
      subject: 'Job Offer Discussion - {Position Title}',
      body: `Dear {HR Manager Name},

Thank you very much for extending the offer for the {Position Title} role at {Company Name}. I am excited about the opportunity to join your team and contribute to {Company Goal/Project}.

After carefully reviewing the offer, I would like to discuss the compensation package. Based on my research of industry standards for similar roles in {Location/Market}, along with my {Your Experience/Skills}, I was hoping we could discuss a salary of {Your Target Salary Range}.

This expectation is based on:
- My {X years} of experience in {Relevant Field}
- Specialized skills in {Your Key Skills}
- {Relevant Achievement/Certification}
- Market research for similar positions in our region

I'm very excited about this opportunity and believe I will bring significant value to the team through {Your Unique Value Proposition}. I'm hopeful we can reach an agreement that reflects both my qualifications and the value I'll bring to {Company Name}.

I'm open to discussing this further at your convenience. Thank you for your understanding and consideration.

Best regards,
{Your Name}
{Your Contact Information}`
    },
    {
      id: 5,
      title: 'Accepting Job Offer',
      subject: 'Acceptance of Job Offer - {Position Title}',
      body: `Dear {HR Manager Name},

I am writing to formally accept your offer for the position of {Position Title} at {Company Name}. Thank you for this wonderful opportunity. I am excited to join the team and contribute to {Company Goal/Project}.

As discussed, I confirm the following details:
- Start Date: {Agreed Start Date}
- Salary: {Agreed Salary}
- Benefits: {Key Benefits Discussed}

Please let me know what the next steps are and if there are any documents or information you need from me prior to my start date. I'm happy to complete any pre-employment requirements at your earliest convenience.

I look forward to working with you and the entire team at {Company Name}. Thank you once again for this opportunity.

Best regards,
{Your Name}
{Your Contact Information}`
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
    toast.success('HR Manager contact added successfully!');
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
      <LoaderOverlay isVisible={isLoading} title="HR Managers" subtitle="Loading your contacts..." />
      <StudentMenuNavigation currentPage={currentPage} onPageChange={handlePageChange} />
      
      <div className="min-h-screen bg-slate-50 lg:ml-72 p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6 pt-12 lg:pt-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">HR Manager Contacts</h1>
          <p className="text-sm text-slate-600">
            Manage your HR connections and access professional email templates
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus-circle"></i>
            Add New HR Manager
          </button>
          
          <button
            onClick={() => setShowEmailTemplates(true)}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
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
              placeholder="Search HR managers by name, email, company, or job..."
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
              <thead className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-slate-200">
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
                  <tr key={contact.id} className="hover:bg-green-50 transition-colors">
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
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {contact.focusJob}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={`mailto:${contact.email}`}
                          className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                          title="Send Email"
                        >
                          <i className="fas fa-envelope text-green-600"></i>
                        </a>
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            setShowDetailModal(true);
                          }}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition-colors"
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
              <i className="fas fa-user-tie text-5xl text-slate-300 mb-4"></i>
              <p className="text-slate-500">No HR managers found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <i className="fas fa-chevron-left text-slate-600"></i>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold">
            1
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            2
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            3
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <i className="fas fa-chevron-right text-slate-600"></i>
          </button>
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
              <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <i className="fas fa-user-plus text-xl"></i>
                  </div>
                  <h2 className="text-xl font-bold">Add New HR Manager</h2>
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
                      placeholder="Enter HR manager's name"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      placeholder="e.g., Microsoft"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      placeholder="hr@example.com"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      placeholder="e.g., Software Engineer"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Add HR Manager
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
              <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <i className="fas fa-envelope text-xl"></i>
                  </div>
                  <h2 className="text-xl font-bold">Email Templates for HR Managers</h2>
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
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
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
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-colors"
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
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
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
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
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
                    className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors text-center"
                  >
                    <i className="fas fa-envelope mr-2"></i>
                    Send Email
                  </a>
                  <a
                    href={`https://wa.me/${selectedContact.whatsappContact.replace(/\s+/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors text-center"
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

export default HRManagers;

