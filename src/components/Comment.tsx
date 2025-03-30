'use client';

import { FC, useState, useRef } from 'react';
import Avatar from './Avatar';
import { StaticImageData } from 'next/image';
import { useMutation } from '@tanstack/react-query';
import { addComment, deleteComment, updateComment } from '@/services/comment';
import TextEditor from './TextEditor';
import useAuthStore from '@/store/authStore';
import { useParams } from 'next/navigation';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface CommentProps {
  comment_id: string;
  imageUrl: string | StaticImageData;
  username: string;
  isChild?: boolean;
  userId: string;
  content: string;
  createAt: Date;
  onSuccess?: () => void;
}

const Comment: FC<CommentProps> = ({
  imageUrl,
  userId,
  username,
  content,
  createAt,
  comment_id,
  isChild = false,
  onSuccess,
}) => {
  const params = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const { mutate: updateCommentMutation } = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      setIsEditing(false);
      setSelectedImages([]);
      setPreviewUrls([]);
      onSuccess?.();
    },
  });

  const { mutate: deleteCommentMutation } = useMutation({
    mutationFn: () =>
      deleteComment({
        commentId: comment_id,
        reviewId: params.id,
        parentId: '',
      }),
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const { mutate: replyCommentMutation } = useMutation({
    mutationFn: (replyContent: string) =>
      addComment({
        reviewId: params.id,
        parentId: comment_id,
        content: replyContent,
        images: selectedImages,
      }),
    onSuccess: () => {
      setIsReplying(false);
      setReplyContent('');
      setSelectedImages([]);
      setPreviewUrls([]);
      onSuccess?.();
    },
  });

  const { userInfo } = useAuthStore();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [replyContent, setReplyContent] = useState('');

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSelectedImages((prev) => [...prev, ...newFiles]);

      // Create preview URLs
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSaveEdit = () => {
    // Create FormData for multipart/form-data
    const formData = new FormData();
    formData.append('content', editedContent);
    selectedImages.forEach((image) => {
      formData.append('images', image);
    });

    updateCommentMutation({
      reviewId: params.id,
      commentId: comment_id,
      content: editedContent,
    });
  };

  const handleSaveReply = () => {
    replyCommentMutation(replyContent);
  };

  const handleDelete = () => {
    deleteCommentMutation();
  };

  return (
    <div className={`mt-10 mb-10 ${isChild ? 'ml-8 w-[calc(100%-2rem)]' : 'w-full'}`}>
      <div className="p-4 border rounded-lg shadow-md bg-base-100">
        <div className="flex items-center justify-between">
          <Avatar src={imageUrl} username={username} />
          <p className="text-sm text-gray-500">{createAt.toLocaleDateString()}</p>
        </div>
        <div className="mt-2">
          {isEditing ? (
            <div>
              <TextEditor defaultValue={editedContent} setValue={setEditedContent} field="edit" />
              <div className="mt-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-sm btn-outline"
                >
                  <FontAwesomeIcon icon={faImage} className="mr-2" />
                  Add Images
                </button>
                {previewUrls.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                <span className="text-blue-500 cursor-pointer" onClick={() => setIsEditing(false)}>
                  Cancel
                </span>
                <span className="text-blue-500 cursor-pointer" onClick={handleSaveEdit}>
                  Save
                </span>
              </div>
            </div>
          ) : (
            <p className="text-white" dangerouslySetInnerHTML={{ __html: editedContent }}></p>
          )}
        </div>
        {!isEditing && (
          <div className="flex gap-2 mt-3">
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => setIsReplying(!isReplying)}
            >
              Reply
            </span>
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => {
                setIsEditing(true);
                setIsReplying(false);
              }}
            >
              Edit
            </span>

            {userId === userInfo?.userId && (
              <span className="text-blue-500 cursor-pointer" onClick={handleDelete}>
                Delete
              </span>
            )}
          </div>
        )}
        {isReplying && !isEditing && (
          <div className="mt-2">
            <TextEditor defaultValue={replyContent} setValue={setReplyContent} field="reply" />
            <div className="mt-4">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-sm btn-outline"
              >
                <FontAwesomeIcon icon={faImage} className="mr-2" />
                Add Images
              </button>
              {previewUrls.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-2">
              <span className="text-blue-500 cursor-pointer" onClick={() => setIsReplying(false)}>
                Cancel
              </span>
              <span className="text-blue-500 cursor-pointer" onClick={handleSaveReply}>
                Save
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
