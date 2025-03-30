'use client';

import { FC } from 'react';
import Comment from './Comment';
import { Comment as CommentType } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

interface ListCommentProps {
  comments: CommentType[];
  reviewId: string;
}

interface CommentTreeProps {
  comment: CommentType;
  reviewId: string;
  onSuccess: () => void;
  level?: number;
}

const CommentTree: FC<CommentTreeProps> = ({ comment, reviewId, onSuccess, level = 0 }) => {
  return (
    <div>
      <Comment
        comment_id={comment.id}
        userId={comment.user.id}
        username={comment.user.name}
        content={comment.text}
        createAt={new Date()}
        imageUrl="/images/avatar.png"
        onSuccess={onSuccess}
        isChild={level > 0}
      />
      {comment.children && comment.children.length > 0 && (
        <div className={`ml-8`}>
          {comment.children.map((child) => (
            <CommentTree
              key={child.id}
              comment={child}
              reviewId={reviewId}
              onSuccess={onSuccess}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ListComment: FC<ListCommentProps> = ({ comments, reviewId }) => {
  const queryClient = useQueryClient();

  const handleCommentSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['comments', reviewId] });
  };

  return (
    <div className="mt-10">
      {comments.map((comment) => (
        <CommentTree
          key={comment.id}
          comment={comment}
          reviewId={reviewId}
          onSuccess={handleCommentSuccess}
          level={0}
        />
      ))}
    </div>
  );
};

export default ListComment;
