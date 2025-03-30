import { env } from '@/enviroment/env';
import { UpdateProfileInfo, type UserProfileResponse } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

export const updateProfileAPI = async (data: UpdateProfileInfo) => {
  const formattedData = {
    ...data,
    birthday: data.birthday.toISOString().split('T')[0], // Format as YYYY-MM-DD
  };
  return await axiosInstance.put(env.SERVER_URL + '/v1/profile', formattedData);
};

export const getProfileAPI = async ({
  userId,
}: {
  userId: string;
}): Promise<UserProfileResponse> => {
  return await axiosInstance.get(`${env.SERVER_URL}/v1/profile/${userId}`);
};
