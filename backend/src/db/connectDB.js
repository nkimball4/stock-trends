const mongoose = require('mongoose')

const user = encodeURIComponent(process.env.DB_USER)
const password = encodeURIComponent(process.env.DB_PASS)
const MONGO_URI = `mongodb+srv://${user}:${password}@cluster0.k066wkd.mongodb.net/?retryWrites=true&w=majority`

const connectDB = async () => {
    try{
        // console.log(process.env.MONGO_URI)
        const conn = await mongoose.connect(MONGO_URI)

        console.log("MongoDB Connected: ", conn.connection.host)
    }
    catch (error){
        console.error(error)
        process.exit(1)
    }
}

module.exports = connectDB