'use client';

import Avatar from '@/components/Avatar';
import ListComment from '@/components/ListComment';
import Navbar from '@/components/NavBar';
import TextEditor from '@/components/TextEditor';
import { addComment, getAllComment } from '@/services/comment';
import { addRatingAPI } from '@/services/rating';
import { getDetailReviewAPI, getReviewImages } from '@/services/review';
import useAuthStore from '@/store/authStore';
import { type CommentResponse } from '@/types';
import { ToastError } from '@/utils/toastify';
import { faComment, faImage, faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import zod from 'zod';
import avatar from '../../../../../public/my-notion-face-transparent.png';
import { env } from '@/enviroment/env';

const comment_schema = zod.object({
  content: zod.string().nonempty({
    message: 'content is required',
  }),
});

const ReviewDetailPage = () => {
  const [review, setReview] = useState<{
    id: string;
    createdAt: Date;
    rating: number;
    content: string;
    title: string;
    product: {
      id: number;
      title: string;
    };
    user: {
      id: string;
      username: string;
      profile: string;
    };
  } | null>(null);
  const params = useParams<{ id: string }>();
  const [rating, setRating] = useState(review?.rating || 0);
  const { userInfo } = useAuthStore();
  const queryClient = useQueryClient();
  const [images, setImages] = useState<
    | {
        filename: string;
        url: string;
        fullpath: string;
      }[]
    | null
  >(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: addCommentMutation, isPending } = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', params.id] });
      reset();
    },
    onError: () => {
      ToastError('Failed to add comment');
    },
  });

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      content: '',
    },
    resolver: zodResolver(comment_schema),
  });

  const handleCancelComment = () => {
    reset();
  };

  const { mutate: addRatingAPIMutation } = useMutation({
    mutationFn: addRatingAPI,
  });

  const handleSubmitRating = async () => {
    await addRatingAPIMutation({
      rating,
      userId: userInfo.userId as string,
      reviewId: params.id as string,
    });
  };

  const { mutateAsync: getDetailReviewMutation } = useMutation({
    mutationFn: getDetailReviewAPI,
    onSuccess: (data) => setReview(data),
  });

  const { data: comments } = useQuery<CommentResponse>({
    queryKey: ['comments', params.id],
    queryFn: () => getAllComment(params.id),
  });

  const { mutateAsync: getReviewImagesMutation } = useMutation({
    mutationFn: getReviewImages,
    onSuccess: (data) => setImages(data),
  });

  const handleEditorChange = useCallback(
    (value: string) => {
      setValue('content', value);
    },
    [setValue]
  );

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSelectedImages((prev) => [...prev, ...newFiles]);

      // Create preview URLs
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmitComment = async (data: { content: string }) => {
    await addCommentMutation({
      reviewId: params.id,
      parentId: null,
      content: data.content,
      images: selectedImages,
    });
    setSelectedImages([]);
    setPreviewUrls([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        getDetailReviewMutation(params.id),
        getReviewImagesMutation({ reviewId: params.id }),
      ]);
    };
    fetchData();
  }, [params.id, getDetailReviewMutation, getReviewImagesMutation]);

  if (!review) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <article className="max-w-4xl mx-auto py-8">
        <div className="px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Avatar src={avatar} username={review.user.username} />
              <div>
                <h2 className="text-xl font-semibold text-white">{review.user.username}</h2>
                <p className="text-sm text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-white">
                <FontAwesomeIcon icon={faShare} />
              </button>
              <button className="text-gray-400 hover:text-white">
                <FontAwesomeIcon icon={faComment} />
              </button>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">{review.title}</h1>
          <div className="prose prose-invert max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: review.content }}></div>
          </div>

          {images && images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-video">
                  <Image
                    src={`${env.SERVER_URL}/static/${image.filename}`}
                    alt={`Review image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2 mb-8">
            <div className="rating rating-lg">
              {[1, 2, 3, 4, 5].map((star) => (
                <input
                  key={star}
                  type="radio"
                  name="rating-8"
                  className="mask mask-star-2 bg-orange-400"
                  checked={rating === star}
                  onChange={() => setRating(star)}
                />
              ))}
            </div>
            <button className="btn btn-sm btn-primary" onClick={handleSubmitRating}>
              Submit Rating
            </button>
          </div>
        </div>

        <form
          className="border-t border-gray-700 px-6 py-4 bg-gray-800"
          onSubmit={handleSubmit(handleSubmitComment)}
        >
          <TextEditor
            {...register('content')}
            field="comment"
            labelText="Write a comment..."
            setValue={handleEditorChange}
            defaultValue={''}
          />

          <div className="mt-4">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-sm btn-outline"
            >
              <FontAwesomeIcon icon={faImage} className="mr-2" />
              Add Images
            </button>
            {previewUrls.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {errors.content && (
            <p className="error-field mt-1 text-error">{errors.content.message}</p>
          )}

          <div className="flex justify-end gap-3 mt-3">
            <button
              className={`btn bg-gray-700 text-gray-300 hover:bg-gray-600 px-4 py-2 rounded-lg btn-sm`}
              disabled={getValues('content') === ''}
              onClick={handleCancelComment}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-blue-600 text-white hover:bg-blue-500 px-4 py-2 rounded-lg btn-sm"
            >
              {isPending ? <span className="loading loading-spinner loading-sm"></span> : 'Comment'}
            </button>
          </div>
        </form>

        {/* List Comments */}
        <div className="px-6 pb-6">
          <ListComment comments={comments?.data.comments || []} reviewId={params.id} />
        </div>
      </article>
    </div>
  );
};

export default ReviewDetailPage;
