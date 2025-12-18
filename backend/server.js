import express from "express";
import cors from "cors";
import { db } from "./db.js";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "SY_SUPER_SECRET_NE_MENYAT";

function checkAdmin(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) {
        console.log("NO AUTH HEADER");
        return res.status(401).json({ success: false, error: "No token" });
    }
    try {
        const token = auth.split(" ")[1];
        const decoded = jwt.verify(token, SECRET);



        if (decoded.role !== 1 && decoded.id!==req.body.id) {
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


// ===== USERS GET =====
app.get("/users/get_all", (req, res) => {
    db.query("SELECT id, name, email, role FROM users", (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.post("/user/get", checkAdmin, (req, res) => {
    const q = "SELECT id, name, email, role FROM users WHERE id = ?";
    db.query(q, [req.body.id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ error: "Not found" });
        return res.json(data[0]);
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

app.put("/users/role", checkAdmin, (req, res) => {
    const { userId, role } = req.body;

    const q = "UPDATE users SET role = ? WHERE id = ?";
    db.query(q, [role, userId], (err) => {
        if (err) return res.json({ success: false, error: "DB error" });
        res.json({ success: true });
    });
});

app.post("/users/save", (req, res) => {
    const { id, name, email, password } = req.body;

    // ===== validation =====
    if (!name || name.length < 3) {
        return res.json({
            success: false,
            errors: { name: "Имя минимум 3 символа" },
        });
    }

    if (!email) {
        return res.json({
            success: false,
            errors: { email: "Email обязателен" },
        });
    }

    // ===== check email unique =====
    const checkSql = id
        ? "SELECT id FROM users WHERE email = ? AND id <> ?"
        : "SELECT id FROM users WHERE email = ?";

    const checkParams = id ? [email, id] : [email];

    db.query(checkSql, checkParams, (err, rows) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: "DB error",
            });
        }
console.log(rows.length);
        if (rows.length > 0) {

            console.log('rows.length > 0');
            return res.json({
                success: false,
                errors: {
                    email: "Пользователь с таким email уже существует",
                },
            });
        }
        console.log('rows.length NOT > 0');

        // ===== save =====
        if (id) {
            // EDIT
            let sql = "UPDATE users SET name=?, email=?";
            const params = [name, email];

            if (password) {
                sql += ", password=?";
                params.push(password);
            }

            sql += " WHERE id=?";
            params.push(id);

            db.query(sql, params, (err) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        error: "DB error",
                    });
                }

                res.json({ success: true });
            });
        } else {
            // ADD
            const sql =
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

            db.query(sql, [name, email, password], (err) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        error: "DB error",
                    });
                }

                res.json({ success: true });
            });
        }
    });
});

app.delete("/user_delete/:id", (req, res) => {
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

app.get("/admin/check", checkAdmin, (req, res) => {
    res.json({ success: true });
});

// ===== LISTEN (ДОЛЖНО БЫТЬ ПОСЛЕ ВСЕХ РОУТОВ!) =====
app.listen(8800, () => {
    console.log("Backend server running on port 8800");
});
