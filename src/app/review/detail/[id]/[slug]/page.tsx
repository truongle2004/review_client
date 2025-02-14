'use client';

import DetailComponent from '@/components/Detail';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const DetailPage = () => {
  const params = useParams();
  const id = params?.id || '';
  const slug = params?.slug || '';

  useEffect(() => {
    // TODO: fetch api
  }, [id, slug]);

  return (
    <div>
      <DetailComponent />
    </div>
  );
};

export default DetailPage;
