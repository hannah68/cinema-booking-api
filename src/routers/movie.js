const express = require("express");
const router = express.Router();
const { 
    getMovies, 
    createMovie,
    getMovieByIdOrName,
    updateMovie,
    getMoviesByRuntime
} = require('../controllers/movie')


router.get("/", getMovies);
router.get("/runtime", getMoviesByRuntime)
router.post("/", createMovie);
router.get("/:identifier", getMovieByIdOrName);
router.put("/:id", updateMovie);

// "/runtime?lessthen =:runtime"
// "/runtime?greaterthan =:runtime"

module.exports = router;