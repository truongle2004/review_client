'use client';

import useAuthStore from '@/store/authStore';
import tokenDecoder from '@/utils/tokenDecode';
import { useEffect } from 'react';

const ReviewLayout = ({ children }: { children: React.ReactNode }) => {
  const { setIsAdmin, setLoginStatus, setUserId } = useAuthStore();

  const handleCheckLogin = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = tokenDecoder(token);
      if (decodedToken) {
        setUserId(decodedToken.userId);
        setIsAdmin(decodedToken.roles === 'admin');
        setLoginStatus(true);
      }
    }
  };

  useEffect(() => {
    handleCheckLogin();
  }, []);

  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default ReviewLayout;
