import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let workouts

export default class WorkoutsDAO {
    static async injectDB(conn) {
        if(workouts) {
            return
        }   
        try {
            workouts = await conn.db(process.env.FITNESS_NS).collection("workouts")
        } catch (e) {
            console.error(`Unable to establish a connection handle in WorkoutsDAO: ${e}`)
        }
    }

    static async getWorkouts({
        filters = null,
        page = 0,
        workoutsPerPage = 20,
    } = {}) {
        let query
        if (filters) {
            if("name" in filters) {
                query = { $text: {$search: filters["name"]}}
            } 
        }

        let cursor 

        try {
            cursor = await workouts.find(query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { workoutsList: [], totalWorkouts: 0 }
        }

        const displayCursor = cursor.limit(workoutsPerPage).skip(workoutsPerPage * page)

        try {
            const workoutsList = await displayCursor.toArray()
            const totalWorkouts = await workouts.countDocuments(query)
            return { workoutsList, totalWorkouts }
        } catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`)
            return { workoutsList: [], totalWorkouts: 0 }
        }
    }

    static async addWorkout(name, exercise, createdBy) {
        try {
            const workoutDoc = {
                name: name,
                exercise: exercise,
                createdBy: new ObjectId(createdBy),
            }
            return await workouts.insertOne(workoutDoc)
        } catch(e) {
            console.error(`Unable to post workout: ${e}`)
            return { error: e }
        }
    }

    static async updateWorkout(workoutId, name, exercise) {
        try {
            const updateResponse = await workouts.updateOne(
                { _id: new ObjectId(workoutId) },
                { $set: { name: name, exercise: exercise } },
            )
            return updateResponse
        } catch(e) {
            console.error(`Unable to update workouts: ${e}`)
            return { error: e }
        }
    }

    static async deleteWorkout(workoutId) {
        try {
            const deleteResponse = await workouts.deleteOne(
                { _id: new ObjectId(workoutId) },
            )
            return deleteResponse
        } catch(e) {
            console.error(`Unable to delete workout: ${e}`)
            return { error: e }
        }
    }
}