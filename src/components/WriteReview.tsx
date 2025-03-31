'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, type FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import zod from 'zod';
import TextEditor from './TextEditor';

interface WriteReviewProps {
  handleSubmitReview: (content: string, title: string, images: File[]) => void;
}

const schema = zod.object({
  content: zod.string().nonempty({
    message: 'content is required',
  }),
  title: zod.string().nonempty({
    message: 'title is required',
  }),
});

const WriteReview: FC<WriteReviewProps> = ({ handleSubmitReview }) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      content: '',
      title: '',
    },
    resolver: zodResolver(schema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...newFiles]);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: { content: string; title: string }) => {
    if (!data.content.trim() || !data.title.trim()) {
      return;
    }

    handleSubmitReview(data.content, data.title, selectedImages);
  };

  return (
    <div className="p-4 w-full mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div>
          <label className="form-control w-full">Title</label>
          <input
            {...register('title')}
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
          />
          {errors?.title && <p className="text-error mt-1">{errors.title.message}</p>}
        </div>

        <div className="mb-4">
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TextEditor
                {...register('content')}
                field="content"
                labelText="Write your review"
                defaultValue={field.value || ''} // Fallback to empty string if undefined
                setValue={(value: string) => field.onChange(value || '')} // Ensure string value
                error={errors.content?.message} // Pass error message directly
              />
            )}
          />
          {errors?.content && <p className="text-error">{errors.content.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full"
          />

          {previews.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Selected Images ({previews.length})</h3>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {previews.map((previewUrl, index) => (
                  <div key={index} className="relative">
                    <img
                      src={previewUrl}
                      alt={`Preview ${index}`}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default WriteReview;
