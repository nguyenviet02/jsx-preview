import React, { useState } from 'react';
import JsxPreview from './JsxPreview';
import { useEffect } from 'react';

const App = () => {
  const expectedOrigin = 'https://jsx-preview.vercel.app';

  const [selectedCode, setSelectedCode] = useState('');

  useEffect(() => {
    console.log('Get message !')
    window.addEventListener('message', (event) => {
      console.log(event)
      if (event.origin !== expectedOrigin) return;
      console.log('☠️ ~ window.addEventListener ~ event:', event)
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

