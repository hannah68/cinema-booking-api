const express = require("express");
const router = express.Router();
const { 
    getMovies, 
    createMovie,
    getMovieByIdOrName,
    updateMovie
} = require('../controllers/movie')


router.get("/", getMovies);
router.post("/", createMovie);
router.get("/:identifier", getMovieByIdOrName);
router.put("/:id", updateMovie);

module.exports = router;