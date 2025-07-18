import React, { useState } from 'react';
import JsxPreview from './JsxPreview';
// Import default code from population-chart-main
import defaultCode from './code/population-chart-main';

// Import all code files
import aiInteractionPrinciplesGame from './code/ai-interaction-principles-game';
import cybersecurityDefenderGame from './code/cybersecurity-defender-game';
import cybersecurityTrueFalseGame from './code/cybersecurity-true-false-game';
import passwordStrengthCheckerMain from './code/password-strength-checker-main';
import quizBlockchainCrypto from './code/quiz-blockchain-crypto';
import quizBlockchainFundamentals from './code/quiz-blockchain-fundamentals';

const JsxPreviewDemo = () => {
  // State for the selected code
  const [selectedCode, setSelectedCode] = useState(defaultCode);
  
  // Map of component names to their code
  const codeMap = {
    'population-chart-main': defaultCode,
    'ai-interaction-principles-game': aiInteractionPrinciplesGame,
    'cybersecurity-defender-game': cybersecurityDefenderGame,
    'cybersecurity-true-false-game': cybersecurityTrueFalseGame,
    'password-strength-checker-main': passwordStrengthCheckerMain,
    'quiz-blockchain-crypto': quizBlockchainCrypto,
    'quiz-blockchain-fundamentals': quizBlockchainFundamentals,
  };
  
  // Handle selection change
  const handleSelectChange = (e) => {
    const selected = e.target.value;
    setSelectedCode(codeMap[selected]);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">JSX Preview Demo</h1>
      
      <div className="mb-4">
        <label htmlFor="component-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select Component:
        </label>
        <select
          id="component-select"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={handleSelectChange}
          defaultValue="population-chart-main"
        >
          <option value="population-chart-main">Population Chart</option>
          <option value="ai-interaction-principles-game">AI Interaction Principles Game</option>
          <option value="cybersecurity-defender-game">Cybersecurity Defender Game</option>
          <option value="cybersecurity-true-false-game">Cybersecurity True/False Game</option>
          <option value="password-strength-checker-main">Password Strength Checker</option>
          <option value="quiz-blockchain-crypto">Quiz: Blockchain & Crypto</option>
          <option value="quiz-blockchain-fundamentals">Quiz: Blockchain Fundamentals</option>
        </select>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Interactive Component</h2>
        <JsxPreview jsxCode={selectedCode} />
      </div>
    </div>
  );
};

export default JsxPreviewDemo;
