/*
import { useEffect, useState } from "react";

export default function App() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8800/users")
            .then((res) => res.json())
            .then((data) => {
                console.log("DATA FROM BACKEND:", data);
                setUsers(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.log("FETCH ERROR:", err));
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Users</h1>

            {!users.length && <div>No data</div>}

            {users.map((u) => (
                <div key={u.id} style={{ marginBottom: "10px" }}>
                    <strong>{u.name}</strong> – {u.email}
                </div>
            ))}
        </div>
    );
}
*/

/*
import UsersPage from "./pages/Users";

function App() {
    return <UsersPage />;
}

export default App;
*/

import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Users from "./pages/Users";
import About from "./pages/About";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="users" element={<Users />} />
                <Route path="about" element={<About />} />
            </Route>
        </Routes>
    );
}
