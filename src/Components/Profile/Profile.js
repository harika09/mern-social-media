import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { HashLoader } from "react-spinners";
import Navbar from "../Navbar/Navbar";
import Modal from "react-modal";
import Axios from "axios";
import "./Profile.css";

function Profile() {
  const history = useHistory();
  const [isloading, setLoading] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const [profile, setProfile] = useState({});
  const [userId, setUserId] = useState("");
  const [post, setPost] = useState([]);
  const [state, setState] = useState({});
  const [error, setError] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState("");
  const [followModal, setFollowModal] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followersModal, setFollowersModal] = useState(false);
  const [userFollowers, setUserFollowers] = useState([]);

  const fileHandler = (e) => {
    /* Preview Image */
    let reader = new FileReader();
    reader.onload = function (e) {
      setFile(e.target.result);
    };

    reader.readAsDataURL(e.target.files[0]);
    setImage(e.target.files[0]);
  };

  const showEditModal = () => {
    setIsModal(!isModal);
  };

  const showFollow = () => {
    setFollowModal(!followModal);
  };

  const showFollowers = () => {
    setFollowersModal(!followersModal);
  };

  const headers = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("Token"),
    },
  };

  const loadUserInfo = async () => {
    const userInfo = await Axios.get(
      /* http://localhost:4000/ */ /* https://mern-social-konek.herokuapp.com */
      `https://mern-social-konek.herokuapp.com/auth/profile`,
      headers
    );

    setProfile(userInfo.data.user);
    setPost(userInfo.data.post);
    setLoading(false);
    setFile(userInfo.data.user.image);
    setFollowingUsers(userInfo.data.following);
    setUserFollowers(userInfo.data.followers);

    // setFile(profile.data.image);
  };

  const bntLogout = () => {
    localStorage.clear();
    history.push("/login");
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    const { username, firstName, lastName } = state;

    const formData = new FormData();

    formData.append("image", image);
    formData.append("username", username);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);

    Axios.put(
      /* http://localhost:4000/ https://mern-social-konek.herokuapp.com */
      "https://mern-social-konek.herokuapp.com/post/profile/update",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("Token"),
        },
      }
    ).then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        /* Success update */
        setError(response.data.success);
        loadUserInfo();
        setIsModal(false);
      }
    });
  };

  useEffect(() => {
    const Token = localStorage.getItem("Token");
    const userData = localStorage.getItem("User");
    const data = JSON.parse(userData);
    if (Token) {
      loadUserInfo();
      setUserId(data._id);
    } else {
      history.push("/login");
    }
  }, [userId]);

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-content bd-container">
          {isloading ? (
            <div className="loading-animation">
              <HashLoader loading color="#4B5A82" size={75} />
            </div>
          ) : (
            <div className="profile-wrapper">
              <div className="profile-top-content">
                <div className="profile-avatar">
                  <img src={profile.image} alt={profile.username} />
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
                      <strong>{profile.followers.length}</strong>

                      {profile.followers.length <= 1 ? (
                        <span onClick={showFollowers}>Follower</span>
                      ) : (
                        <span onClick={showFollowers}>Followers</span>
                      )}
                    </div>

                    <div className="profile-post">
                      <strong>{profile.following.length}</strong>
                      <span onClick={showFollow}>
                        <span>
                          {/* {profile.following.length}
                        {/* {profile.comments.following <= 1
                          ? "Following"
                          : "Following"} */}
                          Following
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bottom-container">
                {post.length === 0 ? (
                  <div className="post-empty">
                    <span>No Post</span>
                  </div>
                ) : (
                  post.map((posts, key) => {
                    return (
                      <div key={posts._id} className="posts-content">
                        <Link to={`/view/post/${posts._id}`}>
                          <img src={posts.image} alt="" />
                        </Link>
                      </div>
                    );
                  })
                )}
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
                <img src={file} alt="upload" className="upload-image" />

                <p className="add-image">Click to upload image</p>
                <label>
                  <input
                    type="file"
                    onChange={fileHandler}
                    // onChange={(e) => setImage(e.target.files[0])}
                    accept="image/jpeg, image/png"
                  />
                  <i className="fas fa-camera"></i>
                </label>
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
                  disabled="true"
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

          {/* Following List */}
          <Modal
            isOpen={followModal}
            onRequestClose={() => setFollowModal(false)}
            className="edit-modal"
          >
            {followingUsers.length > 0 ? (
              <div className="following-list">
                {followingUsers.map((following, key) => {
                  return (
                    <div key={following._id} className="following-user-info">
                      <Link to={`/view/profile/${following._id}`}>
                        <img src={following.image} alt={following.username} />
                      </Link>
                      <Link to={`/view/profile/${following._id}`}>
                        <span>{following.username}</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              "No Data Available"
            )}
          </Modal>

          {/* Followers List */}
          <Modal
            isOpen={followersModal}
            onRequestClose={() => setFollowersModal(false)}
            className="edit-modal"
          >
            {userFollowers.length > 0 ? (
              <div className="follower-list">
                {userFollowers.map((followers, key) => {
                  return (
                    <div key={followers._id} className="follower-user-info">
                      <Link to={`/view/profile/${followers._id}`}>
                        <img src={followers.image} alt={followers.username} />
                      </Link>
                      <Link to={`/view/profile/${followers._id}`}>
                        <span>{followers.username}</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              "No Data Available"
            )}
          </Modal>
        </div>
      </div>
    </>
  );
}

export default Profile;
