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
    <div>
      {listProduct?.map((item: Product) => (
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
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListProduct;
