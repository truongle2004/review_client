'use client';

import Card from '@/components/Card';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();
  const onClickCard = (id: string, slug: string) => {
    router.push(`/review/detail/${id}/${slug}`);
  };

  return (
    <main className="mx-auto w-1/2">
      <div onClick={() => onClickCard('1', 'truong-dep-trai')}>
        <Card />
      </div>
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
    </main>
  );
};

export default HomePage;
