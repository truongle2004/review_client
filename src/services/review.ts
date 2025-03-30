import { env } from '@/enviroment/env';
import type { ReviewImage, Review } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

export const uploadImages = async ({ reviewId, images }: { reviewId: string; images: File[] }) => {
  const formData = new FormData();
  images.forEach((image) => {
    formData.append('reviewImages', image);
  });
  return axiosInstance.post(env.SERVER_URL + `/v1/review/${reviewId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getReviewImages = async ({
  reviewId,
}: {
  reviewId: string;
}): Promise<ReviewImage[]> => {
  return await axiosInstance.get(`${env.SERVER_URL}/v1/review/${reviewId}/images`);
};

export const addNewReviewAPI = async ({
  userId,
  content,
  title,
  productId,
}: {
  userId: string;
  content: string;
  title: string;
  productId: number;
}): Promise<Review> => {
  return axiosInstance.post(env.SERVER_URL + '/v1/review', {
    userId,
    content,
    title,
    productId,
  });
};

export const getReviewsAPI = async (productId: number): Promise<Review[]> => {
  return axiosInstance.get(env.SERVER_URL + `/v1/review/${productId}`);
};

export const getDetailReviewAPI = async (
  reviewId: string
): Promise<{
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
}> => {
  return axiosInstance.get(env.SERVER_URL + `/v1/review/detail/${reviewId}`);
};

export const deleteReview = async (reviewId: string) => {
  return axiosInstance.delete(env.SERVER_URL + `/v1/review/${reviewId}`);
};

export const updateReview = async ({
  userId,
  content,
  title,
  productId,
}: {
  userId: string;
  content: string;
  title: string;
  productId: number;
}) => {
  return await axiosInstance.put(env.SERVER_URL + '/v1/review', {
    userId,
    content,
    title,
    productId,
  });
};
