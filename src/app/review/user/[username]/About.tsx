'use client'

import SectionComponent from "@/components/SectionCustom";
import TextEditor from "@/components/TextEditor";
import { profile_schema } from "@/schema";
import editProfileStore from "@/store/editProfileStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Calendar from "react-calendar";
import { useForm } from "react-hook-form";
import PhoneInput from 'react-phone-number-input';


const About = () => {


  const [bio, setBio] = useState('');
  const [openEditor, setOpenEditor] = useState(false);

  const handleSetBio = (value: string) => setBio(value);

  const [phoneNumber, setPhoneNumber] = useState('');



  const handleToggleEditor = () => setOpenEditor(!openEditor);

  const { register } = useForm({
    defaultValues: {
      fistName: '',
      lastName: '',
      userName: '',
      email: '',
    },
    resolver: zodResolver(profile_schema),
  });


  const { open } = editProfileStore();
  return (
    <div className="mt-6 space-y-4 flex flex-col gap-5">
      <SectionComponent title="Contact Information">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <p className="font-bold w-32 text-white">First name:</p>
            {open ? (
              <input
                type="text"
                value={'truong'}
                className="input input-bordered w-full input-sm max-w-xs"
                {...register('fistName')}
              />
            ) : (
              <p>John</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <p className="font-bold w-32 text-white">Last name:</p>
            {open ? (
              <input
                type="text"
                value={'truong'}
                className="input input-bordered w-full input-sm max-w-xs"
                {...register('lastName')}
              />
            ) : (
              <p>John</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <p className="font-bold w-32 text-white">User name:</p>
            {open ? (
              <input
                type="text"
                value={'truong'}
                className="input input-bordered w-full input-sm max-w-xs"
                {...register('userName')}
              />
            ) : (
              <p>John</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <p className="font-bold w-32 text-white">Phone number:</p>
            <PhoneInput
              onChange={(value) => setPhoneNumber(value as string)}
              className="input input-bordered w-full max-w-xs"
            />
          </div>

          <div className="flex items-center gap-3">
            <p className="font-bold w-32 text-white">Email:</p>
            {open ? (
              <input
                type="email"
                value={'truong@gmail.com'}
                className="input input-bordered w-full input-sm max-w-xs"
                {...register('email')}
              />
            ) : (
              <p>truong@gmail.com</p>
            )}
          </div>
        </div>
      </SectionComponent>

      <hr className="border-gray-300" />

      <SectionComponent title="Basic Information">
        <div className="flex gap-3">
          <p className="font-bold text-white">Birthday: </p>
          {open ? <Calendar /> : <p>01/01/2000</p>}
        </div>
        <div className="flex gap-3">
          <p className="font-bold">Gender: </p>
          <p>Male</p>
          <input type="checkbox" defaultChecked className="checkbox" />
          <p>Female</p>
          <input type="checkbox" className="checkbox" />
        </div>
      </SectionComponent>

      <hr className="border-gray-300" />

      {/* BIO SectionComponent */}
      <div>
        <button className="btn btn-sm" onClick={handleToggleEditor}>
          edit
        </button>
        {openEditor ? (
          <TextEditor field="bio" labelText="bio editing" setValue={handleSetBio} />
        ) : (
          <SectionComponent title="BIO">{bio}</SectionComponent>
        )}
      </div>
    </div>
  );
};

export default About;
