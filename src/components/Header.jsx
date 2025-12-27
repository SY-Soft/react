import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container">
                <Link className="navbar-brand" to="/">MyReact</Link>
                {user ? (
                    <>
                        <span className="sy-header-debug">Ты {user.name}, и ты {user.role===1?'admin':'user'}</span>
                    </>
                ) : (
                    <>
                        <span className="sy-header-debug">Ты гость ;)</span>
                    </>
                )}
                <div className="navbar-nav">
                    <Link className="nav-link" to="/">Главная</Link>
                    <Link className="nav-link" to="/more_details">Подробнее</Link>
                    <Link className="nav-link" to="/about">О проекте</Link>
                    <Link className="nav-link" to="/users">Юзеры</Link>
                    {user ? (
                        <Link className="nav-link sy-link-ico" onClick={logout}><i className="bi bi-box-arrow-right"></i></Link>
                    ) : (
                        <Link className="nav-link sy-link-ico" to="/login"><i className="bi bi-box-arrow-in-right"></i></Link>
                    )}


                </div>
            </div>
        </nav>
    );
}