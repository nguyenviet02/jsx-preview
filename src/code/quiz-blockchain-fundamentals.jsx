const code = `import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// Helper function to shuffle an array
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};

// Define quiz questions. The 'category' field is interpreted as the correct answer.
// Since the original data does not provide multiple-choice options,
// we will generate plausible incorrect options for each question.
const quizData = [
  {
    text: "What is the core technology behind cryptocurrencies like Bitcoin?",
    correctAnswer: "Blockchain",
    metadata: {
      hint: "It's a distributed ledger.",
      explanation: "Blockchain is a decentralized, distributed ledger technology that records transactions across many computers, making them secure and tamper-proof."
    }
  },
  {
    text: "Which of the following best describes the primary purpose of a crypto wallet?",
    correctAnswer: "Storing private keys",
    metadata: {
      hint: "It doesn't directly hold the coins.",
      explanation: "A crypto wallet does not store cryptocurrency directly; instead, it stores the private keys that allow users to access and manage their cryptocurrency on the blockchain."
    }
  },
  {
    text: "What is 'mining' in the context of blockchain?",
    correctAnswer: "Validating transactions",
    metadata: {
      hint: "It involves solving complex computational puzzles.",
      explanation: "In Proof-of-Work blockchains, mining is the process by which new blocks are added to the blockchain by solving complex computational puzzles, thereby validating transactions and securing the network."
    }
  }
];

// Generates multiple-choice options for a given correct answer.
// In a real application, these incorrect options would ideally come from a curated list
// or a more sophisticated generation mechanism.
const generateOptions = (correctAnswer) => {
  const allPossibleAnswersPool = [
    "Blockchain", "Centralized Database", "Cloud Storage", "Quantum Computing",
    "Storing private keys", "Holding digital coins directly", "Trading NFTs", "Providing investment advice",
    "Validating transactions", "Creating new cryptocurrencies", "Exchanging fiat currency", "Selling digital art",
    // Add more plausible incorrect answers to ensure variety
    "Smart Contracts", "Decentralized Finance", "Proof of Stake", "Cryptographic Hashing",
    "Public Key Infrastructure", "Distributed Ledger", "Tokenization", "Consensus Mechanism"
  ];

  let options = [correctAnswer];
  let incorrectOptions = allPossibleAnswersPool.filter(ans => ans !== correctAnswer);

  // Filter out answers that might be too similar or directly related to the correct one
  // This is a simple heuristic; a robust system would use semantic analysis.
  incorrectOptions = incorrectOptions.filter(opt => !correctAnswer.includes(opt) && !opt.includes(correctAnswer));

  // Add 3 unique incorrect options
  while (options.length < 4 && incorrectOptions.length > 0) {
    const randomIndex = Math.floor(Math.random() * incorrectOptions.length);
    const chosenIncorrect = incorrectOptions[randomIndex];
    if (!options.includes(chosenIncorrect)) {
      options.push(chosenIncorrect);
    }
    incorrectOptions.splice(randomIndex, 1); // Remove picked option to ensure uniqueness
  }

  // Fallback if not enough unique incorrect options are found
  while (options.length < 4) {
    options.push(\`Dummy Option \${options.length + 1}\`);
  }

  return shuffleArray(options);
};

const QuizBlockchainFundamentals = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Stores the selected answer string
  const [feedback, setFeedback] = useState(null); // { isCorrect: boolean, message: string, explanation: string, type: 'success' | 'error' | 'alert' }
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentOptions, setCurrentOptions] = useState([]);

  const liveRegionRef = useRef(null); // For ARIA live region announcements

  const currentQuestion = quizData[currentQuestionIndex];

  // Generate options when the question changes
  useEffect(() => {
    if (currentQuestion) {
      setCurrentOptions(generateOptions(currentQuestion.correctAnswer));
      setSelectedAnswer(null); // Reset selected answer for new question
      setFeedback(null); // Clear previous feedback
    }
  }, [currentQuestionIndex, currentQuestion]);

  // Handle answer selection
  const handleAnswerSelect = useCallback((answer) => {
    if (!feedback) { // Only allow selection if no feedback is currently displayed
      setSelectedAnswer(answer);
    }
  }, [feedback]);

  // Handle submission
  const handleSubmitAnswer = useCallback(() => {
    if (selectedAnswer === null) {
      setFeedback({
        isCorrect: false,
        message: "Please select an answer!",
        explanation: "",
        type: "alert"
      });
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = "Please select an answer!";
      }
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }

    setFeedback({
      isCorrect: isCorrect,
      message: isCorrect ? "Correct!" : "Incorrect!",
      explanation: currentQuestion.metadata.explanation,
      type: isCorrect ? "success" : "error"
    });

    // Announce feedback for screen readers
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = \`\${isCorrect ? "Correct!" : "Incorrect!"} \${currentQuestion.metadata.explanation}\`;
    }

    // Placeholder for auditory feedback
    // In a real app, you would play actual sound files here.
    // Example: new Audio('/path/to/sound.mp3').play();
    console.log(\`Playing \${isCorrect ? 'correct' : 'incorrect'} sound!\`);
  }, [selectedAnswer, currentQuestion]);

  // Handle next question or quiz completion
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(null);
      setFeedback(null);
    } else {
      setQuizCompleted(true);
      setFeedback(null); // Clear feedback for final screen
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = \`Quiz complete! You scored \${score} out of \${quizData.length}.\`;
      }
    }
  }, [currentQuestionIndex, quizData.length, score]);

  // Handle quiz reset
  const handleResetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setFeedback(null);
    setQuizCompleted(false);
    setScore(0);
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = "Quiz reset. Starting new quiz.";
    }
  }, []);

  // Tailwind CSS classes based on provided design guidelines
  const commonBorderClasses = "border-[3px] border-black bg-white shadow-[5px_8px_8px_rgba(0,0,0,0.05)]";
  const inGameBorderClasses = "border-2 border-dashed border-black";

  // Font classes (assuming IBM Plex Sans is loaded globally, e.g., via Google Fonts link)
  // For "Fixed/Heading/Heading 03/Font family", using a generic sans-serif as a placeholder.
  const headingFont = "font-['IBM_Plex_Sans'] text-black text-[32px] leading-[44px] tracking-[-0.96px] font-light text-center";
  const subHeadingFont = "font-sans text-black text-[24px] leading-[36px] tracking-[-0.72px] font-light text-center";
  const contentFont = "font-['IBM_Plex_Sans'] text-black text-[16px] leading-[26px] tracking-[-0.32px] font-normal";

  // Color classes using arbitrary values for direct mapping
  const bgColor1 = "bg-[#FFF2C2]";
  const borderColor1 = "border-[#FFB800]";
  const bgColor2 = "bg-[#ECF5FF]";
  const borderColor2 = "border-[#027BE5]";
  const gameContentBg = "bg-[#F4F6FA]";
  const gameContentBorder = "border-[#B4B9CF]";
  const shadowColor = "shadow-[#E6E8F0]"; // This is a general shadow color, not the specific common border shadow.
  const alertBorder = "border-[#F4364B]";
  const alertBg = "bg-[#FFE9E9]";

  if (!currentQuestion && !quizCompleted) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <p className={clsx(contentFont, "text-gray-500")}>Loading quiz...</p>
      </div>
    );
  }

  return (
    <div className={clsx("min-h-screen flex flex-col items-center justify-center p-4", bgColor1)}>
      {/* ARIA Live Region for screen reader announcements */}
      <div ref={liveRegionRef} aria-live="polite" className="sr-only"></div>

      {/* Logo */}
      <img
        src="https://i.ibb.co/qLgM2cfL/image.png"
        alt="Company Logo"
        className="mb-8 w-32 h-auto"
      />

      <div className={clsx("w-full max-w-2xl p-6 rounded-lg", commonBorderClasses, borderColor1)}>
        <h1 className={clsx(headingFont, "mb-4")}>
          Blockchain & Crypto Fundamentals Quiz
        </h1>
        <p className={clsx(contentFont, "mb-8 text-center")}>
          An interactive quiz designed to help users grasp the fundamentals of blockchain and cryptocurrency.
        </p>

        <div className={clsx("p-6 rounded-md", gameContentBg, \`border \${gameContentBorder}\`, shadowColor)}>
          {quizCompleted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className={clsx(subHeadingFont, "mb-4")}>Quiz Complete!</h2>
              <p className={clsx(contentFont, "mb-4")}>
                You scored {score} out of {quizData.length} questions. // TODO: Fix this	
              </p>
              <button
                onClick={handleResetQuiz}
                className={clsx(
                  "px-6 py-3 rounded-md transition-all duration-200",
                  commonBorderClasses,
                  borderColor2,
                  bgColor2,
                  "hover:bg-opacity-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#027BE5]" // Using arbitrary value for ring color
                )}
                aria-label="Restart Quiz"
              >
                <span className={contentFont}>Restart Quiz</span>
              </button>
            </motion.div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex} // Key for re-animating on question change
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className={clsx(contentFont, "mb-6 text-center text-lg font-medium")}>
                    Question {currentQuestionIndex + 1} of {quizData.length}:
                  </p>
                  <p className={clsx(contentFont, "mb-8 text-center text-xl font-semibold")}>
                    {currentQuestion.text}
                  </p>

                  <div role="radiogroup" aria-labelledby="question-text" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {currentOptions.map((option) => (
                      <motion.button
                        key={option}
                        onClick={() => handleAnswerSelect(option)}
                        className={clsx(
                          "w-full p-4 rounded-md text-left transition-all duration-200",
                          inGameBorderClasses,
                          {
                            "bg-white hover:bg-gray-50": selectedAnswer !== option,
                            "bg-[#ECF5FF] border-[#027BE5]": selectedAnswer === option, // Highlight selected
                            "cursor-not-allowed opacity-70": feedback !== null // Disable if feedback is shown
                          }
                        )}
                        aria-checked={selectedAnswer === option}
                        role="radio"
                        disabled={feedback !== null}
                      >
                        <span className={contentFont}>{option}</span>
                      </motion.button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {feedback && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={clsx(
                          "p-4 rounded-md mb-6",
                          {
                            [clsx(alertBg, alertBorder)]: feedback.type === "error" || feedback.type === "alert",
                            "bg-green-100 border-green-500 border": feedback.type === "success",
                          }
                        )}
                        role="alert"
                        aria-live="assertive"
                      >
                        <p className={clsx(contentFont, "font-bold mb-2", { "text-[#F4364B]": feedback.type === "error" || feedback.type === "alert", "text-green-700": feedback.type === "success" })}>
                          {feedback.message}
                          {/* Optional: Add icon for visual feedback */}
                          {feedback.type === "success" && <span className="ml-2" aria-hidden="true">&#10003;</span>}
                          {(feedback.type === "error" || feedback.type === "alert") && <span className="ml-2" aria-hidden="true">&#x2717;</span>}
                        </p>
                        {feedback.explanation && (
                          <p className={clsx(contentFont, "text-gray-700")}>
                            {feedback.explanation}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-center">
                    {!feedback ? (
                      <button
                        onClick={handleSubmitAnswer}
                        className={clsx(
                          "px-6 py-3 rounded-md transition-all duration-200",
                          commonBorderClasses,
                          borderColor2,
                          bgColor2,
                          "hover:bg-opacity-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#027BE5]",
                          { "opacity-50 cursor-not-allowed": selectedAnswer === null }
                        )}
                        disabled={selectedAnswer === null}
                        aria-label="Submit Answer"
                      >
                        <span className={contentFont}>Submit Answer</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className={clsx(
                          "px-6 py-3 rounded-md transition-all duration-200",
                          commonBorderClasses,
                          borderColor1,
                          bgColor1,
                          "hover:bg-opacity-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFB800]"
                        )}
                        aria-label={currentQuestionIndex < quizData.length - 1 ? "Next Question" : "Finish Quiz"}
                      >
                        <span className={contentFont}>
                          {currentQuestionIndex < quizData.length - 1 ? "Next Question" : "Finish Quiz"}
                        </span>
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizBlockchainFundamentals;
`;

export default code;