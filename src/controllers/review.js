const prisma = require('../utils/prisma');

const createReview = async(req,res) => {
    const { review, star, date, customerId } = req.body;
    const { id } = req.params;

    const createReview = await prisma.review.create({
        data: {
            review: review,
            star: star,
            date: new Date(date),
            customer: {
                connect: {
                    id: parseInt(customerId)
                },
            },
            movie: {
                connect: {
                    id: parseInt(id)
                }
            }
        }
    })
    return res.json({data: createReview})
}


module.exports = {
    createReview
}