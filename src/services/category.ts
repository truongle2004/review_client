import { env } from '@/enviroment/env';
import { Category } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

export const fetchAllCategoryAPI = async (): Promise<Category[]> => {
  return await axiosInstance.get(env.SERVER_URL + '/v1/category');
};
