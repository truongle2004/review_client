import { env } from '@/enviroment/env';
import type { ProductPaginateResponse } from '@/types';
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
