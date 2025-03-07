'use client';

import BgImage from '../../../../public/vecteezy_concept-illustration-of-man-and-woman-friends-having-online_8296859.jpg';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { register_schema } from '@/schema';
import { RegisterInfo } from '@/types';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import { registerAccountAPI } from '@/services/auth';
import { ToastSuccess } from '@/utils/toastify';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(register_schema),
  });

  const { mutateAsync: registerAccountMutation } = useMutation({
    mutationFn: registerAccountAPI,
    onSuccess: (data) => {
      ToastSuccess(data._message);
      ToastSuccess('Please login again!');
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push('/review/login');
      }
    },
  });

  const onSubmit = (data: RegisterInfo) => {
    registerAccountMutation(data);
  };

  // const [countries, setCountries] = useState([]);
  // const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);
  // const [phoneNumber, setPhoneNumber] = useState('');

  // const fetchCountriesApi = async () => {
  //   const data = await getCountries();
  //   setCountries(data.countries);
  //   setSelectedCountry(data.userSelectValue);
  // };

  // useEffect(() => {
  //   fetchCountriesApi();
  // }, []);

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <Image
        src={BgImage}
        alt="Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="absolute inset-0 z-0 opacity-50"
      />

      {/* Form Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-10 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8 bg-white/95 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Create Account</h1>
            <p className="mt-2 text-sm text-gray-600">Fill in the details to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">
                  <strong>Username *</strong>
                </span>
              </label>
              <input
                type="text"
                placeholder="Username"
                className="input input-bordered w-full rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                {...register('username')}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">
                  <strong>Email *</strong>
                </span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                {...register('email')}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">Password *</span>
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="input input-bordered w-full rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">
                    <strong>Confirm Password *</strong>
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="input input-bordered w-full rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full rounded-md py-3 text-base font-medium transition duration-200 hover:bg-primary-dark"
            >
              Create Account
            </button>
          </form>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
