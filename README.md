# Overview

The application is built using React and leverages the @tanstack/react-query for fetching data and managing server state. It interacts with the Open Trivia Database API to fetch trivia categories and questions.

# HomePage

The HomePage component is responsible for displaying the list of trivia categories fetched from the Open Trivia Database API. Users can select a category and start the quiz. The page uses Lottie animations for better user engagement.

![homepage](/public/Screenshot-163558.png)

# Quiz

The Quiz component handles the quiz functionality. It fetches trivia questions based on the selected category and presents them to the user. Users can select answers and submit them to see their scores. The component also handles various states like loading, error, and quiz completion.

![quizpage](/public/Screenshot-163823.png)

# Live Site

[Live Site](https://quiz-game-dhnozr.netlify.app/)

# Technologies Used

1. React
2. Axios for API requests
3. @tanstack/react-query
4. Lottie for animations
5. HTML entities for decoding HTML characters in trivia data

# API Reference

The application uses the Open Trivia Database API for fetching trivia categories and questions. More information can be found at Open Trivia Database.

# Contribution

Contributions to this project are welcome. Please ensure to follow the existing code structure and format. For major changes, please open an issue first to discuss what you would like to change.
