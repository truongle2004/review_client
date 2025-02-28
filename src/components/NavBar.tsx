'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Navbar = () => {
  const [toggleDropdown, setToggleDropdown] = useState(false);

  const router = useRouter();

  const handleToggleDropdown = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToggleDropdown(e.target.value.length > 0);
  };

  const handleRedirectLoginPage = () => {
    router.push('/review/login');

    setToggleDropdown(false);
  };

  const handleLogout = () => {
    handleRedirectLoginPage();
  };

  return (
    <div className="navbar bg-base-100 mb-10 relative">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-md">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-full"
            onChange={handleToggleDropdown}
          />
          {toggleDropdown && (
            <ul className="menu absolute left-0 top-full mt-1 bg-base-100 rounded-box z-[10] w-full p-2 shadow">
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Right Side: Profile Dropdown */}
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
            <li onClick={handleRedirectLoginPage}>
              <a>Login</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
