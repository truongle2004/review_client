import { env } from '@/enviroment/env';
import { Category } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

export const fetchAllCategoryAPI = async (): Promise<Category[]> => {
  return await axiosInstance.get(env.SERVER_URL + '/v1/category');
};

export const addNewCategoryAPI = async (name: string): Promise<Category> => {
  return await axiosInstance.post(env.SERVER_URL + '/v1/category', { name });
};

export const deleteCategoryAPI = async (
  id: number
): Promise<{
  message: string;
  id: number;
}> => {
  return await axiosInstance.delete(env.SERVER_URL + `/v1/category/${id}`);
};
