import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Logo from "../../Assets/images/logo.png";
import { HashLoader } from "react-spinners";
import Axios from "axios";
import "./Register.css";

function Register() {
  const history = useHistory();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isloading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const Register = (e) => {
    e.preventDefault();

    setLoading(true);

    Axios.post(`https://mern-social-konek.herokuapp.com/auth/register`, {
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: password,
    }).then((response) => {
      if (response.data.error) {
        setLoading(false);
        setError(response.data.error);
      } else {
        setLoading(false);
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
    <div className="register-container">
      <div className="register-content bd-container">
        {isloading ? (
          <div className="loading-animation">
            <HashLoader loading color="#4B5A82" size={75} />
          </div>
        ) : (
          <div className="register-user-form">
            <div className="register-logo">
              <img src={Logo} alt="Logo" />
            </div>
            <div className="register-form">
              <form onSubmit={Register}>
                {error && (
                  <div className="error">
                    <p>{error}</p>
                  </div>
                )}

                <div className="form-name">
                  <div className="fname">
                    <i className="far fa-user"></i>
                    <label htmlFor="name">First Name</label>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      maxLength="30"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="lname">
                    <i className="far fa-user"></i>
                    <label htmlFor="name">Last Name</label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      maxLength="30"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <label htmlFor="username">User Name</label>
                <div className="user">
                  <i className="far fa-user"></i>
                  <input
                    type="text"
                    placeholder="Enter Username"
                    maxLength="25"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <label htmlFor="email">Email</label>
                <div className="email">
                  <i className="far fa-envelope"></i>
                  <input
                    type="email"
                    placeholder="Enter Emaill Address"
                    value={email}
                    maxLength="60"
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
                    autoComplete="off"
                    maxLength="50"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <input type="submit" value="Register" />
              </form>

              <div className="have-account">
                <Link to="/login">Already have an account?</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
