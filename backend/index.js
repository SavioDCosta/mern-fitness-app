import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import UsersDAO from "./dao/usersDAO.js"
import WorkoutsDAO from "./dao/workoutsDAO.js"
import ExercisesDAO from "./dao/exercisesDAO.js"

dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

MongoClient.connect(
    process.env.FITNESS_DB_URI,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true
    }
).catch(err => {
    console.log(err.stack)
    process.exit(1)
}).then(async client => {
    await UsersDAO.injectDB(client)
    await WorkoutsDAO.injectDB(client)
    await ExercisesDAO.injectDB(client)
    app.listen(port, () => {
       console.log(`listening on port ${port}`) 
    })
})