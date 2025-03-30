'use client';

import { getReviewImages } from '@/services/review';
import { ReviewImage, Review } from '@/types';
import { faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Description from '@/components/Description';
import ImageSlider from '@/components/ImageSlider';
import RatingDisplay from '@/components/Rating';
import WriteReview from '@/components/WriteReview';
import { fetchProductDetailAPI } from '@/services/product';
import { addNewReviewAPI, getReviewsAPI, uploadImages } from '@/services/review';
import useAuthStore from '@/store/authStore';
import { ToastError, ToastWarning } from '@/utils/toastify';
import tokenDecoder from '@/utils/tokenDecode';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { env } from '@/enviroment/env';

const ListingReviewPage = () => {
  const params = useParams<{ id: string }>();
  const [showReadMore, setShowReadMore] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const { userInfo, isLoggedIn } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [overviewImages, setOverviewImages] = useState<ReviewImage | null>(null);
  const router = useRouter();

  const handleCloseReadMore = () => setShowReadMore(false);
  const handleOpenReadMore = () => setShowReadMore(true);

  const { data: listProductData } = useQuery({
    queryKey: ['product', params.id],
    queryFn: () => fetchProductDetailAPI({ id: Number(params.id) }),
    enabled: !!params.id,
  });

  const handleToggleShowWriteReview = () => {
    if (!isLoggedIn) {
      ToastWarning('You need to login to write a review');
      router.push('/review/login');
    }
    setShowWriteReview(!showWriteReview);
  };

  const { mutateAsync: uploadImagesMutation } = useMutation({
    mutationFn: uploadImages,
  });

  const { mutateAsync: addNewReviewMutation } = useMutation({
    mutationFn: addNewReviewAPI,
    onSuccess: (data) => {
      setShowWriteReview(false);
      setReviews([data, ...reviews]);
      // ToastSuccess('Review submitted successfully');
    },
    onError: (err) => {
      console.log(err.message);
      ToastError('Failed to submit review');
    },
  });

  const { mutateAsync: getReviewsAPIMutaion } = useMutation({
    mutationFn: getReviewsAPI,
    onSuccess: (data) => {
      // TODO: something
    },
  });

  const { mutateAsync: getReviewImagesMutation } = useMutation({
    mutationFn: getReviewImages,
  });

  const handleSubmitReview = async (content: string, title: string, images: File[]) => {
    let userId = userInfo.userId;

    const token = localStorage.getItem('token');

    if (!userId && token) {
      const user = tokenDecoder(token);
      userId = user?.userId;
    }

    if (!userId) {
      ToastWarning('There is an error with your account. Please login again');
      router.push('/review/login');
      return;
    }

    try {
      const res = await addNewReviewMutation({
        productId: Number(params.id),
        userId,
        title,
        content,
      });

      if (images.length > 0) {
        await uploadImagesMutation({
          reviewId: res.review_id,
          images,
        });
      }
    } catch (error) {
      ToastError('There something went wrong. Please try again');
    }
  };

  const handleFetchingData = async () => {
    const res = await getReviewsAPIMutaion(Number(params.id));

    let result: Review[] = [];

    res.map((review) => {
      getReviewImagesMutation({ reviewId: review.review_id as string }).then((res_image) => {
        result.push({
          ...review,
          review_images: res_image,
        });
      });
    });

    setReviews(result);
  };

  useEffect(() => {
    handleFetchingData();
  }, []);

  const handleClickReview = (id: string) => {
    router.push(`/review/detail/${id}`);
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
                {reviews ? (
                  reviews.map((review) => (
                    <div
                      key={review.review_id}
                      className="card bg-base-100 shadow-md w-ful cursor-pointer"
                      onClick={() => handleClickReview(review.review_id)}
                    >
                      <div className="card-body">
                        <div className="flex justify-between items-center">
                          <h4 className="card-title text-sm">{review?.user_username}</h4>
                          <RatingDisplay rating={review.review_rating} />
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(review.review_created_at).toLocaleString()}
                        </p>
                        <p className="font-bold text-lg">{review.review_title}</p>

                        {review?.review_images.length > 0 && (
                          <div className="flex gap-4">
                            {review.review_images.map((image) => (
                              <Image
                                key={image.filename}
                                src={`${env.SERVER_URL}${image.url}`}
                                alt={image.filename}
                                className="object-cover rounded-md"
                                width={100}
                                height={100}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 p-4">
                        <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition">
                          <FontAwesomeIcon icon={faComment} />
                          <span>{review.commentCount}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition">
                          <FontAwesomeIcon icon={faShare} />
                          <span>Share</span>
                        </button>
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
