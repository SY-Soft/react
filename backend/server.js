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
        return authFail(res, "Нет токена");
    }

    try {
        const token = auth.split(" ")[1];
        const decoded = jwt.verify(token, SECRET);

        // админ (role === 1) ИЛИ владелец (id совпадает)
        if (decoded.role !== 1 && decoded.id !== req.body.id) {
            return fail(res, {
                type: "AUTH",
                message: "Недостаточно прав",
            });
        }

        req.user = decoded;
        next();

    } catch (e) {
        return authFail(res, "Невалидный или истёкший токен");
    }
}

app.get("/admin/check", checkAdmin, (req, res) => {
    return ok(res);
});
app.get("/users/get_all", (req, res) => {
    db.query(
        "SELECT id, name, email, role FROM users",
        (err, rows) => {
            if (err) { return fail(res, { type: "BUSINESS", message: "Ошибка базы данных",});}
            return ok(res,  rows);
        }
    );

});
app.put("/users/role", checkAdmin, (req, res) => {
    const { userId, role } = req.body;

    const q = "UPDATE users SET role = ? WHERE id = ?";
    db.query(q, [role, userId], (err, result) => {
        if (err) { return fail(res, { type: "BUSINESS", message: "Ошибка базы данных",});}
        return ok(res);
    });
});
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

    const q = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(q, [email, password], (err, rows) => {
        if (err) { return fail(res, { type: "BUSINESS", message: "Ошибка базы данных",});}

        if (rows.length === 0) {
            return authFail(res, "Неверный логин или пароль");

        }

        const user = rows[0];
        const role = user.role;

        const token = jwt.sign(
            { id: user.id, email: user.email, role },
            SECRET,
            { expiresIn: "2h" }
        );

        return ok(res, {token,user,});

    });
});
app.post("/user/get", checkAdmin, (req, res) => {
    const q = "SELECT id, name, email, role FROM users WHERE id = ?";
    db.query(q, [req.body.id], (err, data) => {
        if (err) { return fail(res, { type: "BUSINESS", message: "Ошибка базы данных",});}
        if (data.length === 0) { return fail(res, { type: "BUSINESS", message: "Пользователь не найден",});}
        return ok(res,  data[0]);
    });
});
app.delete("/user_delete/:id", (req, res) => {
    const userId = req.params.id;
    const q = "DELETE FROM users WHERE id = ?";
    db.query(q, [userId], (err, data) => {
        if (err) { return fail(res, { type: "BUSINESS", message: "Ошибка базы данных",});}
        return ok(res,  userId);
    });
});

app.post("/users/save", async (req, res) => {
    const { id, name, email, password } = req.body;

    // ===== validation =====
    const errors = {};

    if (!name || name.length < 3) {
        errors.name = "Имя минимум 3 символа";
    }

    if (!email) {
        errors.email = "Email обязателен";
    }

    if (Object.keys(errors).length) {
        return fail(res, {
            type: "VALIDATION",
            errors,
        });
    }

    try {
        // ===== unique email =====
        const isUnique = await checkEmailUnique(email, id);

        if (!isUnique) {
            return fail(res, {
                type: "VALIDATION",
                errors: {
                    email: "Пользователь с таким email уже существует",
                },
            });
        }

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

            await new Promise((resolve, reject) => {
                db.query(sql, params, err => {
                    if (err) return reject(err);
                    resolve();
                });
            });

        } else {
            // ADD
            const sql =
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

            await new Promise((resolve, reject) => {
                db.query(sql, [name, email, password], err => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        }

        return ok(res);

    } catch (err) {
        return fail(res, {
            type: "BUSINESS",
            message: "Ошибка базы данных",
        });
    }
});

function checkEmailUnique(email, excludeId = null) {
    return new Promise((resolve, reject) => {
        const sql = excludeId
            ? "SELECT id FROM users WHERE email = ? AND id <> ?"
            : "SELECT id FROM users WHERE email = ?";

        const params = excludeId ? [email, excludeId] : [email];

        db.query(sql, params, (err, rows) => {
            if (err) {
                return reject(new Error("DB_ERROR"));
            }

            if (rows.length > 0) {
                return resolve(false); // ❗ не reject
            }

            resolve(true);
        });
    });
}

function ok(res, data = null, message = null) {
    return res.json({
        success: true,
        data,
        message,
    });
}

function fail(res,
              {
        type = "BUSINESS",
        errors = null,
        message = "Ошибка",
    } = {})
{
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

app.listen(8800, () => {
    console.log("Backend server running on port 8800");
});
