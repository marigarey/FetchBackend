import Database from 'better-sqlite3'
const db = new Database('database/rewards.sqlite3')
const sql = "CREATE TABLE IF NOT EXISTS rewards (payer TEXT, points INTEGER, timestamp DATE);"
db.exec(sql)

export default class Services {

    /**
     * Adds a transaction to the SQL database
     * @param {string} payer 
     * @param {number} points 
     * @param {string} timestamp 
     */
    addRewards = (payer, points, timestamp) => {
        // run the sql query with the new values
        const sql = `INSERT INTO rewards VALUES(?, ?, ?);`
        const stmt = db.prepare(sql)
        stmt.run(payer, points, timestamp)
    }

    /**
     * Compiles all the payer information into one dictionary
     * @returns dictionary of points by payer
     */
    balanceRewards = () => {

        const balance = {}

        // select all the rows in the rewards table
        const sql = "SELECT payer, points FROM rewards;"
        const stmt = db.prepare(sql)

        for (const row of stmt.iterate()) {
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
        }

        return balance
    }

    /**
     * Calculates if a user can spent a certain amount of point.
     * If so, return array of spent points by payer and status code 200.
     * Otherwise, return status code 400
     * @param {Object<points : number>} spend 
     * @returns Arrays of spent points by payer
     */
    spendRewards = (spend) => {
        // keeps track of points spent per payer
        let spent = {}
        // get most recent transactions
        const sql = `SELECT points, payer FROM rewards ORDER BY timestamp ASC`
        const stmt = db.prepare(sql)
        for (const row of stmt.iterate()) {
            // check the current points
            if (spend > 0) {
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
                    spend = spend - row.points
                }

                // add updated subtractions to spent
                if (spent[row.payer] !== undefined) {
                    spent[row.payer] += difference
                }
                else {
                    spent[row.payer] = difference
                }
                
            }
        }

        // check that all points have been spent
        if (spend == 0) {
            // reformat spent object
            let response = []

            for (var payer in spent) {
                // re-format object to return
                response.push({
                    "payer" : payer,
                    "points" : spent[payer]
                })

                // add information to sql database
                const sql = `INSERT INTO rewards VALUES(?, ?, ?);`
                const stmt = db.prepare(sql)
                stmt.run(payer, spent[payer], null)

            }

            return response
        }
    }
}
