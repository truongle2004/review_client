'use client';

import type { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import TextEditor from './TextEditor';
import zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface WriteReviewProps {
  handleSubmitReview: (content: string, title: string) => void;
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

  const onSubmit = (data: { content: string; title: string }) => {
    handleSubmitReview(data.content, data.title);
  };

  return (
    <>
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
            {errors?.title && <p className="text-error mt-1">{errors?.title.message}</p>}
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
                  defaultValue={field.value}
                  setValue={field.onChange}
                  error={undefined}
                />
              )}
            />
            {errors?.content && <p className="text-error">{errors?.content.message}</p>}
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary">
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default WriteReview;
