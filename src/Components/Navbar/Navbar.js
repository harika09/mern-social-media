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

  const btnFollow = (id) => {
    Axios.put(
      `https://mern-social-konek.herokuapp.com/auth/follow`,
      { requestedUserId: id },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("Token"),
        },
      }
    ).then((response) => {
      loadUsers();
    });
  };

  const btnUnFollow = (id) => {
    Axios.put(
      `https://mern-social-konek.herokuapp.com/auth/unfollow`,
      { requestedUserId: id },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("Token"),
        },
      }
    ).then((response) => {
      loadUsers();
    });
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
          <Link
            to="/"
            onClick={() => {
              setSearchModal(false);
            }}
          >
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
                setClick(false);
                setSearchModal(false);
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
                setClick(false);
              }}
            >
              Create Post
            </Link>
          </li>

          <li className="nav-list">
            <i className="fas fa-user-plus"></i>
            <Link
              to="/following"
              onClick={() => {
                setClick(false);
              }}
            >
              Following
            </Link>
          </li>

          <li className="nav-list">
            <i className="fas fa-user-circle"></i>
            <Link
              to="/profile"
              onClick={() => {
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
          <button
            className="profile-btn-close"
            onClick={() => {
              setSearchModal(false);
            }}
          >
            <i className="fas fa-times-circle"></i>
          </button>

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
                .map((users) => {
                  return (
                    <div key={users._id} className="search-user">
                      {/* hide current user to search bar */}
                      {users._id !== userId ? (
                        <div className="search-user-info">
                          <div className="search-list">
                            <div className="search-user-img">
                              <Link
                                to={
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
                                  <img
                                    src={users.image}
                                    alt={users.username}
                                    onClick={() => {
                                      setSearchModal(false);
                                    }}
                                  />
                                </span>
                              </Link>
                              {/* <a
                                href={
                                  users._id !== userId
                                    ? `/view/profile/${users._id}`
                                    : `/profile`
                                }
                              >
                               
                              </a> */}
                            </div>
                            <div className="search-user-name">
                              {users._id !== userId ? (
                                <Link to={`/view/profile/${users._id}`} replace>
                                  <span
                                    onClick={() => {
                                      setSearchModal(false);
                                    }}
                                  >
                                    {users.username}
                                  </span>
                                </Link>
                              ) : (
                                <span
                                  onClick={() => {
                                    setSearchModal(false);
                                  }}
                                >
                                  {users.username}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="search-user-follow">
                            {/* hide current user Follower/Following */}
                            {users.followers.includes(userId) ? (
                              <div className="btn-follow">
                                {users._id !== userId ? (
                                  <button
                                    onClick={() => {
                                      btnUnFollow(users._id);
                                    }}
                                    className="btn-follow"
                                  >
                                    Following
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                            ) : (
                              <div className="btn-follow">
                                {users._id !== userId ? (
                                  <button
                                    onClick={() => {
                                      btnFollow(users._id);
                                    }}
                                    className="btn-follow"
                                  >
                                    Follow
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
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
