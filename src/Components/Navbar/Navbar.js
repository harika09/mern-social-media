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
            <Link to="/">Home</Link>
          </li>

          <li className="nav-list">
            <Link to="/post">Create Post</Link>
          </li>

          <li className="nav-list">
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
