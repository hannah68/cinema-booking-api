const prisma = require('../utils/prisma');

const createScreen = async(req, res) => {
    const { number, screenings } = req.body;
    // console.log('screening', screenings);
    const createScreen = await prisma.screen.create({
        data: {
            number: number,
            screenings: screenings ? {
                createMany: {
                    data: screenings
                }
            }: {}
        },
        include: {
            screenings: true
        }
    })
    return res.json({data: createScreen})
}

module.exports = {
    createScreen
}