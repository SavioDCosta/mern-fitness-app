import express from "express"
import WorkoutsController from "./workouts.controller.js"

const router = express.Router()

router.route("/")
    .get(WorkoutsController.apiGetWorkouts)
    .post(WorkoutsController.apiPostWorkouts)
    .put(WorkoutsController.apiUpdateWorkouts)
    .delete(WorkoutsController.apiDeleteWorkouts)

export default router 