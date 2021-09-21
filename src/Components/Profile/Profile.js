import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import Navbar from "../Navbar/Navbar";
import Modal from "react-modal";
import Axios from "axios";
import "./Profile.css";

function Profile() {
  const history = useHistory();
  const [profile, setProfile] = useState({});
  const [post, setPost] = useState([]);
  const [isloading, setLoading] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const [state, setState] = useState({});
  const [error, setError] = useState("");

  const showEditModal = () => {
    setIsModal(!isModal);
  };

  const headers = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("Token"),
    },
  };

  const loadUserInfo = async () => {
    const userInfo = await Axios.get(
      "http://localhost:4000/auth/profile",
      headers
    );

    setProfile(userInfo.data.user);
    setPost(userInfo.data.post);
    setLoading(false);
  };

  const bntLogout = () => {
    localStorage.clear();
    history.push("/login");
  };

  const updateProfile = (e) => {
    e.preventDefault();
    const { username, firstName, lastName, email } = state;

    Axios.put(
      "http://localhost:4000/post/profile/update",
      {
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: email,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("Token"),
        },
      }
    ).then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setError(response.data.success);
        setTimeout(() => {
          setIsModal(false);
        }, 1000);
      }
    });
  };

  useEffect(() => {
    if (localStorage.getItem("Token")) {
      loadUserInfo();
    } else {
      history.push("/login");
    }
  });

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-content bd-container">
          {isloading ? (
            <div className="loading-animation">
              <BounceLoader loading color="#e98580" />
            </div>
          ) : (
            <div className="profile-wrapper">
              <div className="profile-top-content">
                <div className="profile-avatar">
                  <img src={profile.avatar} alt={profile.username} />
                </div>

                <div className="profile-info">
                  <div className="profile-name">
                    <div>
                      <strong>{profile.username}</strong>
                    </div>

                    <div className="profile-btn">
                      <button
                        onClick={() => {
                          showEditModal();
                          setState(profile);
                          setError("");
                        }}
                        className="btn-edit"
                      >
                        <i className="fas fa-cog"></i> Edit Profile
                      </button>
                      <button
                        className="btn-logout"
                        onClick={() => bntLogout()}
                      >
                        <i className="fas fa-sign-out-alt"></i>
                        Logout
                      </button>
                    </div>
                  </div>

                  <div className="profile-other-info">
                    <div className="profile-post">
                      <strong>{profile.post.length}</strong>
                      <span>{profile.post.length <= 1 ? "Post" : "Posts"}</span>
                    </div>

                    <div className="profile-post">
                      <strong>{profile.likes.length}</strong>
                      <span>
                        {profile.likes.length <= 1 ? "Like" : "Likes"}
                      </span>
                    </div>

                    <div className="profile-post">
                      <strong>{profile.comments.length}</strong>
                      <span>
                        {profile.comments.length <= 1 ? "Comment" : "Comments"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bottom-container">
                {post.map((posts, key) => {
                  return (
                    <div key={posts._id} className="posts-content">
                      <Link to={`/view/post/${posts._id}`}>
                        <img src={posts.image} alt="" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {Object.keys(state).length > 0 ? (
            <Modal
              isOpen={isModal}
              onRequestClose={() => setIsModal(false)}
              className="edit-modal"
            >
              {error && (
                <div className="error">
                  <p>{error}</p>
                </div>
              )}
              <form onSubmit={updateProfile}>
                <input
                  type="text"
                  placeholder="Update Username"
                  name="username"
                  value={state.username}
                  onChange={(e) =>
                    setState({ ...state, [e.target.name]: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Update First Name"
                  name="firstName"
                  value={state.firstName}
                  onChange={(e) =>
                    setState({ ...state, [e.target.name]: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Update Last Name"
                  name="lastName"
                  value={state.lastName}
                  onChange={(e) =>
                    setState({ ...state, [e.target.name]: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Update Email"
                  name="email"
                  value={state.email}
                  onChange={(e) =>
                    setState({ ...state, [e.target.name]: e.target.value })
                  }
                />
                <input
                  type="submit"
                  onSubmit={updateProfile}
                  value="Update Profile"
                />
              </form>
            </Modal>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
