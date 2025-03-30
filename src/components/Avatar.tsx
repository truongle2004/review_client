import Image, { StaticImageData } from 'next/image';
import { FC } from 'react';

interface AvatarProps {
  src: string | StaticImageData;
  username: string;
  size?: 'sm' | 'md' | 'lg'; // Optional size prop
}

const Avatar: FC<AvatarProps> = ({ src, username, size = 'md' }) => {
  const avatarSizes = {
    sm: 8,
    md: 10,
    lg: 12,
  };

  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const avatarSize = avatarSizes[size];
  const textClassName = textSize[size];

  return (
    <div className="flex items-center gap-2">
      <div className={`avatar border-2 border-gray-400 rounded-full`}>
        <div className={`w-${avatarSize} rounded-full overflow-hidden relative`}>
          {' '}
          {/* overflow-hidden important */}
          <Image
            src={src}
            alt={`Avatar of ${username}`}
            fill // Use fill for responsive images within the container
            style={{ objectFit: 'cover' }} // Ensure the image covers the container
            sizes="100%" // important
            priority // Optionally add priority for above the fold images
          />
        </div>
      </div>
      <p className={`${textClassName} hover:underline cursor-pointer text-gray-100`}>{username}</p>
    </div>
  );
};

export default Avatar;
