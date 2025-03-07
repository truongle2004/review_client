import { jwtDecode } from 'jwt-decode';

const tokenDecodeer = (token: string) => {
  try {
    return jwtDecode(token);
  } catch (err) {
    console.error(err);
  }
};

export default tokenDecodeer;
