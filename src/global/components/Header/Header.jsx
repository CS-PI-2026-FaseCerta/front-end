import React, { useState } from "react";
import { FaMoon } from "react-icons/fa";
import "./Header.css";


const Header = () => {
    return(
        <header className="page-header">
            <div className="logo">FaseCerta</div>
            <div className="theme-icon">
                <FaMoon size={20} />
            </div>
        </header>

    )
}

export default Header;