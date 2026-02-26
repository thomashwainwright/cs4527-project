
const express = require("express");
const app = express()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")

app.use(cookieParser())
app.use(cors({origin: "http://localhost:5173", credentials: true}))
app.use(express.json())

app.post("/api/login", (req, res) => {
    const {email, password} = req.body

    if (email === "admin@example.com" && password === "password") {
        const token = jwt.sign({email: email}, "secret_key", {expiresIn: "1h"})
        res.cookie("token", token, {httpOnly: true, secure: false}) // secure = true in production
        res.json({message: "Login successful", token: token})
    } else {
        res.status(401).json({message: "Invalid credentials"})
    }
})

app.get("/api/check-auth", (req, res) => {
    const token = req.cookies.token
    if (!token) {
        return res.json({isAuthenticated: false})
    }
    try {
        const decoded = jwt.verify(token, "secret_key")
        res.json({isAuthenticated: true, email: decoded.email})
    } catch (error) {
        res.json({isAuthenticated: false})
    }
})

app.get("/api/logout", (req, res) => {
    res.clearCookie("token")
    res.json({message: "Logout successful"})
})


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000")
})