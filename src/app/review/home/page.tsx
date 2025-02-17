'use client';

import Card from '@/components/Card';
import Paginate from '@/components/Paginate';
import { fetchProductAPI } from '@/services/product';
import type { Product } from '@/types';
import { AppConstant } from '@/utils/AppConstant';
import { convertToSlug } from '@/utils/slugify';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  const onClickCard = (id: string | number, title: string) => {
    const slug = convertToSlug(title);
    router.push(`/review/detail/${id}/${slug}`);
  };

  const {
    data: listProduct,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products', AppConstant.FIRST_PAGE, AppConstant.PAGE_SIZE],
    queryFn: () =>
      fetchProductAPI({
        page: AppConstant.FIRST_PAGE,
        limit: AppConstant.PAGE_SIZE,
      }),
    // check if AppConstant.FIRST_PAGE and AppConstant.PAGE_SIZE is not null
    enabled: !!AppConstant.FIRST_PAGE && !!AppConstant.PAGE_SIZE,
  });

  if (isLoading)
    return (
      <p className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-md"></span>
      </p>
    );

  if (error) return <p>Error: {error.message}</p>;

  return (
    <main className="mx-auto w-1/2">
      {listProduct?.data?.data?.map((item: Product) => (
        <div onClick={() => onClickCard(item.id as number, item.title)}>
          <Card data={item} key={item.id} />
        </div>
      ))}
      <Paginate
        limit={listProduct?.limit as number}
        total={listProduct?.total as number}
        page={listProduct?.page as number}
      />
    </main>
  );
};

export default HomePage;
