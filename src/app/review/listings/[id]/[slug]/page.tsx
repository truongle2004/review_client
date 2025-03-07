'use client';

import Description from '@/components/Description';
import ImageSlider from '@/components/ImageSlider';
import RatingDisplay from '@/components/Rating';
import WriteReview from '@/components/WriteReview';
import { fetchProductDetailAPI } from '@/services/product';
import useAuthStore from '@/store/authStore';
import { ToastWarning } from '@/utils/toastify';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

// Mock review data (you can replace this with a real API fetch later)
const mockReviews = [
  {
    id: 1,
    reviewerName: 'Alice Johnson',
    rating: 4.5,
    comment: '<p>Really love this chair! It’s sturdy and looks great in my dining room.</p>',
    date: '2025-02-15',
  },
  {
    id: 2,
    reviewerName: 'Bob Smith',
    rating: 4.0,
    comment: '<p>Good quality, but the scratches were a bit more noticeable than expected.</p>',
    date: '2025-02-10',
  },
  {
    id: 3,
    reviewerName: 'Clara Lee',
    rating: 5.0,
    comment: '<p>Perfect! Exactly what I was looking for.</p>',
    date: '2025-01-28',
  },
];

const ListingReviewPage = () => {
  const params = useParams<{ id: string }>();
  const [showReadMore, setShowReadMore] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const { userInfo } = useAuthStore();
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ['product', params.id],
    queryFn: () => fetchProductDetailAPI({ id: Number(params.id) }),
    enabled: !!params.id,
  });

  const handleToggleShowReadMore = () => {
    setShowReadMore(!showReadMore);
  };

  const handleToggleShowWriteReview = () => {
    if (!userInfo.isLoggedIn) {
      ToastWarning('You need to login to write a review');
      router.push('/review/login');
    }
    setShowWriteReview(!showWriteReview);
  };

  const handleSubmitReview = (content: string) => {
    console.log(content);
  };

  if (showReadMore) {
    return <Description content={data?.description as string} />;
  }

  return (
    <>
      <div className="flex flex-row flex-wrap gap-6 p-4 container mx-auto bg-base-200">
        <div className="flex flex-col gap-6 min-w-[300px]">
          {/* Main Review Card */}
          <div id="card-review" className="card bg-base-100 shadow-xl text-primary-content w-96">
            <div className="card-body">
              <h2 className="card-title">{data?.title}</h2>
              <RatingDisplay rating={data?.rating as number} />
              <div className="card-actions justify-end">
                <button className="btn btn-primary" onClick={handleToggleShowWriteReview}>
                  {showWriteReview ? 'Close' : 'Write a review'}
                </button>
                <button className="btn btn-outline" onClick={handleToggleShowReadMore}>
                  Read more
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
                {data?.images?.map((image, index) => (
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
                {mockReviews.length > 0 ? (
                  mockReviews.map((review) => (
                    <div key={review.id} className="card bg-base-100 shadow-md w-full">
                      <div className="card-body">
                        <div className="flex justify-between items-center">
                          <h4 className="card-title text-lg">{review.reviewerName}</h4>
                          <RatingDisplay rating={review.rating} />
                        </div>
                        <p className="text-sm text-gray-500">{review.date}</p>
                        <p dangerouslySetInnerHTML={{ __html: review.comment }}></p>
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
