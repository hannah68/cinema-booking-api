const prisma = require('../utils/prisma');

const createTicket = async(req,res) => {
    const { customerId, screeningId } = req.body;
   
    const createTicket = await prisma.ticket.create({
        data: {
            customerId: customerId,
            screeningId: screeningId
        },
        include: {
            customer: true,
            screening: true,
            screening: {
                include: {
                    movie: true,
                    screen: true
                }
            }
        }
    })
    return res.json({data: createTicket})
}

module.exports = {
    createTicket
}