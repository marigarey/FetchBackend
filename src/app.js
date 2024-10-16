import express from 'express'
import bodyParser from 'body-parser'
import routes from './router.js'

const PORT = 8000

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/api', routes)

let server

export const start = async () => {
    return new Promise((resolve, reject) => {
        server = app.listen(PORT, () => {
            console.log("Server listening on:", PORT)
            resolve()
        })
    })
}

export const close = async () => {
    return new Promise((resolve, reject) => {
        if (server) {
            server.close(() => {
                console.log("Closing server...")
            })
          resolve()
        }
        reject()
    })
}

const test = async () => {
    const url = "http://localhost:8000/api/add"
    var obj = {
        method: 'POST',
        body: {
            "payer": "DANNON", 
            "points": 300, 
            "timestamp": "2022-10-31T10:00:00Z"
        }
    }

    const response = await fetch(url, obj)
    console.log(await response)
}
//start()
//test()
