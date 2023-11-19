import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import animationData from './assets/Animation - 1700253930376.json';
import Lottie from 'lottie-react';

export default function HomePage() {
  const navigate = useNavigate();
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    retryDelay: 5000,
    refetchOnMount: true,
    staleTime: 3000,
    queryFn: async () => {
      await wait(3000);
      const { data } = await axios.get('https://opentdb.com/api_category.php');
      return data.trivia_categories;
    },
  });

  // send categoryNumber to quiz page
  const [categoryNumber, setCategoryNumber] = useState(9);

  const onSubmit = e => {
    e.preventDefault();
    navigate('/quiz', { state: categoryNumber });
    queryClient.removeQueries(['categories']);
  };

  const handleChange = e => {
    const selectedIndex = e.target.selectedIndex;

    const value = e.target[selectedIndex].value;
    const categoryValue = Number(value);
    console.log(typeof categoryValue);
    setCategoryNumber(categoryValue);
  };

  console.log(categoryNumber);

  return (
    <div className="h-screen  bg-[url('/blob-scene-haikei.svg')] bg-no-repeat bg-cover flex items-center justify-center flex-col text-white">
      {isLoading ? (
        <div>
          <Lottie animationData={animationData} />
        </div>
      ) : error ? (
        <div>
          <h2>Error accured: {error.message}</h2>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="text-white flex items-center justify-center gap-6 flex-wrap max-w-lg"
        >
          <label className="text-xl" htmlFor="category">
            Choose a Category
          </label>
          <select
            className="bg-white text-black p-2"
            name="category"
            id="category"
            onChange={handleChange}
          >
            {data?.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button className="text-xl border border-cyan-200 p-2 rounded max-w-[200px] w-full hover:bg-yellow-400 transition-all hover:text-slate-900">
            Start Quiz
          </button>
        </form>
      )}
    </div>
  );
}
