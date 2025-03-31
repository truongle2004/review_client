'use client';
import { type Category } from '@/types';
import { ToastError } from '@/utils/toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, type FC } from 'react';
import { useForm } from 'react-hook-form';
import zod from 'zod';
import TextEditor from './TextEditor';

interface AddProductFormProps {
  categories: Category[];
  onSubmit: (data: {
    title: string;
    description: string;
    categoryId: number;
    images: { src: string; alt: string }[];
  }) => Promise<void>;
}

const schema = zod.object({
  title: zod.string().min(1, {
    message: 'Title is required',
  }),
  categoryId: zod.string().min(1, {
    message: 'Category is required',
  }),
});

const AddProductForm: FC<AddProductFormProps> = ({ categories, onSubmit }) => {
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<{ src: string; alt: string }[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      categoryId: '',
    },
    resolver: zodResolver(schema),
  });

  const handleAddImage = () => {
    if (!newImageUrl.trim()) {
      ToastError('Please enter an image URL');
      return;
    }

    setImages((prev) => [
      ...prev,
      {
        src: newImageUrl.trim(),
        alt: newImageAlt.trim() || 'Product image',
      },
    ]);
    setNewImageUrl('');
    setNewImageAlt('');
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (data: { title: string; categoryId: string }) => {
    if (!description.trim()) {
      ToastError('Description is required');
      return;
    }

    if (images.length === 0) {
      ToastError('At least one image is required');
      return;
    }

    try {
      await onSubmit({
        title: data.title,
        description,
        categoryId: parseInt(data.categoryId),
        images,
      });
      // Reset form
      setDescription('');
      setImages([]);
      setNewImageUrl('');
      setNewImageAlt('');
    } catch (error) {
      console.error('Error submitting product:', error);
      ToastError('Failed to add product');
    }
  };

  return (
    <div className="p-4 w-full mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-8">
        <div>
          <label className="form-control w-full">Title</label>
          <input
            {...register('title')}
            type="text"
            placeholder="Enter product title"
            className="input input-bordered w-full"
          />
          {errors?.title && <p className="text-error mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="form-control w-full">Category</label>
          <select {...register('categoryId')} className="select select-bordered w-full">
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors?.categoryId && <p className="text-error mt-1">{errors.categoryId.message}</p>}
        </div>

        <div className="mb-4">
          <TextEditor
            field="description"
            labelText="Product Description"
            defaultValue={description}
            setValue={setDescription}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Product Images</label>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Image URL"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="input input-bordered flex-1"
            />
            <input
              type="text"
              placeholder="Alt text (optional)"
              value={newImageAlt}
              onChange={(e) => setNewImageAlt(e.target.value)}
              className="input input-bordered flex-1"
            />
            <button type="button" onClick={handleAddImage} className="btn btn-primary">
              Add Image
            </button>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
