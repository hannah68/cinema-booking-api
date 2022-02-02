const prisma = require('../utils/prisma');

const createCustomer = async (req, res) => {
    const {
        name,
        phone,
        email
    } = req.body;

    /**
     * @tutorial https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#create-a-related-record
     */
    const createdCustomer = await prisma.customer.create({
        data: {
            name,
            contact: {
                create: {
                    phone,
                    email
                }
            }
        },
        // This is like doing RETURNING in SQL
        include: { 
            contact: true
        }
    })

    res.json({ data: createdCustomer });
}

// get all customer with contact==========================
const getCustomers = async(req,res)=> {
    const customer = await prisma.customer.findMany({
        include: {
            contact: true
        }
    });
    res.json({ data: customer });
}

// update customer=========================================
const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const {name, contact} = req.body;

    const updatedCustomer = await prisma.customer.update({
        where: {
                id: parseInt(id)
        },
        data: {
            name: name,
            contact: {
                update: {
                    email: contact.email,
                    phone: contact.phone
                }
            }
        }
    })
    return res.json({data: updatedCustomer})
}



module.exports = {
    createCustomer,
    updateCustomer,
    getCustomers
};
