
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
        res.json({message: "Login successful", token: token, email: email})
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

app.get("/api/modules", async (req, res) => {
    try {
        console.log("req")
        const result = await pool.query("SELECT * FROM modules")
        res.json(result.rows)
    } catch (error) {
        console.error("Error fetching modules:", error)
        res.status(500).json({message: "Error fetching modules"})
    }
})

app.get("/api/modules/:code", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM modules WHERE code = $1", [req.params.code])
        
        if (result.rows.length === 0) {
            return res.status(404).json({message: "Module not found"})
        }
        res.json(result.rows[0])
    } catch (error) {
        console.error("Error fetching module details:", error)
        res.status(500).json({message: "Error fetching module details"})
    }
})

app.get("/api/assignments/:module_id", async (req, res) => {
    try {
        console.log(req.params.module_id)
        const result = await pool.query(`    SELECT 
        staff_assignments.*, 
        users.name
    FROM staff_assignments
    JOIN users 
        ON staff_assignments.user_id = users.user_id
    WHERE staff_assignments.module_id = $1`, [Number(req.params.module_id)])
        
        if (result.rows.length === 0) {
            return res.status(404).json({message: "Module assignments not found"})
        }
        res.json(result.rows)
    } catch (error) {
        console.error("Error fetching module assignments:", error)
        res.status(500).json({message: "Error fetching module assignments"})
    }
})


app.get("/api/staff", async (req, res) => {
    try {
        console.log("req")
        const result = await pool.query(`SELECT 
    u.user_id,
    u.staff_id,
    u.role,
    u.name,
    u.email,
    s.contract_type,
    s.contract_hours
FROM users u
INNER JOIN staff s 
    ON u.staff_id = s.staff_id;`)
        res.json(result.rows)
    } catch (error) {
        console.error("Error fetching staff:", error)
        res.status(500).json({message: "Error fetching staff"})
    }
})


app.get("/api/staff/:user_id", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [Number(req.params.user_id)])
        
        if (result.rows.length === 0) {
            return res.status(404).json({message: "Staff member not found"})
        }
        res.json(result.rows[0])
    } catch (error) {
        console.error("Error fetching staff details:", error)
        res.status(500).json({message: "Error fetching staff details"})
    }
})

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000")
})

module.exports = pool;