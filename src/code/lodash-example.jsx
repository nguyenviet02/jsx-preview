const code = `import React, { useState } from 'react';
import _ from 'lodash';

const LodashExample = () => {
  const [inputArray, setInputArray] = useState([1, 2, 3, 4, 5, 2, 3, 1]);
  const [inputObject, setInputObject] = useState({
    name: 'John',
    age: 30,
    job: 'Developer',
    skills: ['JavaScript', 'React', 'Node.js'],
    address: {
      city: 'San Francisco',
      state: 'CA',
    },
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [debounceMessage, setDebounceMessage] = useState('Type to see debounce in action');

  // Example data for demonstrations
  const users = [
    { id: 1, name: 'Alice', age: 28, active: true },
    { id: 2, name: 'Bob', age: 32, active: false },
    { id: 3, name: 'Charlie', age: 24, active: true },
    { id: 4, name: 'Diana', age: 35, active: true },
    { id: 5, name: 'Edward', age: 19, active: false },
  ];

  // Simple examples of various lodash methods
  const uniqueArray = _.uniq(inputArray);
  const chunkedArray = _.chunk(inputArray, 3);
  const shuffledArray = _.shuffle([...inputArray]);
  const sortedUsers = _.sortBy(users, ['age']);
  const groupedUsers = _.groupBy(users, 'active');
  const filteredUsers = _.filter(users, { active: true });
  const foundUser = _.find(users, { name: 'Charlie' });
  const transformedUsers = _.map(users, user => ({
    ...user,
    nameWithAge: user.name + ' (' + user.age + ')',
  }));
  const usersSum = _.sumBy(users, 'age');
  const mergedObject = _.merge({}, inputObject, { 
    skills: ['TypeScript'], 
    address: { zipcode: '94105' } 
  });

  // Debounce function for search input
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearchDebounced = _.debounce((term) => {
    setDebounceMessage('Debounced search for: ' + term);
  }, 500);

  const handleSearchInput = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    handleSearchDebounced(term);
  };

  // Function to format data for display
  const formatData = (data) => {
    if (_.isArray(data)) {
      return JSON.stringify(data);
    } else if (_.isObject(data)) {
      return JSON.stringify(data, null, 2);
    }
    return String(data);
  };

  // Render examples in cards
  const renderCard = (title, data, description) => (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">{formatData(data)}</pre>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Lodash Examples</h1>
      
      {/* Input array manipulation */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Array Manipulation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderCard(
            "_.uniq(array)",
            uniqueArray,
            "Creates a duplicate-free version of an array"
          )}
          {renderCard(
            "_.chunk(array, size)",
            chunkedArray,
            "Creates an array of elements split into groups of specified size"
          )}
          {renderCard(
            "_.shuffle(array)",
            shuffledArray,
            "Creates a shuffled version of the collection"
          )}
        </div>
      </div>
      
      {/* Collection manipulation */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Collection Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderCard(
            "_.sortBy(collection, [iteratees])",
            sortedUsers,
            "Creates an array of elements sorted by specified criteria"
          )}
          {renderCard(
            "_.groupBy(collection, iteratee)",
            groupedUsers,
            "Creates an object of elements grouped by the result of iteratee"
          )}
          {renderCard(
            "_.filter(collection, predicate)",
            filteredUsers,
            "Returns array of elements that pass predicate test"
          )}
          {renderCard(
            "_.find(collection, predicate)",
            foundUser,
            "Returns first element that satisfies predicate"
          )}
          {renderCard(
            "_.map(collection, iteratee)",
            transformedUsers,
            "Creates an array of values by iterating over collection"
          )}
          {renderCard(
            "_.sumBy(collection, iteratee)",
            usersSum,
            "Computes sum of elements by iteratee"
          )}
        </div>
      </div>
      
      {/* Object manipulation */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Object Manipulation</h2>
        <div className="grid grid-cols-1 gap-4">
          {renderCard(
            "_.merge(object, [sources])",
            mergedObject,
            "Recursively merges objects, unlike Object.assign which only handles first-level properties"
          )}
        </div>
      </div>
      
      {/* Interactive example */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Interactive Debounce Example</h2>
        <div className="p-4 bg-white rounded-lg shadow">
          <p className="mb-2 text-sm text-gray-600">
            Type in the input to see the debounce effect (waits 500ms after you stop typing).
          </p>
          <input 
            type="text"
            value={searchTerm}
            onChange={handleSearchInput}
            className="w-full p-2 border rounded mb-4"
            placeholder="Type to search..."
          />
          <div className="p-2 bg-gray-100 rounded">
            <p>{debounceMessage}</p>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-600">
        <p className="mb-2">
          Lodash provides utility functions for common programming tasks, making 
          JavaScript easier by taking the hassle out of working with arrays, 
          numbers, objects, strings, etc.
        </p>
        <p>
          This example demonstrates just a small subset of the many utility 
          functions that Lodash provides.
        </p>
      </div>
    </div>
  );
};

export default LodashExample;`;

export default code; 