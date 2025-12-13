import { useEffect, useRef, useState } from "react";
import UserModal from "../components/UserModal";
import {useAuth} from "../AuthContext.jsx";

export default function Users() {
    const [users, setUsers] = useState([]);
    const { user } = useAuth();
    const modalRef = useRef(null); // не обязательно, но можно
    const API = import.meta.env.VITE_API || "http://localhost:8800";

    async function loadUsers() {
        try {
            const res = await fetch(`${API}/users`);
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Load users error", err);
            setUsers([]);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);


    async function changeRole(userId, newRole) {
      //  if (!window.confirm("Изменить роль пользователя?")) return;
        console.log("TOKEN:", localStorage.getItem("token"));

        const res = await fetch("http://localhost:8800/users/role", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                userId,
                role: newRole,
            }),
        });

        const data = await res.json();

        if (!data.success) {
            alert(data.error);
            return;
        }

        loadUsers(); // перезагрузка списка
    }
    const isAdmin = user?.role === 1;

    const [modalMode, setModalMode] = useState(null);
    const [modalUserId, setModalUserId] = useState(null);

    const [currentUser, setCurrentUser] = useState(null);

    function openAdd() {
        setModalMode("add");
        setModalUserId(null);
    }

    function openEdit(id) {
        setModalMode("edit");
        setModalUserId(id);
    }

    function openDelete(user) {
        setCurrentUser(user);
        setModalMode("delete");
        modalRef.current.open();
    }



    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Пользователи</h2>

                <UserModal
                    mode={modalMode}
                    userId={modalUserId}
                    onDone={() => {
                        loadUsers();
                        setModalMode(null);
                    }}
                    onClose={() => setModalMode(null)}
                />
                <button className="btn btn-primary" onClick={openAdd}>
                    Добавить
                </button>
                {/*
                <button className="btn btn-primary" onClick={openAdd}>
                    <i className="bi bi-person-fill-add me-1"></i> Добавить
                </button>
            */}
            </div>

            <div className="row fw-bold border-bottom pb-2">
            <div className="col-4">Имя</div>
                <div className="col-4">Email</div>
                <div className="col-4">...</div>
            </div>


            {users.map((u) => (
                <div className="row py-2 border-bottom" key={u.id}>
                    <div className="col-4">{u.name + (u.role===1?' (admin)':'')}</div>
                    <div className="col-4">{u.email}</div>
                    <div className="col-4">

                        {u.role === 1 ? (
                            <i
                                className={`bi bi-person-fill-down sy-user-op ${isAdmin ? "text-success" : "text-secondary"}`}
                                role="button"
                                onClick={() => isAdmin && changeRole(u.id, 0)}
                                title="Сделать пользователем"
                            />
                        ) : (
                            <i
                                className={`bi bi-person-fill-up sy-user-op ${isAdmin ? "text-warning" : "text-secondary"}`}
                                role="button"
                                onClick={() => isAdmin && changeRole(u.id, 1)}
                                title="Сделать админом"
                            />
                        )}
                        <i
                            className="bi bi-person-fill-slash text-danger"
                            role="button"
                            onClick={() => openDelete(u)}
                        />

                        <i
                            className="bi bi-person-fill-gear"
                            role="button"
                            onClick={() => openEdit(u.id)}
                        />
                        <i className="bi bi-person-fill-gear"></i>
                        <i className="bi bi-person-fill-slash"></i>
                    </div>
                </div>
            ))}
        </div>
    );
}
