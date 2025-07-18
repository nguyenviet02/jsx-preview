const code = `import React, { useRef, useEffect } from 'react';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, BarController } from 'chart.js'; // Import BarController
import _ from 'lodash';

// Register Chart.js components, including BarController
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, BarController); // Register BarController

// Define the data for the chart
const chartData = [
  {
    text: "India",
    category: "Population",
    metadata: {
      value: _.random(1000, 999999999),
      hint: "Most populous country as of 2024."
    }
  },
  {
    text: "China",
    category: "Population",
    metadata: {
      value: 1425671352,
      hint: "Second most populous country."
    }
  },
  {
    text: "United States",
    category: "Population",
    metadata: {
      value: 341814420,
      hint: "Third most populous country."
    }
  },
  {
    text: "Indonesia",
    category: "Population",
    metadata: {
      value: 279476348,
      hint: "Largest island country by population."
    }
  },
  {
    text: "Pakistan",
    category: "Population",
    metadata: {
      value: 243958763,
      hint: "Fifth most populous country."
    }
  },
  {
    text: "Nigeria",
    category: "Population",
    metadata: {
      value: 229152217,
      hint: "Most populous country in Africa."
    }
  },
  {
    text: "Brazil",
    category: "Population",
    metadata: {
      value: 216422446,
      hint: "Most populous country in South America."
    }
  },
  {
    text: "Bangladesh",
    category: "Population",
    metadata: {
      value: 174701211,
      hint: "One of the most densely populated countries."
    }
  },
  {
    text: "Russia",
    category: "Population",
    metadata: {
      value: 144444359,
      hint: "Largest country by land area."
    }
  },
  {
    text: "Mexico",
    category: "Population",
    metadata: {
      value: 129388467,
      hint: "Most populous Spanish-speaking country."
    }
  }
];

// Helper function to format numbers with commas for readability
const formatPopulation = (num) => {
  return num.toString();
};

const PopulationChartMain = () => {
  const chartRef = useRef(null); // Ref for the canvas element
  const chartInstance = useRef(null); // Ref for the Chart.js instance

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart instance if it exists to prevent memory leaks/duplicates
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');

      const labels = chartData.map(item => item.text);
      const dataValues = chartData.map(item => item.metadata.value);

      // Create new Chart.js instance
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Population',
            data: dataValues,
            backgroundColor: '#027BE5', // Border Color 2 from spec
            borderColor: '#027BE5',
            borderWidth: 1,
            borderRadius: 4, // Slightly rounded bars for aesthetics
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Allows chart to fill its container
          indexAxis: 'y', // Makes the bar chart horizontal
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Population',
                font: {
                  family: 'IBM Plex Sans',
                  size: 14,
                  weight: 'normal'
                },
                color: '#000000'
              },
              ticks: {
                callback: function (value) {
                  return formatPopulation(value); // Format x-axis labels
                },
                font: {
                  family: 'IBM Plex Sans',
                  size: 12
                },
                color: '#000000'
              },
              grid: {
                color: '#E6E8F0', // Shadow Color for grid lines
              }
            },
            y: {
              title: {
                display: false, // Hide y-axis title as labels are self-explanatory
              },
              ticks: {
                font: {
                  family: 'IBM Plex Sans',
                  size: 12
                },
                color: '#000000'
              },
              grid: {
                display: false // Hide y-axis grid lines for cleaner look
              }
            }
          },
          plugins: {
            legend: {
              display: false // No need for legend for a single dataset
            },
            tooltip: {
              // Custom tooltip callbacks for displaying exact population and hint on hover
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.x !== null) {
                    label += formatPopulation(context.parsed.x); // Display formatted population
                  }
                  return label;
                },
                title: function (context) {
                  return context[0].label; // Show country name as tooltip title
                },
                afterBody: function (context) {
                  const dataIndex = context[0].dataIndex;
                  return chartData[dataIndex].metadata.hint; // Add hint below population
                }
              },
              backgroundColor: '#000000', // Dark background for tooltip for contrast
              titleFont: {
                family: 'IBM Plex Sans',
                size: 14,
                weight: 'bold'
              },
              bodyFont: {
                family: 'IBM Plex Sans',
                size: 12
              },
              padding: 10,
              displayColors: false, // Don't show color box in tooltip
            }
          }
        }
      });
    }

    // Cleanup function: Destroy chart instance when component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []); // Empty dependency array ensures effect runs only once on mount

  return (
    <div
      className="
        min-h-screen flex flex-col items-center justify-center p-4
        bg-[#FFF2C2]
        font-['IBM_Plex_Sans']
      "
      aria-label="Population Chart UI Component"
    >

      {/* Main content container with common border and shadow */}
      <div
        className="
          w-full max-w-4xl p-6 md:p-8 lg:p-10 rounded-lg
          border-[3px] border-[#000000] bg-[#FFFFFF] shadow-[0_5px_8px_8px_rgba(0,0,0,0.05)]
          flex flex-col items-center gap-6
        "
      >
        {/* Heading component */}
        <h1
          id="chart-title"
          className="
            text-[#000000] font-['IBM_Plex_Sans'] font-light text-[32px] leading-[44px] tracking-[-0.96px] text-center
            mb-2
          "
          aria-level="1"
        >
          Top 10 Countries by Population (2024)
        </h1>

        {/* Sub-heading/Description style text */}
        <p
          className="
            text-[#000000] font-['IBM_Plex_Sans'] font-light text-[24px] leading-[36px] tracking-[-0.72px] text-center
            mb-4
          "
        >
          A static UI component displaying a bar chart of the top 10 countries by population for the year 2024.
        </p>

        {/* Chart container with in-game border and background */}
        <div
          id="chart-container"
          className="
            relative w-full h-[500px] md:h-[600px] lg:h-[700px] p-4 rounded-lg
            bg-[#F4F6FA] border-[2px] border-dashed border-[#B4B9CF]
          "
          role="img"
          aria-label="Bar chart showing population of top 10 countries by descending order. Hover over bars for exact population and additional information."
        >
          {/* Canvas element for Chart.js. aria-hidden because Chart.js handles its own accessibility for screen readers. */}
          <canvas ref={chartRef} aria-hidden="true"></canvas>
        </div>
      </div>

      {/* Logo at the bottom for additional branding */}
      <div className="mt-8">
        <img src="https://i.ibb.co/qLgM2cfL/image.png" alt="Company Logo" className="w-12 h-12 opacity-50" />
      </div>
    </div>
  );
};

export default PopulationChartMain;`;

export default code;
