// Starting imports
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const MOVIEDEX = require('./moviedex.json');

// Start express app
const app = express();

// Global middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

// Validate Bearer Token Function
function validateBearerToken(req, res, next) {
  const myToken = process.env.MY_TOKEN;
  const authToken = req.get('Authorization');

  // If the string doesn't start with 'Bearer'
  if (!authToken.startsWith('Bearer ')) {
    // Give an error response with error message
    return res.status(400).json({ error: 'Invalid request' });
  }

  // If there is no authorization token OR if the token doesn't match
  if (!authToken || authToken.split(' ')[1] !== myToken) {
    // Give an error response with error message
    return res.status(401).json({ error: 'Unauthorized request' });
  }

  // If the tokens match, continue on
  next();
}

// Add validateBearerToken to global middleware chain
app.use(validateBearerToken);

// Handle getting movies
function handleGetMovies(req, res) {
  let results = [...MOVIEDEX];

  console.log(req.query);

  if (req.query.length === 0) {
    return res.json(results);
  }

  for (const key in req.query) {
    if (key === 'genre') {
      const genre = req.query.genre.toLowerCase();
      results = results.filter(movie => movie.genre.toLowerCase().includes(genre));
      continue;
    }
  
    if (key === 'country') {
      const country = req.query.country.toLowerCase();
      results = results.filter(movie => movie.country.toLowerCase().includes(country));
      continue;
    }
  
    if (key === 'avg_vote') {
      const avg_vote = parseFloat(req.query.avg_vote);
      results  = results.filter(movie => movie.avg_vote >= avg_vote);
      continue;
    }
  }

  res.json(results);
}

// Set endpoint to /movie
app.get('/movie', handleGetMovies);

// Listen for port 8000
app.listen(8000, () => {
  console.log('Server running on port 8000');
});