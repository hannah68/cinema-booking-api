const prisma = require('../utils/prisma');

// get movies=======================================
const getMovies = async(req, res) => {
    const movies = await prisma.movie.findMany({
        include: {
            screenings: true
        }
    });
    return res.json({data: movies});
}

// get movies by runtime=============================
const getMoviesByRuntime = async (req, res) => {
    let runtimeObj = {}

    if(req.query["lessthan"]){
        runtimeObj = {
            lt: parseInt(req.query.lessthan)
        }
    }
    if(req.query["greaterthan"]){
        runtimeObj = {
            gt: parseInt(req.query.greaterthan)
        }
    }
    
    const movies = await prisma.movie.findMany({
        where: {
            runtimeMins: runtimeObj
        }
    });
    return res.json({data: movies});
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
    
    const movie = await prisma.movie.create({
        data: {
            title: title,
            runtimeMins: runtimeMins,
        }
    })
    return res.json({data: movie})
    
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
                        contains: identifier,
                        mode: 'insensitive'
                    }
                },
                {
                    id :!isNaN(identifier) ? parseInt(identifier): 0
                }
            ]
        }
    })
    if(!movieByNameORId.length) {
        return res.status(400).send('Movie not found!');
    }
    return res.json({data: movieByNameORId});
    
}

// update movie and screening=============================
const updateMovie = async(req, res) => {
    const { id } = req.params;
    const { title, runtimeMins, screenings } = req.body;

    if(screenings){
        const updatedMovie = await updateMovieAndScreening(screenings, title, runtimeMins, id)
        return res.json({data: updatedMovie})
    }
    const updatedMovie = await prisma.movie.update({
        where: {
            id : parseInt(id)
        },
        data: {
            title: title,
            runtimeMins: runtimeMins, 
        }
    })
    return res.json({data: updatedMovie})
}


// update movie by screening==============================
const updateMovieAndScreening = async (screenings, title, runtimeMins, id) => {
    for(screen of screenings){
        return await prisma.movie.update({
            where: {
                id : parseInt(id)
            },
            data: {
                title: title,
                runtimeMins: runtimeMins,
                screenings: {
                    update: {
                        where: {
                            id: screen.id,
                        },
                        data: {
                            startsAt: new Date(screen.startsAt),
                            screenId: screen.screenId
                        }
                    }
                }
            },
            include: {
                screenings: true
            }
        })
    }
    
}

module.exports = {
    getMovies,
    createMovie,
    getMovieByIdOrName,
    updateMovie,
    getMoviesByRuntime
}