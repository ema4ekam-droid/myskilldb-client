const ViewAccountManagerModal = ({ isOpen, onClose, accountManager }) => {
  const handleClose = () => {
    onClose();
  };

  const formatAadharCard = (aadharNumber) => {
    if (!aadharNumber) return "Not provided";
    // Format as XXXX-XXXX-XXXX
    return aadharNumber.replace(/(\d{4})(\d{4})(\d{4})/, "$1-$2-$3");
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: "Active", class: "bg-green-100 text-green-800" },
      inactive: { label: "Inactive", class: "bg-red-100 text-red-800" },
      pending: { label: "Pending", class: "bg-yellow-100 text-yellow-800" },
    };

    const config = statusConfig[status] || statusConfig.inactive;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.class}`}
      >
        <div
          className={`w-2 h-2 rounded-full mr-2 ${
            status === "active"
              ? "bg-green-500"
              : status === "inactive"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        ></div>
        {config.label}
      </span>
    );
  };

  if (!isOpen || !accountManager) return null;
  console.log(
    "Rendering ViewAccountManagerModal with accountManager:",
    accountManager
  );
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
              {accountManager.image ? (
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
                {accountManager.name}
              </h2>
              <p className="text-sm text-slate-500 capitalize">
                {accountManager.role}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <i className="fas fa-times text-slate-500"></i>
          </button>
        </div>

        {/* Content */}
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
                  Status
                </label>
                <div className="mt-1">
                  {getStatusBadge(accountManager.status)}
                </div>
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

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Verification Status
                </label>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    accountManager.isVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {accountManager.isVerified ? (
                    <>
                      <i className="fas fa-check-circle mr-1"></i>
                      Verified
                    </>
                  ) : (
                    <>
                      <i className="fas fa-clock mr-1"></i>
                      Pending Verification
                    </>
                  )}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Account Status
                </label>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    !accountManager.isBlock
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {!accountManager.isBlock ? (
                    <>
                      <i className="fas fa-check mr-1"></i>
                      Active
                    </>
                  ) : (
                    <>
                      <i className="fas fa-ban mr-1"></i>
                      Blocked
                    </>
                  )}
                </span>
              </div>

              {accountManager.aadharCardNumber && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Aadhar Card Number
                  </label>
                  <p className="text-slate-900 flex items-center gap-2">
                    <i className="fas fa-id-card text-slate-400"></i>
                    <span className="font-mono bg-slate-100 px-2 py-1 rounded">
                      {formatAadharCard(accountManager.aadharCardNumber)}
                    </span>
                  </p>
                </div>
              )}
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
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
