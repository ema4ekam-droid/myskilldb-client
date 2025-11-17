import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getRequest, postRequest } from '../../../api/apiRequests';
import StudentMenuNavigation from '../../../components/student-components/student-menu-components/StudentMenuNavigation';
import LoaderOverlay from '../../../components/loader/LoaderOverlay';
import { ContactTable } from '../../../components/student-components/student-contacts-components/mentors-components';
import { emailTemplates } from './constants/emailTemplates';
import { ModalWrapper } from '../../../components/student-components/student-contacts-components/common-modal-components';

const HRManagers = () => {
  const DESIGNATION = 'hr';
  
  const [currentPage, setCurrentPage] = useState('hr-managers');
  const [isLoading, setIsLoading] = useState(true);
  // const [searchQuery, setSearchQuery] = useState('');
  const [modalView, setModalView] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    organizationLink: '',
    email: '',
    mobile: '',
    linkedin: '',
    note: ''
  });

  // Fetch contacts from API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        const response = await getRequest(`/contacts/${DESIGNATION}`);
        
        if (response.data?.success && response.data?.data) {
          const transformedContacts = response.data.data.map((contact) => ({
            id: contact._id || contact.id,
            name: contact.name || '',
            email: contact.email || '',
            mobile: contact.mobile || '',
            organization: contact.organization || '',
            organizationLink: contact.organizationLink || contact.companyLink || '',
            linkedin: contact.linkedin || '',
            note: contact.note || '',
            designation: contact.designation || '',
            createdAt: contact.createdAt,
            updatedAt: contact.updatedAt
          }));
          setContacts(transformedContacts);
        } else {
          setContacts([]);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
        toast.error('Failed to load HR manager contacts');
        setContacts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddContact = async () => {
    if (!formData.name) {
      toast.error('Name is required');
      return;
    }
  
    try {
      // Prepare payload - remove organizationLink and clean empty strings
      const payload = {
        name: formData.name.trim(),
        designation: DESIGNATION,
        ...(formData.email?.trim() && { email: formData.email.trim() }),
        ...(formData.mobile?.trim() && { mobile: formData.mobile.trim() }),
        ...(formData.organization?.trim() && { organization: formData.organization.trim() }),
        ...(formData.linkedin?.trim() && { linkedin: formData.linkedin.trim() }),
        ...(formData.note?.trim() && { note: formData.note.trim() }),
      };

      // Add new contact
      const { data } = await postRequest(`/contacts/`, payload);

      setContacts([data.data, ...contacts]);
      toast.success('HR manager contact added successfully!');
  
      closeModal();
    } catch (error) {
      console.error('Error adding contact:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleViewDetail = (contact) => {
    setSelectedContact(contact);
    setModalView('detail');
  };

  const closeModal = () => {
    setModalView(null);
    setSelectedContact(null);
    setFormData({
      name: '',
      organization: '',
      organizationLink: '',
      email: '',
      mobile: '',
      linkedin: '',
      note: ''
    });
  };

  // const filteredContacts = contacts.filter(contact =>
  //   contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   contact.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   contact.linkedin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   contact.note?.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  
  const filteredContacts = contacts;

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
            onClick={() => setModalView('add')}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus-circle"></i>
            Add New HR Manager
          </button>
          
          <button
            onClick={() => setModalView('templates')}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-envelope"></i>
            Email Templates
          </button>
        </div>

        {/* Search and Filter */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex items-center gap-3">
            <i className="fas fa-search text-slate-400"></i>
            <input
              type="text"
              placeholder="Search HR managers by name, email, company, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-slate-700"
            />
          </div>
        </div> */}

        {/* Contacts Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <ContactTable
            contacts={filteredContacts}
            onViewDetail={handleViewDetail}
          />
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

      {/* Unified Modal */}
      <ModalWrapper
        modalView={modalView}
        onClose={closeModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddContact}
        selectedContact={selectedContact}
        emailTemplates={emailTemplates}
      />
    </>
  );
};

export default HRManagers;
