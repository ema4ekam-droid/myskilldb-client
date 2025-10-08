import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { getRequest } from "../../../../api/apiRequests";

const OrganizationModal = ({
  isOpen,
  onClose,
  organizationModalMode,
  organizationFormData,
  formErrors,
  inputBaseClass,
  btnTealClass,
  btnSlateClass,
  locations,
  handleInputChange,
  handleOrganizationFormSubmit,
  isLoading,
}) => {
  if (!isOpen) return null;

  const [syllabi, setSyllabi] = useState([]);

  const fetchSyllabi = async () => {
    try {
      const response = await getRequest(`/system-manager/Syllabus`);

      if (response.data && response.data.success && response.data.data) {
        const parsedSyllabi = response.data.data.map((name, index) => ({
          id: index + 1,
          name: name,
        }));
        setSyllabi(parsedSyllabi);
      } else {
        setSyllabi([]);
      }
    } catch (error) {
      setSyllabi([]);
      toast.error("Fetching syllabi failed");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSyllabi();
    }
  }, [isOpen]);

  return (
    <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[100] p-4">
      <Toaster position="top-right" />
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900">
              {organizationModalMode === "view"
                ? "View Organization Details"
                : organizationModalMode === "edit"
                ? "Edit Organization"
                : "Create New Organization"}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-2xl"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleOrganizationFormSubmit} className="p-6 space-y-6">
          {/* Organization Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
              Organization Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  className={`${inputBaseClass} ${
                    formErrors.name ? "border-red-300 focus:ring-red-500" : ""
                  }`}
                  value={organizationFormData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter organization name"
                  disabled={organizationModalMode === "view"}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Syllabus *
                </label>
                <select
                  className={`${inputBaseClass} ${
                    formErrors.board ? "border-red-300 focus:ring-red-500" : ""
                  }`}
                  value={organizationFormData.board}
                  onChange={(e) => handleInputChange("board", e.target.value)}
                  disabled={organizationModalMode === "view"}
                >
                  <option value="">Select Syllabus</option>
                  {syllabi.map((syllabus) => (
                    <option key={syllabus.id} value={syllabus.name}>
                      {syllabus.name}
                    </option>
                  ))}
                </select>
                {formErrors.board && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.board}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Established Year *
                </label>
                <input
                  type="number"
                  className={`${inputBaseClass} ${
                    formErrors.establishedYear
                      ? "border-red-300 focus:ring-red-500"
                      : ""
                  }`}
                  value={organizationFormData.establishedYear}
                  onChange={(e) =>
                    handleInputChange(
                      "establishedYear",
                      parseInt(e.target.value)
                    )
                  }
                  placeholder="e.g., 1995"
                  min="1800"
                  max={new Date().getFullYear()}
                  disabled={organizationModalMode === "view"}
                />
                {formErrors.establishedYear && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.establishedYear}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Admin Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
              Admin Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Admin Name *
                </label>
                <input
                  type="text"
                  className={`${inputBaseClass} ${
                    formErrors.adminName
                      ? "border-red-300 focus:ring-red-500"
                      : ""
                  }`}
                  value={organizationFormData.adminName}
                  onChange={(e) =>
                    handleInputChange("adminName", e.target.value)
                  }
                  placeholder="Enter admin name"
                  disabled={organizationModalMode === "view"}
                />
                {formErrors.adminName && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.adminName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Admin Email *
                </label>
                <input
                  type="email"
                  className={`${inputBaseClass} ${
                    formErrors.adminEmail
                      ? "border-red-300 focus:ring-red-500"
                      : ""
                  }`}
                  value={organizationFormData.adminEmail}
                  onChange={(e) =>
                    handleInputChange("adminEmail", e.target.value)
                  }
                  placeholder="admin@organization.com"
                  disabled={organizationModalMode === "view"}
                />
                {formErrors.adminEmail && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.adminEmail}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  className={`${inputBaseClass} ${
                    formErrors.mobileNumber
                      ? "border-red-300 focus:ring-red-500"
                      : ""
                  }`}
                  value={organizationFormData.mobileNumber}
                  onChange={(e) =>
                    handleInputChange("mobileNumber", e.target.value)
                  }
                  placeholder="9876543210"
                  maxLength="10"
                  disabled={organizationModalMode === "view"}
                />
                {formErrors.mobileNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.mobileNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Alternate Email
                </label>
                <input
                  type="email"
                  className={`${inputBaseClass} ${
                    formErrors.alternateEmail
                      ? "border-red-300 focus:ring-red-500"
                      : ""
                  }`}
                  value={organizationFormData.alternateEmail}
                  onChange={(e) =>
                    handleInputChange("alternateEmail", e.target.value)
                  }
                  placeholder="alternate@organization.com"
                  disabled={organizationModalMode === "view"}
                />
                {formErrors.alternateEmail && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.alternateEmail}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
              Location Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address *
                </label>
                <textarea
                  className={`${inputBaseClass} ${
                    formErrors.address
                      ? "border-red-300 focus:ring-red-500"
                      : ""
                  }`}
                  value={organizationFormData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter complete address"
                  rows="3"
                  disabled={organizationModalMode === "view"}
                />
                {formErrors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Country *
                  </label>
                  <select
                    className={`${inputBaseClass} ${
                      formErrors.country
                        ? "border-red-300 focus:ring-red-500"
                        : ""
                    }`}
                    value={organizationFormData.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                    disabled={organizationModalMode === "view"}
                  >
                    <option value="">Select Country</option>
                    {locations.countries.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.country && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.country}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    State *
                  </label>
                  <select
                    className={`${inputBaseClass} ${
                      formErrors.state
                        ? "border-red-300 focus:ring-red-500"
                        : ""
                    }`}
                    value={organizationFormData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    disabled={
                      organizationModalMode === "view" ||
                      !organizationFormData.country
                    }
                  >
                    <option value="">Select State</option>
                    {locations.states.map((state) => (
                      <option key={state.code} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.state && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.state}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    District *
                  </label>
                  <select
                    className={`${inputBaseClass} ${
                      formErrors.district
                        ? "border-red-300 focus:ring-red-500"
                        : ""
                    }`}
                    value={organizationFormData.district}
                    onChange={(e) =>
                      handleInputChange("district", e.target.value)
                    }
                    disabled={
                      organizationModalMode === "view" ||
                      !organizationFormData.state
                    }
                  >
                    <option value="">Select District</option>
                    {locations.districts.map((district) => (
                      <option key={district.code} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.district && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.district}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    className={`${inputBaseClass} ${
                      formErrors.pincode
                        ? "border-red-300 focus:ring-red-500"
                        : ""
                    }`}
                    value={organizationFormData.pincode}
                    onChange={(e) =>
                      handleInputChange("pincode", e.target.value)
                    }
                    placeholder="560001"
                    maxLength="6"
                    disabled={organizationModalMode === "view"}
                  />
                  {formErrors.pincode && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.pincode}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Organization Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
              Organization Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Total Students *
                </label>
                <input
                  type="number"
                  className={`${inputBaseClass} ${
                    formErrors.totalStudents
                      ? "border-red-300 focus:ring-red-500"
                      : ""
                  }`}
                  value={organizationFormData.totalStudents}
                  onChange={(e) =>
                    handleInputChange("totalStudents", parseInt(e.target.value))
                  }
                  placeholder="1200"
                  min="1"
                  disabled={organizationModalMode === "view"}
                />
                {formErrors.totalStudents && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.totalStudents}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Total Teachers *
                </label>
                <input
                  type="number"
                  className={`${inputBaseClass} ${
                    formErrors.totalTeachers
                      ? "border-red-300 focus:ring-red-500"
                      : ""
                  }`}
                  value={organizationFormData.totalTeachers}
                  onChange={(e) =>
                    handleInputChange("totalTeachers", parseInt(e.target.value))
                  }
                  placeholder="45"
                  min="1"
                  disabled={organizationModalMode === "view"}
                />
                {formErrors.totalTeachers && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.totalTeachers}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Principal Name *
                </label>
                <input
                  type="text"
                  className={`${inputBaseClass} ${
                    formErrors.principalName
                      ? "border-red-300 focus:ring-red-500"
                      : ""
                  }`}
                  value={organizationFormData.principalName}
                  onChange={(e) =>
                    handleInputChange("principalName", e.target.value)
                  }
                  placeholder="Dr. Principal Name"
                  disabled={organizationModalMode === "view"}
                />
                {formErrors.principalName && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.principalName}
                  </p>
                )}
              </div>
            </div>

            {organizationModalMode !== "create" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <select
                  className={inputBaseClass}
                  value={organizationFormData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  disabled={organizationModalMode === "view"}
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="rejected">Rejected</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className={btnSlateClass}
              disabled={isLoading}
            >
              {organizationModalMode === "view" ? "Close" : "Cancel"}
            </button>
            {organizationModalMode !== "view" && (
              <button
                type="submit"
                className={`${btnTealClass} ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus"></i>
                    {organizationModalMode === "edit"
                      ? "Update Organization"
                      : "Create Organization"}
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationModal;
