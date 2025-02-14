import Image, { StaticImageData } from 'next/image';
import { FC } from 'react';

interface AvatarProps {
  src: string | StaticImageData;
  username: string;
}

const Avatar: FC<AvatarProps> = ({ src, username }) => {
  return (
    <div className="flex flex-row items-center gap-2 mb-3">
      <div className="avatar">
        <div className=" w-10 rounded-full">
          <Image src={src} alt="avatar" />
        </div>
      </div>
      <p className="text-sm font-semibold hover:underline cursor-pointer">{username}</p>
    </div>
  );
};

export default Avatar;
