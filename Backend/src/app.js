const express = require('express')
const cookiesParser = require('cookie-parser')
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cookiesParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))


/**
 * Routes
 */

const authRoutes = require('../src/Router/auth.route')
const songsRoute = require("../src/Router/songs.route")

app.use('/api/auth',authRoutes)
app.use('/api/songs',songsRoute)

module.exports = app
