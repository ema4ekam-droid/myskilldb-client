import React from "react";

const FloatingActionButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40"
      title="Create New Job"
    >
      <i className="fas fa-plus text-xl"></i>
    </button>
  );
};

export default FloatingActionButton;
