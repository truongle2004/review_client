import type { TokenResponse } from '@/types';
import { jwtDecode } from 'jwt-decode';

const tokenDecoder = (token: string): TokenResponse | undefined => {
  try {
    return jwtDecode(token);
  } catch (err) {
    console.error(err);
  }
};

export default tokenDecoder;
