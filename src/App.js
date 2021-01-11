import React from 'react'
import { useState } from 'react'

import ReactAudioPlayer from 'react-audio-player'

import './App.css';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { googleTranslate } from './utils/googleTranslate'

import { Button, TextField, Tooltip, Popper } from '@material-ui/core'
import TranslateIcon from '@material-ui/icons/Translate'
import SearchIcon from '@material-ui/icons/Search'
import HelpIcon from '@material-ui/icons/Help'

function App() {

  const [query, setQuery] = useState('')
  const [recordings, setRecordings] = useState([])
  const [headerText, setText] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [open, setOpen] = useState(false)

  const getRecordings = () => {
    var finalQuery = query.trim()
    finalQuery = query.replace(' ', '+')
    setText('Results for ' + query)
    var url = 'https://www.xeno-canto.org/api/2/recordings?query=' + finalQuery + '+q:A+len_gt:5'
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
    fetch(proxyUrl + url)
    .then(response => response.json())
    .then(data => setRecordings(data.recordings))
  }

  const getTranslation = () => {
    googleTranslate.translate(query, 'en', function(err, translation) {
      setQuery(translation.translatedText.toLowerCase())
    })
  }

  const inputChanged = (event) => {
    setQuery(event.target.value)
  }

  const getHelp = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
    setOpen(!open)
  }

  const columns = [
    {
      headerName: 'Species',
      field: 'en',
      sortable: true
    },
    {
      headerName: 'Sound',
      field: 'file',
      width: '360%',
      cellRendererFramework: params =>
        <ReactAudioPlayer
          src = {params.value}
          controls
        />
    },
    {
      field: 'date',
      sortable: true,
      sort: 'desc'
    },
    {
      headerName: 'Country',
      field: 'cnt',
      sortable: true
    },
    {
      headerName: 'Sound type',
      field: 'type',
      sortable: true 
    }

  ]

  return (
    <div className = 'App'>
      <Tooltip title = "Enter bird species or country to search for recordings">
        <TextField 
          label = 'Bird/country' 
          variant = 'outlined' 
          name = "query" 
          value = {query} 
          onChange = {inputChanged} 
          />
        </Tooltip>
      <br />     
      <Button 
        variant = 'contained'
        color = 'primary'
        size = 'small'
        startIcon = {<SearchIcon />}
        onClick = {() => getRecordings()}
        >
          Search
      </Button>
      <Button 
        variant = 'contained'
        color = 'secondary'
        size = 'small'
        startIcon = {<TranslateIcon />}
        onClick = {() => getTranslation()}
      >
          Translate
      </Button>
      <br />

      <h2>
        {headerText}
      </h2>

      <div className = 'ag-theme-alpine'
      style = {{height: 620, width: '80%', margin: 'auto'}}>
        <AgGridReact
          rowData = {recordings}
          columnDefs = {columns}
          resizable
          sizeColumnsToFit
          skipHeaderOnAutoSize
          autoSizeAllColumns
          pagination
          paginationAutoPageSize
        >

        </AgGridReact>
      </div>
      <Button 
        variant = 'contained'
        color = 'default'
        size = 'small'
        startIcon = {<HelpIcon />}
        onClick = {getHelp}
      >
          Help
      </Button>
      <Popper open={open} anchorEl = {anchorEl}>
        <div style = {{
          border: '1px solid',
          padding: '20px',
          margin: 'auto',
          width: '80%',
          maxWidth: 400,
          backgroundColor: '#FFFFFF'
        }}>
          <p>
            Search for bird song recordings by bird species in English or Latin or by country. 
            You may use the Translate button to translate the species/country to English first and then search. 
            Listen to the recordings in the Sound column by clicking play.
          </p>
          <p>
            Please note that the translations provided by Google may not always be correct. The data sheet remains empty if no recordings are found.
          </p>
        </div>
      </Popper>
    </div>
  );
}

export default App;
