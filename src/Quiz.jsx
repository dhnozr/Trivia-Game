import React, { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';

export default function Quiz() {
  const location = useLocation();
  const categoryNumber = location?.state;
  // const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const { data, isLoading, error } = useQuery({
    queryKey: ['questions'],

    queryFn: async () => {
      // await wait(2000);
      const { data } = await axios.get(
        `https://opentdb.com/api.php?amount=10&category=${id}&difficulty=easy&type=multiple`
      );
      return data;
    },
  });

  return <div>Quiz</div>;
}
