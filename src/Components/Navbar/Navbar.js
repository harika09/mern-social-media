import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../Assets/images/logo.png";
import "./Navbar.css";

function Navbar() {
  const [click, setClick] = useState(false);

  const navActive = () => setClick(!click);

  return (
    <div className="nav-container">
      <div className="nav-content bd-container">
        <div className="nav-logo">
          <Link to="/">
            <img src={Logo} alt="logo" />
          </Link>
        </div>

        <div
          className={click ? "menu-toggle active" : "menu-toggle"}
          onClick={navActive}
        >
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
        </div>

        <ul className={click ? "navbar-menu active" : "navbar-menu"}>
          <li className="nav-list">
            <i className="fas fa-home"></i>
            <Link to="/">Home</Link>
          </li>

          <li className="nav-list">
            <i className="fas fa-plus-circle"></i>
            <Link to="/post">Create Post</Link>
          </li>

          <li className="nav-list">
            <i className="fas fa-user-circle"></i>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
