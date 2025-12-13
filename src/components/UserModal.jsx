import { useEffect , useState } from "react";

export default function UserModal({
                                      mode,
                                      userId,
                                      onDone,
                                      onClose
                                  }) {
    if (!mode) return null; // ← аналог "модалка скрыта"
    const [loading, setLoading] = useState(false);
    const [targetUser, setTargetUser] = useState(null);

    useEffect(() => {
        if (!userId) return;
        if (mode !== "edit" && mode !== "delete") return;

        setLoading(true);

        fetch(`http://localhost:8800/users/${userId}`)
            .then(res => res.json())
            .then(data => {
                setTargetUser(data);
            })
            .finally(() => setLoading(false));
    }, [mode, userId]);

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
                            <button className="btn btn-danger">
                                Удалить
                            </button>
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
