import { useEffect, useState } from "react";

const ViewAccountManagerModal = ({ isOpen, onClose, accountManager, isLoading }) => {
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (isOpen && accountManager) {
      setLocalLoading(true);
      // Simulate loading for better UX
      const timer = setTimeout(() => {
        setLocalLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, accountManager]);

  const handleClose = () => {
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMobile = (mobile) => {
    if (!mobile) return "Not provided";
    return `+91-${mobile}`;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              {accountManager?.image ? (
                <img
                  src={accountManager.image}
                  alt={accountManager.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <i className="fas fa-user text-indigo-600 text-xl"></i>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {isLoading || localLoading ? "Loading..." : accountManager?.name || "N/A"}
              </h2>
              <p className="text-sm text-slate-500 capitalize">
                {accountManager?.role || "N/A"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <i className="fas fa-times text-slate-500"></i>
          </button>
        </div>

        {/* Loading State */}
        {(isLoading || localLoading) && (
          <div className="p-8 text-center">
            <i className="fas fa-spinner fa-spin text-2xl text-indigo-600 mb-4"></i>
            <p className="text-slate-600">Loading account manager details...</p>
          </div>
        )}

        {/* Content */}
        {!isLoading && !localLoading && accountManager && (
          <div className="p-6 space-y-6">
            {/* Personal Information */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-user-circle text-indigo-600"></i>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <p className="text-slate-900 font-medium">
                    {accountManager.name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <p className="text-slate-900 flex items-center gap-2">
                    <i className="fas fa-envelope text-slate-400"></i>
                    {accountManager.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Mobile Number
                  </label>
                  <p className="text-slate-900 flex items-center gap-2">
                    <i className="fas fa-phone text-slate-400"></i>
                    {formatMobile(accountManager.mobile)}
                  </p>
                </div>
              </div>
            </div>

            {/* Activity Information */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-clock text-indigo-600"></i>
                Activity Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Account Created
                  </label>
                  <p className="text-slate-900 flex items-center gap-2">
                    <i className="fas fa-calendar-plus text-slate-400"></i>
                    {formatDate(accountManager.createdAt)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Last Updated
                  </label>
                  <p className="text-slate-900 flex items-center gap-2">
                    <i className="fas fa-calendar-edit text-slate-400"></i>
                    {formatDate(accountManager.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Organizations Information */}
            {accountManager.organizationIds &&
              accountManager.organizationIds.length > 0 && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <i className="fas fa-building text-indigo-600"></i>
                    Associated Organizations (
                    {accountManager.organizationIds.length})
                  </h3>
                  <div className="space-y-4">
                    {accountManager.organizationIds.map((org, index) => (
                      <div
                        key={org._id || index}
                        className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-school text-indigo-600"></i>
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-900">
                                  {org.name}
                                </h4>
                                <p className="text-sm text-slate-600 flex items-center gap-1">
                                  <i className="fas fa-graduation-cap text-xs"></i>
                                  {org.board} Board
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <i className="fas fa-map-marker-alt text-slate-400"></i>
                                <span>
                                  {org.district}, {org.state}, {org.country}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <i className="fas fa-calendar text-slate-400"></i>
                                <span>Est. {org.establishedYear}</span>
                              </div>

                              {org.adminName && (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                  <i className="fas fa-user-tie text-slate-400"></i>
                                  <span>Admin: {org.adminName}</span>
                                </div>
                              )}

                              {org.email && (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                  <i className="fas fa-envelope text-slate-400"></i>
                                  <span>{org.email}</span>
                                </div>
                              )}

                              {org.mobile && (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                  <i className="fas fa-phone text-slate-400"></i>
                                  <span>91-{org.mobile}</span>
                                </div>
                              )}

                              {org.website && (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                  <i className="fas fa-globe text-slate-400"></i>
                                  <a
                                    href={
                                      org.website.startsWith("http")
                                        ? org.website
                                        : `https://${org.website}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-800 hover:underline"
                                  >
                                    {org.website}
                                  </a>
                                </div>
                              )}
                            </div>

                            {org.address && (
                              <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-start gap-2 text-sm text-slate-600">
                                  <i className="fas fa-map-pin text-slate-400 mt-0.5"></i>
                                  <span>{org.address}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            disabled={isLoading}
          >
            <i className="fas fa-times"></i>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAccountManagerModal;