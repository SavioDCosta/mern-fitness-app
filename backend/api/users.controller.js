import UsersDAO from "../dao/usersDAO.js";

export default class UsersController {
    static async apiGetUsers(req, res, next) {
        const usersPerPage = req.query.usersPerPage ? parseInt(req.query.usersPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.name) {
            filters.name = req.query.name
        } else if (req.query.age) {
            filters.age = req.query.age
        } else if (req.query.gender) {
            filters.gender = req.query.gender
        } else if (req.query.email) {
            filters.email = req.query.email
        } else if (req.query.password) {
            filters.password = req.query.password
        } else if (req.query.height) {
            filters.height = req.query.height
        } else if (req.query.weight) {
            filters.weight = req.query.weight
        } 

        const { usersList, totalUsers } = await UsersDAO.getUsers({
            filters,
            page,
            usersPerPage,
        })

        let response = {
            users: usersList,
            page: page,
            filters: filters,
            entrierPerPage: usersPerPage,
            totalResults: totalUsers,
        }
        res.json(response)
    }

    static async apiGetUserById(req, res, next) {
        try {
            let id = req.params.id || {}
            let user = await UsersDAO.getUserById(id)
            if(!user){
                res.status(404).json({ error: "Not found."})   
                return
            }
            res.json(user)
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }

    static async apiGetUserWorkouts(req, res, next) {
        
    }
}