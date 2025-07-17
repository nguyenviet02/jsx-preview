import React from 'react';
import JsxPreview from './JsxPreview';
import code from './code3';

const JsxPreviewDemo = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">JSX Preview Demo</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Interactive Component</h2>
        <JsxPreview jsxCode={code} />
      </div>
    </div>
  );
};

export default JsxPreviewDemo; 