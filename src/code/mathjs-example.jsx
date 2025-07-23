const code = `import React, { useState } from 'react';

import {
  atan2, chain, derivative, e, evaluate, log, pi, pow, round, sqrt
} from 'mathjs'

const MathJsExample = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [operation, setOperation] = useState('evaluate');
  
  const calculateResult = () => {
    try {
      switch(operation) {
        case 'evaluate':
          setResult(evaluate(expression));
          break;
        case 'derivative':
          setResult(derivative(expression, 'x').toString());
          break;
        case 'sqrt':
          setResult(sqrt(evaluate(expression)));
          break;
        case 'log':
          setResult(log(evaluate(expression)));
          break;
        case 'pow':
          const [base, exponent] = expression.split(',').map(val => evaluate(val.trim()));
          setResult(pow(base, exponent));
          break;
        default:
          setResult(evaluate(expression));
      }
    } catch (error) {
      setResult('Error: ' + error.message);
    }
  };

  const examples = {
    evaluate: '2 * (3 + 4)',
    derivative: 'x^2 + 2*x',
    sqrt: '16',
    log: '10',
    pow: '2, 3'
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Math.js Calculator</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Select Operation:</label>
        <select 
          className="w-full p-2 border rounded"
          value={operation}
          onChange={(e) => {
            setOperation(e.target.value);
            setExpression(examples[e.target.value]);
          }}
        >
          <option value="evaluate">Evaluate Expression</option>
          <option value="derivative">Calculate Derivative</option>
          <option value="sqrt">Square Root</option>
          <option value="log">Natural Logarithm</option>
          <option value="pow">Power (base, exponent)</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Enter Expression:</label>
        <input 
          type="text" 
          className="w-full p-2 border rounded"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder={examples[operation]}
        />
        <p className="text-sm text-gray-500 mt-1">
          {operation === 'evaluate' && 'Example: 2 * (3 + 4)'}
          {operation === 'derivative' && 'Example: x^2 + 2*x (with respect to x)'}
          {operation === 'sqrt' && 'Example: 16'}
          {operation === 'log' && 'Example: 10 (base e natural logarithm)'}
          {operation === 'pow' && 'Example: 2, 3 (2 raised to power 3)'}
        </p>
      </div>

      <button 
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={calculateResult}
      >
        Calculate
      </button>

      <div className="mt-4">
        <label className="block text-gray-700 mb-2">Result:</label>
        <div className="p-2 bg-gray-100 border rounded">
          {result !== '' ? result : 'Result will appear here'}
        </div>
      </div>

      <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded">
        <h3 className="text-lg font-semibold mb-2">Available Constants</h3>
        <ul className="grid grid-cols-2 gap-2">
          <li><strong>π (pi):</strong> {pi}</li>
          <li><strong>e:</strong> {e}</li>
        </ul>
      </div>
    </div>
  );
};

export default MathJsExample;`;

export default code;
