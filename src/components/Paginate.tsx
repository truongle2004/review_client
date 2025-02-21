import { FC } from "react";

interface PaginateProps {
  limit: number;
  total: number;
  page: number;
  onPageChange: (page: number) => void;
}

const Paginate: FC<PaginateProps> = ({ limit, total, page, onPageChange }) => {
  const totalPages = Math.ceil(total / limit);

  const getPages = () => {
    if (totalPages <= 5) return [...Array(totalPages)].map((_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, "...", totalPages];
    if (page >= totalPages - 2) return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  return (
    <div className="flex justify-center mt-5 space-x-2">
      <button
        className="btn"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>

      {getPages().map((p, index) =>
        p === "..." ? (
          <span key={index} className="btn btn-disabled">...</span>
        ) : (
          <button
            key={index}
            className={`btn ${p === page ? "btn-primary" : "btn-outline"}`}
            onClick={() => onPageChange(Number(p))}
          >
            {p}
          </button>
        )
      )}

      <button
        className="btn"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Paginate;
