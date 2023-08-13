import express from "express"
import ExercisesController from "./exercises.controller.js"

const router = express.Router()

router.route("/")
    .get(ExercisesController.apiGetExercises)
    .post(ExercisesController.apiPostExercises)
    .put(ExercisesController.apiUpdateExercises)
    .delete(ExercisesController.apiDeleteExercises)

export default router 