function OrganizationTable({
  organizations,
  title,
  isLoading = false,
  onView = null,
  onEdit = null,
  onDelete = null,
  onApprove = null,
  showActions = true,
  showCheckboxes = false,
  selectedIds = [],
  onToggleSelect = null,
  onToggleSelectAll = null
}) {
  const StatusPill = ({ status }) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${styles[status] || 'bg-slate-100 text-slate-800'}`}>
        {status}
      </span>
    );
  };

  const allChecked = organizations.length > 0 && selectedIds.length === organizations.length;

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {showCheckboxes && (
                <th className="p-4 w-12">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    checked={allChecked}
                    onChange={e => onToggleSelectAll(e.target.checked)}
                  />
                </th>
              )}
              <th className="p-4 text-left font-semibold">Organization Name</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-left font-semibold">Mobile</th>
              <th className="p-4 text-left font-semibold">Date Registered</th>
              {showActions && (
                <th className="p-4 text-center font-semibold">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {organizations.length > 0 ? organizations.map(organization => (
              <tr key={organization._id} className="hover:bg-slate-50">
                {showCheckboxes && (
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      checked={selectedIds.includes(organization._id)}
                      onChange={e => onToggleSelect(organization._id, e.target.checked)}
                    />
                  </td>
                )}
                <td className="p-4 font-semibold text-slate-900">{organization.name}</td>
                <td className="p-4">
                  <StatusPill status={organization.status} />
                </td>
                <td className="p-4 text-slate-600">{organization.mobileNumber}</td>
                <td className="p-4 text-slate-600">
                  {new Date(organization.createdAt).toLocaleDateString()}
                </td>
                {showActions && (
                  <td className="p-4 text-center">
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                      {onView && (
                        <button
                          onClick={() => onView(organization._id)}
                          className="px-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded-l-lg hover:bg-slate-100"
                        >
                          View
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(organization._id)}
                          className="px-3 py-2 text-xs font-medium text-slate-900 bg-white border-t border-b border-slate-200 hover:bg-slate-100"
                        >
                          Edit
                        </button>
                      )}
                      {onApprove && organization.status === 'pending' && (
                        <button
                          onClick={() => onApprove(organization._id)}
                          className="px-3 py-2 text-xs font-medium text-green-600 bg-white border-t border-b border-slate-200 hover:bg-slate-100"
                        >
                          Approve
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(organization._id)}
                          className="px-3 py-2 text-xs font-medium text-rose-600 bg-white border border-slate-200 rounded-r-md hover:bg-slate-100"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            )) : (
              <tr>
                <td 
                  colSpan={showCheckboxes && showActions ? 6 : showCheckboxes || showActions ? 5 : 4} 
                  className="text-center p-8 text-slate-500"
                >
                  {isLoading ? 'Loading organizations...' : 'No organizations found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default OrganizationTable;