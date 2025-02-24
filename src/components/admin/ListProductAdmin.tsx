'use client';

import { fetchProductAPI } from '@/services/product';
import type { Product } from '@/types';
import { AppConstant } from '@/utils/AppConstant';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const ListProductAdmin = () => {
  const [page, setPage] = useState(AppConstant.FIRST_PAGE);
  const [listProduct, setListProduct] = useState<Product[]>([]);

  const { mutate: fetchListProductMutation, isPending } = useMutation({
    mutationFn: () =>
      fetchProductAPI({
        page,
        limit: AppConstant.PAGE_SIZE,
      }),
    onSuccess: (data) => {
      setListProduct((prev) => [...prev, ...data.data]);
      setPage((prev) => prev + 1);
    },
  });

  useEffect(() => {
    fetchListProductMutation();
  }, []);

  const handleLoadMore = () => {
    fetchListProductMutation();
  };

  if (isPending) {
    return <span className="loading loading-spinner loading-sm"></span>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Name</th>
              <th>Job</th>
              <th>Favorite Color</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listProduct?.map((item: Product) => (
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <Image
                          src={item.images[0].src}
                          alt={item.images[0].alt}
                          width={100}
                          height={100}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{item.title}</div>
                      <div className="text-sm opacity-50">{item.category.name}</div>
                    </div>
                  </div>
                </td>
                <td>
                  Zemlak, Daniel and Leannon
                  <br />
                  <span className="badge badge-ghost badge-sm">Desktop Support Technician</span>
                </td>
                <td>Purple</td>
                <th className="flex gap-2">
                  <button className="btn btn-secondary btn-sm">Details</button>
                  <button className="btn btn-warning btn-sm">Edit</button>
                  <button className="btn btn-error btn-sm">Delete</button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn btn-primary mx-auto mt-10" onClick={handleLoadMore}>
        Load more
      </button>
    </>
  );
};

export default ListProductAdmin;
