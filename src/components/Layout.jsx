import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Шапка — всегда сверху */}
            <Header />

            {/* Контент — растягивается */}
            <main className="flex-grow-1">
                <div className="container py-4">
                    <Outlet />
                </div>
            </main>

            {/* Подвал всегда снизу */}
            <Footer />
        </div>
    );
}
