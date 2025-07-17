const code3 = `
import React, { useState, useEffect } from 'react';
import {toLower, includes, orderBy, groupBy, mapValues, maxBy, countBy, filter, meanBy, round, debounce} from 'lodash';

// Mock API data since we can't use external APIs
const mockApiData = [
  { id: 1, name: 'John Doe', age: 28, department: 'Engineering', salary: 75000, city: 'New York' },
  { id: 2, name: 'Jane Smith', age: 34, department: 'Marketing', salary: 65000, city: 'Los Angeles' },
  { id: 3, name: 'Bob Johnson', age: 45, department: 'Engineering', salary: 95000, city: 'San Francisco' },
  { id: 4, name: 'Alice Brown', age: 29, department: 'Sales', salary: 55000, city: 'Chicago' },
  { id: 5, name: 'Charlie Wilson', age: 38, department: 'Marketing', salary: 70000, city: 'New York' },
  { id: 6, name: 'Diana Davis', age: 31, department: 'Engineering', salary: 85000, city: 'Seattle' },
  { id: 7, name: 'Eve Miller', age: 27, department: 'Sales', salary: 52000, city: 'Boston' },
  { id: 8, name: 'Frank Garcia', age: 42, department: 'Engineering', salary: 90000, city: 'Austin' }
];

// Mock axios-like function
const mockAxios = {
  get: (url) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: mockApiData });
      }, 500);
    });
  }
};

const AxiosLodashDemo = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch data (simulating axios.get)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await mockAxios.get('/api/employees');
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort data using Lodash
  useEffect(() => {
    let result = data;

    // Filter using Lodash
    if (searchTerm) {
      result = _.filter(data, (item) => 
        _.includes(toLower(item.name), toLower(searchTerm)) ||
        _.includes(toLower(item.department), toLower(searchTerm)) ||
        _.includes(toLower(item.city), toLower(searchTerm))
      );
    }

    // Sort using Lodash
    result = _.orderBy(result, [sortBy], [sortOrder]);
    
    setFilteredData(result);
  }, [data, searchTerm, sortBy, sortOrder]);

  // Group data by department using Lodash
  const groupedByDepartment = _.groupBy(filteredData, 'department');

  // Calculate statistics using Lodash
  const stats = {
    totalEmployees: filteredData.length,
    averageAge: _.round(_.meanBy(filteredData, 'age'), 1),
    averageSalary: _.round(_.meanBy(filteredData, 'salary')),
    departmentCounts: _.mapValues(groupedByDepartment, 'length'),
    topEarner: _.maxBy(filteredData, 'salary'),
    cityDistribution: _.countBy(filteredData, 'city')
  };

  // Debounced search using Lodash
  const debouncedSearch = _.debounce((term) => {
    setSearchTerm(term);
  }, 300);

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Employee Data Manager
        </h1>
        <p className="text-gray-600 mb-6">
          Demonstrating Axios for API calls and Lodash for data manipulation
        </p>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search employees..."
            onChange={handleSearchChange}
            className="flex-1 min-w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="age">Sort by Age</option>
            <option value="salary">Sort by Salary</option>
            <option value="department">Sort by Department</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Total Employees</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.totalEmployees}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">Average Age</h3>
            <p className="text-2xl font-bold text-green-600">{stats.averageAge}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800">Average Salary</h3>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Department Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {_.map(stats.departmentCounts, (count, dept) => (
              <div key={dept} className="bg-gray-50 p-3 rounded-lg">
                <span className="font-medium">{dept}</span>
                <span className="ml-2 text-sm text-gray-600">({count} employees)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Earner */}
        {stats.topEarner && (
          <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800">Top Earner</h3>
            <p className="text-yellow-700">
            </p>
          </div>
        )}

        {/* Employee List */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Employee List ({filteredData.length} employees)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Age</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Department</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Salary</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">City</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-medium">{employee.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{employee.age}</td>
                    <td className="border border-gray-300 px-4 py-2">{employee.department}</td>
                    <td className="border border-gray-300 px-4 py-2">{employee.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* City Distribution */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">City Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {_.map(stats.cityDistribution, (count, city) => (
              <div key={city} className="text-sm bg-gray-100 p-2 rounded">
                {city}: {count}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default AxiosLodashDemo;
`

export default code3; 