const app = require('./app');

//config module
const CONFIG = require('./config/config')

//database connection function
const connectToDB = require('./db/mongodb')

//invoke connecToDB function
connectToDB()

app.listen(CONFIG.PORT, () => {
    console.log(`Server is running on http://localhost:${CONFIG.PORT}`)
})