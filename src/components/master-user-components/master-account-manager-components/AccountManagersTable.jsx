import React from 'react';
import Pagination from '../shared/Pagination';

const AccountManagersTable = ({
  accountManagers,
  isLoading,
  selectedAccountManagerIds,
  allChecked,
  onToggleSelectAll,
  onToggleSelectOne,
  onView,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  btnPrimaryClass,
  btnSecondaryClass,
  btnDangerClass
}) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', class: 'bg-green-100 text-green-800' },
      inactive: { label: 'Inactive', class: 'bg-red-100 text-red-800' },
      pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-800' }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatMobile = (mobile) => {
    if (!mobile) return 'Not provided';
    return `+91-${mobile}`;
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Table Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Account Managers</h2>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <i className="fas fa-users"></i>
            <span>{accountManagers.length} account manager(s)</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  checked={allChecked}
                  onChange={(e) => onToggleSelectAll(e.target.checked)}
                />
              </th>
              <th className="p-4 text-left font-semibold text-slate-700">Name</th>
              <th className="p-4 text-left font-semibold text-slate-700">Email</th>
              <th className="p-4 text-left font-semibold text-slate-700">Mobile</th>
              <th className="p-4 text-left font-semibold text-slate-700">Status</th>
              <th className="p-4 text-left font-semibold text-slate-700">Verified</th>
              <th className="p-4 text-left font-semibold text-slate-700">Created</th>
              <th className="p-4 text-center font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {accountManagers.length > 0 ? accountManagers.map(accountManager => (
              <tr key={accountManager._id} className="hover:bg-slate-50">
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    checked={selectedAccountManagerIds.includes(accountManager._id)}
                    onChange={(e) => onToggleSelectOne(accountManager._id, e.target.checked)}
                  />
                </td>
                
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      {accountManager.image ? (
                        <img 
                          src={accountManager.image} 
                          alt={accountManager.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <i className="fas fa-user text-indigo-600"></i>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{accountManager.name}</div>
                      <div className="text-sm text-slate-500 capitalize">{accountManager.role}</div>
                    </div>
                  </div>
                </td>
                
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-envelope text-slate-400"></i>
                    <span className="text-slate-700">{accountManager.email}</span>
                  </div>
                </td>
                
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-phone text-slate-400"></i>
                    <span className="text-slate-700">{formatMobile(accountManager.mobile)}</span>
                  </div>
                </td>
                
                <td className="p-4">
                  {getStatusBadge(accountManager.status)}
                </td>

                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    accountManager.isVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {accountManager.isVerified ? (
                      <>
                        <i className="fas fa-check-circle mr-1"></i>
                        Verified
                      </>
                    ) : (
                      <>
                        <i className="fas fa-clock mr-1"></i>
                        Pending
                      </>
                    )}
                  </span>
                </td>
                
                <td className="p-4">
                  <div className="text-sm text-slate-600">
                    {formatDate(accountManager.createdAt)}
                  </div>
                </td>
                
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onView(accountManager)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Account Manager"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    
                    <button
                      onClick={() => onEdit(accountManager)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Account Manager"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    
                    <button
                      onClick={() => onDelete(accountManager._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Account Manager"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" className="text-center p-8 text-slate-500">
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <i className="fas fa-spinner fa-spin"></i>
                      Loading account managers...
                    </div>
                  ) : (
                    <div>
                      <i className="fas fa-users text-4xl text-slate-300 mb-2"></i>
                      <p>No account managers found.</p>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={accountManagers.length}
          itemsPerPage={itemsPerPage}
        />
      )}
    </section>
  );
};

export default AccountManagersTable;