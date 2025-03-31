import { env } from '@/enviroment/env';
import type { Product, ProductPaginateResponse } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

export const fetchProductAPI = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<ProductPaginateResponse> => {
  return await axiosInstance.get(env.SERVER_URL + '/v1/product', {
    params: {
      page,
      limit,
    },
  });
};

export const fetchProductPaginationAPI = async ({
  page,
  limit,
  categoryId,
  rating,
  sortBy,
}: {
  page: number;
  limit: number;
  categoryId: number;
  rating?: number;
  sortBy?: string;
}): Promise<ProductPaginateResponse> => {
  return await axiosInstance.get(env.SERVER_URL + `/v1/product/category/${categoryId}`, {
    params: {
      page,
      limit,
      rating,
      sortBy,
    },
  });
};

export const fetchProductDetailAPI = async ({ id }: { id: number }): Promise<Product> => {
  return await axiosInstance.get(env.SERVER_URL + `/v1/product/${id}`);
};

export const fetchProductDetailByIdAPI = async ({ id }: { id: number }): Promise<Product> => {
  return await axiosInstance.get(env.SERVER_URL + `/v1/product/${id}`);
};

export const deleteProductAPI = async ({ id }: { id: number }): Promise<{ message: string }> => {
  return await axiosInstance.delete(env.SERVER_URL + `/v1/product/${id}`);
};

export const createProductAPI = async (data: {
  title: string;
  description: string;
  categoryId: number;
  images: { src: string; alt: string }[];
}): Promise<Product> => {
  return await axiosInstance.post(env.SERVER_URL + '/v1/product', data);
};
