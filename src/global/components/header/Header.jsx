import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import useTheme from "../../hooks/useTheme";
import "./Header.css";

const Header = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="page-header">
            <div className="logo">FaseCerta</div>
            <button
                type="button"
                className="theme-icon"
                aria-label="Alternar tema"
                onClick={toggleTheme}
            >
                {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
        </header>
    );
};

export default Header;