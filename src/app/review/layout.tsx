'use client';

import { QueryProvider } from '@/components/QueryProvider';

import { ToastContainer } from 'react-toastify';

const ReviewLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <QueryProvider>{children}</QueryProvider>
      <ToastContainer />
    </div>
  );
};

export default ReviewLayout;
