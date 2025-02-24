'use client';

import { fetchAllCategoryAPI } from '@/services/category';
import { convertToSlug } from '@/utils/slugify';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const Menu = () => {
  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchAllCategoryAPI,
  });

  const router = useRouter();

  const onClickCategory = (name: string, categoryId: number) => {
    const slug = convertToSlug(name);

    router.push(`/review/category/${slug}/${categoryId}`);
  };

  if (!data) return null;

  return (
    <div className="card m-10">
      {data &&
        data.map((item) => (
          <p
            key={item.id}
            className="hover:underline cursor-pointer"
            onClick={() => onClickCategory(item.name, item.id)}
          >
            {item.name}
          </p>
        ))}
    </div>
  );
};

export default Menu;
