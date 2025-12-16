// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./index.css";

import { RouterProvider } from "react-router-dom";
import router from "./router";

import { AuthProvider } from "./AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <NotificationProvider>
                <RouterProvider router={router} />
            </NotificationProvider>
        </AuthProvider>
    </React.StrictMode>
);
