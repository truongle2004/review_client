'use client';

import Card from '@/components/Card';
import Menu from '@/components/Menu';
import Paginate from '@/components/Paginate';
import { fetchProductAPI } from '@/services/product';
import { Product } from '@/types';
import { AppConstant } from '@/utils/AppConstant';
import { convertToSlug } from '@/utils/slugify';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent } from 'react';

const HomePage = () => {
  const router = useRouter();
  const [selectData, setSelectData] = useState('');

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

  const handleSetSelectData = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setSelectData(e.target.value);

    // TODO: use lodash debound and call api
  };

  if (isLoading)
    return (
      <p className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-md"></span>
      </p>
    );

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex justify-center items-start min-h-screen">
      <Menu />
      <main className="w-1/2">
        <div className="flex items-center mb-5">
          <h5 className="font-semibold">Sort by:</h5>
          <select
            className="select select-bordered w-full max-w-xs ml-2 font-bold"
            value={selectData}
            onChange={handleSetSelectData}
          >
            <option disabled value="">
              Who shot first?
            </option>
            <option>Han Solo</option>
            <option>Greedo</option>
          </select>
        </div>

        {listProduct?.data?.map((item: Product) => (
          <div key={item.id} onClick={() => onClickCard(item.id as number, item.title)}>
            <Card data={item} />
          </div>
        ))}

        <Paginate
          limit={listProduct?.limit as number}
          total={listProduct?.total as number}
          page={listProduct?.page as number}
        />
      </main>
    </div>
  );
};

export default HomePage;
