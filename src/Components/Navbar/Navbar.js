import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../Assets/images/logo.png";
import Axios from "axios";
import Modal from "react-modal";
import "./Navbar.css";

function Navbar() {
  const [click, setClick] = useState(false);
  const [searchModal, setSearchModal] = useState("");
  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState([]);
  const [userId, setUserId] = useState("");
  const navActive = () => setClick(!click);

  const showSearch = () => {
    setSearchModal(!searchModal);
    if (searchModal === false) {
      setSearch("");
    }
  };

  const headers = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("Token"),
    },
  };

  const loadUsers = async () => {
    const users = await Axios.get(
      "https://mern-social-konek.herokuapp.com/auth/search/users",
      headers
    );

    setUserList(users.data);
  };

  useEffect(() => {
    const checkToken = localStorage.getItem("Token");
    const userData = localStorage.getItem("User");
    const data = JSON.parse(userData);

    if (checkToken) {
      loadUsers();
      setUserId(data._id);
    }
  }, []);

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
          <li className="nav-list search-users">
            <i
              className="fas fa-search"
              onClick={() => {
                showSearch();
                setClick(false);
              }}
            ></i>
          </li>
          <li className="nav-list">
            <i className="fas fa-home"></i>
            <Link
              to="/"
              onClick={() => {
                showSearch();
                setClick(false);
              }}
            >
              Home
            </Link>
          </li>

          <li className="nav-list">
            <i className="fas fa-plus-circle"></i>
            <Link
              to="/post"
              onClick={() => {
                showSearch();
                setClick(false);
              }}
            >
              Create Post
            </Link>
          </li>

          <li className="nav-list">
            <i className="fas fa-user-circle"></i>
            <Link
              to="/profile"
              onClick={() => {
                showSearch();
                setClick(false);
              }}
            >
              Profile
            </Link>
          </li>
        </ul>
      </div>

      <Modal
        isOpen={searchModal}
        onRequestClose={() => setSearchModal(false)}
        className="search-modal"
      >
        <div className="search-user-list">
          <input
            type="text"
            value={search}
            placeholder="Enter Username"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />

          {userList.length > 0 ? (
            <div className="search-user-result-list">
              {userList
                .filter((users) => {
                  if (search === "") {
                    return users;
                  } else if (
                    users.username
                      .toLowerCase()
                      .includes(search.toLocaleLowerCase())
                  ) {
                    return users;
                  }
                })
                .map((users, key) => {
                  return (
                    <div key={users._id} className="search-user-info">
                      <div className="search-user-img">
                        <a
                          href={
                            users._id !== userId
                              ? `/view/profile/${users._id}`
                              : `/profile`
                          }
                        >
                          <img
                            src={users.image}
                            alt={users.username}
                            onClick={() => {
                              setSearchModal(false);
                            }}
                          />
                        </a>
                      </div>
                      <div className="search-user-name">
                        <a
                          href={
                            users._id !== userId
                              ? `/view/profile/${users._id}`
                              : `/profile`
                          }
                        >
                          <span
                            onClick={() => {
                              setSearchModal(false);
                            }}
                          >
                            {users.username}
                          </span>
                        </a>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            ""
          )}
        </div>
      </Modal>
    </div>
  );
}

export default Navbar;
