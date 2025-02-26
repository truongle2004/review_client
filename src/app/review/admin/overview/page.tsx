'use client';

import ListProductAdmin from '@/components/admin/ListProductAdmin';
import { fetchProductAPI } from '@/services/product';
import { AppConstant } from '@/utils/AppConstant';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const drawer_text = ['List Product', 'Category', 'User', 'Review', 'Order', 'Setting', 'Logout'];

const AdminPage = () => {
  const [page, setPage] = useState(AppConstant.FIRST_PAGE);
  const [drawerIndex, setDrawerIndex] = useState(0);

  const { data } = useQuery({
    queryKey: ['products', page],
    queryFn: () =>
      fetchProductAPI({
        page: page,
        limit: AppConstant.PAGE_SIZE,
      }),
  });

  const handleSetDrawerIndex = (index: number) => {
    setDrawerIndex(index);
  };

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
          {drawer_text.map((item, index) => (
            <li
              className={`${drawerIndex === index ? 'bg-gray-600' : ''}`}
              key={index}
              onClick={() => handleSetDrawerIndex(index)}
            >
              <a>{item}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
