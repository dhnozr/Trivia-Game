import React, { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function Quiz() {
  const location = useLocation();
  const categoryNumber = location?.state;
  console.log(categoryNumber);
  const id = categoryNumber;

  const { data, isLoading, error } = useQuery({
    queryKey: ['questions'],

    queryFn: async () => {
      const { data } = await axios.get(
        `https://opentdb.com/api.php?amount=10&category=${id}&difficulty=easy&type=multiple`
      );
      return data.results;
    },
  });

  const questions = [];
  {
    data?.map(el => {
      questions.push({
        category: el.category,
        correct_answer: el.correct_answer,
        difficulty: el.difficulty,
        all_answers: shuffleArray([...el.incorrect_answers, el.correct_answer]),
        question: el.question,
      });
    });
  }

  function shuffleArray(array) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  const questionsEl = questions.map((qsn, i) => (
    <div>
      <h2>{qsn.question}</h2>
      <div>
        {qsn.all_answers.map((ans, index) => (
          <label htmlFor={`q${i}-${index}`}>
            <input key={index} type="radio" name={`q-${i}`} value={ans} /> {ans}
          </label>
        ))}
      </div>
    </div>
  ));

  return (
    <>
      {isLoading ? (
        <div>
          <h2>...Loading</h2>
        </div>
      ) : error ? (
        <div>
          <h2>Error accured : {error.message}</h2>
        </div>
      ) : (
        questionsEl
      )}
    </>
  );
}
