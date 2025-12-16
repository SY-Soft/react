import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api.js";
import { useNotify } from "../context/NotificationContext";



export default function UserModal({
                                      mode,
                                      userId,
                                      onDone,
                                      onClose,
                                  }) {
    const isEdit = mode === "edit";
    const isAdd = mode === "add";
    const isDelete = mode === "delete";

    const [loading, setLoading] = useState(false);
    const [targetUser, setTargetUser] = useState(null);
    const [error, setError] = useState("");

    const { notify } = useNotify();

    // ===== form state =====
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // ===== load user for edit / delete =====
    useEffect(() => {
        if (!userId) return;
        if (!isEdit && !isDelete) return;

        setLoading(true);
        setError("");

        const loadUser = async () => {
            try {
                const data = await apiFetch("/user/get", {
                    method: "POST",
                    body: JSON.stringify({ id: userId }),
                });

                setTargetUser(data);

                if (isEdit) {
                    setName(data.name || "");
                    setEmail(data.email || "");
                    setPassword("");
                }
            } catch (e) {
                console.error("loadUser error1:", e);

                // 🔴 JWT умер / нет доступа
                if (e.type === "AUTH") {
                    setError("Сессия истекла. Перезайдите.");
                    notify("Сессия истекла. Перезайдите.", "danger");
                    onClose(); // закрываем модалку
                    return;
                }

                setError("Ошибка загрузки пользователя");
                notify("Ошибка загрузки пользователя", "danger");
            } finally {
                setLoading(false);
            }
        };

        loadUser();

    }, [mode, userId]);

    // ===== delete =====
    async function handleDelete() {
        setLoading(true);
        try {
            await apiFetch(`/user_delete/${userId}`, {
                method: "DELETE",
            });

            notify("Пользователь удален", "success");
            onDone();
            onClose();

        } catch (e) {
            notify(e.message, "danger");
        }
        //**
        // setLoading(true);
        // setError("");
    }

    // ===== add / edit =====
    async function handleSubmit() {
        setLoading(true);
        try {
            const payload = {
                id: isEdit ? targetUser.id : null,
                name,
                email,
                password: password || null,
            };

            await apiFetch(`/users/save`, {
                method: "POST",
                body: JSON.stringify(payload),
            });

            notify(`Пользователь ${isEdit ? "обновлен" : "добавлен"}`, "success");
            onDone();
            onClose();

        } catch (e) {
            notify(e.message, "danger");
        }

        /*
        setLoading(true);
        setError("");
        console.log("handleSubmit TOKEN:", localStorage.getItem("token"));
        try {
            const payload = {
                id: isEdit ? targetUser.id : null,
                name,
                email,
                password: password || null,
            };

            await fetch("http://localhost:8800/users/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(payload),
            });

            onDone();
            onClose();
        } catch (e) {
            setError("Ошибка сохранения");
        } finally {
            setLoading(false);
        }
        */
    }

    if (!mode) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">
                            {isAdd && "Добавить пользователя"}

                            {isEdit && targetUser && (
                                <>
                                    Редактирование пользователя:{" "}
                                    <strong>
                                        {targetUser.name}
                                        {targetUser.role === 1 ? " (admin)" : ""}
                                    </strong>
                                </>
                            )}

                            {isDelete && "Удалить пользователя"}
                        </h5>

                        <button className="btn-close" onClick={onClose} />
                    </div>

                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-danger">{error}</div>
                        )}

                        {isDelete && (
                            <>
                                {loading && <p>Загрузка...</p>}

                                {targetUser && (
                                    <p>
                                        Вы уверены, что хотите удалить пользователя{" "}
                                        <strong>
                                            {targetUser.name}
                                            {targetUser.role === 1 ? " (admin)" : ""}
                                        </strong>
                                        ?
                                    </p>
                                )}
                            </>
                        )}

                        {(isAdd || isEdit) && (
                            <>
                                <div className="mb-3">
                                    <label className="form-label">Имя</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Пароль {isEdit && "(необязательно)"}
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Отмена
                        </button>

                        {isDelete && (
                            <button
                                className="btn btn-danger"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                Удалить
                            </button>
                        )}

                        {(isAdd || isEdit) && (
                            <button
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {isAdd ? "Добавить" : "Сохранить"}
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
