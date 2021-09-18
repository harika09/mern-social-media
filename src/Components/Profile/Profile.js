import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import Axios from "axios";
import "./Profile.css";
import Navbar from "../Navbar/Navbar";

function Profile() {
  const history = useHistory();
  const [profile, setProfile] = useState({});
  const [post, setPost] = useState([]);
  const [isloading, setLoading] = useState(true);

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
                      <button className="btn-edit">
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
        </div>
      </div>
    </>
  );
}

export default Profile;
