import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getRequest, postRequest, putRequest } from '../../../api/apiRequests';
import StudentMenuNavigation from '../../../components/student-components/student-menu-components/StudentMenuNavigation';
import LoaderOverlay from '../../../components/loader/LoaderOverlay';
import { ContactTable } from '../../../components/student-components/student-contacts-components/mentors-components';
import { emailTemplates } from './constants/emailTemplates';
import { ModalWrapper } from '../../../components/student-components/student-contacts-components/common-modal-components';

const Mentors = () => {
  const DESIGNATION = 'mentor';
  
  const [currentPage, setCurrentPage] = useState('mentors');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalView, setModalView] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [editingContact, setEditingContact] = useState(null);
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
        const response = await getRequest(`/contacts?designation=${DESIGNATION}`);
        
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
        toast.error('Failed to load mentor contacts');
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
      if (editingContact) {
        // Update existing contact
        const response = await putRequest(`/contacts/${DESIGNATION}/${editingContact.id}`, JSON.stringify(formData));
  
        const data = await response.json();
  
        if (!response.ok) throw new Error(data.message);
  
        const updatedContacts = contacts.map(contact =>
          contact.id === editingContact.id ? data.data : contact
        );
        setContacts(updatedContacts);
        toast.success(`${DESIGNATION} contact updated successfully!`);
      } else {
        // Add new contact
        const response = await postRequest(`/contacts/add/${DESIGNATION}`, JSON.stringify(formData));
  
        const data = await response.json();
  
        if (!response.ok) throw new Error(data.message);
  
        setContacts([data.data, ...contacts]);
        toast.success(`${DESIGNATION} contact added successfully!`);
      }
  
      closeModal();
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name || '',
      organization: contact.organization || '',
      organizationLink: contact.organizationLink || '',
      email: contact.email || '',
      mobile: contact.mobile || '',
      linkedin: contact.linkedin || '',
      note: contact.note || ''
    });
    setModalView('add');
  };

  const handleViewDetail = (contact) => {
    setSelectedContact(contact);
    setModalView('detail');
  };

  const closeModal = () => {
    setModalView(null);
    setSelectedContact(null);
    setEditingContact(null);
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

  const filteredContacts = contacts.filter(contact =>
    contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.linkedin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.note?.toLowerCase().includes(searchQuery.toLowerCase())
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
            onClick={() => {
              setEditingContact(null);
              setModalView('add');
            }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus-circle"></i>
            Add New Mentor
          </button>
          
          <button
            onClick={() => setModalView('templates')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-envelope"></i>
            Email Templates
          </button>
        </div>
        {/* Contacts Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <ContactTable
            contacts={filteredContacts}
            onEdit={handleEditContact}
            onViewDetail={handleViewDetail}
          />
        </div>
      </div>

      {/* Unified Modal */}
      <ModalWrapper
        modalView={modalView}
        onClose={closeModal}
        formData={formData}
        setFormData={setFormData}
        editingContact={editingContact}
        onSubmit={handleAddContact}
        selectedContact={selectedContact}
        emailTemplates={emailTemplates}
      />
    </>
  );
};

export default Mentors;

