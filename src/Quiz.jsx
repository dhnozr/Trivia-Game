import React, { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { decode } from 'html-entities';
import animationData from './assets/Animation - 1700253930376.json';
import Lottie from 'lottie-react';

export default function Quiz() {
  const location = useLocation();
  const categoryNumber = location?.state;
  console.log(categoryNumber);
  const id = categoryNumber;

  // send user the home page after submit btn
  const navigate = useNavigate();

  const [userAnswers, setUserAnswers] = useState([]);
  // condition to render score after submit
  const [quizChecked, setQuizChecked] = useState(false);

  // user score
  const [userScore, setUserScore] = useState(0);

  const wait = ms => new Promise(reselvo => setTimeout(reselvo, ms));
  const { data, isLoading, error } = useQuery({
    queryKey: ['questions', [id]],
    refetchOnWindowFocus: false,
    staleTime: 0,
    retryDelay: 5000,
    queryFn: async () => {
      await wait(2000);

      const { data } = await axios.get(
        `https://opentdb.com/api.php?amount=10&category=${id}&difficulty=easy&type=multiple`
      );
      return data.results;
    },
  });

  console.log(data);

  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const shuffledData = data.map(el => ({
        category: decode(el.category),
        correct_answer: decode(el.correct_answer),
        difficulty: decode(el.difficulty),
        all_answers: shuffleArray(
          [...el.incorrect_answers, el.correct_answer].map(answer =>
            decode(answer)
          )
        ),
        question: decode(el.question),
      }));
      setShuffledQuestions(shuffledData);
    }
  }, [data]);

  if (data?.length <= 0) {
    return (
      <div className="h-screen bg-[url('/layered-waves-haikei.svg')] bg-no-repeat bg-cover text-[#DEEBF8] flex flex-col gap-4 items-center justify-center ">
        <h2 className="text-2xl">No questions available at the moment.</h2>
        <button
          className="bg-black rounded w-full max-w-[200px] my-5 mx-auto py-3"
          onClick={sendUserToHomePage}
        >
          Return Home
        </button>
      </div>
    );
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function handleAnswers(event, questionId) {
    const answers = [...userAnswers];
    const isCorrect =
      event.target.value === shuffledQuestions[questionId].correct_answer;
    answers[questionId] = {
      question: shuffledQuestions[questionId].question,
      isCorrect,
      answer: event.target.value,
      correct_answer: shuffledQuestions[questionId].correct_answer,
    };

    console.log(event.target.value);

    setUserAnswers(answers);
  }

  function handleSubmit() {
    userAnswers.forEach((ans, index) => {
      if (ans?.answer === shuffledQuestions[index].correct_answer) {
        setUserScore(prev => prev + 1);
      }
    });
    setQuizChecked(true);
  }

  function sendUserToHomePage() {
    navigate('/');
    setQuizChecked(true);
  }

  const questionsEl = shuffledQuestions.map((qsn, i) => (
    <div key={i} className="text-center flex flex-col gap-4 px-2">
      <h2 className="text-lg font-bold mt-10 ">{qsn.question}</h2>
      <div className="flex flex-wrap items-center justify-center gap-6">
        {qsn.all_answers.map((ans, index) => (
          <label
            key={index}
            className={`w-full max-w-[180px] py-2  relative border border-sky-100 rounded ${
              userAnswers[i]?.answer === ans
                ? 'bg-[#D6DBF5] text-[#293264]'
                : quizChecked && userAnswers[i]?.correct_answer === ans
                ? 'bg-green-500'
                : ''
            }`}
            htmlFor={`q${i}a${index}`}
          >
            <input
              className="w-full opacity-0 hidden"
              onChange={e => handleAnswers(e, i)}
              key={index}
              type="radio"
              name={`q${i}`}
              value={ans}
              id={`q${i}a${index}`}
              disabled={quizChecked}
            />
            {ans}
          </label>
        ))}
      </div>
    </div>
  ));

  return (
    <>
      <div className="min-h-screen bg-[url('/layered-waves-haikei.svg')] bg-no-repeat bg-cover text-[#DEEBF8] flex flex-col font-Inter">
        {isLoading ? (
          <div className="flex h-screen items-center justify-center">
            <Lottie animationData={animationData} />
          </div>
        ) : error ? (
          <div>
            <h2>Error accured : {error.message}</h2>
          </div>
        ) : (
          <div>
            {questionsEl}

            <div className="text-center">
              {quizChecked ? (
                <div className="flex items-center justify-center gap-4">
                  <button
                    className="bg-black rounded w-full max-w-[200px] my-5 py-3 "
                    onClick={sendUserToHomePage}
                  >
                    Return Home Page
                  </button>
                  <p>
                    Your score {userScore} / {shuffledQuestions.length}
                  </p>
                </div>
              ) : (
                <div>
                  <button
                    className="bg-black rounded w-full max-w-[200px] my-5 mx-auto py-3 "
                    onClick={handleSubmit}
                  >
                    Check Answers
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
