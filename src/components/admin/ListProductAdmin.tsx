'use client';

import { fetchAllCategoryAPI } from '@/services/category';
import { fetchProductAPI } from '@/services/product';
import type { Product } from '@/types';
import { AppConstant } from '@/utils/AppConstant';
import { convertToSlug } from '@/utils/slugify';
import { useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ListProductAdmin = () => {
  const [page, setPage] = useState(AppConstant.FIRST_PAGE);
  const [listProduct, setListProduct] = useState<Product[]>([]);
  const [category, setCategory] = useState('');

  const router = useRouter();

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

  const { data: listCategory, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchAllCategoryAPI(),
  });

  useEffect(() => {
    fetchListProductMutation();
  }, []);

  const handleLoadMore = () => {
    fetchListProductMutation();
  };

  const handleViewDetail = (id: number, title: string) => {
    const slug = convertToSlug(title);
    router.push(`/review/listings/${id}/${slug}`);
  };

  if (isPending) {
    return <span className="loading loading-spinner loading-sm"></span>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="m-10">
          <select className="select select-bordered w-full max-w-xs">
            <option disabled selected>
              {' '}
              -- Category --{' '}
            </option>
            {isLoading && <span className="loading loading-spinner loading-sm"></span>}
            {!isLoading && listCategory?.map((item) => <option key={item.id}>{item.name}</option>)}
          </select>
          <select className="select select-bordered w-full max-w-xs">
            <option disabled selected>
              {' '}
              -- Rating --{' '}
            </option>
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>
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
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleViewDetail(item.id, item.title)}
                  >
                    Details
                  </button>
                  <button className="btn btn-warning btn-sm">Edit</button>
                  <button className="btn btn-error btn-sm">Delete</button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn btn-primary mx-auto mt-10 mb-10" onClick={handleLoadMore}>
        Load more
      </button>
    </>
  );
};

export default ListProductAdmin;
