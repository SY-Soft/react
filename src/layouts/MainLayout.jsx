import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <>
            <div className="layout-wrapper">
                <Header/>
                <main className="container my-4">
                    <Outlet/>
                </main>
                <Footer/>
            </div>

        </>
    );
}
