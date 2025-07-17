const code2 = `
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 200,
  },
];

const rows = [
  { id: 1, name: 'Alice', age: 25, email: 'alice@example.com' },
  { id: 2, name: 'Bob', age: 30, email: 'bob@example.com' },
  { id: 3, name: 'Charlie', age: 28, email: 'charlie@example.com' },
  { id: 4, name: 'Diana', age: 35, email: 'diana@example.com' },
];

const DataTable = () => {
  return (
    <div>
      <h6>
        User Table
      </h6>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </div>
  );
}
export default DataTable;
`

export default code2;