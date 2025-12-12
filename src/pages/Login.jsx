import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:8800/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.error || "Ошибка входа");
                return;
            }

            login(data);     // сохраняет токен + user в localStorage (AuthContext)
            navigate("/");   // навигация без перезагрузки
        } catch (err) {
            setError("Сетевая ошибка");
            console.error(err);
        }
    }

    return (
        <div className="container col-md-4 mt-5">
            <h2>Вход</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <input className="form-control mb-2" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
                <input className="form-control mb-3" type="password" placeholder="Пароль" value={password} onChange={e=>setPassword(e.target.value)} />
                <button className="btn btn-primary w-100">Войти</button>
            </form>
        </div>
    );
}
