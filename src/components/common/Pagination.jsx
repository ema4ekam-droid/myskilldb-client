
const Pagination = ({
  pagination,
  onPageChange,
  isPending = false,
  entityName = "organizations"
}) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages, totalCount, hasPrev, hasNext, limit } = pagination;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalCount);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-200">
      <div className="text-sm text-slate-500">
        Showing {startItem} to {endItem} of {totalCount} {entityName}
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1, isPending)}
          disabled={!hasPrev}
          className={`px-3 py-1 text-sm rounded border ${
            hasPrev
              ? "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
          }`}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page, isPending)}
            className={`px-3 py-1 text-sm rounded border ${
              page === currentPage
                ? "bg-indigo-500 text-white border-indigo-500"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1, isPending)}
          disabled={!hasNext}
          className={`px-3 py-1 text-sm rounded border ${
            hasNext
              ? "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;