'use client';

import Description from '@/components/Description';
import ImageSlider from '@/components/ImageSlider';
import RatingDisplay from '@/components/Rating';
import WriteReview from '@/components/WriteReview';
import { fetchProductDetailAPI } from '@/services/product';
import { addNewReviewAPI, getReviewsAPI } from '@/services/review';
import useAuthStore from '@/store/authStore';
import { ToastError, ToastSuccess, ToastWarning } from '@/utils/toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

const ListingReviewPage = () => {
  const params = useParams<{ id: string }>();
  const [showReadMore, setShowReadMore] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const { userInfo } = useAuthStore();
  const router = useRouter();

  const handleCloseReadMore = () => setShowReadMore(false);
  const handleOpenReadMore = () => setShowReadMore(true);

  const { data: listProductData } = useQuery({
    queryKey: ['product', params.id],
    queryFn: () => fetchProductDetailAPI({ id: Number(params.id) }),
    enabled: !!params.id,
  });

  const handleToggleShowWriteReview = () => {
    if (!userInfo.isLoggedIn) {
      ToastWarning('You need to login to write a review');
      router.push('/review/login');
    }
    setShowWriteReview(!showWriteReview);
  };

  const { mutate: addNewReviewMutation } = useMutation({
    mutationFn: addNewReviewAPI,
    onSuccess: (data) => {
      console.log(data);
      setShowWriteReview(false);
      ToastSuccess('Review submitted successfully');
    },
    onError: (err) => {
      console.log(err);
      ToastError('Failed to submit review');
    },
  });

  const { data: listReviewData } = useQuery({
    queryKey: ['reviews', params.id],
    queryFn: () => getReviewsAPI(Number(params.id)),
    enabled: !!params.id,
  });

  const handleSubmitReview = (content: string, title: string) => {
    addNewReviewMutation({
      productId: Number(params.id),
      userId: userInfo.userId as string,
      title,
      content,
    });
  };

  if (showReadMore) {
    return (
      <Description
        content={listProductData?.description as string}
        handleClose={handleCloseReadMore}
      />
    );
  }

  return (
    <>
      <div className="flex flex-row flex-wrap gap-6 p-4 container mx-auto bg-base-200">
        <div className="flex flex-col gap-6 min-w-[300px]">
          {/* Main Review Card */}
          <div id="card-review" className="card bg-base-100 shadow-xl text-primary-content w-96">
            <div className="card-body">
              <h2 className="card-title">{listProductData?.title}</h2>
              <RatingDisplay rating={listProductData?.rating as number} />
              <div className="card-actions w-full flex flex-row gap-4">
                <button
                  className="btn btn-primary btn-sm flex-1 h-16"
                  onClick={handleToggleShowWriteReview}
                >
                  {showWriteReview ? 'Close' : 'Write a review'}
                </button>

                <button
                  className="btn btn-primary btn-outline btn-sm flex-1 h-16"
                  onClick={handleOpenReadMore}
                >
                  See more
                </button>
              </div>
            </div>
          </div>

          {/* Cookie Card */}
          <div className="card bg-neutral text-neutral-content w-96">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Cookies!</h2>
              <p>We are using cookies for no reason.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Accept</button>
                <button className="btn btn-ghost">Deny</button>
              </div>
            </div>
          </div>
        </div>

        {!showWriteReview ? (
          <div id="review-header" className="flex-1 min-w-[300px]">
            <ul id="list-images" className="w-full">
              <ImageSlider>
                {listProductData?.images?.map((image, index) => (
                  <div key={index} className="carousel-item">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={200}
                      height={200}
                      className="object-cover rounded-lg shadow-md"
                    />
                  </div>
                )) || (
                  <div className="w-48 h-48 bg-base-300 rounded-lg flex items-center justify-center text-gray-500">
                    No images
                  </div>
                )}
              </ImageSlider>
            </ul>

            {/* Review List */}
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
              <div className="flex flex-col gap-4">
                {listReviewData ? (
                  listReviewData.map((review) => (
                    <div key={review.id} className="card bg-base-100 shadow-md w-full">
                      <div className="card-body">
                        <div className="flex justify-between items-center">
                          <h4 className="card-title text-lg">{review?.user?.username}</h4>
                          <RatingDisplay rating={review.rating} />
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleString()}
                        </p>
                        <p>{review.title}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No reviews yet.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex-1">
            <WriteReview handleSubmitReview={handleSubmitReview} />
          </div>
        )}
      </div>
    </>
  );
};

export default ListingReviewPage;
