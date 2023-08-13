import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let users

export default class UsersDAO {
    static async injectDB(conn) {
        if(users) {
            return
        }   
        try {
            users = await conn.db(process.env.FITNESS_NS).collection("users")
        } catch (e) {
            console.error(`Unable to establish a connection handle in usersDAO: ${e}`)
        }
    }

    static async getUsers({
        filters = null,
        page = 0,
        usersPerPage = 20,
    } = {}) {
        let query
        if (filters) {
            if("name" in filters) {
                query = { $text: {$search: filters["name"]}}
            } else if ("age" in filters) {
                query = { "age": {$eq: filters["age"]}}
            } else if ("gender" in filters) {
                query = { "gender": {$eq: filters["gender"]}}
            } else if ("email" in filters) {
                query = { "email": {$eq: filters["email"]}}
            } else if ("password" in filters) {
                query = { "password": {$eq: filters["password"]}}
            } else if ("height" in filters) {
                query = { "height": {$eq: filters["height"]}}
            } else if ("weight" in filters) {
                query = { "weight": {$eq: filters["weight"]}}
            } 
        }

        let cursor 

        try {
            cursor = await users.find(query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { usersList: [], totalUsers: 0 }
        }

        const displayCursor = cursor.limit(usersPerPage).skip(usersPerPage * page)

        try {
            const usersList = await displayCursor.toArray()
            const totalUsers = await users.countDocuments(query)
            return { usersList, totalUsers }
        } catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`)
            return { usersList: [], totalUsers: 0 }
        }
    }

    static async getUserById(id) {
        try {
            const pipeline = [
                {
                    $match: {
                        _id: new ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: "workouts",
                        localField: "_id",
                        foreignField: "createdBy",
                        as: "workouts"
                    }
                },
                {
                    $unwind: {
                        path: "$workouts",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: "$workouts.exercises",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "exercises",
                        localField: "workouts.exercises.exerciseId",
                        foreignField: "_id",
                        as: "workouts.exercises.exercise"
                    }
                },
                {
                    $unwind: {
                        path: "$workouts.exercises.exercise",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        name: { $first: "$name" },
                        age: { $first: "$age" },
                        gender: { $first: "$gender" },
                        email: { $first: "$email" },
                        password: { $first: "$password" },
                        height: { $first: "$height" },
                        weight: { $first: "$weight" },
                        goals: { $first: "$goals" },
                        workouts: {
                            $push: {
                                _id: "$workouts._id",
                                exercise: {
                                    $mergeObjects: [
                                        "$workouts.exercises",
                                        { 
                                            name: "$workouts.exercises.exercise.name", 
                                            type: "$workouts.exercises.exercise.type" 
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        age: 1,
                        gender: 1,
                        email: 1,
                        password: 1,
                        height: 1,
                        weight: 1,
                        goals: 1,
                        workouts: 1,
                    }
                }
            ]

            // const pipeline = [
            //     {  
            //         $match: {
            //             _id: new ObjectId(id)
            //         },
            //     },
            //     {
            //         $lookup: {
            //             from: "workouts",
            //             let: {
            //                 id: "$_id",
            //             },
            //             pipeline: [
            //                 {
            //                     $match: {
            //                         $expr: {
            //                             $eq: ["$createdBy", "$$id"]
            //                         },
            //                     },
            //                 },
            //                 {
            //                     $lookup: {
            //                         from: "exercises",
            //                         localField: "exercises.exerciseId",
            //                         foreignField: "_id",
            //                         as: "exercise"
            //                     },
            //                 },

            //                 {
            //                     $project: {
            //                         exercise: {
            //                             $arrayElemAt: ["$exercise", 0],
                                        
            //                         }
            //                     }
            //                 }

            //                 // {
            //                 //     $group: {
            //                 //         _id: "$_id",
            //                 //         exercises: {$mergeObjects: "$exercises"}
            //                 //     }
            //                 // }
            //             ],
            //             as: "workouts",
            //         },
            //     },
            // ]
            return await users.aggregate(pipeline).next()
        } catch(e) {
            console.error(`Something went wrong in getUserbyId: ${e}`)
            throw e
        }
    }
}

