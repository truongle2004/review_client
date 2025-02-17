import type { FC } from 'react';

interface PaginateProps {
  limit: number;
  total: number;
  page: number;
}

const LIMIT_NUMBER = 5;

const Paginate: FC<PaginateProps> = () => {
  return (
    <div className="join flex justify-center">
      <button className="join-item btn">1</button>
      <button className="join-item btn">2</button>
      <button className="join-item btn btn-disabled">...</button>
      <button className="join-item btn">99</button>
      <button className="join-item btn">100</button>
    </div>
  );
};

export default Paginate;
