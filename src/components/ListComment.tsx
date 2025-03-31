'use client';

import { FC } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Comment as CommentType, CommentImage } from '@/types';
import Comment from './Comment';

interface ListCommentProps {
  comments: CommentType[];
  reviewId: string;
}

interface CommentTreeProps {
  comment: CommentType;
  profilePicture: string;
  imagesUrl: CommentImage[];
  onSuccess: () => void;
  level?: number;
  replies?: CommentType[];
}

const CommentTree: FC<CommentTreeProps> = ({
  comment,
  onSuccess,
  imagesUrl,
  level = 0,
  profilePicture,
  replies = [],
}) => {
  return (
    <div style={{ marginLeft: `${level * 2}rem` }}>
      <Comment
        comment_id={comment.commentId}
        imageUrls={imagesUrl}
        profilePicture={profilePicture}
        userId={comment.user.id}
        username={comment.user.username}
        content={comment.content}
        createAt={new Date(comment.updatedAt)}
        onSuccess={onSuccess}
        isChild={level > 0}
      />
      {replies.map((reply) => (
        <CommentTree
          key={reply.commentId}
          comment={reply}
          imagesUrl={reply.images}
          onSuccess={onSuccess}
          profilePicture={reply.user.profile.profile_picture}
          level={level + 1}
        />
      ))}
    </div>
  );
};

const ListComment: FC<ListCommentProps> = ({ comments, reviewId }) => {
  const queryClient = useQueryClient();

  const handleCommentSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['comments', reviewId] });
  };

  // Group comments by parent ID
  const commentMap = new Map<string, CommentType[]>();
  const rootComments: CommentType[] = [];

  comments.forEach((comment) => {
    if (comment.parentId === null) {
      rootComments.push(comment);
      commentMap.set(comment.commentId, []);
    } else {
      const replies = commentMap.get(comment.parentId) || [];
      replies.push(comment);
      commentMap.set(comment.parentId, replies);
    }
  });

  return (
    <div className="mt-10 space-y-4">
      {rootComments.map((comment) => (
        <CommentTree
          key={comment.commentId}
          comment={comment}
          imagesUrl={comment.images}
          onSuccess={handleCommentSuccess}
          profilePicture={comment.user.profile.profile_picture}
          level={0}
          replies={commentMap.get(comment.commentId) || []}
        />
      ))}
    </div>
  );
};

export default ListComment;
