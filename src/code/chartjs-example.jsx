const code = `import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

const ChartJsExample = () => {
  // Create refs for each chart canvas
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  
  // Chart instances for cleanup
  const chartInstances = useRef([]);

  useEffect(() => {
    // Cleanup function to destroy previous chart instances
    const cleanup = () => {
      chartInstances.current.forEach(chart => chart.destroy());
      chartInstances.current = [];
    };

    // Clean up existing charts before creating new ones
    cleanup();
    
    // Create Line Chart
    if (lineChartRef.current) {
      const lineCtx = lineChartRef.current.getContext('2d');
      const lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [
            {
              label: 'Monthly Sales',
              data: [65, 59, 80, 81, 56, 55],
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
            {
              label: 'Monthly Expenses',
              data: [28, 48, 40, 19, 86, 27],
              fill: false,
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Monthly Performance',
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Value ($)',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Month',
              },
            },
          },
        },
      });
      
      chartInstances.current.push(lineChart);
    }

    // Create Bar Chart
    if (barChartRef.current) {
      const barCtx = barChartRef.current.getContext('2d');
      const barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [
            {
              label: 'Item Popularity',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Item Popularity by Color',
            },
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
      
      chartInstances.current.push(barChart);
    }

    // Create Doughnut Chart
    if (doughnutChartRef.current) {
      const doughnutCtx = doughnutChartRef.current.getContext('2d');
      const doughnutChart = new Chart(doughnutCtx, {
        type: 'doughnut',
        data: {
          labels: ['Desktop', 'Mobile', 'Tablet'],
          datasets: [
            {
              label: 'Device Usage',
              data: [60, 30, 10],
              backgroundColor: [
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 99, 132, 0.8)',
                'rgba(255, 206, 86, 0.8)',
              ],
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'User Device Distribution',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return \`\${label}: \${percentage}% (\${value})\`;
                }
              }
            }
          },
        },
      });
      
      chartInstances.current.push(doughnutChart);
    }

    // Cleanup on unmount
    return cleanup;
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Chart.js Examples</h1>
      
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Line Chart</h2>
        <p className="text-gray-600 mb-4">Shows trends over a period of time</p>
        <div className="bg-white p-4 rounded border border-gray-200">
          <canvas ref={lineChartRef} height="200"></canvas>
        </div>
      </div>
      
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Bar Chart</h2>
        <p className="text-gray-600 mb-4">Compares different categories of data</p>
        <div className="bg-white p-4 rounded border border-gray-200">
          <canvas ref={barChartRef} height="200"></canvas>
        </div>
      </div>
      
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Doughnut Chart</h2>
        <p className="text-gray-600 mb-4">Shows proportions and percentages</p>
        <div className="bg-white p-4 rounded border border-gray-200">
          <canvas ref={doughnutChartRef} height="200"></canvas>
        </div>
      </div>
      
      <div className="text-sm text-gray-500">
        <p>
          Note: This example demonstrates how to use Chart.js with React through the useRef and 
          useEffect hooks to create various types of charts. In a real application, you might 
          consider using a React wrapper library like react-chartjs-2.
        </p>
      </div>
    </div>
  );
};

export default ChartJsExample;`;

export default code;