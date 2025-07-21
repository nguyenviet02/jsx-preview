import React, { useState } from 'react';
import JsxPreview from './JsxPreview';
import { useEffect } from 'react';

const App = () => {
  const expectedOrigin = 'https://jsx-preview.vercel.app/';

  const [selectedCode, setSelectedCode] = useState('');

  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.origin !== expectedOrigin) return;
      console.log(event.data);
      setSelectedCode(event.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <JsxPreview jsxCode={selectedCode} />
    </div>
  );
};

export default App;

