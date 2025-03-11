'use client';

import type { Product } from '@/types';
import type { FC } from 'react';
import Image from 'next/image';

interface ListProductProps {
  listProduct: Product[] | undefined;
  onClickCard: (id: number, title: string) => void;
}

const ListProduct: FC<ListProductProps> = ({ listProduct, onClickCard }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {listProduct?.map((item: Product) => (
        <div
          key={item.id}
          onClick={() => onClickCard(item.id as number, item.title)}
          className="card card-side bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out rounded-lg cursor-pointer overflow-hidden"
        >
          <figure className="relative w-32 h-32 flex-shrink-0">
            <Image
              src={item.images[0].src}
              alt={item.images[0].alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 128px"
            />
          </figure>
          <div className="card-body p-4 flex flex-col justify-between">
            <h2 className="card-title text-lg font-semibold text-white truncate text-wrap">
              {item.title}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rating:</span>
              <span className="text-yellow-500 font-medium">{item.rating}</span>
              <progress
                className="progress progress-info w-full max-w-xs"
                value={item.rating}
                max="100"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListProduct;
