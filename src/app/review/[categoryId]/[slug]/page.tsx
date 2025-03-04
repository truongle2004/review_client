'use client';

import ListProduct from '@/components/ListProduct';
import Paginate from '@/components/Paginate';
import { fetchProductPaginationAPI } from '@/services/product';
import { Product } from '@/types';
import { AppConstant } from '@/utils/AppConstant';
import { convertToSlug } from '@/utils/slugify';
import { ToastWarning } from '@/utils/toastify';
import { useMutation } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, type ChangeEvent } from 'react';

const CategoryPage = () => {
  const router = useRouter();
  const params = useParams();
  const [selectData, setSelectData] = useState('');
  const [page, setPage] = useState(AppConstant.FIRST_PAGE);
  const [listProduct, setListProduct] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<string>('ASC');
  const [rating, setRating] = useState(100);
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

  const { mutate: fetchListProductPaginationMutation } = useMutation({
    mutationFn: () =>
      fetchProductPaginationAPI({
        page,
        limit: AppConstant.PAGE_SIZE,
        categoryId: Number(params.categoryId),
        rating,
        sortBy,
      }),
    onSuccess: (data) => {
      setPaginateData({
        page: data.page,
        limit: data.limit,
        total: data.total,
      });
      setListProduct(data.data);

      window.scrollTo(0, 0);
    },
  });

  // const { data: listCategory } = useQuery({
  //   queryKey: ['categories'],
  //   queryFn: () => fetchAllCategoryAPI(),
  // });

  // const handleSetSelectData = (e: ChangeEvent<HTMLSelectElement>) => {
  //   e.preventDefault();
  //   setSelectData(e.target.value);

  //   // TODO: use lodash debound and call api
  // };

  const handleSubmitFilter = () => {
    if (rating === 100 && sortBy === '') {
      ToastWarning('Please select conditions filter', {});
      return;
    }
    setPage(AppConstant.FIRST_PAGE);
    fetchListProductPaginationMutation();
  };

  // const handleSetSelectCategory = (e: ChangeEvent<HTMLSelectElement>) => {
  //   setCategoryId(Number(e.target.value));
  // };

  const handlePageChange = (page: number) => {
    setPage(page);
    setListProduct([]);

    fetchListProductPaginationMutation();
  };

  const handleSetSortBy = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleRatingChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRating(Number(e.target.value));
  };

  useEffect(() => {
    fetchListProductPaginationMutation();
  }, []);

  return (
    <div className="flex justify-center items-start mb-10">
      <div className="flex w-full max-w-5xl">
        {/* Sidebar (Left) */}
        <aside className="w-1/4 p-4 bg-gray-800 max-h-fit">
          <h2 className="text-xl font-bold mb-6">Filters</h2>

          {/* Category Select */}
          {/* <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              className="select select-bordered w-full"
              defaultValue={'Default'}
              onChange={handleSetSelectCategory}
            >
              {!categoryId && (
                <option value={'Default'} disabled>
                  -- Category --
                </option>
              )}
              {listCategory?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div> */}

          {/* Sort By Select */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Sort By</label>
            <select
              className="select select-bordered w-full"
              defaultValue={'Default'}
              onChange={handleSetSortBy}
            >
              <option value={'Default'} disabled>
                -- Sort by --
              </option>
              <option value={'ASC'}>A to Z</option>
              <option value={'DESC'}>Z to A</option>
            </select>
          </div>

          {/* Rating Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Rating (1-100)</label>
            <input
              type="range"
              min="1"
              max="100"
              value={rating}
              onChange={handleRatingChange}
              className="range range-primary w-full"
            />
            <div className="badge badge-lg badge-secondary mt-2">{rating}</div>
          </div>

          {/* Filter Button */}
          <button className="btn btn-success btn-outline w-full" onClick={handleSubmitFilter}>
            Apply Filters
          </button>
        </aside>

        {/* Main Content (Right) */}
        <main className="w-3/4 p-4">
          <ListProduct listProduct={listProduct} onClickCard={onClickCard} />

          <Paginate
            limit={paginateData?.limit as number}
            total={paginateData?.total as number}
            page={paginateData?.page as number}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
