'use client';

import ListProduct from '@/components/ListProduct';
import Menu from '@/components/Menu';
import Paginate from '@/components/Paginate';
import { fetchProductPaginationAPI } from '@/services/product';
import { AppConstant } from '@/utils/AppConstant';
import { convertToSlug } from '@/utils/slugify';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

// TODO: handle on click
const CategoryPage = () => {
  const [page, setPage] = useState(AppConstant.FIRST_PAGE);
  const params = useParams<{
    slug: string;
    categoryId: string;
  }>();

  const {
    data: listData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['category', params.categoryId, page],
    queryFn: () =>
      fetchProductPaginationAPI({
        page,
        limit: AppConstant.PAGE_SIZE,
        categoryId: Number(params.categoryId),
      }),
    enabled: !!params.categoryId && !!page,
  });

  const router = useRouter();

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const onClickCard = (id: number, title: string) => {
    const slug = convertToSlug(title);
    router.push(`/review/listings/${id}/${slug}`);
  };

  if (isLoading)
    return (
      <p className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-md"></span>
      </p>
    );

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex justify-center items-start w-1/2 min-h-screen mb-10">
      <Menu />
      <div>
        <ListProduct listProduct={listData?.data} onClickCard={onClickCard} />
        <Paginate
          total={listData?.total as number}
          page={listData?.page as number}
          limit={listData?.limit as number}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
