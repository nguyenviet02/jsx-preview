import React, { useState } from 'react';
import JsxPreview from './JsxPreview';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
// Import default code from population-chart-main
import PopulationChartMain from './code/population-chart-main';
import DefaultCode from './code/default-code';

// Import all code files
import aiInteractionPrinciplesGame from './code/ai-interaction-principles-game';
import cybersecurityDefenderGame from './code/cybersecurity-defender-game';
import cybersecurityTrueFalseGame from './code/cybersecurity-true-false-game';
import passwordStrengthCheckerMain from './code/password-strength-checker-main';
import quizBlockchainCrypto from './code/quiz-blockchain-crypto';
import quizBlockchainFundamentals from './code/quiz-blockchain-fundamentals';

const JsxPreviewDemo = () => {
  // State for the selected code option
  const [selectedOption, setSelectedOption] = useState('population-chart-main');
  // State for the selected code content
  const [selectedCode, setSelectedCode] = useState(PopulationChartMain);
  // State for the editor code when using custom code
  const [editorCode, setEditorCode] = useState(DefaultCode);

  // Map of component names to their code
  const codeMap = {
    'population-chart-main': PopulationChartMain,
    'ai-interaction-principles-game': aiInteractionPrinciplesGame,
    'cybersecurity-defender-game': cybersecurityDefenderGame,
    'cybersecurity-true-false-game': cybersecurityTrueFalseGame,
    'password-strength-checker-main': passwordStrengthCheckerMain,
    'quiz-blockchain-crypto': quizBlockchainCrypto,
    'quiz-blockchain-fundamentals': quizBlockchainFundamentals,
    'custom-code': editorCode,
  };

  // Handle selection change
  const handleSelectChange = (e) => {
    const selected = e.target.value;
    setSelectedOption(selected);
    setSelectedCode(codeMap[selected]);
  };

  // Handle editor code changes
  const handleEditorChange = (value) => {
    setEditorCode(value);
    if (selectedOption === 'custom-code') {
      setSelectedCode(value);
    }
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
          value={selectedOption}
        >
          <option value="population-chart-main">Population Chart</option>
          <option value="ai-interaction-principles-game">AI Interaction Principles Game</option>
          <option value="cybersecurity-defender-game">Cybersecurity Defender Game</option>
          <option value="cybersecurity-true-false-game">Cybersecurity True/False Game</option>
          <option value="password-strength-checker-main">Password Strength Checker</option>
          <option value="quiz-blockchain-crypto">Quiz: Blockchain & Crypto</option>
          <option value="quiz-blockchain-fundamentals">Quiz: Blockchain Fundamentals</option>
          <option value="custom-code">Custom Code</option>
        </select>
      </div>

      {selectedOption === 'custom-code' ? (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md shadow-sm h-fit">
            <h2 className="text-xl font-semibold p-2 pb-0 h-fit">Code Editor</h2>
            <p className="text-sm text-gray-500 p-2">Supported libraries: react, tailwindcss, framer-motion, clsx, lodash, recharts, chart.js, axios</p>
            <CodeMirror
              value={editorCode}
              height="500px"
              extensions={[javascript({ jsx: true })]}
              onChange={handleEditorChange}
              theme="dark"
              options={{
                tabSize: 2,
                lineNumbers: true,
                lineWrapping: true,
              }}
            />
          </div>
          <JsxPreview jsxCode={selectedCode} />
        </div>
      ) : (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Interactive Component</h2>
          <JsxPreview jsxCode={selectedCode} />
        </div>
      )}
    </div>
  );
};

export default JsxPreviewDemo;
