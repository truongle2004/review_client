'use client';

import { searchReview } from '@/services/review';
import useAuthStore from '@/store/authStore';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { SearchResponse } from '@/types';

const Navbar = () => {
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResponse['data']>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { userInfo, logout } = useAuthStore();

  const handleRedirectProfilePage = () => {
    if (userInfo.userId) {
      router.push(`/review/user/${userInfo.userId}`);
    }
    setToggleDropdown(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/review/login');
    setToggleDropdown(false);
  };

  const handleLogin = () => {
    router.push('/review/login');
    setToggleDropdown(false);
  };

  const { mutate: searchReviewMutation } = useMutation({
    mutationFn: searchReview,
    onSuccess: (data: SearchResponse) => {
      setSearchResults(data.data);
      setToggleDropdown(true);
    },
  });

  const handleNavigateHome = () => {
    router.push('/review/home');
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      searchReviewMutation(query);
    } else {
      setSearchResults([]);
      setToggleDropdown(false);
    }
  };

  const handleSelectResult = (reviewId: string) => {
    router.push(`/review/detail/${reviewId}`);
    setSearchQuery('');
    setToggleDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToggleDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar bg-base-100 mb-10 relative z-50">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" onClick={handleNavigateHome}>
          Review Hub
        </a>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-md">
        <div className="relative w-full" ref={dropdownRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search reviews..."
              className="input input-bordered w-full pr-10"
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => searchQuery.length > 0 && setToggleDropdown(true)}
            />
            {searchQuery.length > 0 && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setToggleDropdown(false);
                }}
              >
                ✕
              </button>
            )}
          </div>
          {toggleDropdown && searchResults.length > 0 && (
            <div className="absolute left-0 top-full mt-1 w-full bg-base-100 rounded-box shadow-lg border border-gray-700 z-[100] max-h-[300px] overflow-y-auto">
              {searchResults.map((review) => (
                <div
                  key={review.id}
                  className="p-3 hover:bg-gray-700 rounded-md cursor-pointer border-b border-gray-700 last:border-b-0"
                  onClick={() => handleSelectResult(review.id)}
                >
                  <div className="font-medium text-white">{review.title}</div>
                </div>
              ))}
            </div>
          )}
          {toggleDropdown && searchResults.length === 0 && searchQuery.length > 0 && (
            <div className="absolute left-0 top-full mt-1 w-full bg-base-100 rounded-box shadow-lg border border-gray-700 z-[100] p-4 text-center">
              <p className="text-gray-400">No results found</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Profile Dropdown */}
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <Image
                width={40}
                height={40}
                className="rounded-full"
                alt="User Avatar"
                src={
                  'https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg'
                }
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {userInfo.userId ? (
              <>
                <li>
                  <a className="justify-between" onClick={handleRedirectProfilePage}>
                    Profile
                  </a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li onClick={handleLogout}>
                  <a>Logout</a>
                </li>
              </>
            ) : (
              <li onClick={handleLogin}>
                <a>Login</a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
