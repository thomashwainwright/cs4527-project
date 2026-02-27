
const express = require("express");
const app = express()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const bcrypt = require("bcryptjs")

const { Pool } = require("pg");

app.use(cookieParser())
app.use(cors({origin: "http://localhost:5173", credentials: true}))
app.use(express.json())

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "workload_manager",
    password: "admin",
    port: 5432,
});

const checkAccount = async (email, password_plaintext) => {
    const res = await pool.query("SELECT * FROM users WHERE email = $1", [email])
    if (res.rows.length === 0) return false
    const db_hash = res.rows[0].password_hash
    
    const valid =  await bcrypt.compare(password_plaintext, db_hash)
    return valid
}

app.post("/api/login", async (req, res) => {
    const {email, password} = req.body

    if (await checkAccount(email, password)) {
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

module.exports = pool;