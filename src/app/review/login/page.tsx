'use client';

import { login_schema } from '@/schema';
import { loginAccountAPI } from '@/services/auth';
import type { LoginInfo } from '@/types';
import { ToastError, ToastSuccess } from '@/utils/toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import BgImage from '../../../../public/vecteezy_concept-illustration-of-man-and-woman-friends-having-online_8296859.jpg';
import axiosInstance from '@/utils/axiosInstance';

const LoginPage = () => {
  const router = useRouter();
  const { mutate: loginAccountMutation } = useMutation({
    mutationFn: loginAccountAPI,
    onSuccess: (data) => {
      ToastSuccess(data.message);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.data.accessToken}`;
      localStorage.setItem('token', data.data.accessToken);
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push('/review/home');
      }
    },
    onError: (err) => {
      ToastError(err.message);
    },
  });

  const onSubmit = (data: LoginInfo) => {
    loginAccountMutation(data);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(login_schema),
  });

  return (
    <div className="min-h-screen flex">
      {/* Background Image Container */}
      <div className="hidden lg:block w-1/2 relative">
        <Image
          src={BgImage}
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="absolute inset-0"
        />
      </div>

      {/* Login Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
          </div>

          <form className="bg-white p-6 rounded-xl shadow-lg" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div className="form-control">
                <label className="label" htmlFor="email">
                  <span className="label-text font-medium text-gray-700">Email</span>
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="input input-bordered w-full rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  {...register('email')}
                />
              </div>

              <div className="form-control">
                <label className="label" htmlFor="password">
                  <span className="label-text font-medium text-gray-700">Password</span>
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className="input input-bordered w-full rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  {...register('password')}
                />
                <div className="text-right mt-2">
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full rounded-md py-3 text-base font-medium transition duration-200 hover:bg-primary-dark"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="register" className="text-primary font-medium hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
