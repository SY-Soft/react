import { useState } from "react";

export default function SyForm() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: ""
    });

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function loadList() {
        const res = await fetch("http://localhost:3001/staff");
        const data = await res.json();
        alert("Получено: " + data.length + " сотрудников\n\n" + JSON.stringify(data, null, 2));
    }


    function action(msg) {
        alert("Нажата кнопка: " + msg + "\n\n" + JSON.stringify(form, null, 2));
    }

    return (
        <div className="container mt-4">
            <h2>SY React Base</h2>

            <div className="mb-3">
                <label>Имя</label>
                <input
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-3">
                <label>Email</label>
                <input
                    name="email"
                    className="form-control"
                    value={form.email}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-3">
                <label>Телефон</label>
                <input
                    name="phone"
                    className="form-control"
                    value={form.phone}
                    onChange={handleChange}
                />
            </div>

            <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={() => action("Добавить")}>Добавить</button>
                <button className="btn btn-secondary" onClick={() => action("Редактировать")}>Редактировать</button>
                <button className="btn btn-warning" onClick={() => action("Очистить форму")}>Очистить</button>
                <button className="btn btn-danger" onClick={() => action("Удалить")}>Удалить</button>
                <button className="btn btn-success" onClick={loadList}>Список</button>
            </div>
        </div>
    );
}
