import express from "express"
import UsersController from "./users.controller.js"
import WorkoutsController from "./workouts.controller.js"

const router = express.Router()

router
    .route("/")
    .get(UsersController.apiGetUsers)
    
router
    .route("/id/:id")
    .get(UsersController.apiGetUserById)

// router 
//     .route("/user-workout")
//     .get(UsersController.apiGetUserWorkouts)

// router
//     .route("/user-workout")
//     .post(WorkoutsController.apiPostWorkouts)
//     .put(WorkoutsController.apiUpdateWorkouts)
//     .delete(WorkoutsController.apiDeleteWorkouts)


export default router 