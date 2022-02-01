const express = require("express");
const router = express.Router();
const { 
    getMovies, 
    createMovie,
    getMovieByIdOrName
} = require('../controllers/movie')


router.get("/", getMovies);
router.post("/", createMovie);
router.get("/:identifier", getMovieByIdOrName);

module.exports = router;