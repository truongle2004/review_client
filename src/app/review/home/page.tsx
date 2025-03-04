'use client';

import Navbar from '@/components/NavBar';
import { fetchAllCategoryAPI } from '@/services/category';
import { convertToSlug } from '@/utils/slugify';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

const HomePage = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchAllCategoryAPI,
  });

  return (
    <>
      <Navbar />
      <div className="relative w-full min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Welcome to Review Hub
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Discover authentic reviews, share your insights, and uncover top recommendations for
            products and services that matter most to you.
          </p>
          <Link
            href="/reviews"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full
                    hover:bg-indigo-700 transition-all duration-300 text-lg font-semibold shadow-md"
          >
            Explore Reviews
          </Link>
        </section>

        {/* Search Section */}
        <section className="container mx-auto px-4 py-16 text-center bg-white shadow-lg rounded-lg max-w-4xl -mt-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-3">Know Better, Choose Better</h2>
          <p className="text-gray-500 mb-6">Reviews by real people, just like you</p>
          <div className="flex justify-center">
            <label className="relative flex items-center w-full max-w-md">
              <input
                type="text"
                placeholder="Search reviews..."
                className="w-full rounded-full py-3 pl-5 pr-12 text-gray-700 border border-gray-300
                        focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="absolute right-4 h-5 w-5 text-gray-500"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>
        </section>

        {/* Categories Section */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-10">
            Explore Categories
          </h2>
          {isLoading ? (
            <div className="text-center text-gray-500">Loading categories...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories?.map((category) => (
                <Link
                  key={category.id}
                  href={`/review/${category.id}/${convertToSlug(category.name)}`}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {category.name || 'Unnamed Category'}
                    </h3>
                    <p className="text-gray-600 line-clamp-2">
                      {category.description || 'Discover reviews in this category.'}
                    </p>
                    <span className="inline-block mt-3 text-indigo-600 font-medium group-hover:underline">
                      View Reviews
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Preview Section */}
        <section className="container mx-auto px-4 py-20 bg-gray-100">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-10">
            Why Review Hub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Product Reviews</h3>
              <p className="text-gray-600 leading-relaxed">
                Explore in-depth reviews on the latest products, from tech gadgets to everyday
                essentials.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">User Stories</h3>
              <p className="text-gray-600 leading-relaxed">
                Dive into authentic experiences shared by our vibrant community of reviewers.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Rate & Review</h3>
              <p className="text-gray-600 leading-relaxed">
                Share your opinions and guide others toward smarter decisions.
              </p>
            </div>
          </div>
        </section>

        {/* Footer Teaser */}
        <section className="container mx-auto px-4 py-12 text-center border-t border-gray-200">
          <p className="text-gray-600">
            Join thousands of users making informed choices every day.{' '}
            <Link href="/signup" className="text-indigo-600 hover:underline font-medium">
              Get Started
            </Link>
          </p>
        </section>
      </div>
    </>
  );
};

export default HomePage;
