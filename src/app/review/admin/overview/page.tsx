'use client';

import ListProductAdmin from '@/components/admin/ListProductAdmin';
import { fetchProductAPI } from '@/services/product';
import { AppConstant } from '@/utils/AppConstant';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const AdminPage = () => {
  const [page, setPage] = useState(AppConstant.FIRST_PAGE);
  const { data } = useQuery({
    queryKey: ['products', page],
    queryFn: () =>
      fetchProductAPI({
        page: page,
        limit: AppConstant.PAGE_SIZE,
      }),
  });

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <ListProductAdmin />
        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
          Open drawer
        </label>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <li>
            <a>List Product</a>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
