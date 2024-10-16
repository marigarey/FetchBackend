//const sqlite3 = require('sqlite3').verbose()
import sqlite3 from 'sqlite3'
const db = new sqlite3.Database('src/database.sql')

export default class Services {

    init = () => {
        // set up the sql database
        const sql = "CREATE TABLE IF NOT EXISTS rewards (payer TEXT, points INTEGER, timestamp DATE);"
        db.run(sql)
    }

    addRewards = (payer, points, timestamp) => {
        // run the sql query with the new values
        const sql = `INSERT INTO rewards VALUES(?, ?, ?);`
    
        db.run(sql, [payer, points, timestamp])
    }

    balanceRewards = () => {

        const balance = {}

        // select all the rows in the rewards table
        const sql = "SELECT payer, points FROM rewards;"

        db.each(sql, (err, row) => {
            if (!row) {
            }
            else if (row.payer in balance) {
                // add the points to the total payer points
                balance[row.payer] += row.points
            }
            else {
                // create a new object in balance with the payer and current points
                balance[row.payer] = row.points
            }
        })

        return balance
    }

    spendRewards = (spend) => {
        // keeps track of points spent per payer
        let spent = []

        // get most recent transactions
        const sql = `SELECT points, payer FROM rewards ORDER BY timestamp ASC;`
        db.each(sql, (err, row) => {
            // check the current points
            if (row && spend > 0) {
                console.log('row')
                console.log(row)
                let difference = 0
                
                if (row.points >= spend) {
                    // current payer reward has more points than points to spend
                    difference = -spend

                    // update points value
                    spend = 0
                }
                else {
                    // current payer rewards has less points than points to spend
                    difference = -row.points

                    // update points value
                    spend = row.points - spend
                }

                // add updated subtractions to spent
                spent.push({
                    "payer": row.payer,
                    "points": difference
                })
            }
        })

        // check that all points have been spent
        if (spend == 0) {
            // all points have been spent successfully

            // add the spent array to the sql database
            const stmt = db.prepare("INSERT INTO rewards VALUES(?)")
            for (let i = 0; i < spent.length; i++) {
                stmt.run([spent[i].payer, spent[i].points])
            }
            stmt.finalize()

            // return the list of spent points
            return spent

        }
    }
}
