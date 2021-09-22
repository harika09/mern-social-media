import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Logo from "../../Assets/images/logo.png";
import Axios from "axios";
import "./Login.css";

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = (e) => {
    e.preventDefault();

    Axios.post(`https://mern-social-konek.herokuapp.com/auth/login`, {
      email: email,
      password: password,
    }).then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        /* Saving user Data and JWT token to local Storage */
        localStorage.setItem("Token", response.data.token);
        localStorage.setItem("User", JSON.stringify(response.data.user));
        history.push("/");
      }
    });
  };

  useEffect(() => {
    if (localStorage.getItem("Token")) {
      history.push("/");
    }
  });

  return (
    <div className="login-container">
      <div className="login-content bd-container">
        <div className="login-logo">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="login-form">
          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}
          <form onSubmit={login}>
            <label htmlFor="email">Email</label>
            <div className="email">
              <i className="far fa-envelope"></i>
              <input
                type="email"
                placeholder="Enter Emaill Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <label htmlFor="password">Password</label>
            <div className="pass">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <input type="submit" value="Login" />
          </form>

          <div className="login-low-content">
            <div className="reset">
              <Link to="#">Reset Password</Link>
            </div>

            <div className="register">
              <Link to="/register">Register?</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
