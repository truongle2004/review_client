'use client';

import ListProduct from '@/components/ListProduct';
import Menu from '@/components/Menu';
import Paginate from '@/components/Paginate';
import { fetchAllCategoryAPI } from '@/services/category';
import { fetchProductAPI, fetchProductByCategoryAPI } from '@/services/product';
import { Product } from '@/types';
import { AppConstant } from '@/utils/AppConstant';
import { convertToSlug } from '@/utils/slugify';
import { ToastWarning } from '@/utils/toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ChangeEvent } from 'react';

const HomePage = () => {
  const router = useRouter();
  const [selectData, setSelectData] = useState('');
  const [page, setPage] = useState(AppConstant.FIRST_PAGE);
  const [categoryId, setCategoryId] = useState(0);
  const [listProduct, setListProduct] = useState<Product[]>([]);
  const [paginateData, setPaginateData] = useState<{
    page: number;
    limit: number;
    total: number;
  } | null>({
    page: AppConstant.FIRST_PAGE,
    limit: AppConstant.PAGE_SIZE,
    total: 0,
  });

  const onClickCard = (id: string | number, title: string) => {
    const slug = convertToSlug(title);
    router.push(`/review/listings/${id}/${slug}`);
  };

  const { mutate: fetchListProductMutation, isPending } = useMutation({
    mutationFn: () =>
      fetchProductAPI({
        page,
        limit: AppConstant.PAGE_SIZE,
      }),
    onSuccess: (data) => {
      setPaginateData({
        page: data.page,
        limit: data.limit,
        total: data.total,
      });
      setListProduct(data.data);
    },
  });

  const { mutate: fetchListProductByCategoryMutation } = useMutation({
    mutationFn: () =>
      fetchProductByCategoryAPI({
        page,
        limit: AppConstant.PAGE_SIZE,
        categoryId: categoryId as number,
      }),
    onSuccess: (data) => {
      setPaginateData({
        page: data.page,
        limit: data.limit,
        total: data.total,
      });
      setListProduct(data.data);
    },
  });

  const { data: listCategory } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchAllCategoryAPI(),
  });

  const handleSetSelectData = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setSelectData(e.target.value);

    // TODO: use lodash debound and call api
  };

  const handleSubmitFilter = () => {
    if (categoryId === null) {
      ToastWarning('Please select conditions filter', {});
      return;
    }
    setListProduct([]);
    setPage(AppConstant.FIRST_PAGE);
    fetchListProductByCategoryMutation();
  };

  const handleSetSelectCategory = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(Number(e.target.value));
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  useEffect(() => {
    fetchListProductMutation();
  }, []);

  return (
    <div className="flex justify-center items-start min-h-screen mb-10">
      <Menu />
      <main className="w-1/2">
        <div className="flex flex-row justify-between mb-10">
          <div>
            <select
              className="select select-bordered w-full max-w-xs"
              defaultValue={'Default'}
              onChange={handleSetSelectCategory}
            >
              {!categoryId && (
                <option value={'Default'} disabled>
                  {' '}
                  -- Category --{' '}
                </option>
              )}

              {listCategory?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button className="btn btn-primary btn-outline" onClick={handleSubmitFilter}>
              Filter
            </button>
          </div>
        </div>

        <ListProduct listProduct={listProduct} onClickCard={onClickCard} />

        <Paginate
          limit={paginateData?.page as number}
          total={paginateData?.total as number}
          page={paginateData?.page as number}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
};

export default HomePage;
