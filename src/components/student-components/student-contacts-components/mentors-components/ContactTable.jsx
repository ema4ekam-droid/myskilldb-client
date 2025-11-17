import React from 'react';

const ContactTable = ({ contacts, onViewDetail }) => {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-user-friends text-5xl text-slate-300 mb-4"></i>
        <p className="text-slate-500">No mentors found</p>
      </div>
    );
  }

  return (
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
            <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {contacts.map((contact) => (
            <tr key={contact.id} className="hover:bg-purple-50 transition-colors">
              <td className="px-6 py-4">
                <p className="font-semibold text-slate-900">{contact.name}</p>
              </td>
              <td className="px-6 py-4">
                <p className="text-slate-700 text-sm">{contact.email || 'N/A'}</p>
              </td>
              <td className="px-6 py-4 hidden md:table-cell">
                <p className="text-slate-700 text-sm">{contact.mobile || 'N/A'}</p>
              </td>
              <td className="px-6 py-4 hidden lg:table-cell">
                {contact.organizationLink ? (
                  <a
                    href={contact.organizationLink.startsWith('http') 
                      ? contact.organizationLink 
                      : `https://${contact.organizationLink.replace(/^https?:\/\//, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700 hover:underline inline-flex items-center gap-1 group"
                  >
                    <span>{contact.organization || 'View'}</span>
                    <i className="fas fa-external-link-alt text-xs opacity-0 group-hover:opacity-100 transition-opacity"></i>
                  </a>
                ) : (
                  <p className="text-slate-700 text-sm">{contact.organization || 'N/A'}</p>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                      title="Send Email"
                    >
                      <i className="fas fa-envelope text-purple-600"></i>
                    </a>
                  )}
                  <button
                    onClick={() => onViewDetail(contact)}
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
  );
};

export default ContactTable;

