const code = `import React, { useState, useEffect, useCallback } from 'react';

// Data for the quiz questions
const QUIZ_ITEMS = [
  {
    text: 'Which action best protects your personal information online?',
    category: 'Providing sensitive data only on encrypted, reputable websites.',
    metadata: {
      hint: 'Think about where and how you share private details.',
      explanation:
        "Providing sensitive data only on encrypted, reputable websites (look for 'https://' and a padlock icon) ensures your information is transmitted securely and handled by trusted entities. Sharing widely or using insecure methods increases risk.",
    },
  },
  {
    text: 'What is a key practice for creating a strong and secure password?',
    category: 'Creating a long phrase with a mix of uppercase, lowercase, numbers, and symbols.',
    metadata: {
      hint: 'Consider complexity and uniqueness.',
      explanation:
        'Strong passwords are long, complex, and unique. Combining different character types (uppercase, lowercase, numbers, symbols) makes them much harder to guess or crack. Avoid using easily guessable information like names or birthdates, and never reuse passwords.',
    },
  },
  {
    text: 'Why is it important to regularly update your software and operating system?',
    category: 'Updates often include critical security patches that fix vulnerabilities.',
    metadata: {
      hint: 'Think about security gaps.',
      explanation:
        'Software updates frequently contain patches for newly discovered security vulnerabilities. Keeping your software updated is crucial for protecting your devices from cyber threats and ensuring optimal performance and stability.',
    },
  },
];

// Helper to generate options for a given question
const generateOptions = (questions, currentIndex) => {
  const currentQuestion = questions[currentIndex];
  const correctAnswer = currentQuestion.category;

  const allCategories = questions.map((q) => q.category);
  // Create a pool of unique incorrect options from other categories
  const incorrectOptionsPool = [...new Set(allCategories.filter((cat) => cat !== correctAnswer))];

  let incorrectOptions = [];
  // Shuffle the pool to pick random incorrect options
  for (let i = incorrectOptionsPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [incorrectOptionsPool[i], incorrectOptionsPool[j]] = [incorrectOptionsPool[j], incorrectOptionsPool[i]];
  }

  // Pick up to 2 incorrect options from the shuffled pool
  while (incorrectOptions.length < 2 && incorrectOptionsPool.length > 0) {
    incorrectOptions.push(incorrectOptionsPool.shift());
  }

  // If still not enough unique incorrect options from the pool, generate generic ones
  while (incorrectOptions.length < 2) {
    incorrectOptions.push(\`Another Choice \${incorrectOptions.length + 1}\`);
  }

  const options = [...incorrectOptions, correctAnswer];
  // Shuffle all options to randomize position of the correct answer
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
};

const CybersecurityDefenderGame = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showNextButton, setShowNextButton] = useState(false);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = QUIZ_ITEMS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === QUIZ_ITEMS.length - 1;

  // Effect to generate options when the current question changes or on initial load
  useEffect(() => {
    if (!quizCompleted) {
      setCurrentOptions(generateOptions(QUIZ_ITEMS, currentQuestionIndex));
    }
  }, [currentQuestionIndex, quizCompleted]);

  // Callback for selecting an answer
  const handleAnswerSelect = useCallback(
    (answer) => {
      if (!isAnswerChecked) {
        // Only allow selection if answer hasn't been checked yet
        setSelectedAnswer(answer);
        setFeedbackMessage(''); // Clear previous feedback when a new option is selected
      }
    },
    [isAnswerChecked]
  );

  // Callback for checking the answer
  const handleCheckAnswer = useCallback(() => {
    if (selectedAnswer === null) {
      setFeedbackMessage('Please select an answer before checking.');
      return;
    }
    setIsAnswerChecked(true); // Lock answer selection
    setShowNextButton(true); // Show the next/finish button

    const isCorrect = selectedAnswer === currentQuestion.category;
    if (isCorrect) {
      setFeedbackMessage(\`Correct! \${currentQuestion.metadata.explanation}\`);
      setScore((prevScore) => prevScore + 1);
    } else {
      setFeedbackMessage(\`Incorrect! The correct answer was: "\${currentQuestion.category}". \${currentQuestion.metadata.explanation}\`);
    }
  }, [selectedAnswer, currentQuestion]);

  // Callback for moving to the next question or completing the quiz
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < QUIZ_ITEMS.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer(null);
      setFeedbackMessage('');
      setShowNextButton(false);
      setIsAnswerChecked(false);
    } else {
      setQuizCompleted(true); // Mark quiz as completed
    }
  }, [currentQuestionIndex]);

  // Callback for restarting the game
  const handleRestartGame = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setFeedbackMessage('');
    setShowNextButton(false);
    setIsAnswerChecked(false);
    setScore(0);
    setQuizCompleted(false);
    setCurrentOptions(generateOptions(QUIZ_ITEMS, 0)); // Re-generate options for the first question
  }, []);

  // Tailwind CSS classes based on requirements
  const commonBorderClasses = 'border-[3px] border-black bg-white shadow-[5px_8px_8px_rgba(0,0,0,0.05)]';
  const gameContentClasses = 'bg-[#F4F6FA] border-[#B4B9CF]';
  const buttonBaseClasses = 'w-full py-3 px-4 rounded-md text-center transition-all duration-200 ease-in-out font-semibold';

  // Dynamic classes for answer option buttons
  const optionButtonClasses = (option) => {
    let classes = \`\${buttonBaseClasses} border-2 border-dashed border-[#B4B9CF] text-black\`;

    if (isAnswerChecked) {
      classes += ' cursor-not-allowed opacity-70';
      if (option === currentQuestion.category) {
        // Correct answer revealed
        classes += ' bg-green-200 border-green-600';
      } else if (selectedAnswer === option) {
        // Incorrect answer selected by user
        classes += ' bg-[#FFE9E9] border-[#F4364B]';
      } else {
        // Unselected incorrect answer
        classes += ' bg-white';
      }
    } else {
      classes += ' cursor-pointer hover:bg-gray-100';
      if (selectedAnswer === option) {
        // Currently selected before checking
        classes += ' bg-[#ECF5FF] border-[#027BE5] shadow-[2px_2px_4px_rgba(0,0,0,0.1)]';
      } else {
        classes += ' bg-white';
      }
    }
    return classes;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FFF2C2] font-sans">
      <div className={\`w-full max-w-2xl p-6 md:p-8 space-y-6 \${commonBorderClasses}\`}>
        {/* Logo at the top */}
        <div className="flex justify-center mb-4">
          <img src="https://i.ibb.co/qLgM2cfL/image.png" alt="Logo" className="max-h-20" />
        </div>

        {/* Game Title */}
        <h1 className="font-['IBM Plex Sans'] text-black text-[32px] leading-[44px] tracking-[-0.96px] text-center font-light" id="game-title" aria-label="Cybersecurity Defender Challenge Game Title">
          Cybersecurity Defender Challenge
        </h1>

        {/* Game Description / Sub-heading */}
        <p className="font-['IBM Plex Sans'] text-black text-[24px] leading-[36px] tracking-[-0.72px] text-center font-light mb-6" aria-label="Topic: Cybersecurity and Data Protection">
          {quizCompleted ? 'Quiz Complete!' : 'Topic: Cybersecurity and Data Protection'}
        </p>

        {quizCompleted ? (
          // Quiz completion screen
          <div className={\`p-6 rounded-lg \${gameContentClasses} border-[2px] border-dashed border-[#B4B9CF] text-center space-y-4\`}>
            <p className="text-xl font-bold text-black" aria-live="polite">
              You've completed the challenge!
            </p>
            <p className="text-2xl font-extrabold text-black">
              Your Score: {score} out of {QUIZ_ITEMS.length}
            </p>
            <button
              onClick={handleRestartGame}
              className={\`\${buttonBaseClasses} bg-[#027BE5] text-white hover:bg-[#0056b3] focus:outline-none focus:ring-2 focus:ring-[#027BE5] focus:ring-opacity-75\`}
              aria-label="Restart game"
            >
              Play Again
            </button>
          </div>
        ) : (
          // Active quiz game screen
          <div className={\`p-6 rounded-lg \${gameContentClasses} border-[2px] border-dashed border-[#B4B9CF] space-y-4\`}>
            {/* Question Display */}
            <p className="font-['IBM Plex Sans'] text-black text-[16px] leading-[26px] tracking-[-0.32px] font-bold" id="question-display" aria-live="polite" aria-atomic="true">
              {currentQuestion.text}
            </p>

            {/* Answer Options */}
            <div className="grid grid-cols-1 gap-3">
              {currentOptions.map((option, index) => (
                <button
                  key={index}
                  id={\`option-\${String.fromCharCode(97 + index)}-button\`} // Generates IDs like option-a-button
                  onClick={() => handleAnswerSelect(option)}
                  className={optionButtonClasses(option)}
                  disabled={isAnswerChecked} // Disable buttons after answer is checked
                  aria-pressed={selectedAnswer === option}
                  aria-label={\`Select option \${option}\`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Check Answer Button */}
            <button
              id="check-answer-button"
              onClick={handleCheckAnswer}
              className={\`\${buttonBaseClasses} bg-[#027BE5] text-white hover:bg-[#0056b3] focus:outline-none focus:ring-2 focus:ring-[#027BE5] focus:ring-opacity-75 \${
                isAnswerChecked || selectedAnswer === null ? 'opacity-50 cursor-not-allowed' : ''
              }\`}
              disabled={isAnswerChecked || selectedAnswer === null} // Disable if already checked or no answer selected
              aria-label="Check my answer"
            >
              Check Answer
            </button>

            {/* Feedback Display */}
            <p
              id="feedback-display"
              className={\`font-['IBM Plex Sans'] text-[16px] leading-[26px] tracking-[-0.32px] font-normal italic mt-4 p-3 rounded-md border-[2px] border-dashed
                \${
                  feedbackMessage.includes('Correct')
                    ? 'bg-green-100 text-green-800 border-green-400'
                    : feedbackMessage.includes('Incorrect')
                    ? 'bg-[#FFE9E9] text-[#F4364B] border-[#F4364B]'
                    : feedbackMessage
                    ? 'bg-blue-100 text-blue-800 border-blue-400'
                    : 'hidden'
                }
              \`}
              aria-live="assertive"
              aria-atomic="true"
            >
              {feedbackMessage}
            </p>

            {/* Next Question Button */}
            {showNextButton && (
              <button
                id="next-question-button"
                onClick={handleNextQuestion}
                className={\`\${buttonBaseClasses} bg-[#027BE5] text-white hover:bg-[#0056b3] focus:outline-none focus:ring-2 focus:ring-[#027BE5] focus:ring-opacity-75 mt-4\`}
                aria-label={isLastQuestion ? 'Finish Quiz' : 'Next Question'}
              >
                {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CybersecurityDefenderGame;`;

export default code;
