import { useEffect, useState } from 'react'
import './App.css'
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider, InputLabel, Select, ButtonGroup, Button, MenuItem, FormControl, Box } from '@mui/material';
import Typography from '@mui/material/Typography';


const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

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

  const [genreArray, setGenreArray] = useState([]);

  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  useEffect(() => {
    fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=" + API_KEY, requestOptions)
      .then((response) => response.json())
      .then((genreData) => {
        console.log("got data", genreData.genres);
        setGenreArray(genreData.genres);
      })
      .catch((error) => console.log("error", error));
  }, []);

  const [isVisible, setIsVisible] = useState(false);

  const handleButtonClick = () => {
    setIsVisible(true);
  };

  const [movieArray, setMovieArray] = useState([]);

  const handleGenreChange = () => {

    let genreID = ""

    for (let i = 0; i < genreArray.length; i++) {
      if (genreArray[i].name == genre) {
        genreID = genreArray[i].id.toString();
      }
    }

    let pageNum = getRandomInt(300).toString();

    fetch("https://api.themoviedb.org/3/discover/movie?api_key=" + API_KEY + "&primary_release_date.gte=1990-01-01&with_original_language=en&with_genres=" + genreID + "&page=" + pageNum, requestOptions)
      .then(response => response.json())
      .then(movieData => {
        setMovieArray(movieData.results);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  console.log(movieArray);

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
            sx={{ mb: 2 }}
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
              sx={{ width: 200 }}
              onChange={(event) => {
                setGenre(event.target.value);
                handleGenreChange();
              }}
            >
              {genreArray && genreArray.map((genre) => (

                <MenuItem value={genre.id}>{genre.name}</MenuItem>

              ))}
            </Select>
            <Button onClick={handleButtonClick} sx={{ bgcolor: "#898AC4" }}>
              Start
            </Button>
          </ButtonGroup>
        </FormControl>

      </Container>
      {isVisible && (
        <Typography>
          Movie Poster here
        </Typography>
      )}
    </>
  )
}

export default App
