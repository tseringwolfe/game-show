import { useEffect, useState } from 'react'
import './App.css'
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider, InputLabel, Select, ButtonGroup, Button, MenuItem, FormControl, Box, Card, CardMedia, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';


const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// a random number generator helper function
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// pull a random movie from page helper function
function getRandomMovie(movieArray) {
  let index = getRandomInt(movieArray.length);
  return movieArray[index];
}


function App() {

  // themes to make fonts for website
  const fontTheme = createTheme({
    typography: {
      h2: {
        fontFamily: "copperplate",
        fontStyle: "bold",
        fontWeight: 450
      },
      body1: {
        fontFamily: "georgia",
        fontSize: "25px"
      },
    },
  });


  // state variable to show selected genre in dropdown menu
  const [genreID, setGenreID] = useState("");

  //state variable to get array of genres from API
  const [genreArray, setGenreArray] = useState([]);

  // state variable to handle "start button"
  const [isVisible, setIsVisible] = useState(false);

  //state variable for poster path
  const [posterPath, setPosterPath] = useState("");

  //state variable for movie year
  const [movieYear, setMovieYear] = useState(0);

  // state variable getting list of movies from API (using genre prev selected)
  const [movieArray, setMovieArray] = useState([]);

  //state variable for score
  const [score, setScore] = useState(0);

  //state var for year guessing options holds [left year, right year]
  const [guessOptions, setGuessOptions] = useState([]);

  // state var to keep track of rounds
  const [round, setRound] = useState(0);

  //state var for gameOver screen
  const [gameOver, setGameOver] = useState(false);

  const [resultMessage, setResultMessage] = useState("");
  const [resultColor, setResultColor] = useState("text.primary");


  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  // fetches genre array from API
  useEffect(() => {
    fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=" + API_KEY, requestOptions)
      .then((response) => response.json())
      .then((genreData) => {
        // we are originally fetching an object with an array inside of it from API, "genres" is the array we want to return
        console.log("got data", genreData.genres);
        setGenreArray(genreData.genres);
      })
      .catch((error) => console.log("error", error));
  }, []);

  const handleStartButton = () => {
    setGameOver(false);
    setRound(0);
    setScore(0);
    setResultMessage("");
    handleButtonClick();
  }

  const handleAnswerButton = () => {
    if (round >= 5) {
      setGameOver(true);
      return;
    }
    handleButtonClick();
  }


  // handle when button is clicked
  const handleButtonClick = () => {

    setIsVisible(true);

    //make sure all movies have a poster path
    const validMovies = movieArray.filter(movie => movie.poster_path !== null);
    if (validMovies.length < 5) {
      console.warn("Not enough valid movies");
      return;
    }

    //get random movie
    let movie = getRandomMovie(validMovies);
    console.log(movie);

    //get movie year
    let year = movie.release_date.slice(0, 4);
    const correctYear = parseInt(year);

    let offset;
    do {
      offset = getRandomInt(21) - 10;
    } while (offset === 0);

    let wrongYear = correctYear + offset;
    if (wrongYear > 2025) {
      wrongYear = correctYear - offset;
    }


    const randomSide = Math.random() < 0.5;
    const options = randomSide ? [correctYear, wrongYear] : [wrongYear, correctYear];


    //update state
    setMovieYear(correctYear);
    setPosterPath("https://image.tmdb.org/t/p/original/" + movie.poster_path);
    setGuessOptions(options);


    //remove movie from movieArray
    const indexRemove = movieArray.findIndex(item => item.title === movie.title);
    const updatedMovies = movieArray;
    updatedMovies.splice(indexRemove, 1);
    setMovieArray(updatedMovies);

    //increment rounds
    setRound(prev => prev + 1);
  };

  const handleGuess = (selectedYear) => {
    handleAnswerButton();
    if (selectedYear === movieYear) {
      setScore(score + 5);
      setResultColor("green");
      setResultMessage("Correct!");
    }
    else {
      setResultMessage("Incorrect.");
      setResultColor("red");
    }

  }


  // handle when genre changes
  const handleGenreChange = (genreID) => {

    //get a random page number
    let pageNum = getRandomInt(100).toString();


    //checking genreID
    console.log("genre id is: " + genreID.toString());


    //fetch the list of movies according the genre(by ID) and random page number
    fetch("https://api.themoviedb.org/3/discover/movie?api_key=" + API_KEY + "&primary_release_date.gte=2000-01-01&with_original_language=en&with_genres=" + genreID + "&page=" + pageNum, requestOptions)
      .then(response => response.json())
      .then(movieData => {
        //set movie array to be results (20 movies)
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
        <ThemeProvider theme={fontTheme}>
          <Typography
            variant="h2"
            align="center"
            color="text.primary"
            sx={{ mt: 2 }}
          >
            Movie Year Guessr
          </Typography>
        </ThemeProvider>

        <ThemeProvider theme={fontTheme}>
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
              value={genreID}
              label="Genre"
              sx={{ width: 200 }}
              onChange={(event) => {
                const selectedID = event.target.value;
                setGenreID(selectedID);
                handleGenreChange(selectedID);
              }}
            >
              {genreArray && genreArray.map((genre) => (

                <MenuItem key={genre.id} value={genre.id}>{genre.name}</MenuItem>

              ))}
            </Select>
            <Button onClick={handleStartButton} sx={{ bgcolor: "#898AC4" }}>
              Start
            </Button>
          </ButtonGroup>
        </FormControl>

      </Container>
      {isVisible && (movieArray == 0) && (
        <Typography>
          Please enter a genre first.
        </Typography>
      )}

      {gameOver ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <ThemeProvider theme={fontTheme}>
            <Typography variant='h3' color='error' gutterBottom>
              Game Over!
            </Typography>
            <Typography variant="h5">
              Final Score: {score}
            </Typography>
            <Typography variant='body2'>
              Press start to play again.
            </Typography>
          </ThemeProvider>
        </Box>
      ) : isVisible && (movieArray !== 0) && (

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 4,
            gap: 4
          }}>

          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 4,
            width: '100%'
          }}>

            {/*Instructions*/}
            <Box sx={{
              width: '25%',
              maxWidth: '300px',
              padding: 2
            }}>
              <ThemeProvider theme={fontTheme}>
                <Typography
                  variant="body1"
                  align="center"
                  color="text.primary"
                  sx={{ mb: 2 }}>
                  How to Play
                </Typography>
                <Typography variant='body2'>
                  1. Pick the year you think the movie was released!
                </Typography>
                <Typography variant='body2'>
                  2. +5 points for correct guesses
                </Typography>
                <Typography variant='body2'>
                  3. There is five rounds total
                </Typography>
              </ThemeProvider>
            </Box>

            {/*Movie Poster*/}

            <Card sx={{ maxWidth: 345, flexShrink: 0 }}>
              <CardMedia
                component="img"
                sx={{
                  height: 'auto',
                  width: '100%',
                  objectFit: 'contain'
                }}
                image={posterPath}
              />
            </Card>


            {/* Score */}
            <Box sx={{
              width: '25%',
              maxWidth: '300px',
              padding: 2,
              textAlign: 'center'
            }}>
              <ThemeProvider theme={fontTheme}>
                <Typography
                  variant="body1"
                  align="center"
                  color="text.primary"
                  sx={{ mb: 2 }}>
                  Score: {score}
                </Typography>
              </ThemeProvider>
            </Box>
          </Box>

          {/* Guessing buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant='contained' onClick={() => handleGuess(guessOptions[0])}>
              {guessOptions[0]}
            </Button>
            <Button variant='contained' onClick={() => handleGuess(guessOptions[1])}>
              {guessOptions[1]}
            </Button>
          </Box>

          {resultMessage && (
            <Typography variant="h6" sx={{ color: resultColor }}>
              {resultMessage}
            </Typography>
          )}

        </Box>

      )}


    </>
  )
}

export default App
