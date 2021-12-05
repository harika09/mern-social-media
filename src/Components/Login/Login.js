import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Logo from "../../Assets/images/logo.png";
import { HashLoader } from "react-spinners";
import Modal from "react-modal";
import Axios from "axios";
import "./Login.css";

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorReset, setErrorReset] = useState("");
  const [isloading, setLoading] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState("");

  const showModal = () => {
    setIsModal(!isModal);
  };

  const login = (e) => {
    e.preventDefault();

    setLoading(true);

    Axios.post(`https://mern-social-konek.herokuapp.com/auth/login`, {
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

  const btnRecover = () => {
    if (!recoverEmail.trim()) {
      setLoading(false);
      setErrorReset("Email is empty");
    } else {
      Axios.post(
        "https://mern-social-konek.herokuapp.com/auth/reset-password",
        {
          email: recoverEmail,
        }
      ).then((response) => {
        setRecoverEmail("");
        setErrorReset(response.data.success);
        setTimeout(() => {
          setIsModal(false);
        }, 15000);
      });
    }
  };

  useEffect(() => {
    if (localStorage.getItem("Token")) {
      history.push("/");
    }
  });

  return (
    <div className="login-container">
      <div className="login-content bd-container">
        {isloading ? (
          <div className="loading-animation">
            <HashLoader loading color="#4B5A82" size={75} />
          </div>
        ) : (
          <div className="user-login-form">
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
                    maxLength="50"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <label htmlFor="password">Password</label>
                <div className="pass">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Enter Password"
                    autoComplete="off"
                    value={password}
                    maxLength="50"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <input type="submit" value="Login" />
              </form>

              <div className="login-low-content">
                <div className="reset">
                  <button onClick={showModal}>Forgot Password ?</button>
                </div>

                <div className="register">
                  Create your account
                  <Link to="/register"> Here</Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <Modal
          isOpen={isModal}
          onRequestClose={() => setIsModal(false)}
          className="edit-modal"
        >
          <div className="recovery-options">
            <div className="recover-password">
              {errorReset && (
                <div className="error">
                  <p>{errorReset}</p>
                </div>
              )}
              <input
                type="email"
                placeholder="Enter Email"
                value={recoverEmail}
                onChange={(e) => {
                  setRecoverEmail(e.target.value);
                }}
              />

              <button className="btn-reset" onClick={btnRecover}>
                Reset Password
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Login;
