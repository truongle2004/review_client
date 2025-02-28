'use client';

import ImageSlider from '@/components/ImageSlider';
import RatingDisplay from '@/components/Rating';
import { fetchProductDetailAPI } from '@/services/product';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';
// TODO: get detail product here
// TODO: fetch all reviews
const ListingReviewPage = () => {
  const params = useParams<{ id: string }>();

  const [showReadMore, setShowReadMore] = useState(false);

  const { data } = useQuery({
    queryKey: ['product', params.id],
    queryFn: () => fetchProductDetailAPI({ id: Number(params.id) }),
    enabled: !!params.id,
  });

  const handleToggleShowReadMore = () => {
    setShowReadMore(!showReadMore);
  };

  if (showReadMore) {
    return (
      <section className="w-1/2 mx-auto">
        <h4 className="mb-0 text-center">Description</h4>
        <hr />
        <p
          className="lead link-no-decoration"
          style={{ whiteSpace: 'pre-wrap', padding: '10px 20px' }}
          dangerouslySetInnerHTML={{
            __html: data?.description as string,
          }}
        ></p>
      </section>
    );
  }

  return (
    <div className="flex flex-row flex-wrap gap-6 p-4 container mx-auto bg-base-200">
      <div className="flex flex-col gap-6 min-w-[300px]">
        {/* Main Review Card */}
        <div id="card-review" className="card bg-base-100 shadow-xl text-primary-content w-96">
          <div className="card-body">
            <h2 className="card-title">{data?.title}</h2>
            <RatingDisplay rating={data?.rating as number} />
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Write a review</button>
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
      {/* Review Header with Image Slider */}
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
      </div>

      {/* List of Reviews */}
      {/* <div id="list-review" className="flex-1 min-w-[300px]">
        <h3 className="text-xl font-bold mb-4">User Reviews</h3>
        {data?.reviews && data.reviews.length > 0 ? (
          <div className="space-y-4">
            {data.reviews.map((review, index) => (
              <div key={index} className="card bg-base-100 shadow-md p-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{review.author}</span>
                  <RatingDisplay rating={review.rating} />
                </div>
                <p className="text-gray-700 mt-2">{review.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div> */}

      {/* Cards Section */}
    </div>
  );
};

export default ListingReviewPage;
