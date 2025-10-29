import React from "react";

const DepartmentFilter = ({
  selectedDepartment,
  setSelectedDepartment,
  departments,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-10 pt-16 lg:pt-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-3">
          <button
            onClick={() => setSelectedDepartment("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedDepartment === "all"
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <i className="fas fa-star text-sm"></i>
            <span className="text-sm">For You</span>
          </button>

          {departments.map((dept) => (
            <button
              key={dept._id}
              onClick={() => setSelectedDepartment(dept._id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedDepartment === dept._id
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <i className={`fas fa-briefcase text-sm`}></i>
              <span className="text-sm">{dept.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentFilter;
