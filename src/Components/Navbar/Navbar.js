import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <div className="nav-container">
      <div className="nav-content bd-container">
        <div className="nav-logo">
          <Link to="/">Logo</Link>
        </div>

        <ul className="navbar-menu">
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
