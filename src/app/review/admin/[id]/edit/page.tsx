'use client';

import TextEditor from '@/components/TextEditor';
import { fetchAllCategoryAPI } from '@/services/category';
import { fetchProductDetailAPI } from '@/services/product';
import { Category } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const EditProductPage = () => {
  const params = useParams();

  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>({
    id: 0,
    name: '',
    description: '',
    createdAt: null,
    updatedAt: null,
    deleteAt: null,
  });
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');

  const { data } = useQuery({
    queryKey: ['product', params.id],
    queryFn: () => fetchProductDetailAPI({ id: Number(params.id) }),
    enabled: !!params.id,
  });

  const { register } = useForm({
    defaultValues: {
      title: '',
    },
  });

  const { mutate: fetchProductDetailMutation } = useMutation({
    mutationFn: () => fetchProductDetailAPI({ id: Number(params.id) }),
    onSuccess: (data) => {
      setDescription(data.description);
      setCategory(data.category);
      setTitle(data.title);
      setRating(data.rating);
    },
  });

  const { data: listCategory } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchAllCategoryAPI(),
  });

  useEffect(() => {
    fetchProductDetailMutation();
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col">
        <label>Title</label>
        <input
          type="text"
          value={title}
          className="input input-bordered w-1/2"
          {...register('title')}
        />
      </section>

      <section className="flex flex-col">
        <label htmlFor="category">category</label>
        <select className="select select-bordered w-1/2" defaultValue={category.name}>
          <option value={'Default'} disabled>
            {' '}
            -- Category --{' '}
          </option>

          {listCategory?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </section>

      <TextEditor
        field="title"
        labelText="Title"
        defaultValue={description}
        setValue={setDescription}
      />
    </div>
  );
};

export default EditProductPage;
