import express from 'express'
import bodyParser from 'body-parser'
import routes from './router.js'

const PORT = 8000

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/api', routes)

let server

/**
 * Starts the connection to the API Server
 * @returns connection to the server
 */
export const start = async () => {
    return new Promise((resolve, reject) => {
        server = app.listen(PORT, () => {
            console.log("Server listening on:", PORT)
            resolve()
        })
    })
}

/**
 * Closes the connection to the API Server
 * @returns closed connection to the server
 */
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
