'use client';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState, type FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getReviewsAPI, addNewReviewAPI, uploadImages } from '@/services/review';
import WriteReview from '@/components/WriteReview';
import { ToastError, ToastSuccess } from '@/utils/toastify';
import useAuthStore from '@/store/authStore';
import tokenDecoder from '@/utils/tokenDecode';
import { type Review } from '@/types';

const ReviewPage: FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isAddingReview, setIsAddingReview] = useState(false);
  const { userInfo, isLoggedIn } = useAuthStore();

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ['reviews'],
    queryFn: () => getReviewsAPI(1), // Using a default product ID of 1 for now
  });

  const handleSubmitReview = async (content: string, title: string, images: File[]) => {
    let userId = userInfo.userId;

    const token = localStorage.getItem('token');

    if (!userId && token) {
      const user = tokenDecoder(token);
      userId = user?.userId;
    }

    if (!userId) {
      ToastError('There is an error with your account. Please login again');
      router.push('/review/login');
      return;
    }

    try {
      // First create the review
      const reviewResponse = await addNewReviewAPI({
        productId: 1, // Using a default product ID of 1 for now
        userId,
        title,
        content,
      });

      // Check if we have a valid review ID before proceeding with image upload
      if (!reviewResponse?.id) {
        throw new Error('Failed to get review ID after creation');
      }

      // Upload images if we have them and a valid review ID
      if (images.length > 0) {
        try {
          await uploadImages({
            reviewId: reviewResponse.id,
            images,
          });
        } catch (imageError) {
          console.error('Error uploading images:', imageError);
          ToastError('Review created but failed to upload images');
          // Continue with the flow even if image upload fails
        }
      }

      ToastSuccess('Review added successfully');
      setIsAddingReview(false);
      // Fetch all reviews again
      const updatedReviews = await getReviewsAPI(1);
      queryClient.setQueryData(['reviews'], updatedReviews);
    } catch (error) {
      console.error('Error adding review:', error);
      ToastError('Failed to add review');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Reviews</h1>
        <button
          onClick={() => {
            if (!isLoggedIn) {
              ToastError('You need to login to write a review');
              router.push('/review/login');
              return;
            }
            setIsAddingReview(true);
          }}
          className="btn btn-primary"
        >
          Add New Review
        </button>
      </div>

      {isAddingReview && (
        <div className="mb-8">
          <WriteReview handleSubmitReview={handleSubmitReview} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review.review_id}
            className="card bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
            onClick={() => router.push(`/review/detail/${review.review_id}`)}
          >
            <figure>
              {review.review_images && review.review_images.length > 0 ? (
                <img
                  src={review.review_images[0].url}
                  alt={review.review_title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </figure>
            <div className="card-body">
              <h2 className="card-title">{review.review_title}</h2>
              <p className="line-clamp-3">{review.content}</p>
              <div className="card-actions justify-end">
                <div className="badge badge-primary">{review.review_rating}/100</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewPage;
