'use client';

import { fetchAllCategoryAPI } from '@/services/category';
import { deleteProductAPI, fetchProductAPI, fetchProductPaginationAPI } from '@/services/product';
import type { Product } from '@/types';
import { AppConstant } from '@/utils/AppConstant';
import { convertToSlug } from '@/utils/slugify';
import { ToastWarning } from '@/utils/toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import Paginate from '../Paginate';

const ListProductAdmin = () => {
  const [page, setPage] = useState(AppConstant.FIRST_PAGE);
  const [listProduct, setListProduct] = useState<Product[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [openModalAlertDelete, setOpenModalAlertDelete] = useState(false);
  const [productId, setProductId] = useState<number | null>(null);
  const [paginateData, setPaginateData] = useState<{
    page: number;
    limit: number;
    total: number;
  } | null>({
    page: AppConstant.FIRST_PAGE,
    limit: AppConstant.PAGE_SIZE,
    total: 0,
  });
  const [rating, setRating] = useState(100);

  const router = useRouter();

  const { mutate: fetchListProductMutation, isPending } = useMutation({
    mutationFn: () =>
      fetchProductAPI({
        page,
        limit: AppConstant.PAGE_SIZE,
      }),
    onSuccess: (data) => {
      setPaginateData({
        page: data.page,
        limit: data.limit,
        total: data.total,
      });
      setListProduct(data.data);
    },
  });

  const { mutate: fetchListProductByCategoryMutation } = useMutation({
    mutationFn: () =>
      fetchProductPaginationAPI({
        page,
        limit: AppConstant.PAGE_SIZE,
        categoryId: categoryId as number,
        rating,
      }),
    onSuccess: (data) => {
      setPaginateData({
        page: data.page,
        limit: data.limit,
        total: data.total,
      });
      setListProduct(data.data);
    },
  });

  const { mutate: deleteProductMutation } = useMutation({
    mutationFn: deleteProductAPI,
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });

  const { data: listCategory } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchAllCategoryAPI(),
  });

  const handleSubmitFilter = () => {
    if (categoryId === null && rating === 1) {
      ToastWarning('Please select conditions filter', {});
      return;
    }
    setListProduct([]);
    setPage(AppConstant.FIRST_PAGE);
    fetchListProductByCategoryMutation();
  };

  const handleLoadMore = () => {
    if (categoryId) fetchListProductByCategoryMutation();
    else fetchListProductMutation();
  };

  const handleViewDetail = (id: number, title: string) => {
    const slug = convertToSlug(title);
    router.push(`/review/listings/${id}/${slug}`);
  };

  const handleSetSelectCategory = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(Number(e.target.value));
  };

  const handleRatingChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRating(Number(e.target.value));
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    handleLoadMore();
  };

  const handleDeleteProduct = (id: number) => {
    setOpenModalAlertDelete(true);
    setProductId(id);
  };

  const handleCancelDeleteProduct = () => {
    setProductId(null);
    setOpenModalAlertDelete(false);
  };

  const handleConfirmDeleteProduct = () => {
    if (productId) {
      deleteProductMutation({ id: productId });
      setOpenModalAlertDelete(false);

      setListProduct(listProduct.filter((item) => item.id !== productId));
    }
  };

  const handleOnClickEdit = (id: number) => {
    router.push(`/review/admin/${id}/edit`);
  };

  useEffect(() => {
    fetchListProductMutation();
  }, []);

  if (isPending) {
    return (
      <div className="flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <dialog id="my_modal_1" className={`modal ${openModalAlertDelete ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Warning!</h3>
          <p className="py-4">Are you sure want to delete this items?</p>
          <div className="modal-action">
            <form method="dialog" className="flex flex-row gap-4">
              <button className="btn btn-success" onClick={handleConfirmDeleteProduct}>
                Sure
              </button>
              <button className="btn btn-warning" onClick={handleCancelDeleteProduct}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>
      <div className="overflow-x-auto">
        <div className="m-10 flex justify-between items-center">
          <div className="flex flex-row gap-4 w-full items-center">
            <select
              className="select select-bordered w-full max-w-xs"
              defaultValue={'Default'}
              onChange={handleSetSelectCategory}
            >
              {!categoryId && (
                <option value={'Default'} disabled>
                  {' '}
                  -- Category --{' '}
                </option>
              )}

              {listCategory?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <div className="flex flex-col items-center gap-4 p-4">
              <h2 className="text-xl font-bold">Rate from 1 to 100</h2>

              {/* DaisyUI-styled range input */}
              <input
                type="range"
                min="1"
                max="100"
                value={rating}
                onChange={handleRatingChange}
                className="range range-primary w-full max-w-xs"
              />

              {/* Display the current rating */}
              <div className="badge badge-lg badge-secondary">{rating}</div>
            </div>
          </div>
          <button className="btn btn-info" onClick={handleSubmitFilter}>
            Filter
          </button>
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
              <th>Created At</th>
              <th>Favorite Color</th>
              <th>Actions</th>
            </tr>
          </thead>
          {listProduct?.map((item: Product) => (
            <tbody key={item.id}>
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
                          src={item.images[0]?.src}
                          alt={item.images[0]?.alt}
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
                <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>Purple</td>
                <th className="flex gap-2">
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => handleViewDetail(item.id, item.title)}
                  >
                    Details
                  </button>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleOnClickEdit(item.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => handleDeleteProduct(item.id)}
                  >
                    Delete
                  </button>
                </th>
              </tr>
            </tbody>
          ))}
        </table>
      </div>

      <Paginate
        page={paginateData?.page as number}
        limit={paginateData?.limit as number}
        total={paginateData?.total as number}
        onPageChange={handlePageChange}
      />
      <div className="mb-10 mt-5" />
    </>
  );
};

export default ListProductAdmin;
