'use client';

import { addNewCategoryAPI, fetchAllCategoryAPI } from '@/services/category';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

const ListCategoryAdmin = () => {
  const { data: listCategory } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchAllCategoryAPI(),
  });

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: '',
    },
  });

  const { mutate: addNewCategoryMutation } = useMutation({
    mutationFn: addNewCategoryAPI,
  });

  const onSubmit = (data: any) => {
    const { name } = data;

    if (!name) {
      return;
    }

    addNewCategoryMutation(name);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row gap-3">
        <input
          type="text"
          placeholder="Type here"
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
                  <button className="btn btn-error btn-sm">delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListCategoryAdmin;
