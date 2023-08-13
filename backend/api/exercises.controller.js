import ExercisesDAO from "../dao/exercisesDAO.js";

export default class ExercisesController {
    static async apiGetExercises(req, res, next) {
        const exercisesPerPage = req.query.exercisesPerPage ? parseInt(req.query.exercisesPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.name) {
            filters.name = req.query.name
        } else if (req.query.type) {
            filters.type = req.query.type
        } 

        const { exercisesList, totalExercises } = await ExercisesDAO.getExercises({
            filters,
            page,
            exercisesPerPage,
        })

        let response = {
            exercises: exercisesList,
            page: page,
            filters: filters,
            entrierPerPage: exercisesPerPage,
            totalResults: totalExercises,
        }
        res.json(response)
    }

    static async apiPostExercises(req, res, next) {
        try {
            const name = req.body.name
            const type = req.body.type
            // const exerciseResponse = 
            await ExercisesDAO.addExercises(
                name,
                type,
            )
            res.json({ status: "success" })
        } catch(e) {
            res.status(500).json({ error: e.message })
        }   
    }

    static async apiUpdateExercises(req, res, next) {
        try {
            const exerciseId = req.body.exerciseId
            const name = req.body.name
            const type = req.body.type
            const exerciseResponse = await ExercisesDAO.updateExercises(
                exerciseId,
                name,
                type,
            )
            var { error } = exerciseResponse
            if (error) {
                res.status(400).json({ error })
            }
            if(exerciseResponse.modifiedCount === 0) {
                throw new Error("Unable to update exercise")
            }
            res.json({ status: "success" })
        } catch(e) {
            res.status(500).json({ error: e.message })
        }   
    }

    static async apiDeleteExercises(req, res, next) {
        try {
            const exerciseId = req.query.exerciseId
            // const exerciseResponse = 
            await ExercisesDAO.deleteExercises(
                exerciseId,
            )
            res.json({ status: "success" })
        } catch(e) {
            res.status(500).json({ error: e.message })
        }   
    }
}