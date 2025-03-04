import { env } from '@/enviroment/env';
import { RegisterResponse, RegisterInfo, LoginResponse, LoginInfo } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

export const registerAccountAPI = async ({
  username,
  email,
  password,
  confirmPassword,
}: RegisterInfo): Promise<RegisterResponse> => {
  console.log(env.SERVER_URL + 'v1/auth/register');
  return await axiosInstance.post(env.SERVER_URL + '/v1/auth/register', {
    username,
    email,
    password,
    confirmPassword,
  });
};

export const loginAccountAPI = async ({ email, password }: LoginInfo): Promise<LoginResponse> => {
  return await axiosInstance.post(env.SERVER_URL + '/v1/auth/login', {
    email,
    password,
  });
};
