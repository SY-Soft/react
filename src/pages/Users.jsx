import { useEffect, useRef, useState } from "react";
import AddUserModal from "../components/AddUserModal";
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
                    <div className="col-4">{u.name + (u.role===1?' (admin)':'')}</div>
                    <div className="col-4">{u.email}</div>
                    <div className="col-4">
                        {/* if (user.role==='admin') let btnDisable=FALSE; else let btnDisable=TRUE; */}
                        { /* if (u.role===1) */ }
                        <a href={'#'} className="sy-user-op"><i className="bi bi-person-fill-down"></i></a>
                        { /* else */ }
                        <a href={'#'} className="sy-user-op"><i className="bi bi-person-fill-up"></i></a>
                        { /* endif) */ }
                        <a href={'#'} className="sy-user-op"><i className="bi bi-person-fill-gear"></i></a>
                        <a href={'#'} className="sy-user-op"><i className="bi bi-person-fill-slash"></i></a>
                    </div>
                </div>
            ))}
        </div>
    );
}
