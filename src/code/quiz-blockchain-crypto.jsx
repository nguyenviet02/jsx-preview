const code = `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // For beautiful UI and nice effects

const QuizBlockchainCrypto = () => {
  const quizData = {
    "file_name": "quiz-blockchain-crypto",
    "type": "game",
    "logic game": "A multiple-choice quiz designed to test user understanding of blockchain and cryptocurrency fundamentals. Users select an answer, receive immediate feedback, and are rewarded with a 'wow' effect for correct answers.",
    "libraries": "react, react-dom",
    "title": "Blockchain & Crypto Fundamentals Quiz",
    "topic": "Blockchain, Cryptocurrency, Web3",
    "description": "A mini-game quiz assessing user understanding of blockchain and cryptocurrency concepts based on foundational knowledge, providing interactive feedback and celebratory effects for correct answers.",
    "game_type": "multiple_choice",
    "components": [
      {
        "type": "title",
        "id": "quiz-title",
        "content": "Blockchain & Crypto Fundamentals Quiz"
      },
      {
        "type": "text",
        "id": "question-display",
        "content": "Your question will appear here."
      },
      {
        "type": "button",
        "id": "answer-option-1",
        "content": "Option A"
      },
      {
        "type": "button",
        "id": "answer-option-2",
        "content": "Option B"
      },
      {
        "type": "button",
        "id": "answer-option-3",
        "content": "Option C"
      },
      {
        "type": "button",
        "id": "submit-answer-button",
        "content": "Submit Answer"
      },
      {
        "type": "text",
        "id": "feedback-display",
        "content": "Feedback will appear here."
      }
    ],
    "items": [
      {
        "text": "What is the primary technology underlying most cryptocurrencies like Bitcoin?",
        "category": "Blockchain",
        "options": [
          "Centralized Ledger",
          "Blockchain",
          "Relational Database"
        ],
        "correct_answer": "Blockchain",
        "metadata": {
          "hint": "It's a distributed, immutable ledger.",
          "explanation": "Blockchain is a decentralized and distributed ledger technology that records transactions across many computers, forming the backbone of cryptocurrencies."
        }
      },
      {
        "text": "Which of the following is essential for securely storing and managing your cryptocurrency?",
        "category": "Cryptocurrency Wallets",
        "options": [
          "A bank account",
          "A physical safe",
          "A cryptocurrency wallet"
        ],
        "correct_answer": "A cryptocurrency wallet",
        "metadata": {
          "hint": "It manages your private keys.",
          "explanation": "A cryptocurrency wallet is a software or hardware device that stores the public and private keys used to send and receive digital currency."
        }
      },
      {
        "text": "What does 'decentralization' mean in the context of blockchain?",
        "category": "Blockchain Concepts",
        "options": [
          "Control by a single entity or government.",
          "Absence of a central authority, with control distributed among participants.",
          "The ability to spend the same cryptocurrency multiple times."
        ],
        "correct_answer": "Absence of a central authority, with control distributed among participants.",
        "metadata": {
          "hint": "Think about who holds the power.",
          "explanation": "Decentralization means that no single entity has control over the network; instead, power and decision-making are distributed among many participants."
        }
      }
    ],
    "interactions": [
      {
        "trigger": "User clicks on an answer option button",
        "response": "The selected answer option is highlighted."
      },
      {
        "trigger": "User clicks 'Submit Answer' button",
        "response": "The selected answer is validated against the correct answer. Feedback is displayed. If correct, a 'wow' visual and/or audio effect is triggered."
      },
      {
        "trigger": "After feedback is displayed",
        "response": "A 'Next Question' button appears to advance the quiz."
      }
    ],
    "feedback": true
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false); // For "wow" effect

  const questions = quizData.items;
  const currentQuestion = questions[currentQuestionIndex];

  // Confetti effect timer
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 1500); // Confetti duration
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    if (!showFeedback) { // Prevent changing selection after submitting
      setSelectedAnswer(answer);
    }
  };

  // Handle submitting the answer
  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) {
      setFeedbackMessage('Please select an answer before submitting.');
      return;
    }

    setShowFeedback(true);
    if (selectedAnswer === currentQuestion.correct_answer) {
      setFeedbackMessage('Correct! ' + currentQuestion.metadata.explanation);
      setIsCorrect(true);
      setScore(score + 1);
      setShowConfetti(true); // Trigger confetti
    } else {
      setFeedbackMessage(\`Incorrect. The correct answer was: "\${currentQuestion.correct_answer}". \${currentQuestion.metadata.explanation}\`);
      setIsCorrect(false);
    }
  };

  // Handle moving to the next question or finishing the quiz
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setFeedbackMessage('');
      setIsCorrect(false);
      setShowFeedback(false);
    } else {
      setQuizFinished(true);
    }
  };

  // Handle restarting the quiz
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setFeedbackMessage('');
    setIsCorrect(false);
    setShowFeedback(false);
    setScore(0);
    setQuizFinished(false);
    setShowConfetti(false);
  };

  // Tailwind classes for global styles based on specification
  const headingClasses = "text-black font-['IBM_Plex_Sans'] font-light text-[32px] leading-[44px] tracking-[-0.96px] text-center";
  const subHeadingClasses = "text-black font-['Fixed_Heading'] font-light text-[24px] leading-[36px] tracking-[-0.72px] text-center";
  const textContentClasses = "text-black font-['IBM_Plex_Sans'] font-normal text-[16px] leading-[26px] tracking-[-0.32px]";
  const commonBorderClasses = "border-[3px] border-black bg-white shadow-[0px_5px_8px_rgba(0,0,0,0.05)]"; // Drop shadow interpretation
  const gameContentBg = "bg-[#F4F6FA]";
  const gameContentBorder = "border-[#B4B9CF]";
  const alertBorderAndIconColor = "border-[#F4364B]";
  const alertBackground = "bg-[#FFE9E9]";

  // Helper for common button styles for answer options
  const answerButtonBaseClasses = "w-full py-3 px-4 rounded-md text-left transition-all duration-200 ease-in-out " +
                                  "border-2 border-dashed border-[#B4B9CF] text-black " + // In-game border
                                  "hover:scale-[1.01] focus:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-[#027BE5]";

  // Helper for styling answer buttons based on selection/feedback
  const getAnswerButtonClasses = (option) => {
    let classes = answerButtonBaseClasses;
    if (showFeedback) {
      if (option === currentQuestion.correct_answer) {
        classes += " bg-green-200 border-green-600"; // Correct answer styling
      } else if (option === selectedAnswer && option !== currentQuestion.correct_answer) {
        classes += \` \${alertBackground} \${alertBorderAndIconColor}\`; // Incorrect selected answer styling
      } else {
        classes += " opacity-70"; // Dim unselected incorrect answers
      }
    } else if (option === selectedAnswer) {
      classes += " bg-[#ECF5FF] border-[#027BE5]"; // Selected but not yet submitted
    }
    return classes;
  };

  return (
    <div className={\`min-h-screen flex flex-col items-center justify-center p-4 bg-[#FFF2C2] text-black\`}>
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth - window.innerWidth / 2,
                  y: Math.random() * window.innerHeight - window.innerHeight / 2,
                  opacity: 1,
                  scale: Math.random() * 0.5 + 0.5,
                }}
                animate={{
                  y: [Math.random() * window.innerHeight * 0.5, window.innerHeight + 50],
                  x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                  opacity: [1, 0],
                  rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                }}
                transition={{
                  duration: Math.random() * 1.5 + 1,
                  repeat: 0,
                  ease: "easeOut",
                  delay: Math.random() * 0.5,
                }}
                exit={{ opacity: 0, scale: 0 }}
                style={{
                  width: Math.random() * 10 + 5,
                  height: Math.random() * 10 + 5,
                  left: \`calc(50% + \${Math.random() * 400 - 200}px)\`,
                  top: \`calc(50% + \${Math.random() * 400 - 200}px)\`,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className={\`w-full max-w-2xl p-6 rounded-lg \${commonBorderClasses}\`}>
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="https://i.ibb.co/qLgM2cfL/image.png" alt="Logo" className="max-w-[150px] h-auto" />
        </div>

        {/* Title */}
        <h1 className={\`\${headingClasses} mb-4\`} id="quiz-title" aria-label={quizData.title}>
          {quizData.title}
        </h1>

        {/* Description */}
        <p className={\`\${textContentClasses} mb-8 text-center\`} aria-live="polite">
          {quizData.description}
        </p>

        {!quizFinished ? (
          <div className={\`\${gameContentBg} p-5 rounded-md \${gameContentBorder} border-[2px]\`}>
            {/* Question Display */}
            <h2 className={\`\${subHeadingClasses} mb-6\`} id="question-display" aria-live="polite">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
            <p className={\`\${textContentClasses} mb-8 p-4 bg-white rounded-md \${gameContentBorder} border-[2px] border-dashed\`} aria-live="polite">
              {currentQuestion.text}
            </p>

            {/* Answer Options */}
            <div role="radiogroup" aria-labelledby="question-display" className="space-y-4 mb-6">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  id={\`answer-option-\${index + 1}\`}
                  className={getAnswerButtonClasses(option)}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showFeedback}
                  aria-checked={selectedAnswer === option}
                  role="radio"
                  // tabIndex management for accessibility: only selected item is in tab order, others are navigable by arrow keys within the group
                  tabIndex={selectedAnswer === option || (selectedAnswer === null && index === 0) ? 0 : -1}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Submit Button */}
            {!showFeedback && (
              <button
                id="submit-answer-button"
                className={\`w-full py-3 px-4 rounded-md text-center font-bold transition-colors duration-200 \${selectedAnswer ? \`bg-[#FFB800] hover:bg-[#E5A300] text-black\` : \`bg-gray-300 text-gray-500 cursor-not-allowed\`}\`}
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                aria-label="Submit your answer"
              >
                Submit Answer
              </button>
            )}

            {/* Feedback Display */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={\`mt-6 p-4 rounded-md border-2 \${isCorrect ? \`bg-green-100 border-green-500\` : \`\${alertBackground} \${alertBorderAndIconColor}\`} font-semibold\`}
                  role="alert"
                  aria-live="assertive"
                  id="feedback-display"
                >
                  {feedbackMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next Question / Finish Button */}
            <AnimatePresence>
              {showFeedback && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="mt-4 w-full py-3 px-4 rounded-md text-center font-bold bg-[#027BE5] text-white hover:bg-[#026AD0] transition-colors duration-200"
                  onClick={handleNextQuestion}
                  aria-label={currentQuestionIndex < questions.length - 1 ? "Go to next question" : "Finish quiz and see results"}
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className={\`\${gameContentBg} p-5 rounded-md \${gameContentBorder} border-[2px] text-center\`}>
            <h2 className={\`\${subHeadingClasses} mb-4\`}>Quiz Complete!</h2>
            <p className={\`\${textContentClasses} mb-6\`}>You scored {score} out of {questions.length} questions correctly.</p>
            <button
              className="w-full py-3 px-4 rounded-md text-center font-bold bg-[#FFB800] text-black hover:bg-[#E5A300] transition-colors duration-200"
              onClick={handleRestartQuiz}
              aria-label="Restart the quiz"
            >
              Restart Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizBlockchainCrypto;
`;

export default code;