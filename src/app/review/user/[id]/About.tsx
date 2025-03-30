'use client';

import SectionComponent from '@/components/SectionCustom';
import TextEditor from '@/components/TextEditor';
import { profile_schema } from '@/schema';
import editProfileStore from '@/store/editProfileStore';
import { UpdateProfileInfo } from '@/types';
import { getProfileAPI, updateProfileAPI } from '@/services/user';
import { ToastSuccess, ToastError } from '@/utils/toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import useAuthStore from '@/store/authStore';

const About = () => {
  const { userInfo } = useAuthStore();
  const [bio, setBio] = useState('');
  const [phone, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [country, setCountry] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');

  const handleSetBio = (value: string) => setBio(value);

  const { setOpen, open } = editProfileStore();

  const handleCancel = () => setOpen(false);

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
      profilePicture: profileUrl,
      country,
      phone,
      gender,
      birthday,
      bio,
    };
    updateProfileMutation(profileData);
  };

  const { register } = useForm({
    defaultValues: {
      userName: '',
      email: '',
      profileUrl: '',
      country: '',
    },
    resolver: zodResolver(profile_schema),
  });

  const { mutate: getProfile } = useMutation({
    mutationFn: getProfileAPI,
    onSuccess: (data) => {
      // Update all form fields with the profile data
      setBio(data.data.profile.bio || '');
      setPhoneNumber(data.data.profile.phone || '');
      setGender(data.data.profile.gender || '');
      setProfileUrl(data.data.profile.profile_picture || '');
      setCountry(data.data.profile.country || '');
      setBirthday(data.data.profile.birthday ? new Date(data.data.profile.birthday) : new Date());
      setUserName(data.data.username || '');
      setEmail(data.data.email || '');
    },
    onError: (error: Error) => {
      ToastError(error.message || 'Failed to fetch profile');
    },
  });

  useEffect(() => {
    if (userInfo.userId) {
      getProfile({ userId: userInfo.userId });
    }
  }, [userInfo.userId]);

  const handleSetGender = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.type === 'checkbox') {
      setGender(e.currentTarget.checked ? e.currentTarget.id : '');
    }
  };

  return (
    <div className="mt-6 space-y-4 flex flex-col gap-5">
      {!open && (
        <button className="btn btn-primary btn-sm self-end" onClick={() => setOpen(true)}>
          Edit Profile
        </button>
      )}

      <SectionComponent title="Contact Information">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <p className="font-bold w-32 text-white">User name:</p>
            {open ? (
              <input
                type="text"
                className="input input-bordered w-full input-sm max-w-xs"
                {...register('userName', {
                  onChange: (e) => setUserName(e.target.value),
                })}
              />
            ) : (
              <p>{userName || 'Not provided'}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <p className="font-bold w-32 text-white">Phone number:</p>
            {open ? (
              <PhoneInput
                value={phone}
                onChange={(value) => setPhoneNumber(value as string)}
                className="input input-bordered w-full max-w-xs"
              />
            ) : (
              <p>{phone || 'Not provided'}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <p className="font-bold w-32 text-white">Email:</p>
            {open ? (
              <input
                type="email"
                className="input input-bordered w-full input-sm max-w-xs"
                {...register('email', {
                  onChange: (e) => setEmail(e.target.value),
                })}
              />
            ) : (
              <p>{email || 'Not provided'}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <p className="font-bold w-32 text-white">Profile URL:</p>
            {open ? (
              <input
                type="url"
                className="input input-bordered w-full input-sm max-w-xs"
                {...register('profileUrl', {
                  onChange: (e) => setProfileUrl(e.target.value),
                })}
              />
            ) : (
              <p>{profileUrl || 'Not provided'}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <p className="font-bold w-32 text-white">Country:</p>
            {open ? (
              <input
                type="text"
                className="input input-bordered w-full input-sm max-w-xs"
                {...register('country', {
                  onChange: (e) => setCountry(e.target.value),
                })}
              />
            ) : (
              <p>{country || 'Not provided'}</p>
            )}
          </div>
        </div>
      </SectionComponent>

      <hr className="border-gray-300" />

      <SectionComponent title="Basic Information">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <p className="font-bold w-32 text-white">Birthday: </p>
            {open ? (
              <Calendar
                onChange={(value) => setBirthday(value as Date)}
                value={birthday}
                className="rounded-lg border p-2"
              />
            ) : (
              <p>{birthday.toLocaleDateString()}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <p className="font-bold w-32 text-white">Gender: </p>
            {open ? (
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="male"
                    checked={gender === 'male'}
                    className="checkbox"
                    onChange={handleSetGender}
                  />
                  <span>Male</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="female"
                    checked={gender === 'female'}
                    className="checkbox"
                    onChange={handleSetGender}
                  />
                  <span>Female</span>
                </label>
              </div>
            ) : (
              <p>{gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : 'Not specified'}</p>
            )}
          </div>
        </div>
      </SectionComponent>

      <hr className="border-gray-300" />

      <div>
        {open ? (
          <TextEditor field="bio" labelText="Bio editing" setValue={handleSetBio} />
        ) : (
          <SectionComponent title="BIO">{bio}</SectionComponent>
        )}
      </div>

      {open && (
        <div className="flex flex-row items-center gap-3">
          <button className="btn btn-error btn-outline" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn btn-success btn-outline" onClick={handleCloseEditAndSave}>
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default About;
