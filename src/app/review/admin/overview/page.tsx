'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faList } from '@fortawesome/free-solid-svg-icons';

import ListCategoryAdmin from '@/components/admin/ListCategoryAdmin';
import ListProductAdmin from '@/components/admin/ListProductAdmin';
import { fetchProductAPI } from '@/services/product';
import { AppConstant } from '@/utils/AppConstant';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const drawerItems = [
  {
    id: 1,
    name: 'Products',
    icon: faBox,
    component: <ListProductAdmin />,
  },
  {
    id: 2,
    name: 'Categories',
    icon: faList,
    component: <ListCategoryAdmin />,
  },
];

const AdminPage = () => {
  const [page, setPage] = useState(AppConstant.FIRST_PAGE);
  const [drawerIndex, setDrawerIndex] = useState(
    localStorage.getItem('drawerIndex') ? Number(localStorage.getItem('drawerIndex')) : 0
  );

  // Fetch product data only when viewing "List Product"
  const { data } = useQuery({
    queryKey: ['products', page],
    queryFn: () =>
      fetchProductAPI({
        page,
        limit: AppConstant.PAGE_SIZE,
      }),
    enabled: drawerIndex === 0, // Only fetch when "List Product" is active
  });

  const handleSetDrawerIndex = (index: number) => {
    setDrawerIndex(index);
    localStorage.setItem('drawerIndex', index.toString());
  };

  // useEffect(() => {
  //   const drawerIndex = Number(localStorage.getItem('drawerIndex'));
  //   if (drawerIndex) {
  //     setDrawerIndex(drawerIndex);
  //   }
  // }, []);
  //
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Dynamically render selected component */}
        {drawerItems[drawerIndex]?.component}

        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
          Open drawer
        </label>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {drawerItems.map((item, index) => (
            <li
              className={`cursor-pointer flex flex-row items-center gap-3 p-3 rounded-lg ${
                drawerIndex === index ? 'bg-gray-600 text-white' : 'hover:bg-gray-300'
              }`}
              key={item.id}
              onClick={() => handleSetDrawerIndex(index)}
            >
              <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
