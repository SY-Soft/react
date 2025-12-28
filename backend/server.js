import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { db } from "./db.js";

dotenv.config();
const SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;
const PORT = process.env.SERVER_PORT;

const app = express();
app.use(cors({
    origin: CLIENT_URL,
    credentials: true,
}));
app.use(express.json());



if (!SECRET) {
    throw new Error("JWT_SECRET not defined");
}

/* ===================== HELPERS ===================== */

function ok(res, data = null, message = null) {
    return res.json({
        success: true,
        data,
        message,
    });
}

function fail(
    res,
    {
        type = "BUSINESS",
        errors = null,
        message = "Ошибка",
    } = {}
) {
    return res.json({
        success: false,
        type,
        errors,
        message,
    });
}

function authFail(res, message = "Unauthorized") {
    return res.json({
        success: false,
        type: "AUTH",
        message,
    });
}

/* ===================== MIDDLEWARE ===================== */

function checkAdmin(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) {
        return authFail(res, "Нет токена");
    }

    try {
        const token = auth.split(" ")[1];
        const decoded = jwt.verify(token, SECRET);

        // админ (role === 1) ИЛИ владелец
        if (decoded.role !== 1 && decoded.id !== req.body.id) {
            return authFail(res, "Недостаточно прав");
        }

        req.user = decoded;
        next();
    } catch (e) {
        return authFail(res, "Невалидный или истёкший токен");
    }
}

/* ===================== AUTH ===================== */

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return fail(res, {
            type: "VALIDATION",
            errors: {
                email: !email ? "Обязательное поле" : undefined,
                password: !password ? "Обязательное поле" : undefined,
            },
        });
    }

    const q = "SELECT * FROM users WHERE email = ?";
    db.query(q, [email], async (err, rows) => {
        if (err) {
            return fail(res, { type: "BUSINESS", message: "Ошибка базы данных" });
        }

        if (rows.length === 0) {
            return authFail(res, "Неверный логин или пароль");
        }

        const user = rows[0];

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return authFail(res, "Неверный логин или пароль");
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            SECRET,
            { expiresIn: "2h" }
        );

        delete user.password;

        return ok(res, { token, user });
    });
});

app.get("/admin/check", checkAdmin, (req, res) => {
    return ok(res);
});

/* ===================== USERS ===================== */

app.get("/users/get_all", (req, res) => {
    const q = "SELECT id, name, email, role FROM users";
    db.query(q, (err, rows) => {
        if (err) {
            return fail(res, { type: "BUSINESS", message: "Ошибка базы данных" });
        }
        return ok(res, rows);
    });
});

app.post("/user/get", checkAdmin, (req, res) => {
    const q = "SELECT id, name, email, role FROM users WHERE id = ?";
    db.query(q, [req.body.id], (err, rows) => {
        if (err) {
            return fail(res, { type: "BUSINESS", message: "Ошибка базы данных" });
        }
        if (rows.length === 0) {
            return fail(res, { message: "Пользователь не найден" });
        }
        return ok(res, rows[0]);
    });
});

app.put("/users/role", checkAdmin, (req, res) => {
    const { userId, role } = req.body;

    const q = "UPDATE users SET role = ? WHERE id = ?";
    db.query(q, [role, userId], err => {
        if (err) {
            return fail(res, { type: "BUSINESS", message: "Ошибка базы данных" });
        }
        return ok(res);
    });
});

app.delete("/user_delete/:id", (req, res) => {
    const q = "DELETE FROM users WHERE id = ?";
    db.query(q, [req.params.id], err => {
        if (err) {
            return fail(res, { type: "BUSINESS", message: "Ошибка базы данных" });
        }
        return ok(res, req.params.id);
    });
});

/* ===================== SAVE USER ===================== */

app.post("/users/save", async (req, res) => {
    const { id, name, email, password } = req.body;

    const errors = {};
    if (!name || name.length < 3) errors.name = "Имя минимум 3 символа";
    if (!email) errors.email = "Email обязателен";

    if (Object.keys(errors).length) {
        return fail(res, { type: "VALIDATION", errors });
    }

    try {
        const unique = await checkEmailUnique(email, id);
        if (!unique) {
            return fail(res, {
                type: "VALIDATION",
                errors: { email: "Email уже существует" },
            });
        }

        if (id) {
            let sql = "UPDATE users SET name=?, email=?";
            const params = [name, email];

            if (password) {
                const hash = await bcrypt.hash(password, 10);
                sql += ", password=?";
                params.push(hash);
            }

            sql += " WHERE id=?";
            params.push(id);

            await query(sql, params);
        } else {
            const hash = await bcrypt.hash(password, 10);
            await query(
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                [name, email, hash]
            );
        }

        return ok(res);
    } catch (e) {
        return fail(res, { type: "BUSINESS", message: "Ошибка базы данных" });
    }
});

/* ===================== UTILS ===================== */

function query(sql, params) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, err => {
            if (err) reject(err);
            else resolve();
        });
    });
}

function checkEmailUnique(email, excludeId = null) {
    return new Promise((resolve, reject) => {
        const sql = excludeId
            ? "SELECT id FROM users WHERE email=? AND id<>?"
            : "SELECT id FROM users WHERE email=?";
        const params = excludeId ? [email, excludeId] : [email];

        db.query(sql, params, (err, rows) => {
            if (err) reject(err);
            resolve(rows.length === 0);
        });
    });
}

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
