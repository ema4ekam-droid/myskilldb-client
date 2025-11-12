import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import StudentMenuNavigation from '../../../components/student-components/student-menu-components/StudentMenuNavigation';
import LoaderOverlay from '../../../components/loader/LoaderOverlay';

const Founders = () => {
  const [currentPage, setCurrentPage] = useState('founders');
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
      name: 'Elon Musk',
      email: 'elon@spacex.com',
      whatsappContact: '+91 98765 43210',
      companyName: 'SpaceX',
      companyWebsite: 'www.spacex.com',
      linkedinLink: 'linkedin.com/in/elonmusk',
      focusJob: 'Aerospace Engineer'
    },
    {
      id: 2,
      name: 'Satya Nadella',
      email: 'satya@microsoft.com',
      whatsappContact: '+91 98123 45678',
      companyName: 'Microsoft',
      companyWebsite: 'www.microsoft.com',
      linkedinLink: 'linkedin.com/in/satyanadella',
      focusJob: 'Cloud Architect'
    },
    {
      id: 3,
      name: 'Sundar Pichai',
      email: 'sundar@google.com',
      whatsappContact: '+91 98765 12345',
      companyName: 'Google',
      companyWebsite: 'www.google.com',
      linkedinLink: 'linkedin.com/in/sundarpichai',
      focusJob: 'Product Manager'
    }
  ]);

  // Email templates specific to Founders
  const emailTemplates = [
    {
      id: 1,
      title: 'Cold Email to Founder - Seeking Advice',
      subject: 'Seeking Guidance from a Visionary Leader',
      body: `Dear {Founder Name},

I hope this message finds you well. My name is {Your Name}, and I am a {Your Year} student at {Your College} deeply passionate about {Industry/Field}.

I have been following {Company Name}'s journey and your leadership with great admiration. Your approach to {Specific Innovation/Strategy} has been particularly inspiring to me as I shape my own career path.

I am reaching out with a humble request: would you be open to a brief conversation (15-20 minutes) where I could learn from your experiences? I'm especially interested in understanding:
- How you identified and validated your business idea
- Key lessons from your entrepreneurial journey
- Advice for aspiring entrepreneurs in {Industry}

I understand you have an incredibly demanding schedule, so I'm flexible with timing and happy to work around your availability.

Thank you for considering my request. Your insights would be invaluable as I navigate my career journey.

Best regards,
{Your Name}
{Your Email}
{Your LinkedIn Profile}`
    },
    {
      id: 2,
      title: 'Request for Internship/Job Opportunity',
      subject: 'Passionate {Your Field} Enthusiast Seeking to Contribute to {Company Name}',
      body: `Dear {Founder Name},

I hope this email finds you well. My name is {Your Name}, and I am writing to express my strong interest in contributing to {Company Name}'s mission of {Company Mission}.

As a {Your Background}, I have been developing skills in {Your Key Skills} and have worked on projects involving {Your Relevant Projects}. What draws me to {Company Name} is {Specific Reason - Innovation/Impact/Technology}.

I believe I can add value to your team through:
- {Your Strength 1}
- {Your Strength 2}
- {Your Strength 3}

I would love the opportunity to discuss how I can contribute to {Company Name}, whether through an internship, project-based collaboration, or any role where my skills could be useful.

I've attached my resume for your review. I'm excited about the possibility of being part of your journey to {Company Goal}.

Thank you for your time and consideration.

Best regards,
{Your Name}
{Your Contact Information}
{Your Portfolio/LinkedIn}`
    },
    {
      id: 3,
      title: 'Networking - Industry Event Follow-up',
      subject: 'Great Meeting You at {Event Name}',
      body: `Dear {Founder Name},

It was a pleasure meeting you at {Event Name} {yesterday/last week}. Our conversation about {Topic Discussed} was truly enlightening and has given me a fresh perspective on {Industry/Field}.

I was particularly intrigued by your insights on {Specific Point They Made}. Since our conversation, I've been exploring {Action You Took Based on Their Advice}, and it has already proven valuable.

As I mentioned during our chat, I'm currently working on {Your Project/Area of Focus}. I would love to stay connected and keep you updated on my progress. If you're open to it, I'd be grateful for the opportunity to reach out occasionally with questions or updates.

Thank you again for your time and generosity in sharing your experiences. I look forward to staying in touch.

Best regards,
{Your Name}
{Your Contact Information}`
    },
    {
      id: 4,
      title: 'Requesting a Meeting/Coffee Chat',
      subject: 'Request for a Brief Meeting - Inspired by Your Journey',
      body: `Dear {Founder Name},

I hope you're doing well. My name is {Your Name}, and I'm reaching out because I'm genuinely inspired by what you've built with {Company Name}.

Your recent {Interview/Article/Achievement} about {Specific Topic} resonated deeply with me. I'm currently {Your Current Status - student/working on/exploring} in the {Industry} space, and your approach to {Specific Strategy} has influenced my thinking significantly.

I would be incredibly grateful for the opportunity to meet with you for coffee or a brief virtual chat. I promise to be mindful of your time - even 15 minutes would be invaluable.

I'm particularly interested in learning about:
- Your decision-making process during {Specific Challenge}
- How you approach {Specific Business Aspect}
- Advice for someone aspiring to {Your Goal}

Please let me know if you have any availability in the coming weeks. I'm happy to work around your schedule.

Thank you for considering my request.

Best regards,
{Your Name}
{Your Email}
{Your Phone}`
    },
    {
      id: 5,
      title: 'Pitching an Idea for Collaboration',
      subject: 'Exciting Collaboration Opportunity for {Company Name}',
      body: `Dear {Founder Name},

I hope this email finds you well. My name is {Your Name}, and I'm reaching out with an idea that I believe could be valuable for {Company Name}.

I've been following {Company Name}'s work in {Industry/Area}, particularly your focus on {Specific Initiative}. I've developed {Your Idea/Solution} that could potentially {Value Proposition - enhance/complement/solve}.

Here's a brief overview:
- Problem: {Problem Your Idea Solves}
- Solution: {Your Solution in 1-2 sentences}
- Value: {How it benefits Company Name}

I have {Relevant Credentials - built a prototype/conducted research/gained experience} in this area and would love to discuss how this could align with {Company Name}'s goals.

Would you be open to a brief call to explore this further? I'm confident this could be mutually beneficial.

Thank you for your time, and I look forward to the possibility of working together.

Best regards,
{Your Name}
{Your Contact Information}
{Link to Demo/Presentation if applicable}`
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
    toast.success('Founder contact added successfully!');
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
      <LoaderOverlay isVisible={isLoading} title="Founders" subtitle="Loading your contacts..." />
      <StudentMenuNavigation currentPage={currentPage} onPageChange={handlePageChange} />
      
      <div className="min-h-screen bg-slate-50 lg:ml-72 p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6 pt-12 lg:pt-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Founder Contacts</h1>
          <p className="text-sm text-slate-600">
            Connect with industry leaders and visionary founders
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus-circle"></i>
            Add New Founder
          </button>
          
          <button
            onClick={() => setShowEmailTemplates(true)}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
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
              placeholder="Search founders by name, email, company, or job..."
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
              <thead className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-slate-200">
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
                  <tr key={contact.id} className="hover:bg-orange-50 transition-colors">
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
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                        {contact.focusJob}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={`mailto:${contact.email}`}
                          className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
                          title="Send Email"
                        >
                          <i className="fas fa-envelope text-orange-600"></i>
                        </a>
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            setShowDetailModal(true);
                          }}
                          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold transition-colors"
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
              <i className="fas fa-rocket text-5xl text-slate-300 mb-4"></i>
              <p className="text-slate-500">No founders found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <i className="fas fa-chevron-left text-slate-600"></i>
          </button>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold">
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
              <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <i className="fas fa-user-plus text-xl"></i>
                  </div>
                  <h2 className="text-xl font-bold">Add New Founder</h2>
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
                      placeholder="Enter founder's name"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                      placeholder="e.g., SpaceX"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                      placeholder="founder@example.com"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                      placeholder="e.g., Aerospace Engineer"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Add Founder
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
              <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <i className="fas fa-envelope text-xl"></i>
                  </div>
                  <h2 className="text-xl font-bold">Email Templates for Founders</h2>
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
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
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
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors"
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
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
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
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
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
                    className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors text-center"
                  >
                    <i className="fas fa-envelope mr-2"></i>
                    Send Email
                  </a>
                  <a
                    href={`https://wa.me/${selectedContact.whatsappContact.replace(/\s+/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors text-center"
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

export default Founders;

