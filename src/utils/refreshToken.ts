import { refreshToken } from '@/services/auth';

export const callRefreshToken = async () => {
  await refreshToken();
};
