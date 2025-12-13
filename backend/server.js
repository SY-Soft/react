import express from "express";
import cors from "cors";
import { db } from "./db.js";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "SY_SUPER_SECRET_NE_MENYAT";

// ===== USERS GET =====
app.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// ===== USERS ADD =====
app.post("/users", (req, res) => {
    const q = "INSERT INTO users (`name`, `email`, `password`) VALUES (?)";
    const values = [req.body.name, req.body.email, req.body.pass];

    db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json({ id: data.insertId, ...req.body });
    });
});

// ===== LOGIN =====
app.post("/login", (req, res) => {
    console.log("LOGIN HIT:", req.body);
    const { email, password } = req.body;

    const q = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(q, [email, password], (err, data) => {
        if (err) return res.json({ success: false, error: "DB error" });
        if (data.length === 0)
            return res.json({ success: false, error: "Неверный логин или пароль" });

        const user = data[0];

        const role = user.role === 1 ? "admin" : "user";

        const token = jwt.sign(
            { id: user.id, email: user.email, role },
            SECRET,
            { expiresIn: "2h" }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role,
            }
        });
    });
});

// ===== LISTEN (ДОЛЖНО БЫТЬ ПОСЛЕ ВСЕХ РОУТОВ!) =====
app.listen(8800, () => {
    console.log("Backend server running on port 8800");
});
