import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Following.css";
import Navbar from "../Navbar/Navbar";

function Following() {
  return (
    <>
      <Navbar />
      <div className="following-container">
        <div className="following-content bd-container">Following Page</div>
      </div>
    </>
  );
}

export default Following;
