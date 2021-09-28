import React, { useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { HashLoader } from "react-spinners";
import Axios from "axios";
import "./ResetPassword.css";
import Logo from "../../Assets/images/logo.png";

function ResetPassword() {
  const history = useHistory();
  const params = useParams();
  const [newPass, setNewPass] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 1500);

  const updatePass = () => {
    setLoading(true);
    Axios.put(`http://localhost:4000/auth/update/password`, {
      token: params.token,
      password: newPass,
    }).then((response) => {
      if (response.data.error) {
        setLoading(false);
        setMessage(response.data.error);
      } else {
        setMessage(response.data.success);
        setLoading(true);
        setTimeout(() => {
          history.push("/login");
        }, 1500);
      }
    });
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-content bd-container">
        {loading ? (
          <div className="loading-animation">
            <HashLoader loading color="#4B5A82" size={75} />
          </div>
        ) : (
          <div className="reset-form">
            {message && (
              <div className="message">
                <p>{message}</p>
              </div>
            )}
            <img src={Logo} alt="logo" />
            <input
              type="password"
              placeholder="Enter New Password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            <button
              className="btn-reset"
              onClick={() => {
                updatePass();
              }}
            >
              Update
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
