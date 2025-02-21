'use client';

import Card from '@/components/Card';
import Menu from '@/components/Menu';
import Paginate from '@/components/Paginate';
import { fetchProductAPI } from '@/services/product';
import { Product } from '@/types';
import { AppConstant } from '@/utils/AppConstant';
import { convertToSlug } from '@/utils/slugify';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent } from 'react';

const HomePage = () => {
  const router = useRouter();
  const [selectData, setSelectData] = useState('');
  const [page, setPage] = useState(AppConstant.FIRST_PAGE);

  const onClickCard = (id: string | number, title: string) => {
    const slug = convertToSlug(title);
    router.push(`/review/detail/${id}/${slug}`);
  };

  const {
    data: listProduct,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products', page, AppConstant.PAGE_SIZE],
    queryFn: () =>
      fetchProductAPI({
        page: page,
        limit: AppConstant.PAGE_SIZE,
      }),
    // check if AppConstant.FIRST_PAGE and AppConstant.PAGE_SIZE is not null
    enabled: !!page,
  });

  const handleSetSelectData = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setSelectData(e.target.value);

    // TODO: use lodash debound and call api
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  if (isLoading)
    return (
      <p className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-md"></span>
      </p>
    );

  if (error) return <p>Error: {error.message}</p>;

  console.log(page)

  return (
    <div className="flex justify-center items-start min-h-screen mb-10">
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
          <div
            key={item.id}
            onClick={() => onClickCard(item.id as number, item.title)}
            className="mb-5"
          >
            <div className="card card-side p-5 bg-base-200 hover:bg-gray-950 transition-colors duration-300 ease-in-out rounded-lg cursor-pointer">
              <figure>
                <Image
                  src={item.images[0].src}
                  alt={item.images[0].alt}
                  width={100}
                  height={100}
                  className="object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{item.title}</h2>
                <div className="flex items-center">
                  <p>rating: </p>
                  <p className="text-yellow-50">{item.rating}</p>
                  <progress
                    className="progress progress-info w-56"
                    value={item.rating}
                    max="100"
                  ></progress>
                </div>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Watch</button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Paginate
          limit={listProduct?.limit as number}
          total={listProduct?.total as number}
          page={listProduct?.page as number}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
};

export default HomePage;
