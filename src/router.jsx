import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Users from "./pages/Users";
import About from "./pages/About";
import Login from "./pages/Login.jsx";
// import AddUser from "./pages/AddUser";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,    // ← Layout со шапкой
        children: [
            { path: "/", element: <Home /> },
            { path: "/users", element: <Users /> },
            { path: "/about", element: <About /> },
            { path: "/login", element: <Login /> },
/*            { path: "/add", element: <AddUser /> }, */
        ]
    }
]);

export default router;
