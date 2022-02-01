const prisma = require('../utils/prisma');

// get movies=======================================
const getMovies = async(req, res) => {
    if(req.query.runtime){
        const movies = await filterMoviesByRuntime(req, res);
        // console.log({movie});
        return res.json({data: movies});
    }
    if(!req.query.runtime){
        const movies = await prisma.movie.findMany({
            include: {
                screenings: true
            }
        });
        return res.json({data: movies});
    }
}                                                                                                                            

// get movie by runtime============================
const filterMoviesByRuntime = async(req, res) => {
    const { runtime, lessthan } = req.query;
    // console.log(runtime);
    const movies = await prisma.movie.findMany({
        where: {
            runtimeMins: lessthan ? {
                lte: parseInt(runtime) 
            } : {
                gte: parseInt(runtime)
            }
        },
        include: {                                                        
            screenings: true
        }
    })
    return movies;
}


// create movie=======================================
const createMovie = async(req, res) => {
    const {title, runtimeMins, screenings} = req.body;

    const existedMovie = await prisma.movie.findMany({
        where: { 
            title: title 
        }
    })
    // console.log('existed',existedMovie);
    if(existedMovie.length > 0){
        return res.status(400).send('Movie already exists')
    }
    if(screenings){
        const movie = await createMovieWithScreening(title, runtimeMins, screenings);
        return res.json({data: movie})
    }
    else{
        const movie = await prisma.movie.create({
            data: {
                title: title,
                runtimeMins: runtimeMins,
            }
        })
        return res.json({data: movie})
    }
}

// create a movie with screening=================================
const createMovieWithScreening = async (title, runtimeMins, screenings) => {
    return await prisma.movie.create({
        data: {
            title: title,
            runtimeMins: runtimeMins,
            screenings: {
                createMany : {
                    data: screenings
                }
            }
        },
        include: {
            screenings: true
        }
    })
}

// get a single movie by id or name=============================
const getMovieByIdOrName = async(req,res) => {
    const { identifier } = req.params;
    
    const movieByNameORId = await prisma.movie.findMany({
        where: {
            OR: [
                {
                    title : {
                        contains: identifier
                    }
                },
                {
                    id : !isNaN(identifier) ? parseInt(identifier): 0
                }
            ]
        }
    })
    if(movieByNameORId.length <= 0) {
        return res.status(400).send('Movie not found!');
    }else{
        return res.json({data: movieByNameORId})
    }
}


module.exports = {
    getMovies,
    createMovie,
    getMovieByIdOrName
}