import React from 'react';

const ContactDetailModal = ({ isOpen, onClose, contact }) => {
  if (!isOpen || !contact) return null;

  return (
    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
        <h2 className="text-xl font-bold">Contact Details</h2>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors shadow-md"
          title="Close"
        >
          <i className="fas fa-times text-slate-700 text-md"></i>
        </button>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <p className="text-sm text-slate-600 mb-1">Name</p>
          <p className="text-lg font-semibold text-slate-900">{contact.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-600 mb-1">Email</p>
            <p className="text-slate-900">{contact.email || 'N/A'}</p>
          </div>

          <div>
            <p className="text-sm text-slate-600 mb-1">Mobile</p>
            <p className="text-slate-900">{contact.mobile || 'N/A'}</p>
          </div>

          <div>
            <p className="text-sm text-slate-600 mb-1">Organization</p>
            {contact.organizationLink ? (
              <a
                href={contact.organizationLink.startsWith('http') 
                  ? contact.organizationLink 
                  : `https://${contact.organizationLink.replace(/^https?:\/\//, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 hover:underline group"
              >
                <span className="font-medium">{contact.organization || 'View Organization'}</span>
                <i className="fas fa-external-link-alt text-xs opacity-70 group-hover:opacity-100 transition-opacity"></i>
              </a>
            ) : (
              <p className="text-slate-900">{contact.organization || 'N/A'}</p>
            )}
          </div>
        </div>

        {contact.linkedin && (
          <div>
            <p className="text-sm text-slate-600 mb-2">LinkedIn Profile</p>
            <a
              href={contact.linkedin.startsWith('http') 
                ? contact.linkedin 
                : `https://${contact.linkedin.replace(/^https?:\/\//, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all duration-200 hover:shadow-md group"
            >
              <i className="fab fa-linkedin text-lg group-hover:scale-110 transition-transform"></i>
              <span className="font-medium">View Profile</span>
              <i className="fas fa-external-link-alt text-xs opacity-70 group-hover:opacity-100 transition-opacity"></i>
            </a>
          </div>
        )}

        {contact.note && (
          <div>
            <p className="text-sm text-slate-600 mb-1">Note</p>
            <p className="text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-200">
              {contact.note}
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors text-center"
            >
              <i className="fas fa-envelope mr-2"></i>
              Send Email
            </a>
          )}
          {contact.mobile && (
            <a
              href={`https://wa.me/${contact.mobile.replace(/\s+/g, '').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors text-center"
            >
              <i className="fab fa-whatsapp mr-2"></i>
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactDetailModal;

