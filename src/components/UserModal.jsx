import { useEffect, useState } from "react";

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

    // ===== form state =====
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // ===== load user for edit / delete =====
    useEffect(() => {
        if (!userId) return;
        if (!isEdit && !isDelete) return;

        setLoading(true);

        fetch(`http://localhost:8800/users/${userId}`)
            .then(res => res.json())
            .then(data => {
                setTargetUser(data);

                if (isEdit) {
                    setName(data.name || "");
                    setEmail(data.email || "");
                    setPassword("");
                }
            })
            .finally(() => setLoading(false));
    }, [mode, userId]);

    // ===== delete =====
    async function handleDelete() {
        setLoading(true);
        setError("");

        try {
            const res = await fetch(
                `http://localhost:8800/users/${userId}`,
                { method: "DELETE" }
            );

            const data = await res.json();

            if (!data.success) {
                setError("Ошибка удаления");
                return;
            }

            onDone();
            onClose();
        } catch (e) {
            setError("Сервер недоступен");
        } finally {
            setLoading(false);
        }
    }

    // ===== add / edit =====
    async function handleSubmit() {
        setLoading(true);
        setError("");

        console.log("TOKEN:", localStorage.getItem("token"));


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
