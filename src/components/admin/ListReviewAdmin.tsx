'use client';

import { deleteReview, getReviewsAPI } from '@/services/review';
import { useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ListReviewAdmin = () => {
  const [openModalAlertDelete, setOpenModalAlertDelete] = useState(false);
  const [reviewId, setReviewId] = useState<string | null>(null);

  const {
    data: reviews,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => getReviewsAPI(0), // Pass 0 to get all reviews
  });

  const { mutate: deleteReviewMutation } = useMutation({
    mutationFn: deleteReview,
    onSuccess: (data) => {
      toast.success(data.message);
      refetch();
    },
  });

  const handleDeleteReview = (id: string) => {
    setOpenModalAlertDelete(true);
    setReviewId(id);
  };

  const handleCancelDeleteReview = () => {
    setReviewId(null);
    setOpenModalAlertDelete(false);
  };

  const handleConfirmDeleteReview = () => {
    if (reviewId) {
      deleteReviewMutation(reviewId);
      setOpenModalAlertDelete(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <dialog id="my_modal_1" className={`modal ${openModalAlertDelete ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Warning!</h3>
          <p className="py-4">Are you sure you want to delete this review?</p>
          <div className="modal-action">
            <form method="dialog" className="flex flex-row gap-4">
              <button className="btn btn-success" onClick={handleConfirmDeleteReview}>
                Sure
              </button>
              <button className="btn btn-warning" onClick={handleCancelDeleteReview}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <div className="overflow-x-auto">
        <div className="m-10">
          <h2 className="text-2xl font-bold mb-6">Reviews Management</h2>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>User</th>
              <th>Product</th>
              <th>Title</th>
              <th>Rating</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews?.map((review) => (
              <tr key={review.review_id}>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <Image
                          src={review.profile_profile_picture}
                          alt={review.user_username}
                          width={48}
                          height={48}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{review.user_username}</div>
                      <div className="text-sm opacity-50">{review.user_id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="font-medium">{review.product_title}</div>
                  <div className="text-sm opacity-50">ID: {review.product_id}</div>
                </td>
                <td className="max-w-xs truncate">{review.review_title}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <span>{review.review_rating}/100</span>
                    <progress
                      className="progress progress-info w-24"
                      value={review.review_rating}
                      max="100"
                    />
                  </div>
                </td>
                <td>{new Date(review.review_created_at).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => {
                        // TODO: Implement view review details
                        toast.info('View review details coming soon');
                      }}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleDeleteReview(review.review_id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListReviewAdmin;
