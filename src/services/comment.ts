import { env } from '@/enviroment/env';
import type { CommentResponse } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

export const addComment = async ({
  reviewId,
  parentId = null,
  content,
  images,
}: {
  reviewId: string;
  parentId: string | null;
  content: string;
  images: File[];
}) => {
  const formData = new FormData();
  formData.append('reviewId', reviewId);
  formData.append('parentId', parentId !== null ? parentId : '');
  formData.append('content', content);
  images.forEach((image) => {
    formData.append('images', image);
  });

  return await axiosInstance.post(env.SERVER_URL + '/v1/comment', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getAllComment = async (reviewId: string): Promise<CommentResponse> => {
  return await axiosInstance.get(env.SERVER_URL + `/v1/comment/${reviewId}`);
};

export const updateComment = async ({
  reviewId,
  commentId,
  content,
}: {
  reviewId: string;
  commentId: string;
  content: string;
}) => {
  return axiosInstance.put(env.SERVER_URL + `/v1/comment`, {
    reviewId,
    commentId,
    content,
  });
};

export const deleteComment = async ({
  commentId,
  reviewId,
  parentId,
}: {
  commentId: string;
  reviewId: string;
  parentId: string;
}) => {
  return axiosInstance.delete(env.SERVER_URL + '/v1/comment', {
    data: {
      commentId,
      reviewId,
      parentId,
    },
  });
};

// export const uploadImages = async ({ reviewId, images }: { reviewId: string; images: File[] }) => {
//   const formData = new FormData();
//   images.forEach((image) => {
//     formData.append('reviewImages', image);
//   });
//   return axiosInstance.post(env.SERVER_URL + `/v1/review/${reviewId}/images`, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
// };
