const ViewModal = ({
  isOpen,
  viewModalType,
  viewingItem,
  onClose,
  getEntityDisplayValue
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              View All {viewModalType.charAt(0).toUpperCase() + viewModalType.slice(1)}s
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 text-slate-600">
                  <th className="p-3 text-left font-semibold">Name</th>
                  <th className="p-3 text-left font-semibold">Description</th>
                  {viewModalType === 'subject' && (
                    <>
                      <th className="p-3 text-left font-semibold">Code</th>
                      <th className="p-3 text-left font-semibold">Department</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {viewingItem && viewingItem.map((item, index) => (
                  <tr key={item._id || index} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3 text-slate-600">{item.description || '-'}</td>
                    {viewModalType === 'subject' && (
                      <>
                        <td className="p-3 text-slate-600">{item.code}</td>
                        <td className="p-3 text-slate-600">{getEntityDisplayValue(item, 'department')}</td>
                      </>
                    )}
                  </tr>
                ))}
                {(!viewingItem || viewingItem.length === 0) && (
                  <tr>
                    <td colSpan={viewModalType === 'subject' ? 4 : 2} className="text-center p-8 text-slate-500">
                      No {viewModalType}s found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;