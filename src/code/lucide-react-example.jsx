const code = `import React from 'react';
import { Settings, User, Bell, Menu, X, ArrowRightToLine } from 'lucide-react';

const LucideReactExample = () => {

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Lucide React Icons Example</h2>
      
      <div className="flex flex-wrap gap-8 mb-8">
        <div className="flex flex-col items-center">
          <Settings className="h-8 w-8 text-blue-500" />
          <span className="mt-2 text-sm">Settings</span>
        </div>
        
        <div className="flex flex-col items-center">
          <User className="h-8 w-8 text-green-500" />
          <span className="mt-2 text-sm">User</span>
        </div>
        
        <div className="flex flex-col items-center">
          <Bell className="h-8 w-8 text-red-500" />
          <span className="mt-2 text-sm">Notifications</span>
        </div>

        <div className="flex flex-col items-center">
          <ArrowRightToLine className="h-8 w-8 text-purple-500" />
          <span className="mt-2 text-sm">Arrow Right to Line</span>
        </div>
      </div>

      <div className="flex space-x-4 mb-8">
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">
          <Menu className="h-5 w-5" /> Menu
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-red-100 rounded-md hover:bg-red-200">
          <X className="h-5 w-5" /> Close
        </button>
      </div>

      <p className="text-sm text-gray-600">
        Note: This is a demonstration of how to use Lucide React icons. 
        In a real application, you would import these icons directly from the 'lucide-react' package.
      </p>
    </div>
  );
};

export default LucideReactExample;`;

export default code;
