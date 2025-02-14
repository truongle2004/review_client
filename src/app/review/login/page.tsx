'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { login_schema } from '@/schema';

const LoginPage = () => {
  const onSubmit = (data: any) => {
    const { email, password } = data;
    console.log(email, password);
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
    <div className="flex flex-col items-center mt-10 mb-10">
      <h1 className="text-3xl font-bold mb-6">LOGIN</h1>
      <form
        className="w-1/3 bg-base-200 p-6 rounded-lg shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="form-control mb-4">
          <label className="label" htmlFor="email">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="input input-bordered w-full"
            required
            {...register('email')}
          />
        </div>

        <div className="form-control mb-4">
          <label className="label" htmlFor="password">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="input input-bordered w-full"
            required
            {...register('password')}
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Login
        </button>
      </form>

      <div className="mt-4">
        <p>
          Don't have an account?{' '}
          <Link href="register" className="text-primary">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
