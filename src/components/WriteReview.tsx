'use client';

import { useForm, Controller } from 'react-hook-form';
import TextEditor from './TextEditor';
import type { FC } from 'react';

interface WriteReviewProps {
  handleSubmitReview: (content: string) => void;
}

const WriteReview: FC<WriteReviewProps> = ({ handleSubmitReview }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = (data: { content: string }) => {
    handleSubmitReview(data.content);
  };

  console.log('is rendering');

  return (
    <div className="p-4 w-full mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TextEditor
                field="content"
                labelText="Write your review"
                defaultValue={field.value}
                setValue={field.onChange}
                error={undefined}
              />
            )}
          />
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
