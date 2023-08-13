import WorkoutsDAO from "../dao/workoutsDAO.js";

export default class WorkoutsController {
    static async apiGetWorkouts(req, res, next) {
        const workoutsPerPage = req.query.workoutsPerPage ? parseInt(req.query.workoutsPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.name) {
            filters.name = req.query.name
        } else if (req.query.createdBy) {
            filters.createdBy = req.query.createdBy
        }

        const { workoutsList, totalWorkouts } = await WorkoutsDAO.getWorkouts({
            filters,
            page,
            workoutsPerPage,
        })

        let response = {
            workouts: workoutsList,
            page: page,
            filters: filters,
            entrierPerPage: workoutsPerPage,
            totalResults: totalWorkouts,
        }
        res.json(response)
    }

    static async apiPostWorkouts(req, res, next) {
        try{
            const name = req.body.name
            const exercise = req.body.exercise
            const createdBy = req.body.createdBy
            // const WorkoutResponse = 
            await WorkoutsDAO.addWorkout(
                name,
                exercise,
                createdBy,
            )
            res.json({status: "success"})
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiUpdateWorkouts(req, res, next) {
        try{
            const workoutId = req.body.workoutId
            const name = req.body.name
            const exercise = req.body.exercise
            const createdBy = req.body.createdBy
            const workoutResponse = await WorkoutsDAO.updateWorkout(
                workoutId,
                name,
                exercise,
                createdBy,
            )
            var { error } = workoutResponse
            if (error) {
                res.status(400).json({ error })
            }
            if(workoutResponse.modifiedCount === 0) {
                throw new Error("Unable to update workout")
            }
            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiDeleteWorkouts(req, res, next) {
        try{
            const workoutId = req.query.workoutId
            // const workoutResponse = 
            await WorkoutsDAO.deleteWorkout(
                workoutId,
            )
            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

}