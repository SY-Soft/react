import { useEffect , useState } from "react";



export default function UserModal({
                                      mode,
                                      userId,
                                      onDone,
                                      onClose
                                  }) {
    const [loading, setLoading] = useState(false);
    const [targetUser, setTargetUser] = useState(null);
    const [error, setError] = useState("");

    async function handleDelete() {
        setLoading(true);
        setError("");
        console.log('handleDelete2');
        console.log(userId);
        try {
            const res = await fetch(
                `http://localhost:8800/users/${userId}`,
                {
                    method: "DELETE",
                }
            );

            const data = await res.json();

            if (!data.success) {
                setError("Ошибка удаления");
                return;
            }

            onDone();          // обновляем список
            closeModal();      // закрываем модалку
        } catch (e) {
            setError("Сервер недоступен");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!userId) return;
        if (mode !== "edit" && mode !== "delete") return;

        setLoading(true);

        fetch(`http://localhost:8800/users/${userId}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setTargetUser(data);
            })
            .finally(() => setLoading(false));
    }, [mode, userId]);

    if (!mode) return null; // ← аналог "модалка скрыта"

    return (
        <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">
                            {mode === "add" && "Добавить пользователя"}

                            {mode === "edit" && targetUser && (
                                <div className="alert alert-secondary py-2">
                                    Редактирование пользователя:{" "}
                                    <strong>
                                        {targetUser.name}
                                        {targetUser.role === 1 ? " (admin)" : ""}
                                    </strong>
                                </div>
                            )}

                            {mode === "delete" && "Удалить пользователя"}
                        </h5>
                        <button className="btn-close" onClick={onClose} />
                    </div>

                    <div className="modal-body">
                        {mode === "delete" && (
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


                        {(mode === "add" || mode === "edit") && (
                            <>
                                <div className="mb-3">
                                    <label className="form-label">Имя</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Имя"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Email"
                                    />
                                </div>

                                    <div className="mb-3">
                                        <label className="form-label">Пароль</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Пароль"
                                        />
                                    </div>
                            </>
                        )}

                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Отмена
                        </button>

                        {mode === "delete" && (
                            <div className="d-flex justify-content-end gap-2">


                                <button
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                    disabled={loading}
                                >
                                    Удалить
                                </button>
                            </div>
                        )}


                        {(mode === "add" || mode === "edit") && (
                            <button className="btn btn-primary">
                                Сохранить
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
