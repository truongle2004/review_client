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

const UserPage = () => {
  const {
    userInfo: { isAdmin },
  } = useAuthStore();

  const { setOpen, open } = editProfileStore();

  const handleSetOpen = () => setOpen(true);
  const handleSetClose = () => setOpen(false);

  const [buttonIndex, setButtonIndex] = useState(1);

  const handleSetButtonIndex = (index: number) => setButtonIndex(index);

  return (
    <div className="mx-auto flex gap-20 p-6 border border-gray-200 rounded-lg">
      <div className="flex flex-col gap-10 font-bold text-pink-50">
        {/* Avatar Section */}
        <Image
          src={avatar}
          alt="User Avatar"
          className="h-96 w-96 ring ring-cyan-50 rounded-full"
        />
        {/*USER EXPERIENCE*/}
        <div>
          <h3>USER EXPERIENCE</h3>
          <div>
            <nav>
              <ul className="list-disc">
                <li>React.js</li>
                <li>Next.js</li>
                <li>Node.js</li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* User Info Section */}
      <div className="flex-1 flex flex-col justify-between">
        {/* User Name & Location */}
        <div>
          <h1 className="text-2xl font-semibold">Truong dep trai</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <FontAwesomeIcon icon={faLocationDot} />
            <span className="text-white">New York</span>
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
          <div>
            {open && (
              <button className="btn" onClick={handleSetOpen}>
                Edit Profile
              </button>
            )}
            {!open && (
              <button className="btn btn-success" onClick={handleSetClose}>
                Save
              </button>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-row gap-3 mt-6">
          <button
            className={`${buttonIndex === 0 ? 'btn-success btn-outline' : ''} btn px-4 py-2 rounded-md transition text-white`}
            onClick={() => handleSetButtonIndex(0)}
          >
            <FontAwesomeIcon icon={faTimeline} />
            <span>Time-line</span>
          </button>

          <button
            className={`${buttonIndex === 1 ? 'btn-success btn-outline' : ''} btn px-4 py-2 rounded-md transition text-white`}
            onClick={() => handleSetButtonIndex(1)}
          >
            <FontAwesomeIcon icon={faUser} />
            <span>About</span>
          </button>
        </div>
        {/* Contact & Basic Information */}
        {buttonIndex === 0 && <TimeLine />}
        {buttonIndex === 1 && <About />}
      </div>
    </div>
  );
};

export default UserPage;
