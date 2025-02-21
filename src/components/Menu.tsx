import { fetchAllCategoryAPI } from '@/services/category';
import { useQuery } from '@tanstack/react-query';

const Menu = () => {
  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchAllCategoryAPI,
  });

  if (!data) return null;

  return (
    <div className="card m-10">
      {data &&
        data.map((item) => (
          <p key={item.id} className="hover:underline cursor-pointer">
            {item.name}
          </p>
        ))}
    </div>
  );
};

export default Menu;
