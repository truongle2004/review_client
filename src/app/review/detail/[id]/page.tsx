'use client';

import Avatar from '@/components/Avatar';
import ListComment from '@/components/ListComment';
import Navbar from '@/components/NavBar';
import TextEditor from '@/components/TextEditor';
import { env } from '@/enviroment/env';
import { addComment, getAllComment } from '@/services/comment';
import { addRatingAPI } from '@/services/rating';
import { deleteReview, getDetailReviewAPI, getReviewImages, updateReview } from '@/services/review';
import useAuthStore from '@/store/authStore';
import { type CommentResponse } from '@/types';
import { ToastError, ToastSuccess } from '@/utils/toastify';
import { faImage, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import zod from 'zod';
import avatar from '../../../../../public/my-notion-face-transparent.png';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const router = useRouter();
  const [openModalDelete, setOpenModalDelete] = useState(false);

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
    onSuccess: () => {
      ToastSuccess('Rating submitted successfully');
      queryClient.invalidateQueries({ queryKey: ['review', params.id] });
      getDetailReviewMutation(params.id);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response?.status === 409) {
        ToastError(error.response.data?.message || 'You have already rated this review');
      } else {
        ToastError('Failed to submit rating');
      }
    },
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

  const { mutate: updateReviewMutation } = useMutation({
    mutationFn: () =>
      updateReview({
        reviewId: params.id,
        userId: userInfo?.userId as string,
        content: editedContent,
        title: editedTitle,
        productId: review?.product.id as number,
      }),
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['review', params.id] });
      ToastSuccess('Review updated successfully');

      getDetailReviewMutation(params.id);
    },
    onError: () => {
      ToastError('Failed to update review');
    },
  });

  const { mutate: deleteReviewMutation } = useMutation({
    mutationFn: () => deleteReview(params.id),
    onSuccess: () => {
      ToastSuccess('Review deleted successfully');
      router.back();
    },
    onError: () => {
      ToastError('Failed to delete review');
    },
  });

  const handleEdit = () => {
    if (!review) return;
    setIsEditing(true);
    setEditedContent(review.content);
    setEditedTitle(review.title);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent('');
    setEditedTitle('');
  };

  const handleSaveEdit = () => {
    if (params.id === undefined) return;
    updateReviewMutation();
  };

  const handleDelete = () => {
    setOpenModalDelete(true);
  };

  const handleConfirmDelete = () => {
    deleteReviewMutation();
    setOpenModalDelete(false);
  };

  const handleCancelDelete = () => {
    setOpenModalDelete(false);
  };

  const handleGoBack = () => {
    router.back();
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
    return (
      <div className="flex justify-center items-center h-screen">
        <div className=" w-32 h-32 relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-xl bg-blue-500/20 blur-xl animate-pulse"></div>

          <div className="w-full h-full relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 animate-spin blur-sm"></div>

            <div className="absolute inset-1 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
              <div className="flex gap-1 items-center">
                <div className="w-1.5 h-12 bg-cyan-500 rounded-full animate-[bounce_1s_ease-in-out_infinite]"></div>
                <div className="w-1.5 h-12 bg-blue-500 rounded-full animate-[bounce_1s_ease-in-out_infinite_0.1s]"></div>
                <div className="w-1.5 h-12 bg-indigo-500 rounded-full animate-[bounce_1s_ease-in-out_infinite_0.2s]"></div>
                <div className="w-1.5 h-12 bg-purple-500 rounded-full animate-[bounce_1s_ease-in-out_infinite_0.3s]"></div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/10 to-transparent animate-pulse"></div>
            </div>
          </div>

          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-ping delay-100"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-500 rounded-full animate-ping delay-200"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping delay-300"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <article className="max-w-4xl mx-auto py-8">
        <dialog id="my_modal_1" className={`modal ${openModalDelete ? 'modal-open' : ''}`}>
          <div className="modal-box">
            <h3 className="font-bold text-lg">Warning!</h3>
            <p className="py-4">Are you sure you want to delete this review?</p>
            <div className="modal-action">
              <form method="dialog" className="flex flex-row gap-4">
                <button className="btn btn-success" onClick={handleConfirmDelete}>
                  Sure
                </button>
                <button className="btn btn-warning" onClick={handleCancelDelete}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </dialog>

        <button
          className="cursor-pointer duration-200 hover:scale-125 active:scale-100"
          title="Go Back"
          onClick={handleGoBack}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35px"
            height="35px"
            viewBox="0 0 24 24"
            className="stroke-blue-300"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="1.5"
              d="M11 6L5 12M5 12L11 18M5 12H19"
            ></path>
          </svg>
        </button>
        <div className="px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Avatar src={avatar} username={review.user.username} />
              <div>
                <p className="text-sm text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {userInfo?.userId === review.user.id && (
              <div className="flex items-center space-x-4">
                <button
                  className="w-20 h-10 text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg hover:scale-105 duration-200 hover:drop-shadow-2xl hover:shadow-[#7dd3fc] hover:cursor-pointer"
                  onClick={handleEdit}
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <button
                  className="flex justify-center items-center gap-2 w-20 h-10 cursor-pointer rounded-md shadow-2xl text-white font-semibold bg-gradient-to-r from-[#fb7185] via-[#e11d48] to-[#be123c] hover:shadow-xl hover:shadow-red-500 hover:scale-105 duration-300 hover:from-[#be123c] hover:to-[#fb7185]"
                  onClick={handleDelete}
                >
                  <svg
                    className="w-6 h-6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mb-8">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full p-2 mb-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                placeholder="Review title"
              />
              <TextEditor defaultValue={editedContent} setValue={setEditedContent} field="edit" />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="btn bg-gray-700 text-gray-300 hover:bg-gray-600 px-4 py-2 rounded-lg btn-sm"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
                <button
                  className="btn bg-blue-600 text-white hover:bg-blue-500 px-4 py-2 rounded-lg btn-sm"
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-white mb-4">{review.title}</h1>
              <div className="prose prose-invert max-w-none mb-8">
                <div dangerouslySetInnerHTML={{ __html: review.content }}></div>
              </div>
            </>
          )}

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
            <div className="flex items-center space-x-4 w-full">
              <input
                type="range"
                min="1"
                max="100"
                value={rating || 0}
                onChange={(e) => setRating(Number(e.target.value))}
                className="range range-primary flex-1"
              />
              <span className="text-white min-w-[3rem] text-center">{rating || 0}</span>
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
          {comments?.data && comments?.data.length > 0 ? (
            <ListComment comments={comments?.data || []} reviewId={params.id} />
          ) : (
            <div className="text-center text-gray-400">No comments yet</div>
          )}
        </div>
      </article>
    </div>
  );
};

export default ReviewDetailPage;
