import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let exercises

export default class ExercisesDAO {
    static async injectDB(conn) {
        if(exercises) {
            return
        }   
        try {
            exercises = await conn.db(process.env.FITNESS_NS).collection("exercises")
        } catch (e) {
            console.error(`Unable to establish a connection handle in excercisesDAO: ${e}`)
        }
    }

    static async getExercises({
        filters = null,
        page = 0,
        exercisesPerPage = 20,
    } = {}) {
        let query
        if (filters) {
            if("name" in filters) {
                query = { $text: {$search: filters["name"]}}
            } else if ("type" in filters) {
                query = { "type": {$eq: filters["type"]}}
            } 
        }

        let cursor 

        try {
            cursor = await exercises.find(query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { exercisesList: [], totalExercises: 0 }
        }

        const displayCursor = cursor.limit(exercisesPerPage).skip(exercisesPerPage * page)

        try {
            const exercisesList = await displayCursor.toArray()
            const totalExercises = await exercises.countDocuments(query)
            return { exercisesList, totalExercises }
        } catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`)
            return { exercisesList: [], totalExercises: 0 }
        }
    }

    static async addExercises(name, type) {
        try {
            const exerciseDoc = {
                name: name,
                type: type,
            }
            return await exercises.insertOne(exerciseDoc)
        } catch(e) {
            console.error(`Unable to add exercise: ${e}`)
            return { error: e }
        }
    }

    static async updateExercises(exerciseId, name, type) {
        try {
            const updateResponse = await exercises.updateOne(
                { _id: new ObjectId(exerciseId) },
                { $set: { name: name, type: type } },
            )
            return updateResponse
        } catch(e) {
            console.error(`Unable to update exercise: ${e}`)
            return { error: e }
        }
    }

    static async deleteExercises(exerciseId) {
        try {
            const deleteResponse = await exercises.deleteOne(
                { _id: new ObjectId(exerciseId) },
            )
            return deleteResponse
        } catch(e) {
            console.error(`Unable to delete exercise: ${e}`)
            return { error: e }
        }
    }
}

