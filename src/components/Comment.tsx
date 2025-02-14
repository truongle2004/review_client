import { FC } from 'react';
import Avatar from './Avatar';
import { StaticImageData } from 'next/image';

interface CommentProps {
  imageUrl: string | StaticImageData;
  username: string;
  content: string;
  createAt: Date;
}

const CommentComponent: FC<CommentProps> = ({ imageUrl, username, content, createAt }) => {
  return (
    <div className="mt-10 mb-10">
      <div className="flex items-center justify-between">
        <Avatar src={imageUrl} username={username} />
        <p className="text-sm">{createAt.toLocaleDateString()}</p>
      </div>
      <div>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default CommentComponent;
