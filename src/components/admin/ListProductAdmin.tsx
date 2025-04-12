'use client';

import { fetchAllCategoryAPI } from '@/services/category';
import {
  deleteProductAPI,
  fetchProductAPI,
  fetchProductPaginationAPI,
  createProductAPI,
} from '@/services/product';
import type { Category, Product } from '@/types';
import { AppConstant } from '@/utils/AppConstant';
import { convertToSlug } from '@/utils/slugify';
import { ToastWarning, ToastError, ToastSuccess } from '@/utils/toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import Paginate from '../Paginate';
import AddProductForm from '../AddProductForm';

const ListProductAdmin = () => {
  const [page, setPage] = useState(AppConstant.FIRST_PAGE);
  const [listProduct, setListProduct] = useState<Product[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [openModalAlertDelete, setOpenModalAlertDelete] = useState(false);
  const [productId, setProductId] = useState<number | null>(null);
  const [listCategory, setListCategory] = useState<Category[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
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

  const { mutateAsync: fetchListProductByCategoryMutation } = useMutation({
    mutationFn: fetchProductPaginationAPI,
    onSuccess: (data) => {
      setPaginateData({
        page: data.page,
        limit: data.limit,
        total: data.total,
      });
      setListProduct(data.data);
    },
  });

  const { mutateAsync: fetchAllCategoryMutation } = useMutation({
    mutationFn: fetchAllCategoryAPI,
    onSuccess: (data) => {
      setListCategory(data);
    },
  });

  const { mutateAsync: deleteProductMutation } = useMutation({
    mutationFn: deleteProductAPI,
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });

  const handleSubmitProduct = async (data: {
    title: string;
    description: string;
    categoryId: number;
    images: { src: string; alt: string }[];
  }) => {
    try {
      await createProductAPI(data);
      ToastSuccess('Product added successfully');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating product:', error);
      ToastError('Failed to add product');
    }
  };

  const handleSubmitFilter = () => {
    if (categoryId === null && rating === 1) {
      ToastWarning('Please select conditions filter', {});
      return;
    }
    setListProduct([]);
    setPage(AppConstant.FIRST_PAGE);
    fetchListProductByCategoryMutation({
      page: AppConstant.FIRST_PAGE,
      limit: AppConstant.PAGE_SIZE,
      categoryId: categoryId ?? 0,
      rating,
    });
  };

  const handleLoadMore = () => {
    fetchListProductByCategoryMutation({
      page,
      limit: AppConstant.PAGE_SIZE,
      categoryId: categoryId ?? 0,
      rating,
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchListProductByCategoryMutation({
      page: newPage,
      limit: AppConstant.PAGE_SIZE,
      categoryId: categoryId ?? 0,
      rating,
    });
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

  const handlFetchData = async () => {
    const res = await fetchAllCategoryMutation();
    await fetchListProductByCategoryMutation({
      page: AppConstant.FIRST_PAGE,
      limit: AppConstant.PAGE_SIZE,
      categoryId: res[0].id,
    });
  };

  useEffect(() => {
    if (page > AppConstant.FIRST_PAGE) {
      handleLoadMore();
    }
  }, [page]);

  useEffect(() => {
    handlFetchData();
  }, []);

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
              <input
                type="range"
                min="1"
                max="100"
                value={rating}
                onChange={handleRatingChange}
                className="range range-primary w-full max-w-xs"
              />
              <div className="badge badge-lg badge-secondary">{rating}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-info" onClick={handleSubmitFilter}>
              Filter
            </button>
            <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
              Add New Product
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="m-10 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Add New Product</h2>
              <button onClick={() => setShowAddForm(false)} className="btn btn-ghost">
                Cancel
              </button>
            </div>
            <AddProductForm categories={listCategory || []} onSubmit={handleSubmitProduct} />
          </div>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Name</th>
              <th>Category</th>
              <th>Rating</th>
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
                <td>{item.category.name}</td>
                <td>{item.rating}/100</td>
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
