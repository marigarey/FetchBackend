import { test } from '@japa/runner'
import { start, close } from '../src/app.js'

/**
 * Tests the Normal Execution of the API
 */
test.group('Normal Execution:', (group) => {

    group.setup(async () => {
        await start()
    })

    group.teardown(async () => {
        await close()
    })

    /**
     * Checks the API's ability to add one transactions
     */
    test('Post /add first obj', async ({ client }) => {
        const response = await client
        .post('/api/add')
        .json({
            "payer": "DANNON", "points": 300, "timestamp": "2022-10-31T10:00:00Z"
        })
        
        response.assertStatus(200)
    })

    /**
     * Checks the API's ability to add multiple transactions
     */
    test('Post /add all', async ({ client }) => {
        const response1 = await client
        .post('/api/add')
        .json({
            "payer": "UNILEVER", "points": 200, "timestamp": "2022-10-31T11:00:00Z"
        })
        
        response1.assertStatus(200)

        const response2 = await client
        .post('/api/add')
        .json({
            "payer": "DANNON", "points": -200, "timestamp": "2022-10-31T15:00:00Z"
        })
        
        response2.assertStatus(200)

        const response3 = await client
        .post('/api/add')
        .json({
            "payer": "MILLER COORS", "points": 10000, "timestamp": "2022-11-01T14:00:00Z"
        })
        
        response3.assertStatus(200)

        const response4 = await client
        .post('/api/add')
        .json({
            "payer": "DANNON", "points": 1000, "timestamp": "2022-11-02T14:00:00Z"
        })
        
        response4.assertStatus(200)
    })
    
    /**
     * Checks that the API will spend points the user has
     */
    test('Post /spend', async ({ client }) => {
        const response = await client
        .post('/api/spend').json({
            "points" : 5000
        })
        
        const output = [
            {"payer": "DANNON", "points": -100},
            {"payer": "UNILEVER", "points": -200},
            {"payer": "MILLER COORS", "points": -4700}
        ]
    
        response.assertStatus(200)
        response.assertBody(output)
    })
    
    /**
     * Checks the API will return the correct balance
     */
    test('Get /balance', async ({ client }) => {
        const response = await client
        .get('/api/balance')
    
        const output = {
            "DANNON": 1000,
            "UNILEVER": 0,
            "MILLER COORS": 5300
        }
    
        response.assertStatus(200)
        response.assertBody(output)
    })
})

/**
 * Tests an Edge Case of the API to make sure it fails
 */
test.group('Edge Cases:', (group) => {
    group.setup(async () => {
        await start()
    })

    group.teardown(async () => {
        await close()
    })

    /**
     * Checks that API fails to spend points the user does not have
     */
    test('Post /spend not enough points', async ({ client }) => {
        const response = await client
        .post('/api/spend').json({
            "points" : 100000
        })
    
        response.assertStatus(400)
    })
})