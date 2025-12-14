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
    const { email, password } = req.body;

    const q = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(q, [email, password], (err, data) => {
        if (err) return res.json({ success: false, error: "DB error" });
        if (data.length === 0)
            return res.json({ success: false, error: "Неверный логин или пароль" });

        const user = data[0];

        // const role = user.role === 1 ? "admin" : "user";
        const role = user.role;

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
function checkAdmin(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) {
        console.log("NO AUTH HEADER");
        return res.status(401).json({ success: false, error: "No token" });
    }

    try {
        const token = auth.split(" ")[1];
        const decoded = jwt.verify(token, SECRET);

    //    console.log("JWT DECODED:", decoded); // ← ВАЖНО

        if (decoded.role !== 1) {
    //        console.log("ROLE IS NOT ADMIN:", decoded.role);
            return res.status(403).json({ success: false, error: "Not admin" });
        }

        req.user = decoded;
        next();
    } catch (e) {
        console.log("JWT ERROR:", e.message);
        return res.status(401).json({ success: false, error: "Invalid token" });
    }
}


app.put("/users/role", checkAdmin, (req, res) => {
    const { userId, role } = req.body;

    const q = "UPDATE users SET role = ? WHERE id = ?";
    db.query(q, [role, userId], (err) => {
        if (err) return res.json({ success: false, error: "DB error" });
        res.json({ success: true });
    });
});

app.get("/users/:id", (req, res) => {
    const q = "SELECT id, name, email, role FROM users WHERE id = ?";
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ error: "Not found" });

        res.json(data[0]);
    });
});

app.delete("/users/:id", (req, res) => {
    const userId = req.params.id;

    const q = "DELETE FROM users WHERE id = ?";
    db.query(q, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: "DB error",
            });
        }

        return res.json({
            success: true,
            id: userId,
        });
    });
});

app.post("/users/save", checkAdmin, async (req, res) => {
    const { id, name, email, password } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: "Invalid data" });
    }

    if (id) {
        // UPDATE
        if (password) {
            await db.query(
                "UPDATE users SET name=?, email=?, password=? WHERE id=?",
                [name, email, password, id]
            );
        } else {
            await db.query(
                "UPDATE users SET name=?, email=? WHERE id=?",
                [name, email, id]
            );
        }
    } else {
        // INSERT
        if (!password) {
            return res.status(400).json({ error: "Password required" });
        }

        await db.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 0)",
            [name, email, password]
        );
    }

    res.json({ ok: true });
});



// ===== LISTEN (ДОЛЖНО БЫТЬ ПОСЛЕ ВСЕХ РОУТОВ!) =====
app.listen(8800, () => {
    console.log("Backend server running on port 8800");
});
