import express from "express";
import cors from "cors";
import users from "./api/users.route.js"
import workouts from "./api/workouts.route.js"
import exercises from "./api/exercises.route.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1/users", users)
app.use("/api/v1/workouts", workouts)
app.use("/api/v1/exercises", exercises)
app.use("*", (req, res) => res.status(404).json({error: "not found"}))

export default app