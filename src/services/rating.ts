import { env } from '@/enviroment/env';
import axiosInstance from '@/utils/axiosInstance';

export const addRatingAPI = async ({
  rating,
  userId,
  reviewId,
}: {
  rating: number;
  userId: string;
  reviewId: string;
}) => {
  return await axiosInstance.post(env.SERVER_URL + '/v1/rating', {
    rating,
    userId,
    reviewId,
  });
};
