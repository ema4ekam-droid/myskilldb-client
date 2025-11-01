const EditListModal = ({
  isOpen,
  editListType,
  editListItems,
  onClose,
  onEditDepartment,
  onEditClass,
  onEditSection,
  onEditSubject,
  onDeleteDepartment,
  onDeleteClass,
  onDeleteSection,
  onDeleteSubject,
  btnSlateClass
}) => {
  if (!isOpen) return null;

  const handleEdit = (item) => {
    onClose();
    switch (editListType) {
      case 'department':
        onEditDepartment(item);
        break;
      case 'class':
        onEditClass(item);
        break;
      case 'section':
        onEditSection(item);
        break;
      case 'subject':
        onEditSubject(item);
        break;
      default:
        break;
    }
  };

  const handleDelete = (item) => {
    switch (editListType) {
      case 'department':
        onDeleteDepartment(item);
        break;
      case 'class':
        onDeleteClass(item);
        break;
      case 'section':
        onDeleteSection(item);
        break;
      case 'subject':
        onDeleteSubject(item);
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Edit {editListType.charAt(0).toUpperCase() + editListType.slice(1)}s
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>

          <div className="space-y-4">
            {editListItems.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <i className="fas fa-inbox text-4xl mb-4"></i>
                <p>No {editListType}s found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {editListItems.map((item, index) => (
                  <div key={item._id || index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{item.name}</h3>
                      <p className="text-sm text-slate-600">{item.description || 'No description'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit this item"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete this item"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className={btnSlateClass}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditListModal;