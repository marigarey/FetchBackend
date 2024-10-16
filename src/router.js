import express, { response } from 'express'
import Services from './services.js'

const router = express.Router()
const services = new Services()
services.init()

router.use((response, request, next) => {
    next()
})

/**
 * Accepts transactions containing points to be added to a specific payer
 * as well as when the transaction took place.
 */
router.post("/api/add", (request, response) => {
    try {
        // access the request values
        const { payer, points, timestamp } = request.body

        // query the information
        services.addRewards(payer, points, timestamp)

        // successful transaction
        response.status(200)
        response.end()

    } catch(error) {
        // throw internal server error
        response.status(500)
    }
})

/**
 * Spends the oldest points first.
 * If not all points can be spent, ie user does not have enough points, then
 * return status code 400, otherwise, return status code 200 with the amount of
 * points spent per payer
 */
router.post("/api/spend", (request, response) => {
    try {
        const { points } = request.body

        const spent = services.spendRewards(points)

        // check if points have been spent
        if (spent) {
            response.status(200).send(spent)
        }
        else {
            // user does not have enough points to spend
            response.status(400).send("ERROR: User does not have enough points to spend!")
        }
        
    } catch(error) {
        // throw internal server error
        response.status(500)
    }
})

router.get("/api/balance", (request, response) => {
    try {
        
        // get the balance of each reward
        const balance = services.balanceRewards()

        // successfully get all reward points
        response.status(200).send(balance)

    } catch(error) {
        // throw internal server error
        response.status(500)
    }
})

export default router
