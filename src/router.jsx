import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Users from "./pages/Users";
import About from "./pages/About";
import More_details from "./pages/More_details";
import Login from "./pages/Login.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/more_details", element: <More_details /> },
            { path: "/about", element: <About /> },
            { path: "/users", element: <Users /> },
            { path: "/login", element: <Login /> },
        ]
    }
]);

export default router;
