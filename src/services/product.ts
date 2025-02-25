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

export const fetchProductByCategoryAPI = async ({
  page,
  limit,
  categoryId,
}: {
  page: number;
  limit: number;
  categoryId: number;
}): Promise<ProductPaginateResponse> => {
  return await axiosInstance.get(env.SERVER_URL + `/v1/product/category/${categoryId}`, {
    params: {
      page,
      limit,
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
