import { useState } from 'react'
import './App.css'
import Container from '@mui/material/Container';
import { MenuItem, FormControl, InputLabel, Select, createTheme, ThemeProvider, ButtonGroup, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const API_KEY = import.meta.env.TMDB_API_KEY;


function App() {
  const [genre, setGenre] = useState('');

  const themeHeader = createTheme({
    typography: {
      h2: {
        fontFamily: "copperplate",
        fontStyle: "bold",
        fontWeight: 450
      },
    },
  });
  const themeBody = createTheme({
    typography: {
      body1: {
        fontFamily: "georgia",
        fontSize: "25px"
      },
    },
  });

  return (
    <>
      <Container fixed>
        <ThemeProvider theme={themeHeader}>
          <Typography
            variant="h2"
            align="center"
            color="text.primary"
            sx={{ mt: 2 }}
          >
            Movie Year Guessr
          </Typography>
        </ThemeProvider>

        <ThemeProvider theme={themeBody}>
          <Typography
            variant="body1"
            align="center"
            color="text.primary"
            sx={{ mb: 6 }}
          >
            Please select a genre to begin!
          </Typography>
        </ThemeProvider>
      </Container>




      <Container fixed>

        <FormControl>
          <ButtonGroup variant="contained">
            <InputLabel id="genre-label">Genre</InputLabel>
            <Select
              labelId="genre-label"
              id="genre-simple-select"
              value={genre}
              label="Genre"
              sx={{width: 200}}
              onChange={(event) => {
      setGenre(event.target.value)}}
            >
              <MenuItem value={1}>Action</MenuItem>
              <MenuItem value={2}>Drama</MenuItem>
              <MenuItem value={3}>Comedy</MenuItem>
              <MenuItem value={4}>Romance</MenuItem>
            </Select>
            <Button sx={{ bgcolor: "#898AC4" }}>
              Start
            </Button>
          </ButtonGroup>
        </FormControl>

      </Container>

      <Container fixed>

      </Container>
    </>
  )
}

export default App
