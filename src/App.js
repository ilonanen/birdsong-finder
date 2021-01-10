import React from 'react'
import { useState } from 'react'
import './App.css';

import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

function App() {

  const [query, setQuery] = useState('')
  const [recordings, setRecordings] = useState([])

  const getRecordings = () => {
    var finalQuery = query.trim()
    finalQuery = query.replace(' ', '+')
    // setUrl('https://www.xeno-canto.org/api/2/recordings?query=' + query)
    var url = 'https://www.xeno-canto.org/api/2/recordings?query=' + finalQuery + '+q:A+year:2021'
    console.log(url)
    fetch(url)
    .then(response => response.json())
    .then(data => setRecordings(data.recordings))
  }

  const inputChanged = (event) => {
    setQuery(event.target.value)
  }

  const columns = [
    {
      field: 'file'
    },
    {
      field: 'date'
    },
    {
      field: 'cnt'
    },
    {
      field: 'type'
    },
    {
      field: 'rmk'
    }

  ]

  return (
    <div className="App">
      <input type = "text" name = "query" value = {query} onChange = {inputChanged} />
      <button onClick = {() => getRecordings()}>Search</button><br />
      <div className = 'ag-theme-alpine'
      style = {{height: 560, width: '40%', margin: 'auto'}}>
        <AgGridReact
          rowData = {recordings}
          columnDefs = {columns}
        >

        </AgGridReact>
      </div>
    </div>
  );
}

export default App;
