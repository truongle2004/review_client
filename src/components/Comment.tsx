'use client';

import { addComment, deleteComment, updateComment } from '@/services/comment';
import useAuthStore from '@/store/authStore';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { FC, useRef, useState } from 'react';
import Avatar from './Avatar';
import TextEditor from './TextEditor';
import Image from 'next/image';
import type { CommentImage } from '@/types';
import { env } from '@/enviroment/env';
import { ToastSuccess, ToastError } from '@/utils/toastify';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

interface CommentProps {
  comment_id: string;
  imageUrls: CommentImage[];
  username: string;
  profilePicture: string;
  isChild?: boolean;
  userId: string;
  content: string;
  createAt: Date;
  onSuccess?: () => void;
}

const Comment: FC<CommentProps> = ({
  imageUrls,
  userId,
  username,
  profilePicture,
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
  const [openModalDelete, setOpenModalDelete] = useState(false);

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
      ToastSuccess('Comment deleted successfully');
      onSuccess?.();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      ToastError(error.response?.data?.message || 'Failed to delete comment');
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
    if (!replyContent) return;
    if (!params.id) return;
    if (!comment_id) return;

    replyCommentMutation(replyContent);
  };

  const handleDelete = () => {
    setOpenModalDelete(true);
  };

  const handleConfirmDelete = () => {
    deleteCommentMutation();
    setOpenModalDelete(false);
  };

  const handleCancelDelete = () => {
    setOpenModalDelete(false);
  };

  return (
    <>
      <dialog id="my_modal_1" className={`modal ${openModalDelete ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Warning!</h3>
          <p className="py-4">Are you sure you want to delete this comment?</p>
          <div className="modal-action">
            <form method="dialog" className="flex flex-row gap-4">
              <button className="btn btn-success" onClick={handleConfirmDelete}>
                Sure
              </button>
              <button className="btn btn-warning" onClick={handleCancelDelete}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <div className={`mt-10 mb-10 ${isChild ? 'ml-8 w-[calc(100%-2rem)]' : 'w-full'}`}>
        <div className="p-4 border rounded-lg shadow-md bg-base-100">
          <div className="flex items-center justify-between">
            <Avatar
              src={
                profilePicture ??
                'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
              }
              username={username}
            />
            <p className="text-sm text-gray-500">{new Date(createAt).toLocaleDateString()}</p>
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
                          <Image
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-20 h-20 object-cover rounded"
                            width={80}
                            height={80}
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
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </span>
                  <span className="text-blue-500 cursor-pointer" onClick={handleSaveEdit}>
                    Save
                  </span>
                </div>
              </div>
            ) : (
              <>
                <p className="text-white" dangerouslySetInnerHTML={{ __html: editedContent }}></p>
                {imageUrls.map((url, index) => (
                  <Image
                    key={index}
                    src={`${env.SERVER_URL}/${url.url}`}
                    alt={`Preview ${index + 1}`}
                    className="w-20 h-20 object-cover rounded"
                    width={80}
                    height={80}
                  />
                ))}
              </>
            )}
          </div>
          {!isEditing && (
            <div className="flex gap-2 mt-3">
              <span
                className="text-blue-500 cursor-pointer hover:text-blue-400"
                onClick={() => setIsReplying(!isReplying)}
              >
                Reply
              </span>
              {userId === userInfo?.userId && (
                <>
                  <span
                    className="text-blue-500 cursor-pointer hover:text-blue-400"
                    onClick={() => {
                      setIsEditing(true);
                      setIsReplying(false);
                    }}
                  >
                    Edit
                  </span>
                  <span
                    className="text-red-500 cursor-pointer hover:text-red-400"
                    onClick={handleDelete}
                  >
                    Delete
                  </span>
                </>
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
                        <Image
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
    </>
  );
};

export default Comment;
