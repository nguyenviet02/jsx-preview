# JSX Preview System

This project demonstrates a system for dynamically rendering JSX code at runtime using Babel standalone. It's designed to preview AI-generated React components without requiring a rebuild.

## Features

- Loads React, ReactDOM, and Babel from CDN
- Dynamically compiles and executes JSX code
- Handles import statement removal
- Provides error display for invalid JSX
- Includes a live editor for testing

## How It Works

1. **Load Core Libraries from CDN**: React, ReactDOM, and Babel are loaded from CDN to avoid bundling
2. **Process JSX Code**: Import statements are removed from the JSX code
3. **Transform with Babel**: The JSX is compiled to plain JavaScript using Babel.transform
4. **Execute the Code**: The transformed code is executed to obtain a React component
5. **Render the Component**: The component is rendered in the DOM

## Usage

### Project Setup

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### Standalone Usage

You can also use the standalone example by opening `standalone-example.html` directly in a browser. This file contains everything needed to render JSX code dynamically.

### Using the JsxPreview Component

```jsx
import React, { useState } from 'react';
import JsxPreview from './JsxPreview';

const MyApp = () => {
  const [jsxCode, setJsxCode] = useState(`
    // Your JSX code here
    const Component = () => {
      return <div>Hello, dynamic world!</div>;
    };
    
    export default Component;
  `);
  
  return (
    <div>
      <textarea
        value={jsxCode}
        onChange={(e) => setJsxCode(e.target.value)}
      />
      <JsxPreview jsxCode={jsxCode} />
    </div>
  );
};
```

## Security Considerations

This system uses `new Function()` to execute code, which should be used with caution. Only use this with trusted code sources or in a controlled environment.

## License

MIT
