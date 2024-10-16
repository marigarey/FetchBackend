import { test } from '@japa/runner'
import { start, close } from '../src/app.js'

test.group('normal execution', (group) => {
    group.setup(async () => {
        await start()
    })

    group.teardown(async () => {
        await close()
    })

    test('post /add first obj', async ({ client }) => {
        const response = await client
        .post('/api/add')
        .json({
            "payer": "DANNON", "points": 300, "timestamp": "2022-10-31T10:00:00Z"
        })
        
        response.assertStatus(200)
    })
    test('post /add all', async ({ client }) => {
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
    
    test('post /spend', async ({ client }) => {
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
    
    /**test('get /balance', async ({ client }) => {
        const response = await client
        .get('/api/balance')
    
        const output = {
            "DANNON": 1000,
            "UNILEVER": 0,
            "MILLER COORS": 5300
        }
    
        response.assertStatus(200)
        response.assertBody(output)
    })**/
})