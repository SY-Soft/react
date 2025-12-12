import { Link } from "react-router-dom";

export default function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container">
                <Link className="navbar-brand" to="/">MyReact</Link>

                <div className="navbar-nav">
                    <Link className="nav-link" to="/">Главная</Link>
                    <Link className="nav-link" to="/users">Юзеры</Link>
                    <Link className="nav-link" to="/about">О нас</Link>
                </div>
            </div>
        </nav>
    );
}
