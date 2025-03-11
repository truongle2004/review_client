import { env } from '@/enviroment/env';
import type { ReviewResponse } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

export const addNewReviewAPI = async ({
  userId = '2aee4c90-d78a-413d-b55b-5a42e2707c8e',
  content,
  title,
  productId,
}: {
  userId: string;
  content: string;
  title: string;
  productId: number;
}) => {
  return axiosInstance.post(env.SERVER_URL + '/v1/review', {
    userId,
    content,
    title,
    productId,
  });
};

export const getReviewsAPI = async (productId: number): Promise<ReviewResponse[]> => {
  return axiosInstance.get(env.SERVER_URL + `/v1/review/${productId}`);
};
