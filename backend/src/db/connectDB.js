const mongoose = require('mongoose')

/**
 * Connects to mongo DB cluster using DB_USER and DB_PASS defined in .env
 */
const user = encodeURIComponent(process.env.DB_USER)
const password = encodeURIComponent(process.env.DB_PASS)
const MONGO_URI = `mongodb+srv://${user}:${password}@cluster0.k066wkd.mongodb.net/?retryWrites=true&w=majority`

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(MONGO_URI)

        console.log("MongoDB Connected: ", conn.connection.host)
    }
    catch (error){
        console.error(error)
        process.exit(1)
    }
}

module.exports = connectDB