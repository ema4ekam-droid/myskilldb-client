import React from 'react';

const SectionModal = ({ 
  isOpen, 
  editingSection, 
  sectionFormData, 
  setSectionFormData, 
  onSubmit, 
  onClose,
  classes,
  inputBaseClass,
  btnTealClass,
  btnSlateClass
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">
            {editingSection ? 'Edit Section' : 'Add Section'}
          </h3>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Section Name *</label>
            <input
              type="text"
              className={inputBaseClass}
              value={sectionFormData.name}
              onChange={(e) => setSectionFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Classes *</label>
            <div className="border border-slate-200 rounded-md">
              {/* Select All Option */}
              <div className="p-2 border-b border-slate-200 bg-slate-50">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={classes.length > 0 && sectionFormData.classIds.length === classes.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSectionFormData(prev => ({ 
                          ...prev, 
                          classIds: classes.map(cls => cls.id)
                        }));
                      } else {
                        setSectionFormData(prev => ({ 
                          ...prev, 
                          classIds: []
                        }));
                      }
                    }}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Select All Classes</span>
                </label>
              </div>
              
              {/* Scrollable Classes List */}
              <div className="max-h-40 overflow-y-auto p-2">
                {classes.length > 0 ? (
                  <div className="space-y-2">
                    {classes.map((cls) => (
                      <label key={cls.id} className="flex items-center space-x-2 hover:bg-slate-50 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={sectionFormData.classIds.includes(cls.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSectionFormData(prev => ({ 
                                ...prev, 
                                classIds: [...prev.classIds, cls.id] 
                              }));
                            } else {
                              setSectionFormData(prev => ({ 
                                ...prev, 
                                classIds: prev.classIds.filter(id => id !== cls.id) 
                              }));
                            }
                          }}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-slate-700">{cls.name}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 text-center py-2">
                    No classes available. Please add classes first.
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              className={inputBaseClass}
              rows="3"
              value={sectionFormData.description}
              onChange={(e) => setSectionFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className={btnTealClass}>
              {editingSection ? 'Update' : 'Add'} Section
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className={btnSlateClass}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SectionModal;
