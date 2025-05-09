'use client';

import useAuthStore from '@/store/authStore';
import {
  faAddressBook,
  faLocationDot,
  faMessage,
  faTimeline,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import avatar from '../../../../../public/my-notion-face-transparent.png';
import editProfileStore from '@/store/editProfileStore';
import About from './About';
import { useState } from 'react';
import TimeLine from './TimeLine';
import { useQuery } from '@tanstack/react-query';
import { getProfileAPI } from '@/services/user';
import { useParams } from 'next/navigation';
import type { UserProfileResponse } from '@/types';

const UserPage = () => {
  const {
    userInfo: { isAdmin },
  } = useAuthStore();

  const { setOpen, open, setIsUserProfile, isUserProfile } = editProfileStore();
  const params = useParams<{ id: string }>();
  const [buttonIndex, setButtonIndex] = useState(1);

  const { data: userProfile } = useQuery<UserProfileResponse>({
    queryKey: ['userProfile', params.id],
    queryFn: () => getProfileAPI({ userId: params.id }),
  });

  const handleSetOpen = () => setOpen(true);
  const handleSetButtonIndex = (index: number) => setButtonIndex(index);
  const handleSetIsUserProfile = (isProfile: boolean) => setIsUserProfile(isProfile);

  return (
    <div className="mx-auto flex gap-20 p-6 border border-gray-200 rounded-lg">
      <div className="flex flex-col gap-10 font-bold text-pink-50">
        {/* Avatar Section */}
        <Image
          src={userProfile?.data?.profile?.profile_picture ?? avatar}
          alt="User Avatar"
          className="h-96 w-96 ring ring-cyan-50 rounded-full object-cover"
          width={384}
          height={384}
        />
      </div>

      {/* User Info Section */}
      <div className="flex-1 flex flex-col justify-between">
        {/* User Name & Location */}
        <div>
          <h1 className="text-2xl font-semibold">{userProfile?.data.username}</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <FontAwesomeIcon icon={faLocationDot} />
            <span className="text-white">
              {userProfile?.data?.profile?.country ?? 'Not specified'}
            </span>
          </div>
        </div>

        {!isAdmin ? (
          <div className="flex flex-row gap-3">
            <button className="btn">
              <FontAwesomeIcon icon={faMessage} />
              Send Message
            </button>
            <button className="btn">
              <FontAwesomeIcon icon={faAddressBook} />
              Contact
            </button>
            <button className="btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Like
            </button>
          </div>
        ) : (
          <div className="mt-3">
            {!open && isUserProfile && (
              <button className="btn" onClick={handleSetOpen}>
                Edit Profile
              </button>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-row gap-3 mt-6">
          <button
            className={`${buttonIndex === 0 ? 'btn-success btn-outline' : ''} btn px-4 py-2 rounded-md transition text-white`}
            onClick={() => {
              handleSetButtonIndex(0);
              handleSetIsUserProfile(false);
            }}
          >
            <FontAwesomeIcon icon={faTimeline} />
            <span>Time-line</span>
          </button>

          <button
            className={`${buttonIndex === 1 ? 'btn-success btn-outline' : ''} btn px-4 py-2 rounded-md transition text-white`}
            onClick={() => {
              handleSetButtonIndex(1);
              handleSetIsUserProfile(true);
            }}
          >
            <FontAwesomeIcon icon={faUser} />
            <span>About</span>
          </button>
        </div>
        {/* Contact & Basic Information */}
        {buttonIndex === 0 && <TimeLine />}
        {buttonIndex === 1 && userProfile?.data && <About userProfile={userProfile.data} />}
      </div>
    </div>
  );
};

export default UserPage;
