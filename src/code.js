const code = `
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';


const InteractiveComponent = () => {
  const [currentDataset, setCurrentDataset] = useState(0);
  
  const datasets = [
    {
      name: "Sales by Region",
      data: [
        { name: 'North America', value: 45, color: '#8884d8' },
        { name: 'Europe', value: 30, color: '#82ca9d' },
        { name: 'Asia', value: 20, color: '#ffc658' },
        { name: 'Others', value: 5, color: '#ff7c7c' }
      ]
    },
    {
      name: "Market Share",
      data: [
        { name: 'Product A', value: 35, color: '#8884d8' },
        { name: 'Product B', value: 25, color: '#82ca9d' },
        { name: 'Product C', value: 20, color: '#ffc658' },
        { name: 'Product D', value: 15, color: '#ff7c7c' },
        { name: 'Others', value: 5, color: '#8dd1e1' }
      ]
    },
    {
      name: "Budget Allocation",
      data: [
        { name: 'Marketing', value: 40, color: '#8884d8' },
        { name: 'Development', value: 25, color: '#82ca9d' },
        { name: 'Operations', value: 20, color: '#ffc658' },
        { name: 'Support', value: 10, color: '#ff7c7c' },
        { name: 'Research', value: 5, color: '#8dd1e1' }
      ]
    }
  ];

  const handleDataChange = () => {
    setCurrentDataset((prev) => (prev + 1) % datasets.length);
  };

  const currentData = datasets[currentDataset];
  const total = currentData.data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {currentData.name}
        </h2>
        <button
          onClick={handleDataChange}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Change Data
        </button>
      </div>
      
      <div className="flex flex-col space-y-4">
        {currentData.data.map((item, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">{item.name}</span>
              <span>{item.value}% ({(item.value / total * 100).toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="h-full rounded-full" 
                style={{
                  width: \`\${item.value / total * 100}%\`,
                  backgroundColor: item.color
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        Dataset {currentDataset + 1} of {datasets.length}
      </div>
    </div>
  );
};

export default InteractiveComponent;
`

export default code;