const code = `import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, ScatterChart, Scatter, RadarChart, Radar, RadialBarChart, RadialBar, ComposedChart, Treemap, Funnel, FunnelChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const RechartsShowcase = () => {
  const [activeChart, setActiveChart] = useState('line');
  
  // Sample data sets
  const lineData = [
    { name: 'Jan', value: 400 }, { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 }, { name: 'Apr', value: 800 },
    { name: 'May', value: 500 }, { name: 'Jun', value: 900 }
  ];
  
  const barData = [
    { name: 'Q1', value: 2400 }, { name: 'Q2', value: 1398 },
    { name: 'Q3', value: 9800 }, { name: 'Q4', value: 3908 }
  ];
  
  const pieData = [
    { name: 'Group A', value: 400, color: '#0088FE' },
    { name: 'Group B', value: 300, color: '#00C49F' },
    { name: 'Group C', value: 300, color: '#FFBB28' },
    { name: 'Group D', value: 200, color: '#FF8042' }
  ];
  
  const areaData = [
    { name: 'Jan', value: 400, value2: 240 },
    { name: 'Feb', value: 300, value2: 139 },
    { name: 'Mar', value: 600, value2: 980 },
    { name: 'Apr', value: 800, value2: 390 },
    { name: 'May', value: 500, value2: 480 },
    { name: 'Jun', value: 900, value2: 380 }
  ];
  
  const scatterData = [
    { x: 100, y: 200, z: 200 }, { x: 120, y: 100, z: 260 },
    { x: 170, y: 300, z: 400 }, { x: 140, y: 250, z: 280 },
    { x: 150, y: 400, z: 500 }, { x: 110, y: 280, z: 200 }
  ];
  
  const radarData = [
    { subject: 'Math', A: 120, B: 110, fullMark: 150 },
    { subject: 'Chinese', A: 98, B: 130, fullMark: 150 },
    { subject: 'English', A: 86, B: 130, fullMark: 150 },
    { subject: 'Geography', A: 99, B: 100, fullMark: 150 },
    { subject: 'Physics', A: 85, B: 90, fullMark: 150 },
    { subject: 'History', A: 65, B: 85, fullMark: 150 }
  ];
  
  const radialBarData = [
    { name: '18-24', uv: 31.47, fill: '#8884d8' },
    { name: '25-29', uv: 26.69, fill: '#83a6ed' },
    { name: '30-34', uv: 15.69, fill: '#8dd1e1' },
    { name: '35-39', uv: 8.22, fill: '#82ca9d' },
    { name: '40-49', uv: 8.63, fill: '#a4de6c' }
  ];
  
  const composedData = [
    { name: 'Page A', uv: 590, pv: 800, amt: 1400 },
    { name: 'Page B', uv: 868, pv: 967, amt: 1506 },
    { name: 'Page C', uv: 1397, pv: 1098, amt: 989 },
    { name: 'Page D', uv: 1480, pv: 1200, amt: 1228 },
    { name: 'Page E', uv: 1520, pv: 1108, amt: 1100 },
    { name: 'Page F', uv: 1400, pv: 680, amt: 1700 }
  ];
  
  const treemapData = [
    { name: 'axis', size: 2200 },
    { name: 'controls', size: 2000 },
    { name: 'data', size: 1700 },
    { name: 'layouts', size: 1500 },
    { name: 'scales', size: 1200 },
    { name: 'display', size: 1000 },
    { name: 'animation', size: 800 }
  ];
  
  const funnelData = [
    { value: 100, name: 'Visitors', fill: '#8884d8' },
    { value: 80, name: 'Leads', fill: '#83a6ed' },
    { value: 50, name: 'Prospects', fill: '#8dd1e1' },
    { value: 30, name: 'Opportunities', fill: '#82ca9d' },
    { value: 20, name: 'Closed Deals', fill: '#a4de6c' }
  ];

  // Helper function to render the active chart
  const renderChart = () => {
    switch (activeChart) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => \`\${name} \${(percent * 100).toFixed(0)}%\`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={\`cell-\${index}\`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={areaData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="value" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="value2" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="x-axis" />
              <YAxis type="number" dataKey="y" name="y-axis" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Values" data={scatterData} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart outerRadius={90} width={730} height={250} data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 150]} />
              <Radar name="Student A" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Radar name="Student B" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        );
      
      case 'radialBar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="10%" 
              outerRadius="80%" 
              barSize={10} 
              data={radialBarData}
            >
              <RadialBar
                minAngle={15}
                background
                clockWise
                dataKey="uv"
              />
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        );
      
      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={composedData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
              <Bar dataKey="pv" barSize={20} fill="#413ea0" />
              <Line type="monotone" dataKey="uv" stroke="#ff7300" />
            </ComposedChart>
          </ResponsiveContainer>
        );
      
      case 'treemap':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <Treemap
              data={treemapData}
              dataKey="size"
              aspectRatio={4/3}
              stroke="#fff"
              fill="#8884d8"
            >
              {treemapData.map((entry, index) => (
                <Cell key={\`cell-\${index}\`} fill={\`hsl(\${index * 40}, 70%, 70%)\`} />
              ))}
            </Treemap>
          </ResponsiveContainer>
        );
        
      case 'funnel':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <FunnelChart>
              <Tooltip />
              <Funnel
                dataKey="value"
                data={funnelData}
                isAnimationActive
              >
                {funnelData.map((entry, index) => (
                  <Cell key={\`cell-\${index}\`} fill={entry.fill} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div>Select a chart type</div>;
    }
  };

  const chartTypes = [
    'line', 'bar', 'pie', 'area', 'scatter', 
    'radar', 'radialBar', 'composed', 'treemap', 'funnel'
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Recharts Showcase</h1>
      
      <div className="mb-6">
        <h2 className="text-xl mb-3">Select Chart Type:</h2>
        <div className="flex flex-wrap gap-2">
          {chartTypes.map(type => (
            <button
              key={type}
              onClick={() => setActiveChart(type)}
              className={\`px-3 py-2 rounded text-sm \${
                activeChart === type 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }\`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mb-3">
          {activeChart.charAt(0).toUpperCase() + activeChart.slice(1)} Chart
        </h3>
        {renderChart()}
      </div>
      
      <div className="text-sm text-gray-600 mt-4">
        <p>This example showcases various chart types available in the Recharts library.</p>
        <p>Click on the buttons above to explore different visualizations.</p>
      </div>
    </div>
  );
};

export default RechartsShowcase;`;

export default code;
