'use client';

import SectionComponent from '@/components/SectionCustom';
import TextEditor from '@/components/TextEditor';
import editProfileStore from '@/store/editProfileStore';
import { UpdateProfileInfo, UserProfileResponse } from '@/types';
import { updateProfileAPI } from '@/services/user';
import { ToastSuccess, ToastError } from '@/utils/toastify';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import PhoneInput from 'react-phone-number-input';
import useAuthStore from '@/store/authStore';

interface AboutProps {
  userProfile: UserProfileResponse['data'];
}

const About: React.FC<AboutProps> = ({ userProfile }) => {
  const { userInfo } = useAuthStore();
  const [bio, setBio] = useState(userProfile.profile.bio || '');
  const [phone, setPhoneNumber] = useState(userProfile.profile.phone || '');
  const [gender, setGender] = useState(userProfile.profile.gender || '');
  const [country, setCountry] = useState(userProfile.profile.country || '');
  const [birthday, setBirthday] = useState(
    userProfile.profile.birthday ? new Date(userProfile.profile.birthday) : new Date()
  );
  const [username, setUsername] = useState(userProfile.username || '');
  const [email, setEmail] = useState(userProfile.email || '');

  const handleSetBio = (value: string) => setBio(value);

  const { setOpen, open } = editProfileStore();

  const handleCancel = () => {
    // Reset form values to original data
    setBio(userProfile.profile.bio || '');
    setPhoneNumber(userProfile.profile.phone || '');
    setGender(userProfile.profile.gender || '');
    setCountry(userProfile.profile.country || '');
    setBirthday(userProfile.profile.birthday ? new Date(userProfile.profile.birthday) : new Date());
    setUsername(userProfile.username || '');
    setEmail(userProfile.email || '');
    setOpen(false);
  };

  const { mutate: updateProfileMutation } = useMutation({
    mutationFn: updateProfileAPI,
    onSuccess: () => {
      ToastSuccess('Profile updated successfully');
      setOpen(false);
    },
    onError: (error: Error) => {
      ToastError(error.message || 'Failed to update profile');
    },
  });

  const handleCloseEditAndSave = () => {
    const profileData: UpdateProfileInfo = {
      userId: userInfo.userId as string,
      profilePicture: userProfile.profile.profile_picture,
      country,
      phone,
      gender,
      birthday,
      bio,
      username,
      email,
    };
    updateProfileMutation(profileData);
  };

  const handleSetGender = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.type === 'checkbox') {
      setGender(e.currentTarget.checked ? e.currentTarget.id : '');
    }
  };

  return (
    <div className="mt-6 space-y-4 flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Profile Information</h2>
        {!open ? (
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button className="btn btn-ghost" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCloseEditAndSave}>
              Save Changes
            </button>
          </div>
        )}
      </div>
      <SectionComponent title="About Me">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Username</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={!open}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!open}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Phone</label>
            <PhoneInput
              value={phone}
              onChange={(value) => setPhoneNumber(value || '')}
              className="input input-bordered w-full"
              disabled={!open}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Country</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={!open}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Birthday</label>
            {open ? (
              <Calendar
                onChange={(value) => setBirthday(value as Date)}
                value={birthday}
                className="rounded-lg border p-2"
              />
            ) : (
              <div className="input input-bordered w-full">{birthday.toLocaleDateString()}</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Gender</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="MALE"
                  checked={gender === 'MALE'}
                  onChange={handleSetGender}
                  className="checkbox"
                  disabled={!open}
                />
                <span>Male</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="FEMALE"
                  checked={gender === 'FEMALE'}
                  onChange={handleSetGender}
                  className="checkbox"
                  disabled={!open}
                />
                <span>Female</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="OTHER"
                  checked={gender === 'OTHER'}
                  onChange={handleSetGender}
                  className="checkbox"
                  disabled={!open}
                />
                <span>Other</span>
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Bio</label>
            {open ? (
              <TextEditor defaultValue={bio} setValue={handleSetBio} field="bio" />
            ) : (
              <div className="input input-bordered w-full min-h-[100px] p-2">
                {bio || 'No bio provided'}
              </div>
            )}
          </div>
        </div>
      </SectionComponent>
    </div>
  );
};

export default About;
