import React from "react";
import ReactDOM from "react-dom/client";

// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './index.css';

// React Router
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";

import router from "./router";   // <<< ВАЖНО!!!
import { AuthProvider } from "./AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
);
