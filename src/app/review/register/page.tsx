'use client';

import { getCountries } from '@/services/country_api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import Select from 'react-select';
import Link from 'next/link';
import { register_schema } from '@/schema';
import { CountryOption } from '@/types';

// Define TypeScript types for country options
const RegisterPage = () => {
  const onSubmit = (data: any) => {
    const { firstName, lastName, username, email, password, confirmPassword } = data;
    const country = selectedCountry?.value;
    const registerInfo = {
      firstName,
      lastName,
      username,
      email,
      password,
      confirmPassword,
      country,
      phoneNumber,
    };

    // TODO: do something
  };

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const fetchCountriesApi = async () => {
    const data = await getCountries();
    setCountries(data.countries);
    setSelectedCountry(data.userSelectValue);
  };

  useEffect(() => {
    fetchCountriesApi();
  }, []);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(register_schema),
  });

  return (
    <div className="flex flex-col items-center mt-10 mb-10">
      <h1 className="text-3xl font-bold mb-6">REGISTER</h1>
      <form
        className="w-1/3 bg-base-200 p-6 rounded-lg shadow-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="form-control">
          <label className="label">First Name</label>
          <input
            type="text"
            placeholder="First Name"
            className="input input-bordered"
            {...register('firstName')}
          />
          {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
        </div>

        <div className="form-control">
          <label className="label">Last Name</label>
          <input
            type="text"
            placeholder="Last Name"
            className="input input-bordered"
            {...register('lastName')}
          />
          {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
        </div>

        <div className="form-control">
          <label className="label">Username *</label>
          <input
            type="text"
            placeholder="Username"
            className="input input-bordered"
            required
            {...register('username')}
          />
        </div>
        {errors.username && <p className="text-red-500">{errors.username.message}</p>}

        <div className="form-control">
          <label className="label">Phone *</label>
          <PhoneInput
            onChange={(value) => setPhoneNumber(value as string)}
            className="input input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label">Country</label>
          <Select
            options={countries}
            value={selectedCountry}
            onChange={setSelectedCountry}
            className="input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label">Email *</label>
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered"
            required
            {...register('email')}
          />
        </div>
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <div className="form-control">
          <label className="label">Password *</label>
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered"
            required
            {...register('password')}
          />
        </div>
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        <div className="form-control">
          <label className="label">Confirm Password *</label>
          <input
            type="password"
            placeholder="Confirm Password"
            className="input input-bordered"
            required
            {...register('confirmPassword')}
          />
        </div>
        {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}

        <button type="submit" className="btn btn-primary w-full mt-4">
          Register
        </button>
      </form>
      <div className="mt-4">
        <p>
          Already have an account?{' '}
          <Link href="login" className="link link-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
