import { useRef, useState } from "react";
import { Modal } from "bootstrap";

export default function AddUserModal({ onAdd }) {

    const modalRef = useRef(null);
    const bsModal = useRef(null);

    // Данные формы
    const [form, setForm] = useState({
        name: "",
        email: "",
        pass: ""
    });

    // Ошибки валидации
    const [errors, setErrors] = useState({});

    // Открытие модалки
    function open() {
        if (!bsModal.current) {
            bsModal.current = new Modal(modalRef.current);
        }
        bsModal.current.show();
    }

    // Валидация
    function validate() {
        let e = {};

        if (!form.name.trim()) e.name = "Введите имя";
        if (!form.email.trim()) e.email = "Введите email";
        else if (!form.email.includes("@")) e.email = "Некорректный email";

        if (!form.pass.trim()) e.pass = "Введите пароль";
        else if (form.pass.length < 6) e.pass = "Слишком короткий пароль";

        setErrors(e);
        return Object.keys(e).length === 0;
    }

    // Сохранение
    async function save() {
        if (!validate()) return;

        const res = await fetch("http://localhost:8800/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        if (!res.ok) {
            alert("Ошибка сохранения!");
            return;
        }

        // Обновить список в Users.jsx
        onAdd();

        // Закрыть модалку
        bsModal.current.hide();

        // Очистить форму
        setForm({ name: "", email: "", pass: "" });
        setErrors({});
    }

    return (
        <>
            {/* Кнопка открытия */}
            <button className="btn btn-primary" onClick={open} disabled>
                <i className="bi bi-person-fill-add"></i> Добавить юзера
            </button>

            {/* Модалка */}
            <div className="modal fade" tabIndex="-1" ref={modalRef}>
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">Добавить пользователя</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => bsModal.current.hide()}
                            ></button>
                        </div>

                        <div className="modal-body">

                            {/* Имя */}
                            <div className="mb-3">
                                <label className="form-label">Имя</label>
                                <input
                                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                />
                                {errors.name && (
                                    <div className="invalid-feedback">{errors.name}</div>
                                )}
                            </div>

                            {/* Email */}
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({ ...form, email: e.target.value })
                                    }
                                />
                                {errors.email && (
                                    <div className="invalid-feedback">{errors.email}</div>
                                )}
                            </div>

                            {/* пароль */}
                            <div className="mb-3">
                                <label className="form-label">Пароль</label>
                                <input
                                    className={`form-control ${errors.pass ? "is-invalid" : ""}`}
                                    value={form.pass}
                                    onChange={(e) =>
                                        setForm({ ...form, pass: e.target.value })
                                    }
                                />
                                {errors.pass && (
                                    <div className="invalid-feedback">{errors.pass}</div>
                                )}
                            </div>

                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => bsModal.current.hide()}
                            >
                                Отмена
                            </button>

                            <button className="btn btn-primary" onClick={save}>
                                Сохранить
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
