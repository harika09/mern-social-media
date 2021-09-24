import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./Page404.css";
import image from "../../Assets/images/3.svg";

function Page404() {
  return (
    <>
      <Navbar />

      <div className="error-404-container">
        <div className="error-404-content bd-container">
          <div className="error-info">
            <img src={image} alt="error-404" />
            <p>The page you're looking for can't be found</p>
            <Link to="/" className="back-home">
              Back To Home Page
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page404;
