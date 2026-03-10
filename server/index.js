
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
    password: "password",
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
        const result = await pool.query("SELECT * FROM modules")
        res.json(result.rows)
    } catch (error) {
        console.error("SS Error fetching modules:", error)
        res.status(500).json({message: "Error fetching modules"})
    }
})

// app.get("/api/module_offerings/:year_id", async (req, res) => {
//     try {
//         const result = await pool.query(  `
//             SELECT *
//             FROM module_offerings mo
//             INNER JOIN modules m
//                 ON mo.module_id = m.module_id
//             WHERE mo.year_id = $1
//         `, [req.params.year_id])
//         res.json(result.rows)
//     } catch (error) {
//         console.error("SS Error fetching modules offerings:", error)
//         res.status(500).json({message: "Error fetching modules"})
//     }
// })

app.get("/api/module_offerings/:year_id", async (req, res) => {
    try {
        const result = await pool.query(  `
            SELECT 
                mo.*,
                m.*,
                COALESCE(SUM(sa.share), 0) AS allocation
            FROM module_offerings mo
            INNER JOIN modules m
                ON mo.module_id = m.module_id
            LEFT JOIN staff_assignments sa
                ON sa.offering_id = mo.offering_id
            WHERE mo.year_id = $1
            GROUP BY mo.offering_id, m.module_id
        `, [req.params.year_id])
        res.json(result.rows)
    } catch (error) {
        console.error("SS Error fetching modules offerings:", error)
        res.status(500).json({message: "Error fetching modules"})
    }
})

app.get("/api/modules/:code", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                modules.*,
                module_offerings.*
            FROM modules
            JOIN module_offerings
                ON modules.module_id = module_offerings.module_id
            WHERE modules.code = $1;`, 
        [req.params.code])
 
        if (result.rows.length === 0) {
            return res.status(404).json({message: "Module not found"})
        }
        res.json(result.rows[0])
    } catch (error) {
        console.error("SS Error fetching module details:", error)
        res.status(500).json({message: "Error fetching module details"})
    }
})

app.get("/api/assignments/module_id/:module_id/year_id/:year_id", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                staff_assignments.*, 
                users.name,
                module_offerings.module_id,
                module_offerings.year_id
             FROM staff_assignments
             JOIN users 
                ON staff_assignments.user_id = users.user_id
             JOIN module_offerings
                ON staff_assignments.offering_id = module_offerings.offering_id
             WHERE module_offerings.module_id = $1
             AND module_offerings.year_id = $2`,
            [Number(req.params.module_id), Number(req.params.year_id)])
        if (result.rows.length === 0) {
            return res.status(404).json({message: "Module assignments not found"})
        }
        res.json(result.rows)
    } catch (error) {
        console.error("SS Error fetching module assignments:", error)
        res.status(500).json({message: "Error fetching module assignments"})
    }
})


app.get("/api/staff", async (req, res) => {
    try {
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
        console.error("SS Error fetching staff:", error)
        res.status(500).json({message: "Error fetching staff"})
    }
})


app.get("/api/staff/user_id/:user_id", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [Number(req.params.user_id)])
        
        if (result.rows.length === 0) {
            return res.status(404).json({message: "Staff member not found"})
        }
        res.json(result.rows[0])
    } catch (error) {
        console.error("SS Error fetching staff details by user id:", error)
        res.status(500).json({message: "Error fetching staff details by user id:", error})
    }
})

app.get("/api/staff/email/:email", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [req.params.email])
        if (result.rows.length === 0) {
            return res.status(404).json({message: "Staff member not found"})
        }
        res.json(result.rows[0])
    } catch (error) {
        console.error("SS Error fetching staff details by email:", error)
        res.status(500).json({message: "Error fetching staff details by email"})
    }
})

app.get("/api/assignments/user_id/:user_id/year_id/:year_id", async (req, res) => {
    try {
        const result = await pool.query(
                `
            SELECT 
                sa.*,
                m.*,
                mo.*
            FROM staff_assignments sa
            JOIN module_offerings mo
                ON sa.offering_id = mo.offering_id
            JOIN modules m
                ON mo.module_id = m.module_id
            WHERE sa.user_id = $1
                AND mo.year_id = $2
            `,
        [Number(req.params.user_id), Number(req.params.year_id)]
        );

        res.json(result.rows)
    } catch (error) {
        console.error("SS Error staff assignments by year:", error)
        res.status(500).json({message: "Error staff assignments by year"})
    }
})

app.get("/api/academic_years", async (req, res) => {
    try {
        const result = await pool.query(
        `
            SELECT * FROM academic_years
        `,
        []
        );
        res.json(result.rows)
    } catch (error) {
        console.error("SS Error fetching academic years:", error)
        res.status(500).json({message: "Error fetching academic years"})
    }
})

//   `/api/formula/by_offering_id/${offering_id.toString()}`,

app.get("/api/formula/by_offering_id/:offering_id/user_id/:user_id", async (req, res) => {
    try {
        const result = await pool.query(
        `
            SELECT
                ay.label,
                sa.custom_formula
            FROM staff_assignments sa
            JOIN module_offerings mo ON sa.offering_id = mo.offering_id
            JOIN academic_years ay ON mo.year_id = ay.year_id
            JOIN module_offerings current_mo ON current_mo.offering_id = $1
            WHERE mo.module_id = current_mo.module_id
            AND sa.user_id = $2
            AND mo.year_id != current_mo.year_id;
        `,
        [Number(req.params.offering_id), Number(req.params.user_id)]
        );
        res.json(result.rows)
    } catch (error) {
        console.error("SS Error fetching formula:", error)
        res.status(500).json({message: "Error fetching academic years"})
    }
})


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000")
})

module.exports = pool;