import { useState, useEffect } from "react";

export default function StaffTable() {
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 20;

    async function load() {
        const url = `http://localhost:3001/staff?_page=${page}&_limit=${limit}`;
        console.log('url='+url );
        const res = await fetch(url);
        const data = await res.json();
        setList(data);
    }

    useEffect(() => {
        load();
    }, [page]);

    function prev() {
        if (page > 1) setPage(page - 1);
    }

    function next() {
        setPage(page + 1);
        console.log('page='+page );
    }

    return (
        <div className="container mt-5">
            <h3>Сотрудники — страница {page}</h3>

            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Имя</th>
                    <th>Email</th>
                    <th>Телефон</th>
                </tr>
                </thead>

                <tbody>
                {list.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="d-flex gap-2">
                <button className="btn btn-secondary" onClick={prev}>Назад</button>
                <button className="btn btn-primary" onClick={next}>Вперёд</button>
            </div>
        </div>

    );
}
