import { useState } from 'react'
import './App.css'
import Container from '@mui/material/Container'
import { MenuItem, FormControl, InputLabel, Select } from '@mui/material';

const API_KEY = import.meta.env.TMDB_API_KEY;

function App() {
  const [genre, setGenre] = useState('');


  return (
    <>
      <Container sx={{ minWidth: 400 }}>

        <FormControl fullWidth>
          <InputLabel id="genre-label">Genre</InputLabel>
          <Select
            labelId="genre-label"
            id="genre-simple-select"
            value={genre}
            label="Genre"
            onChange={(event) => {
    setGenre(event.target.value)}}
          >
            <MenuItem value={1}>Action</MenuItem>
            <MenuItem value={2}>Drama</MenuItem>
            <MenuItem value={3}>Comedy</MenuItem>
            <MenuItem value={4}>Romance</MenuItem>
          </Select>
        </FormControl>

      </Container>
    </>
  )
}

export default App
