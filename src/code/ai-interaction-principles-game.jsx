// Export the component as a string
const code = `import React, { useState, useEffect } from 'react';

// Define the game questions and options internally, augmenting the provided data
const gameQuestions = [
  {
    id: 1,
    question: "Scenario: You're starting a new project and plan to integrate an AI tool. How should you best approach it?",
    options: [
      { text: 'A) Delegate completely and expect perfection without much input.', isCorrect: false },
      { text: 'B) Treat it as a junior colleague, guiding and collaborating to achieve goals.', isCorrect: true },
      { text: 'C) Use it only for simple, repetitive tasks and avoid complex interactions.', isCorrect: false },
    ],
    explanation:
      'Correct answer is B. Treating AI as a junior colleague means you guide it, provide context, and collaborate, leveraging its strengths while understanding its limitations, just as you would with a human teammate.',
  },
  {
    id: 2,
    question: 'Scenario: You need the AI to summarize a long document. What is the most effective way to prompt it?',
    options: [
      { text: "A) Just tell it 'Summarize this document.'", isCorrect: false },
      { text: "B) Provide specific instructions like 'Summarize this document into 3 bullet points, focusing on key findings and recommendations.'", isCorrect: true },
      { text: 'C) Copy and paste the entire document and hope it figures out what you want.', isCorrect: false },
    ],
    explanation:
      'Correct answer is B. Providing clear, specific, and concise prompts helps the AI understand your intent precisely, leading to more accurate and relevant outputs. Vague or overly complex instructions often lead to undesirable results.',
  },
  {
    id: 3,
    question: "Scenario: After a successful AI-assisted task, what is a balanced perspective on AI's role?",
    options: [
      { text: 'A) AI is now fully capable of independent complex problem-solving.', isCorrect: false },
      { text: 'B) AI is merely a glorified search engine; its contributions are minimal.', isCorrect: false },
      { text: 'C) AI is a powerful tool with specific strengths and limitations, requiring human oversight and collaboration.', isCorrect: true },
    ],
    explanation:
      'Correct answer is C. A balanced perspective acknowledges that AI is a powerful tool with specific strengths (e.g., data processing, pattern recognition) but also limitations (e.g., lack of true understanding, common sense). Overestimating can lead to unrealistic expectations, while underestimating can prevent leveraging its full potential.',
  },
];

const AiInteractionPrinciplesGame = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Current question data
  const currentQuestion = gameQuestions[currentQuestionIndex];

  // Reset states when question changes (or on initial load)
  useEffect(() => {
    setSelectedOptionIndex(null);
    setFeedbackMessage('');
    setIsAnswered(false);
  }, [currentQuestionIndex]);

  const handleOptionClick = (optionIndex) => {
    if (isAnswered) return; // Prevent multiple selections

    setSelectedOptionIndex(optionIndex);
    setIsAnswered(true);

    const isCorrect = currentQuestion.options[optionIndex].isCorrect;
    if (isCorrect) {
      setFeedbackMessage(\`Correct! \${currentQuestion.explanation}\`);
      setScore((prevScore) => prevScore + 1);
    } else {
      setFeedbackMessage(\`Incorrect. \${currentQuestion.explanation}\`);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < gameQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setGameOver(true);
    }
  };

  const handleRestartGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setFeedbackMessage('');
    setIsAnswered(false);
    setScore(0);
    setGameOver(false);
  };

  // Tailwind custom styles based on requirements
  const commonBorderClasses = 'border-[3px] border-black bg-white shadow-[5px_8px_8px_rgba(0,0,0,0.05)]';
  // The 'dash length: 8px' for in-game border is hard to achieve with pure Tailwind classes.
  // Using generic \`border-dashed\` which is visually appropriate.
  const inGameBorderClasses = 'border-[2px] border-dashed';

  // Base classes for buttons
  const btnBaseClasses = 'w-full p-4 text-left rounded-lg transition-all duration-200 ease-in-out font-ibm-plex-sans-regular text-[16px] leading-[26px] tracking-[-0.32px] text-black';
  const btnHoverFocusClasses = 'hover:scale-[1.01] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2'; // Slightly adjusted scale for better feel

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FFF2C2]">
      {' '}
      {/* Background Color 1 */}
      <div className={\`w-full max-w-2xl p-6 md:p-8 rounded-lg \${commonBorderClasses} bg-[#F4F6FA] border-[#B4B9CF]\`}>
        {' '}
        {/* Game Content Background & Border */}
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="https://i.ibb.co/qLgM2cfL/image.png" alt="Logo" className="h-16 w-auto" />
        </div>
        {/* Title */}
        <h1 className="font-['IBM_Plex_Sans'] font-light text-[32px] leading-[44px] tracking-[-0.96px] text-black text-center mb-4">AI Interaction Principles Challenge</h1>
        {/* Description */}
        <p className="font-['IBM_Plex_Sans'] font-normal text-[16px] leading-[26px] tracking-[-0.32px] text-black text-center mb-8">
          An interactive mini-game designed to educate users on effective communication and interaction principles when working with Artificial Intelligence, reinforcing core concepts through
          scenario-based questions.
        </p>
        {gameOver ? (
          <div className={\`p-6 rounded-lg text-center \${inGameBorderClasses} border-[#027BE5] bg-[#ECF5FF]\`}>
            {' '}
            {/* Background Color 2 & Border Color 2 for game over */}
            <h2 className="font-['IBM_Plex_Sans'] font-light text-[24px] leading-[36px] tracking-[-0.72px] text-black mb-4">Game Over!</h2>
            <p className="font-['IBM_Plex_Sans'] font-normal text-[16px] leading-[26px] tracking-[-0.32px] text-black mb-6">
              You scored {score} out of {gameQuestions.length} questions correctly.
            </p>
            <button onClick={handleRestartGame} className={\`py-3 px-6 bg-[#027BE5] text-white rounded-lg font-bold \${btnHoverFocusClasses} focus:ring-[#027BE5]\`} aria-label="Restart Game">
              Restart Game
            </button>
          </div>
        ) : (
          <div className={\`p-6 rounded-lg \${inGameBorderClasses} border-[#FFB800] bg-[#FFF2C2]\`}>
            {' '}
            {/* Background Color 1 & Border Color 1 for game content */}
            {/* Question */}
            <p className="font-['IBM_Plex_Sans'] font-normal text-[16px] leading-[26px] tracking-[-0.32px] text-black mb-6" id="question-text">
              <span className="font-bold">
                Question {currentQuestionIndex + 1}/{gameQuestions.length}:
              </span>{' '}
              {currentQuestion?.question}
            </p>
            {/* Options */}
            <div className="space-y-4 mb-6">
              {currentQuestion?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  disabled={isAnswered}
                  className={\`\${btnBaseClasses}
                             \${isAnswered && (option.isCorrect ? 'bg-green-200 border-2 border-green-600' : '')}
                             \${isAnswered && (!option.isCorrect && selectedOptionIndex === index ? 'bg-[#FFE9E9] border-2 border-[#F4364B]' : 'bg-white border-2 border-transparent')}
                             \${!isAnswered ? \`bg-white border-2 border-[#FFB800] \${btnHoverFocusClasses} hover:bg-[#FFF2C2] focus:ring-[#FFB800]\` : ''}
                             \`}
                  aria-pressed={selectedOptionIndex === index}
                  aria-describedby={isAnswered && selectedOptionIndex === index ? 'feedback-message' : undefined}
                  aria-label={\`Option \${String.fromCharCode(65 + index)}: \${option.text}\`}
                >
                  <span className="font-bold">{String.fromCharCode(65 + index)}) </span>
                  {option.text}
                </button>
              ))}
            </div>
            {/* Feedback Message */}
            {feedbackMessage && (
              <div
                role="status"
                aria-live="polite"
                id="feedback-message"
                className={\`p-4 rounded-lg mb-6 
                            \${currentQuestion.options[selectedOptionIndex]?.isCorrect ? 'bg-green-100 border-2 border-green-500' : 'bg-[#FFE9E9] border-2 border-[#F4364B]'} 
                            text-black font-['IBM_Plex_Sans'] font-normal text-[16px] leading-[26px] tracking-[-0.32px]\`}
              >
                {feedbackMessage}
              </div>
            )}
            {/* Next Question Button */}
            <div className="flex justify-center">
              <button
                onClick={handleNextQuestion}
                disabled={!isAnswered}
                className={\`py-3 px-6 rounded-lg font-bold transition-colors duration-200 ease-in-out
                           \${isAnswered ? 'bg-[#027BE5] text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}
                           \${isAnswered ? \`\${btnHoverFocusClasses} focus:ring-[#027BE5]\` : ''}\`}
                aria-label={currentQuestionIndex < gameQuestions.length - 1 ? 'Next Question' : 'Finish Game'}
              >
                {currentQuestionIndex < gameQuestions.length - 1 ? 'Next Question' : 'Finish Game'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiInteractionPrinciplesGame;`;

export default code;
