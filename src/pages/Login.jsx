import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { apiFetch } from "../utils/api";

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setFieldErrors({});
        try {
            const data = await apiFetch("/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            // data = { token, user }
            login(data);
            navigate("/");

        } catch (err) {
            // ошибка авторизации (неверный логин/пароль)
            if (err.type === "AUTH") {
                setError(err.message);
                return;
            }

            // валидация (пустые поля и т.п.)
            if (err.type === "VALIDATION") {
                setFieldErrors(err.errors || {});
                return;
            }

            // всё остальное
            setError(err.message || "Ошибка входа");
            console.error(err);
        }
    }

    return (
        <div className="container col-md-4 mt-5">
            <h2>Вход</h2>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <input
                    className={`form-control mb-2 ${fieldErrors.email ? "is-invalid" : ""}`}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <div className="invalid-feedback mt-0 mb-4">
                    {fieldErrors.email}
                </div>

                <input
                    className={`form-control mb-2 ${fieldErrors.password ? "is-invalid" : ""}`}
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <div className="invalid-feedback mt-0 mb-4">
                    {fieldErrors.password}
                </div>

                <button className="btn btn-primary w-100">
                    Войти
                </button>
            </form>
        </div>
    );
}
