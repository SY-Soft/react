import { useEffect, useRef, useState } from "react";
import AddUserModal from "../components/AddUserModal";

export default function Users() {
    const [users, setUsers] = useState([]);
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


    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Пользователи</h2>

                <AddUserModal onAdd={loadUsers} ref={modalRef} />

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
                    <div className="col-4">{u.name}</div>
                    <div className="col-4">{u.email}</div>
                    <div className="col-4">SYMARK2 = Всем пусто, юзерам дизаблет edit+delete, админам edit+delete </div>
                </div>
            ))}
        </div>
    );
}
