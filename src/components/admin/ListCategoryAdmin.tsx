'use client';

import { addNewCategoryAPI, deleteCategoryAPI, fetchAllCategoryAPI } from '@/services/category';
import { ToastError, ToastSuccess } from '@/utils/toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const ListCategoryAdmin = () => {
  const [showModal, setShowModal] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const { data: listCategory, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchAllCategoryAPI(),
  });

  const { register, reset, handleSubmit } = useForm({
    defaultValues: {
      name: '',
    },
  });

  const { mutate: deleteCategoryMutation } = useMutation({
    mutationFn: deleteCategoryAPI,
    onSuccess: (data) => {
      if (data) listCategory?.filter((item) => item.id !== data.id);
      ToastSuccess(data.message);
    },
    onError: (data) => {
      ToastError(data.message);
    },
  });

  const { mutate: addNewCategoryMutation } = useMutation({
    mutationFn: addNewCategoryAPI,
    onSuccess: (data) => {
      if (data) listCategory?.push(data);
      reset();
    },
  });

  const onSubmit = (data: any) => {
    const { name } = data;

    if (!name) {
      return;
    }

    addNewCategoryMutation(name);
  };

  const handleModalDeleteCategory = (id: number) => {
    setShowModal(true);
    setCategoryId(id);
  };

  const handleDeleteCategory = () => {
    deleteCategoryMutation(categoryId as number);
    setShowModal(false);
  };

  const handleRejectDelete = () => {
    setShowModal(false);
    setCategoryId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <dialog id="my_modal_1" className={`modal ${showModal ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Warning!</h3>
          <p className="py-4">
            Are you sure you want to delete this category? it could cause problems
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn" onClick={handleRejectDelete}>
                Cancel
              </button>
              <button className="btn btn-primary ml-4" onClick={handleDeleteCategory}>
                Submit
              </button>
            </form>
          </div>
        </div>
      </dialog>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row gap-3">
          <input
            type="text"
            placeholder="Add new category"
            className="input input-bordered w-full max-w-xs"
            {...register('name')}
          />
          <button type="submit" className="btn btn-outline">
            add
          </button>
        </form>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Job</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {listCategory?.map((category) => (
                <tr key={category.id}>
                  <th>{category.name}</th>
                  <td>Cy Ganderton</td>
                  <td>Quality Control Specialist</td>
                  <td>
                    {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleModalDeleteCategory(category.id)}
                    >
                      delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ListCategoryAdmin;
